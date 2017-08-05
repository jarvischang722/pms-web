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
    var imageURL = [];
    var info = [];

    var form = new formidable.IncomingForm();

    form.on('field', function (name, value) {
        switch (name) {
            case "imageURL":
                imageURL.push(value);
                break;
            case "info":
                var lo_value = JSON.parse(value);
                info.push(lo_value);
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
        var writeErr = "";
        var rtnData = [];

        _.each(imageURL, function (file, index) {
            // 上傳路徑 = config上傳位置/athena_id/hotel_cod/room_cod/
            var begin_dat = info[index].begin_dat.split("/");
            var year = begin_dat[0];
            var mon = begin_dat[1];
            var day = begin_dat[2];
            var ls_folder = athena_id + "/" + hotel_cod + "/" + info[index].room_cod.trim();
            var ls_upload_url = sysConfig.upload_url + ls_folder;
            var string = file;
            var regex = /^data:.+\/(.+);base64,(.*)$/;

            var matches = string.match(regex);
            var data = matches[2];
            var buffer = new Buffer(data, 'base64');

            // 驗證父層資料夾是否存在
            chkDir(ls_upload_url);

            try {
                fs.writeFileSync(ls_upload_url + "/" + info[index].fileName, buffer);
                rtnData.push({
                    fileDir: ls_folder + "/" + info[index].fileName,
                    fileName: info[index].fileName,
                    image_url: sysConfig.image_url + ls_folder + "/" + info[index].fileName
                });
            }
            catch (err) {
                writeErr = err;
            }
        })
        if (writeErr != "") {
            cb(writeErr, {success: false, rtnData: ""});
        }
        else {
            cb(null, {success: true, rtnData: rtnData});
        }


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