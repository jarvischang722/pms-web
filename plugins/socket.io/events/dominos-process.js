/**
 * Created by user on 2017/4/7.
 * 系統共用socket
 */
var _ = require("underscore");
var mongoAgent = require("../../mongodb");
var moment = require("moment");
var dbSVC = require("../../../services/DbTableService");
var PSIWService = require("../../../services/SaleAndInventoryService");

module.exports = function (io) {
    io.of("/dominos").on('connection', function (socket) {
        console.log(socket.client.id + "已連線");
        let go_session = socket.request.session;

        var lo_data;

        socket.on('doRowLock', function (data) {
            lo_data = data;
            doRowLock(socket.client.id, go_session, data);
        });

        socket.on('doRowUnLock', function (data) {
            doRowUnlock(socket.client.id, go_session, data);
        });

        socket.on('disconnect', function () {
            if(!_.isUndefined(lo_data)){

                doRowUnlock(socket.client.id, go_session, lo_data);
                console.log("unlock: " + lo_data.order_nos);

                //region//取消修改狀態

                var lo_params = {
                    REVE_CODE : 'PSIW5100302010',
                    prg_id: lo_data.prg_id,
                    order_nos: lo_data.order_nos
                };

                PSIWService.callAPI(lo_params, go_session, function (errorMsg, success) {
                });

                //endregion
            }
              console.log(socket.client.id + "已斷線");
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
                        socket.emit('checkRowLock', {success: success, errorMsg: errorMsg, prg_id: prg_id});
                    });
                }
            } catch (ex) {
                console.error(ex);
            }
        }


    });

    /**
     * 解Lock
     * @param socket_id
     * @param go_session
     * @param data :{
          prg_id {String}
          page_id {Number}   : default  1
     }
     */
    function doRowUnlock(socket_id, go_session, data) {

        try {
            if (data && !_.isUndefined(data.prg_id) && !_.isUndefined(go_session.user)) {
                let prg_id = data.prg_id || "";
                let table_name = go_session.user.cmp_id + data.order_nos;
                //let table_name = "";
                let lock_type = "R";
                let key_cod = "psi_quote_mn";

                dbSVC.doTableUnLock(prg_id, table_name, go_session.user, lock_type, key_cod, socket_id, function (errorMsg, success) {

                });
            }
        } catch (ex) {
            console.error(ex);
        }
    }

};