/**
 * Created by jing on 2017/11/25.
 */
const  _  = require('underscore');
const  mongoAgent  = require('../plugins/mongodb');

/**
 * 設定欄位寬度的屬性
 */
exports.getSetPageProSize = function (req, res) {
    res.render("subsystem/admin/setPageProSize");
};


exports.getProgramPropsByPrgID = function (req, res) {
    let collName = req.body.collName;
    let prg_id = req.body.prg_id;
    let lao_collSchema = [];
    //組合collection schema
    _.each(mongoAgent[collName].schema.tree,function(field,fieldName){
        if(!_.isEqual(fieldName,"_id") && !_.isEqual(fieldName,"id") && !_.isEqual(fieldName,"__v") ){
            lao_collSchema.push({
                field:fieldName,
                type:field.name
            });
        }
    })
    mongoAgent[collName].find({prg_id: prg_id}).exec(function (err,data) {
         res.json({success: true, props: data, collSchema:lao_collSchema});
    });
};