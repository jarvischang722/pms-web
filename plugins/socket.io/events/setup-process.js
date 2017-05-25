/**
 * Created by user on 2017/4/7.
 */
var _ = require("underscore");
var mongoAgent = require("../../mongodb");
var dbSVC = require("../../../services/dbTableService");


module.exports = function (io) {

    io.of("/setup").on('connection', function (socket) {
        var go_session = socket.request.session;
        socket.on('handleTableLock', function (data) {
            var prg_id = data.prg_id || "";
            var page_id = data.page_id || 1;
            var table_name = "";
            var user_id = go_session.user.usr_id;
            var athena_id = go_session.user.athena_id;
            var hotel_cod = go_session.user.fun_hotel_cod;
            var lock_type = "";
            var key_cod = "";
            var socket_id = socket.id;


            mongoAgent.TemplateRf.findOne({prg_id: prg_id, page_id: page_id}, function (err, template) {

                if (!err && template && !_.isEmpty(template.lock_table)) {
                    template = template.toObject();
                    table_name = template.lock_table;
                    lock_type = template.lock_type == "table" ? "T" : "R";

                    dbSVC.doTableLock(prg_id, table_name, go_session.user, lock_type, key_cod, socket_id, function (errorMsg, success) {
                        socket.emit('checkTableLock', {success: success, errorMsg: errorMsg, prg_id: prg_id});
                    })
                } else {
                    socket.emit('checkTableLock', {success: false, errorMsg: "Not found Program.", prg_id: prg_id});
                }

            })

        });

        // table unlock
        socket.on('handleTableUnlock', function (data) {
            var prg_id = data.prg_id || "";
            var page_id = data.page_id || 1;
            var table_name = "";
            var user_id = go_session.user.usr_id;
            var athena_id = go_session.user.athena_id;
            var hotel_cod = go_session.user.fun_hotel_cod;
            var lock_type = "";
            var key_cod = "";
            var socket_id = socket.id;


            mongoAgent.TemplateRf.findOne({prg_id: prg_id, page_id: page_id}, function (err, template) {

                if (!err && template && !_.isEmpty(template.lock_table)) {
                    template = template.toObject();
                    table_name = template.lock_table;
                    lock_type = template.lock_type == "table" ? "T" : "R";

                    dbSVC.doTableUnLock(prg_id, table_name, go_session.user, lock_type, key_cod, socket_id, function (errorMsg, success) {
                        //table lock done
                    })
                }

            })

        })
    })

};