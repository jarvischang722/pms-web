/**
 * Created by user on 2017/4/7.
 */
var _ = require("underscore");
var mongoAgent = require("../../mongodb");
var dbSVC = require("../../../services/dbTableService");


module.exports = function (io) {

    io.of("/setup").on('connection', function (socket) {

        // table lock
        socket.on('handleTableLock', function (data) {
            var prg_id = data.prg_id || "";
            var page_id = data.page_id || 1;
            var table_name = "";
            var user_id = data.user.usr_id;
            var athena_id = data.user.athena_id;
            var lock_type = "";
            var key_cod = "";
            var socket_id = socket.id;


            mongoAgent.TemplateRf.findOne({prg_id: prg_id, page_id: page_id}, function (err, template) {

                if (!err && template) {
                    template = template.toObject();
                    table_name = template.lock_table;
                    lock_type = template.lock_type == "table" ? "T" : "R";

                    dbSVC.doTableLock(prg_id, table_name, user_id, lock_type, key_cod, athena_id, socket_id, function (errorMsg, success) {
                        console.log(success);
                        socket.emit('checkTableLock', {success: success, errorMsg: errorMsg});
                    })
                }

            })

        });

        // table unlock
        socket.on('handleTableUnlock', function (data) {
            var prg_id = data.prg_id || "";
            var page_id = data.page_id || 1;
            var table_name = "";
            var user_id = data.user.usr_id;
            var athena_id = data.user.athena_id;
            var lock_type = "";
            var key_cod = "";
            var socket_id = socket.id;


            mongoAgent.TemplateRf.findOne({prg_id: prg_id, page_id: page_id}, function (err, template) {

                if (!err && template) {
                    template = template.toObject();
                    table_name = template.lock_table;
                    lock_type = template.lock_type == "table" ? "T" : "R";

                    dbSVC.doTableUnLock(prg_id, table_name, user_id, lock_type, key_cod, athena_id, socket_id, function (errorMsg, success) {
                        //table lock done
                    })
                }

            })

        })
    })

};