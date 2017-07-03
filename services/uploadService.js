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

/**
 * 上傳圖片
 */
exports.uploadFile = function (params, session, cb) {
    var dataURL = [];
    var fileName = [];

    var form = new formidable.IncomingForm();

    form.on('field', function (name, value) {
        switch (name) {
            case "dataURL":
                dataURL.push(value);
                break;
            case "fileName":
                fileName.push(value);
                break;
        }
    });

    // log any errors that occur
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
        var ls_upload_url = sysConfig.upload_url;
        _.each(dataURL, function(file, index){
            var string = file;
            var regex = /^data:.+\/(.+);base64,(.*)$/;

            var matches = string.match(regex);
            var data = matches[2];
            var buffer = new Buffer(data, 'base64');
            fs.writeFileSync(ls_upload_url + fileName[index], buffer);
        })
        cb(null, true);

    });
    // parse the incoming request containing the form data
    form.parse(params);
};