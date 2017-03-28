/**
 * Created by Jun Chang on 2017/2/8.
 */
var mongoAgent = require("../plugins/mongodb");


mongoAgent.TemplateDatagrid.find().exec(function(err,row){
    console.log(err);
    console.log(row);
})