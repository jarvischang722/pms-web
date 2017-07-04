/**
 * Created by a16010 on 2017/7/3.
 */

const moment = require("moment");
const _ = require("underscore");
const async = require("async");
const CommonTools = require("../utils/CommonTools");
const sysConfig = require("../configs/SystemConfig");
const fs = require("fs");
const formidable = require('formidable');
const path = require("path");

/**
 * 上傳圖片
 */
exports.uploadFile = function (params, session, cb) {
    var dataURL = [];
    var roomInfo = [];

    var form = new formidable.IncomingForm();

    form.on('field', function (name, value) {
        switch (name) {
            case "dataURL":
                dataURL.push(value);
                break;
            case "roomInfo":
                var lo_value = JSON.parse(value);
                roomInfo.push(lo_value);
                break;
        }
    });

    // log any errors that occur
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
        var athena_id = session.user.athena_id;
        var hotel_cod = session.user.fun_hotel_cod;


        _.each(dataURL, function (file, index) {
            // 上傳路徑 = config上傳位置/athena_id/hotel_cod/room_cod/
            var ext = roomInfo[index].fileName.split(".")[1];
            var ls_upload_url = sysConfig.upload_url + athena_id + "/" + hotel_cod + "/" + roomInfo[index].room_cod.trim();
            chkDir(ls_upload_url);
            var ls_fileName = "RMK_" + moment(roomInfo[index].begin_dat).format("YYYYMMDD") + "." + ext;
            var string = file;
            var regex = /^data:.+\/(.+);base64,(.*)$/;

            var matches = string.match(regex);
            var data = matches[2];
            var buffer = new Buffer(data, 'base64');
            // fs.writeFileSync(ls_upload_url + "/" + ls_fileName, buffer);
        })
        cb(null, true);

    });
    // parse the incoming request containing the form data
    form.parse(params);
};

function chkDir(targetDir) {
    targetDir.split('/').forEach((dir, index, splits) => {
        const parent = splits.slice(0, index).join('/');
        const dirPath = path.resolve(parent, dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
    });
}