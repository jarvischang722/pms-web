/**
 * Created by Jun on 2017/6/27.
 */
var GatewaySVC = require("../services/GatewayService");
var commonTools = require("../utils/CommonTools");
var _ = require("underscore");

/**
 * 產生房型庫存
 */
exports.genRoomTypeStock = function (req, res) {
    GatewaySVC.genRoomTypeStock(req.session, req.body, function (err, success) {
        res.json({success: success, errorMsg: err});
    });
};

/**
 * 上傳圖片
 */
exports.uploadRoomTypePic = function (req, res) {
    GatewaySVC.uploadRoomTypePic(req.session, req, function (err, success) {
        res.json({success: success, errorMsg: err});
    });
};

/**
 * 上傳房型到ERP
 */
exports.uploadRoomType = function (req, res) {
    GatewaySVC.uploadRoomType(req.session, req.body, function (err, success) {
        res.json({success: success, errorMsg: err});
    });
};

exports.uploadFile = function (req, res) {
    var fields = {}, files = [];
    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // every time a file has been uploaded successfully,
    form.on('field', function (name, value) {
        switch (name) {
            case "id":
                fields.id = value;
                break;
            case "type":
                fields.type = value;
                break;
        }
    });
    // rename it to it's orignal name
    form.on('file', function (name, file) {
        files.push({
            "size": file.size,
            "temp_path": file.path,
            "file_name": file.name
        })
    });

    // log any errors that occur
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
        var hotel_cod = req.params.hotel_cod;
        var type = fields.type;

        var config = _.find(hotelCodConfig, function (eachConfig) {
            return req.headers.host.indexOf(eachConfig.DNS) > -1;
        });
        var new_location = config.upload_url;

        var vendors_id = fields.id;
        var vendorStr = vendors_id.slice(19);
        var file_dir = req.params.hotel_cod + vendorStr;
        new_location = new_location + file_dir;
        var new_file_name = "";
        var condition = {
            hotel_cod: hotel_cod,
            type: type,
            code: vendors_id
        }

        async.waterfall([
            function (cb) {
                var order;
                uploadService.getNewOrder(condition, function (err, result) {
                    if (result) {
                        if (result.length == 0) {
                            order = 0;
                        } else {
                            var la_file_name_ary = result[result.length - 1].file_name.split("/");
                            if(la_file_name_ary.length == 1){
                                order = la_file_name_ary[0].slice(9, 12);
                            }
                            else{
                                order = (result[result.length - 1].file_name.split("/")[2].slice(9,12));
                            }
                            order = parseInt(order);
                        }
                        cb(null, order);//回傳現在圖片的數字
                    } else {
                        cb(err, null);
                    }
                })
            },
            function (Order, cb) {
                _.each(files, function (eachFiles, index) {
                    var file_size = eachFiles.size;
                    var extName = eachFiles.file_name.split(".")[1];//jpg or png
                    var file_order = "";
                    Order++;
                    if (Order < 10) file_order = "00" + Order;
                    else if (Order < 100) file_order = "0" + Order;

                    var upload_file_name = file_dir + file_order + "." + extName;
                    new_file_name = file_dir + "/" + file_dir + file_order + "." + extName;

                    imageUpload(eachFiles.temp_path, new_location, upload_file_name);
                    write_into_db(hotel_cod, vendors_id, new_location, new_file_name, file_size, type);

                })
                cb(null, "OK");
            }
        ], function (err, result) {
            if (err) {
                res.json({"success": false, "msg": err});
            } else {
                res.json({success: true, msg: "上傳成功", new_file_name: new_file_name});
            }
        });

    });
    // parse the incoming request containing the form data
    form.parse(req);
};