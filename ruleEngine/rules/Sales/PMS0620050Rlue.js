/**
 * Created by a17010 on 2017/11/18.
 */
var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var ruleRootPath = appRootDir + "/ruleEngine/";
var queryAgent = require(appRootDir + '/plugins/kplug-oracle/QueryAgent');
var commandRules = require("./../CommonRule");
var ReturnClass = require(ruleRootPath + "/returnClass");
var ErrorClass = require(ruleRootPath + "/errorClass");

module.exports = {

    /**
     * PMS0620050 搜尋列 cust_cod下拉資料 popupgrid
     */
    sel_cust_mn: function(postData, session, callback){
        var lo_params = {
            athena_id: session.user.user_athena_id
        };
        var lo_result = new ReturnClass();
        var lo_error = null;

        let ui_field_name = _.isUndefined(postData.fields) ? "" : postData.fields.ui_field_name;
        let updateFieldName = {
            cust_cod: "cust_cod",
            cust_nam: "cust_nam"
        };

        let fieldNameChangeLanguage = {
            cust_cod: "公司代號",
            cust_nam: "公司名稱"
        };

        if (ui_field_name != "") {
            queryAgent.queryList("sel_cust_mn".toUpperCase(), lo_params, 0, 0, function (err, userList) {
                if (!err) {
                    lo_result.effectValues.showDataGrid = userList;
                    lo_result.effectValues.updateFieldNameTmp = updateFieldName;
                    lo_result.effectValues.fieldNameChangeLanguageTmp = fieldNameChangeLanguage;
                    callback(lo_error, [lo_result]);
                }
            });
        }
        else {
            callback(null, lo_result);
        }
    },


    /**
     * PMS0620050 搜尋列 sales_cod 下拉資料 popupgrid
     */
    sel_sales_mn: function(postData, session, callback){
        var lo_params = {
            athena_id: session.user.user_athena_id
        };
        var lo_result = new ReturnClass();
        var lo_error = null;

        let ui_field_name = _.isUndefined(postData.fields) ? "" : postData.fields.ui_field_name;
        let updateFieldName = {
            sales_cod: "sales_cod",
            sales_nam: "sales_nam"
        };

        let fieldNameChangeLanguage = {
            sales_cod: "業務員編號",
            sales_nam: "業務員名稱"
        };

        if (ui_field_name != "") {
            queryAgent.queryList("sel_sales_mn".toUpperCase(), lo_params, 0, 0, function (err, userList) {
                if (!err) {
                    lo_result.effectValues.showDataGrid = userList;
                    lo_result.effectValues.updateFieldNameTmp = updateFieldName;
                    lo_result.effectValues.fieldNameChangeLanguageTmp = fieldNameChangeLanguage;
                    callback(lo_error, [lo_result]);
                }
            });
        }
        else {
            callback(null, lo_result);
        }
    },


    /**
     * PMS0620050 搜尋列 business_cod 下拉資料 popupgrid
     */
    sel_business_rf: function(postData, session, callback){
        var lo_params = {
            athena_id: session.user.user_athena_id
        };
        var lo_result = new ReturnClass();
        var lo_error = null;

        let ui_field_name = _.isUndefined(postData.fields) ? "" : postData.fields.ui_field_name;
        let updateFieldName = {
            business_cod: "business_cod",
            business_rmk: "business_rmk"
        };

        let fieldNameChangeLanguage = {
            business_cod: "行業代號",
            business_rmk: "行業名稱"
        };

        if (ui_field_name != "") {
            queryAgent.queryList("sel_business_rf".toUpperCase(), lo_params, 0, 0, function (err, userList) {
                if (!err) {
                    lo_result.effectValues.showDataGrid = userList;
                    lo_result.effectValues.updateFieldNameTmp = updateFieldName;
                    lo_result.effectValues.fieldNameChangeLanguageTmp = fieldNameChangeLanguage;
                    callback(lo_error, [lo_result]);
                }
            });
        }
        else {
            callback(null, lo_result);
        }
    },


    /**
     * PMS0620050 搜尋列 purport_rmk 下拉資料 popupgrid
     */
    sel_remark_typ_rf: function(postData, session, callback){
        var lo_params = {
            athena_id: session.user.user_athena_id
        };
        var lo_result = new ReturnClass();
        var lo_error = null;

        let ui_field_name = _.isUndefined(postData.fields) ? "" : postData.fields.ui_field_name;
        let updateFieldName = {
            remark_typ: "remark_typ",
            type_nam: "type_nam"
        };

        let fieldNameChangeLanguage = {
            remark_typ: "備註代號",
            type_nam: "備註名稱"
        };

        if (ui_field_name != "") {
            queryAgent.queryList("sel_remark_typ_rf".toUpperCase(), lo_params, 0, 0, function (err, userList) {
                if (!err) {
                    lo_result.effectValues.showDataGrid = userList;
                    lo_result.effectValues.updateFieldNameTmp = updateFieldName;
                    lo_result.effectValues.fieldNameChangeLanguageTmp = fieldNameChangeLanguage;
                    callback(lo_error, [lo_result]);
                }
            });
        }
        else {
            callback(null, lo_result);
        }
    },

    /**
     * PMS0620050 搜尋列 area_cod 下拉資料 tree
     * @param postData
     */
    sel_area_cod_kvrf: function (postData, session, callback) {
        let self = this;
        let lo_error = null;
        let lo_result = new ReturnClass();
        let lo_params = {
            athena_id: session.athena_id
        };
        queryAgent.queryList("SEL_AREA_COD_KVRF", lo_params, 0, 0, function (err, result) {

            let la_selectData = initTreeData(result);

            lo_result.selectOptions = la_selectData;
            callback(lo_error, lo_result);
        });
    }

    //TODO 之後移至 DataRuleService中並新增 getTreeOption function(將處理tree資料組成一個moduel)
    //初始化樹狀資料
    // initTreeData: function (selectData) {
    //     let la_selectData = [];
    //     let _this = this;
    //     let la_root = _.filter(selectData, function (lo_rowData) {
    //         return lo_rowData.parent_cod.trim() == "ROOT";
    //     });
    //
    //     _.each(la_root, function (lo_root) {
    //         let lo_node = new node(lo_root);
    //         convertData2TreeData(selectData, lo_node);
    //         la_selectData.push(lo_node);
    //     });
    //
    //     return la_selectData;
    // }
    //轉換資料格式
    // convertData2TreeData: function (lo_selectRowData, lo_parent_node) {
    //     let self = this;
    //     let la_rowData = _.filter(lo_selectRowData, function (lo_rowData) {
    //         return lo_rowData.parent_cod.trim() == lo_parent_node.value;
    //     });
    //
    //     if (la_rowData.length != 0) {
    //         lo_parent_node.children = [];
    //         _.each(la_rowData, function (lo_rowData) {
    //             let lo_node = new node(lo_rowData);
    //             self.convertData2TreeData(lo_selectRowData, lo_node);
    //             lo_parent_node.children.push(lo_node);
    //         });
    //     }
    // }
};

class node {
    constructor(lo_rowData) {
        this.parent_cod = lo_rowData.parent_cod;
        this.label = lo_rowData.area_nam;
        this.value = lo_rowData.area_cod;
    }
}

//因為 this 指向的關係，所以將 initTreeData、convertData2TreeData 從module.exports 的屬性移至外面 做為額外的 function
function initTreeData(selectData){
    let la_selectData = [];
    let _this = this;
    let la_root = _.filter(selectData, function (lo_rowData) {
        return lo_rowData.parent_cod.trim() == "ROOT";
    });

    _.each(la_root, function (lo_root) {
        let lo_node = new node(lo_root);
        convertData2TreeData(selectData, lo_node);
        la_selectData.push(lo_node);
    });

    return la_selectData;
}

function convertData2TreeData(lo_selectRowData, lo_parent_node){
    let la_rowData = _.filter(lo_selectRowData, function (lo_rowData) {
        return lo_rowData.parent_cod.trim() == lo_parent_node.value;
    });

    if (la_rowData.length != 0) {
        lo_parent_node.children = [];
        _.each(la_rowData, function (lo_rowData) {
            let lo_node = new node(lo_rowData);
            convertData2TreeData(lo_selectRowData, lo_node);
            lo_parent_node.children.push(lo_node);
        });
    }
}
