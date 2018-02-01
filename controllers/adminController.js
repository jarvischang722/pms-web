/**
 * Created by jing on 2017/11/25.
 */
const _ = require('underscore');
const mongoAgent = require('../plugins/mongodb');
const async = require('async');

/**
 * 設定欄位寬度的屬性
 */
exports.prgPropsSetup = function (req, res) {
    res.render("subsystem/admin/prgPropsSetup");
};


/**
 * 取collection 資料與schema
 */
exports.getProgramPropsByPrgID = function (req, res) {
    let ls_collName = req.body.collName;
    let ls_prg_id = req.body.prg_id;
    let lao_collSchema = [];
    let las_collIndexs = _.keys(mongoAgent[ls_collName].schema._indexes[0][0]);
    //組合collection schema
    _.each(mongoAgent[ls_collName].schema.tree, function (field, fieldName) {
        if (!_.isEqual(fieldName, "_id") && !_.isEqual(fieldName, "id") && !_.isEqual(fieldName, "__v")) {
            lao_collSchema.push({
                name: fieldName,
                type: field.name || field.type.name
            });
        }
    });
    mongoAgent[ls_collName].find({prg_id: ls_prg_id}).exec(function (err, data) {
        res.json({success: true, propsData: data, collSchema: lao_collSchema, collIndexs: las_collIndexs});
    });
};


/**
 * 儲存collection 資料
 */
exports.handleCollSave = function (req, res) {
    let updateData = req.body.updateData;
    let ls_collName = req.body.collName;
    let laf_saveFuncs = [];
    let lao_collSchema = [];
    let las_collIndexs = _.keys(mongoAgent[ls_collName].schema._indexes[0][0]);
    //組合collection schema
    _.each(mongoAgent[ls_collName].schema.tree, function (field, fieldName) {
        if (!_.isEqual(fieldName, "_id") && !_.isEqual(fieldName, "id") && !_.isEqual(fieldName, "__v")) {
            lao_collSchema.push({
                name: fieldName,
                type: field.name || field.type.name
            });
        }
    });


    _.each(updateData,function (uData) {
        laf_saveFuncs.push(function (callback) {
            //修正型態
            _.each(lao_collSchema, function (col) {
                if (col.type == "Number") {
                    uData.rowData[col.name] = Number(uData.rowData[col.name]);

                    if(uData.updConds[col.name]){
                        uData.updConds[col.name] = Number(uData.updConds[col.name]);
                    }
                }
            });
            mongoAgent[ls_collName].update(uData.updConds,uData.rowData,{ multi: true },callback);
        });
    });
    async.parallel(laf_saveFuncs, function (err, results) {
        if (err) {
            console.error(err);
        }
        res.json({success: err == null, errorMsg: '儲存失敗'});
    });

};