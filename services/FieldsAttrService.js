/**
 * Created by Jun on 2017/8/27.
 * 欄位屬性處理
 */
let moment = require("moment");
let queryAgent = require('../plugins/kplug-oracle/QueryAgent');
let mongoAgent = require("../plugins/mongodb");
let ruleAgent = require("../ruleEngine/ruleAgent");
let _ = require("underscore");
let async = require("async");
let dataRuleSvc = require("./DataRuleService");
let CommonTools = require("../utils/CommonTools");
/**
 * 取得UIPageField欄位屬性
 * @param params
 * @param callback
 * @returns {*}
 */
exports.getAllUIPageFieldAttr = function (params, session, callback) {
    let ls_locale = params.locale || 'zh_TW';
    if (_.isUndefined(params.prg_id)) {
        return callback([]);
    }
    if (_.isUndefined(params.page_id)) {
        params.page_id = 1;
    }
    async.waterfall([
        function (callback) {
            mongoAgent.UIPageField.find({prg_id: params.prg_id, page_id: params.page_id}).sort({
                row_seq: 1,
                col_seq: 1
            }).exec(function (err, fields) {
                fields = CommonTools.mongoDocToObject(fields);
                callback(err, fields);
            });
        },
        function (fields, callback) {
            mongoAgent.LangUIField.find({prg_id: params.prg_id}).exec(function (err, langs) {
                if (err) {
                    return callback(err, fields);
                }
                if (langs.length > 0) {
                    langs = CommonTools.mongoDocToObject(langs);
                    _.each(fields, function (field, idx) {
                        fields[idx]["ui_display_name"] = field.ui_field_name;
                        let lo_lang = _.findWhere(langs, {ui_field_name: field.ui_field_name});
                        if (lo_lang) {
                            fields[idx]["ui_display_name"] = lo_lang['ui_display_name_' + ls_locale]
                                ? lo_lang['ui_display_name_' + ls_locale] : field.ui_field_name;
                            fields[idx]["ui_hint"] = lo_lang['hint_' + ls_locale]
                                ? lo_lang['hint_' + ls_locale] : '';
                        }
                    });
                }
                callback(null, fields);
            });
        },
        function (fields, callback) {
            filterSpecField(fields, session, function (err, filteredFields) {
                callback(err, filteredFields);
            });
        }
    ], function (err, filteredFields) {
        callback(err, filteredFields);
    });

};


function filterSpecField(allFields, session, callback) {
    let handleFuncs = [];
    _.each(allFields, function (field, fIdx) {
        //撈取下拉選單資料
        if (_.isEqual(field.ui_type, "select") || _.isEqual(field.ui_type, "multiselect") || _.isEqual(field.ui_type, "checkbox") ||
            _.isEqual(field.ui_type, "selectgrid") || _.isEqual(field.ui_type, "radio") || _.isEqual(field.ui_type, "multiselectgrid")) {
            handleFuncs.push(
                function (callback) {
                    appendFieldSelectData(field, session, function (err, appendedField) {
                        callback(err, appendedField);
                    });
                }
            );
        }
        else if (_.isEqual(field.ui_type, "tree") || _.isEqual(field.ui_type, "multitree")) {
            handleFuncs.push(
                function (callback) {
                    allFields[fIdx].selectData = [];
                    ruleAgent[field.rule_func_name](field, session.user, function (err, result) {
                        allFields[fIdx].selectData = result.selectOptions;
                        callback(null, allFields[fIdx]);
                    });
                }
            );
        }
        else {
            handleFuncs.push(
                function (callback) {
                    callback(null, field);
                }
            );
        }
    });
    async.parallel(handleFuncs, function (err, fields) {
        callback(err, fields);
    });
}

function appendFieldSelectData(field, session, callback) {
    mongoAgent.UITypeSelect.findOne({
        prg_id: field.prg_id,
        ui_field_name: field.ui_field_name,
        $or: [
            {
                "page_id": {$exists: false}
            },
            {
                "page_id": field.page_id
            }
        ]
    }).exec(function (err, selRow) {
        if (selRow) {
            selRow = selRow.toObject();
            if(field.ui_type == "selectgrid" || field.ui_type == "multiselectgrid"){
                dataRuleSvc.getSelectGridOption(session, selRow, field, function (err, selectData) {
                    field.selectData = selectData;
                    callback(null, field);
                });
            }
            else{
                dataRuleSvc.getSelectOptions(session.user, selRow, field, function (selectData) {
                    field.selectData = selectData;
                    callback(null, field);
                });
            }
        } else {
            callback(null, field);
        }
    });
}