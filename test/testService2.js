/**
 * Created by kaiyue on 2017/10/22.
 */
var _ = require("underscore");
var dbCtrl = require("../controllers/GateWayController");

var postData = {
    prg_id: "PMS0830100",
    trans_cod: "",
    tmpCUD: {
        createData: [],
        updateData: [],
        deleteData: []
    }
};

var req = {};
req.body = postData;


dbCtrl.doOperationSingleSave(req, function(result){
    console.log(result);
});

return;