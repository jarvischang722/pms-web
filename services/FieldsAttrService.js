/**
 * Created by Jun on 2017/8/27.
 * 欄位屬性處理
 */
let moment = require("moment");
let queryAgent = require('../plugins/kplug-oracle/QueryAgent');
let mongoAgent = require("../plugins/mongodb");
let _ = require("underscore");
let async = require("async");
let dataRuleSvc = require("./DataRuleService");

/**
 * 取得UIPageField欄位屬性
 * @param params
 * @param callback
 * @returns {*}
 */
exports.getAllUIPageFieldAttr = function (params, userInfo,callback) {
    if (_.isUndefined(params.prg_id)) {
        return callback([]);
    }
    if (_.isUndefined(params.page_id)) {
        params.page_id = 1;
    }
    mongoAgent.UI_PageField.find({prg_id: params.prg_id, page_id: params.page_id}).sort({
        row_seq: 1,
        col_seq: 1
    }).exec(function (err, fields) {
        filterSpecField(fields, userInfo, function (filteredFields) {
            callback(filteredFields);
        });
    });
};


function filterSpecField(allFields,userInfo, callback) {
    let handleFuncs = [];
    _.each(allFields, function (field, fIdx) {
        field = field.toObject();
        //撈取下拉選單資料
        if (_.isEqual(field.ui_type, "select") || _.isEqual(field.ui_type, "multiselect" ||
                field.ui_type == "checkbox" || field.ui_type == "selectgrid")) {
            handleFuncs.push(
                function (callback) {
                    appendFieldSelectData(field, userInfo,function (err,appendedField) {
                        callback(err, appendedField);
                    });
                }
            );
        }else{
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

function appendFieldSelectData(field,userInfo, callback) {
    mongoAgent.UI_Type_Select.findOne({
        prg_id: field.prg_id,
        ui_field_name: field.ui_field_name
    }).exec(function (err, selRow) {
        if (selRow) {
            selRow = selRow.toObject();
            dataRuleSvc.getSelectOptions(userInfo, selRow, function (selectData) {
                field.selectData = selectData;
                callback(null, field);
            });
        } else {
            callback(null, field);
        }
    });
}