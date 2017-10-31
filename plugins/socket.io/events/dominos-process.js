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
        //console.log(socket.client.id + "連線囉!!");
        let go_session = socket.request.session;


        //TODO on method  做table lock ; clien 做 emit method
        socket.on('doTableLock', function (data) {
            socket.emit("tttttt", {sssss:xxxx});
        });

        //TODO on method  做table unlock ; clien 做 emit method
        socket.on('doTableUnLock', function (data) {

        });

        socket.on('disconnect', function () {
            //TODO 做table unlock
            //console.log(socket.client.id + "斷線囉!!");
        });

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
            } else {
                dbSVC.doTableUnLockBySocketID(socket_id, function (errorMsg, success) {
                    deleteLockListBySocketID(socket_id);
                });
            }

        } catch (ex) {
            console.error(ex);
        }
    }


    /**
     * 更新暫存的lock中的program
     * @param socket_id
     * @param prg_id
     * @param table_name
     */
    function updateLockList(socket_id, prg_id, table_name) {
        let lo_lock = {socket_id: socket_id, lockingPrgID: prg_id, table_name};
        let idx = _.findIndex(ga_lockPrgIDList, {socket_id});
        if (idx > -1) {
            ga_lockPrgIDList[idx] = lo_lock;
        } else {
            ga_lockPrgIDList.push(lo_lock);
        }
    }

    /**
     * 刪除暫存
     * @param socket_id
     * @param lockingPrgID
     */
    function deleteLockList(socket_id, lockingPrgID) {
        ga_lockPrgIDList = _.filter(ga_lockPrgIDList, function (data) {
            if (!_.isUndefined(lockingPrgID)) {
                return _.findIndex(ga_lockPrgIDList, {socket_id, lockingPrgID}) == -1;
            }
            return _.findIndex(ga_lockPrgIDList, {socket_id}) == -1;

        });

    }

    /**
     * 刪除指定SocketID暫存
     * @param socket_id
     */
    function deleteLockListBySocketID(socket_id) {
        ga_lockPrgIDList = _.filter(ga_lockPrgIDList, function (data) {
            return !_.isEqual(socket_id, data.socket_id);
        });

    }
};