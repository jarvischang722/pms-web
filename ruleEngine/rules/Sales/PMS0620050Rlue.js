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
     * PMS0620050 搜尋列下拉資料 tree
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

            let la_selectData = self.initTreeData(result);
            // self.convertData2TreeData(result);

            lo_result.selectOptions = la_selectData;
            callback(lo_error, lo_result);
        });
    },

    //初始化樹狀資料
    initTreeData: function (selectData) {
        let la_selectData = [];
        let self = this;
        let la_root = _.filter(selectData, function (lo_rowData) {
            return lo_rowData.parent_cod.trim() == "ROOT";
        });

        _.each(la_root, function (lo_root) {
            let lo_node = new node(lo_root);
            self.convertData2TreeData(selectData, lo_node);
            la_selectData.push(lo_node);
        });

        return la_selectData;
    },
    //轉換資料格式
    convertData2TreeData: function (lo_selectRowData, lo_parent_node) {
        let self = this;
        let la_rowData = _.filter(lo_selectRowData, function (lo_rowData) {
            return lo_rowData.parent_cod.trim() == lo_parent_node.value;
        });

        if (la_rowData.length != 0) {
            lo_parent_node.children = [];
            _.each(la_rowData, function (lo_rowData) {
                let lo_node = new node(lo_rowData);
                self.convertData2TreeData(lo_selectRowData, lo_node);
                lo_parent_node.children.push(lo_node);
            });
        }
    }
};

class node {
    constructor(lo_rowData) {
        this.parent_cod = lo_rowData.parent_cod;
        this.label = lo_rowData.area_cod;
        this.value = lo_rowData.area_nam;
    }
}
