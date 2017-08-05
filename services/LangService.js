/**
 * Created by Jun on 2017/4/25.
 * 處理多語
 */
var _ = require("underscore");
var _s = require("underscore.string");
var moment = require("moment");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var mongoAgent = require("../plugins/mongodb");
var async = require("async");
var commonTools = require("../utils/CommonTools");

/**
 * datagrid 資料多語處理
 * @param dataGridRows {Array || Object}
 * @param prg_id {String}
 * @param page_id {Number}
 * @param locale {String}
 * @param callback {Function}
 */
exports.handleMultiDataLangConv = function (dataGridRows, prg_id, page_id, locale, callback) {

    var _thisSvc = this;
    mongoAgent.UIDatagridField.find({prg_id: prg_id, page_id: page_id}).exec(function (err, fieldData) {

        if (err || fieldData.length == 0) {
            return callback(null, dataGridRows);
        }

        fieldData = commonTools.mongoDocToObject(fieldData);

        var la_multiLangField = _.filter(fieldData, function (field) {
            return !_.isEmpty(field.multi_lang_table);
        });

        var la_keyField = _.filter(fieldData, {keyable: 'Y'});

        if (la_multiLangField.length > 0) {

            var langFuncs = {};

            async.waterfall([
                //抓取每一個多語欄位的所有內容
                function (callback) {
                    _.each(la_multiLangField, function (field) {
                        langFuncs[field.ui_field_name] = function (callback) {
                            _thisSvc.handleMultiLangContentByField(field.multi_lang_table, field.ui_field_name, locale, function (err, langRows) {
                                if (err) {
                                    langRows = [];
                                }
                                callback(null, langRows);
                            });
                        };
                    });

                    // lo_multiLangContents 存放每個欄位多語內容 key 為ui_field_name
                    async.parallel(langFuncs, function (err, lo_multiLangContents) {
                        callback(err, lo_multiLangContents);
                    });
                },
                //將多語系資料塞回顯示資料中
                function (lo_multiLangContents, callback) {
                    /**
                     lo_multiLangContents : {
                        field1: [langObj,langObj....,langObj],
                        field2: [langObj,langObj....,langObj],
                        field3: [langObj,langObj....,langObj],
                     }
                     迴圈跑每一筆資料
                     lo_multiLangContents 存放每筆資料哪些欄位需要處理多語系

                     */
                    _.each(dataGridRows, function (row, rIdx) {
                        dataGridRows[rIdx] = fillRowMultiLangContent(row, lo_multiLangContents, la_keyField);
                    });

                    callback(null, dataGridRows);
                }
            ], function (err, result) {
                callback(err, dataGridRows);
            });

        } else {
            callback(null, dataGridRows);
        }

    });

};

/**
 * 單筆資料多語處理
 * @param singleData {Object}
 * @param prg_id {String}
 * @param page_id {Number}
 * @param locale {String}
 * @param callback {Function}
 */
exports.handleSingleDataLangConv = function (singleData, prg_id, page_id, locale, callback) {

    var _thisSvc = this;
    mongoAgent.UI_PageField.find({prg_id: prg_id, page_id: page_id}).exec(function (err, fieldData) {

        if (err || fieldData.length == 0) {
            return callback(null, singleData);
        }

        fieldData = commonTools.mongoDocToObject(fieldData);

        var la_multiLangField = _.filter(fieldData, function (field) {
            return !_.isEmpty(field.multi_lang_table);
        });

        var la_keyField = _.filter(fieldData, {keyable: 'Y'});

        if (la_multiLangField.length > 0) {

            var langFuncs = {};

            async.waterfall([
                //抓取每一個多語欄位的所有內容
                function (callback) {
                    _.each(la_multiLangField, function (field) {
                        langFuncs[field.ui_field_name] = function (callback) {
                            _thisSvc.handleMultiLangContentByField(field.multi_lang_table, field.ui_field_name, locale, function (err, langRows) {
                                if (err) {
                                    langRows = [];
                                }
                                callback(null, langRows);
                            });
                        };
                    });

                    // lo_multiLangContents 存放每個欄位多語內容 key 為ui_field_name
                    async.parallel(langFuncs, function (err, lo_multiLangContents) {
                        callback(err, lo_multiLangContents);
                    });
                },
                //將多語系資料塞回顯示資料中
                function (lo_multiLangContents, callback) {
                    /**
                     lo_multiLangContents : {
                        field1: [langObj,langObj....,langObj],
                        field2: [langObj,langObj....,langObj],
                        field3: [langObj,langObj....,langObj],
                     }
                     迴圈跑每一筆資料
                     lo_multiLangContents 存放每筆資料哪些欄位需要處理多語系
                     */
                    singleData = fillRowMultiLangContent(singleData, lo_multiLangContents, la_keyField);

                    callback(null, singleData);
                }
            ], function (err, result) {
                callback(err, singleData);
            });

        } else {
            callback(null, singleData);
        }

    });

};

/**
 * 用lang key撈取內容多語系
 * @param langTable {String}
 * @param keys {Object}
 * @param locale {String}
 * @param callback {Function}
 */
exports.handleMultiLangContentByKey = function (langTable, locale, keys, field_name, callback) {
    var condition = _s.join(" ", combineCondition(keys));
    if (!_.isUndefined(locale) && !_.isEmpty(locale)) {
        condition = _s.join(" ", condition, "and", "locale = '" + locale + "'");
    }
    if (!_.isEmpty(field_name)) {
        condition = _s.join(" ", condition, "and", "field_name = '" + field_name + "'");
    }
    var queryXML = '<dao >' +
        '<statement><![CDATA[ SELECT * FROM ' + langTable + '  WHERE ' + condition + '  ]]></statement>' +
        '</dao>';
    queryAgent.queryList({xml: queryXML}, {}, 0, 0, function (err, rows) {
        if (err) {
            rows = [];
        }
        callback(err, rows);
    });
};

/**
 * 用Field 撈取內容多語系
 * @param langTable{String} : 多語系table
 * @param fields{Array | String} : 多語欄位名
 * @param locale{String} : 語系
 * @param callback{Function} :
 */
exports.handleMultiLangContentByField = function (langTable, fields, locale, callback) {

    var condition = "";

    if (_.isArray(fields)) {
        fields = _.map(fields, function (field) {
            return "'" + field + "'";
        });
        condition = "field_name  IN(" + fields + ")";
    } else {
        condition = "field_name  = '" + fields + "'";
    }

    if (!_.isUndefined(locale) && !_.isEmpty(locale)) {
        condition = _s.join(" ", condition, "and", "locale = '" + locale + "'");
    }

    var queryXML = '<dao >' +
        '<statement><![CDATA[ SELECT * FROM ' + langTable + ' WHERE ' + condition + '  ]]></statement>' +
        '</dao>';
    queryAgent.queryList({xml: queryXML}, {}, 0, 0, function (err, rows) {
        if (err) {
            console.error(err);
        }
        callback(err, rows);
    });
};

/**
 *
 * @param req {Object}
 * @param field_name {String}
 * @param callback {Function}
 */
exports.handleRowDataMultiLang = function (req, field_name, callback) {
    let _thisSvc = this;
    let rowData = req.body["rowData"];
    let prg_id = req.body["prg_id"];
    let page_id = req.body["page_id"];
    let dataType = req.body["dataType"] || "datagrid"; // dat
    let localeGrp = req.cookies["sys_locales"];
    let collection = dataType == 'datagrid' ? 'UIDatagridField' : 'UI_PageField';
    mongoAgent[collection].find({prg_id: prg_id, page_id: Number(page_id)}, function (err, fieldData) {
        if (err || fieldData.length == 0) {
            return callback({});
        }
        fieldData = commonTools.mongoDocToObject(fieldData);
        var multiLangData = [];
        var la_keyableFields = _.pluck(_.where(fieldData, {keyable: 'Y'}), "ui_field_name");  //是key值的欄位
        var la_multiLangFields = _.filter(fieldData, function (field) {
            if (!_.isUndefined(field_name) && !_.isEmpty(field_name)) {
                return field.ui_field_name == field_name;
            } 
                return field.multi_lang_table != "";
            

        }); // 有多語系的欄位

        var funcs = [];
        var keys = {}; //找尋的key value
        if (_.isUndefined(rowData)) {
            rowData = {};
        }
        
        _.each(la_keyableFields, function (fieldName) {
            if (!_.isUndefined(rowData[fieldName])) {
                keys[fieldName] = rowData[fieldName].trim();
            }
        });
        _.each(la_multiLangFields, function (field) {
            funcs.push(
                function (callback) {
                    _thisSvc.handleMultiLangContentByKey(field.multi_lang_table, "", keys, field.ui_field_name, function (err, langData) {
                        multiLangData = _.union(multiLangData, langData);
                        callback(null, langData);
                    });
                }
            );
        });

        async.parallel(funcs, function (err, langResults) {
            var result = [];
            _.each(localeGrp, function (locale) {
                var localeData = _.where(multiLangData, {locale: locale.lang});
                var langRowObj = {locale: locale.lang,display_locale: decodeURIComponent(locale.name)};
                _.each(localeData, function (data) {
                    langRowObj[data.field_name] = data.words || "";
                });

                result.push(langRowObj);
            });
            callback(result);
        });
    });


};


/**
 * 組合條件
 * @param keys{Object} : 每一個key 值
 * @return whereString{String} : 組好的where 條件
 */
function combineCondition(keys) {
    var ls_whereString = "";
    var kindex = 0;
    _.each(keys, function (fieldVal, fieldName) {

        var fieldCond = "";
        //判斷為日期
        var patternDat = /_dat$/i; //找尋欄位是dat或date結尾
        if (moment(keys[fieldName], ["YYYY/MM/DD", "YYYY-MM-DD"]).isValid() && patternDat.test(fieldName)) {
            fieldCond = fieldName + " = to_date('" + fieldVal + "','YYYY/MM/DD')";
        } else {
            //非日期
            fieldCond = fieldName + " = '" + fieldVal + "'";
        }
        ls_whereString = _s.join(" ", ls_whereString, fieldCond, kindex < _.size(keys) - 1 ? "and" : "");

        kindex++;

    });
    return ls_whereString;
}


/**
 * 找尋row 填入多語內容
 * @param row {Object}
 * @param lo_multiLangContents {Obejct}
 * @param la_keyField {Array}
 */
function fillRowMultiLangContent(row, lo_multiLangContents, la_keyField) {
    //run every multi lang field
    _.each(lo_multiLangContents, function (la_fieldLangList, field_name) {
        if (!_.isUndefined(row[field_name])) {
            //組搜尋條件
            var la_searchCond = {};
            _.each(la_keyField, function (field) {
                if (field.ui_type == 'date' || field.ui_type == 'datetime') {
                    //TODO 無法找尋Date :(  2017/04/26
                } else {
                    var fieldVal = row[field.ui_field_name];
                    if (typeof fieldVal === 'string') {
                        fieldVal.trim();
                    }
                    la_searchCond[field.ui_field_name] = fieldVal;
                }
            });
            la_searchCond["field_name"] = field_name;
            var langIdx = _.findIndex(la_fieldLangList, la_searchCond);
            //如果找得到, 將多語資料塞回RowData
            if (langIdx > -1) {
                row[field_name] = la_fieldLangList[langIdx].words;
            }
        }
    });
    return row;
}