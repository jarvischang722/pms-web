/**
 * Created by user on 2017/4/7.
 * 系統共用socket
 */
var _ = require("underscore");
var mongoAgent = require("../../mongodb");
var moment = require("moment");
var dbSVC = require("../../../services/DbTableService");


module.exports = function (io) {
    let ga_lockPrgIDList = [];
    io.of("/dominos").on('connection', function (socket) {
        console.log(socket.client.id + "連線囉!!");
        let go_session = socket.request.session;

        socket.on('doRowLock', function (data) {
            doRowLock(socket.client.id, go_session, data);
        });


        socket.on('doTableUnLock', function (data) {
            doTableUnlock(socket.client.id, go_session, data);
        });

        socket.on('disconnect', function (data) {
            doTableUnlock(socket.client.id, go_session, data);
            console.log(socket.client.id + "斷線囉!!");
        });

    });


    /**
     * Lock
     * @param socket_id
     * @param go_session
     * @param data :{
          prg_id {String}
          page_id {Number}   : default  1
     }
     */
    function doRowLock(socket_id, go_session, data) {

        try {
            if (data && !_.isUndefined(data.prg_id) && !_.isUndefined(go_session.user)) {
                let prg_id = data.prg_id || "";
                let table_name = go_session.user.cmp_id + data.order_nos;
                let lock_type = "R";
                let key_cod = "psi_quote_mn";

                 dbSVC.doTableLock(prg_id, table_name, go_session.user, lock_type, key_cod, socket_id, function (errorMsg, success) {
                     if (!success) {
                         success = true;
                     }
                     if (success) {
                         updateLockList(socket_id, prg_id, table_name);
                     }

                     socket.emit('checkTableLock', {success: success, errorMsg: errorMsg, prg_id: prg_id});
                 });
            }
        } catch (ex) {
            console.error(ex);
        }
    }

    /**
     * 解Lock
     * @param socket_id
     * @param go_session
     * @param data :{
          prg_id {String}
          page_id {Number}   : default  1
     }
     */
    function doTableUnlock(socket_id, go_session, data) {
        let prg_id = "";
        let page_id = 1;
        let table_name = "";
        let lock_type = "";
        let key_cod = "";

        try {

            if (data && !_.isUndefined(data.prg_id) && !_.isEmpty(data.prg_id) && !_.isUndefined(go_session.user)) {
                prg_id = data.prg_id || "";
                page_id = data.page_id || 1;
                table_name = "";
                lock_type = "";
                key_cod = "";
                mongoAgent.TemplateRf.findOne({prg_id: prg_id, page_id: page_id}, function (err, template) {

                    if (!err && template && !_.isEmpty(template.lock_table)) {
                        template = template.toObject();
                        table_name = template.lock_table;
                        lock_type = template.lock_type == "table" ? "T" : "R";

                        dbSVC.doTableUnLock(prg_id, table_name, go_session.user, lock_type, key_cod, socket_id, function (errorMsg, success) {
                            deleteLockList(socket_id, prg_id);
                        });
                    }

                });
            }
        } catch (ex) {
            console.error(ex);
        }
    }

};