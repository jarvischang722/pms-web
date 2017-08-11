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
    io.of("/system").on('connection', function (socket) {

        let go_session = socket.request.session;
        socket.on('handleTableLock', function (data) {
            try {
                let prg_id = data.prg_id || "";
                let page_id = data.page_id || 1;
                let table_name = "";
                let lock_type = "";
                let key_cod = "";
                let socket_id = socket.client.id;

                mongoAgent.TemplateRf.findOne({prg_id: prg_id, page_id: page_id}, function (err, template) {

                    if (!err && template) {

                        if (!_.isEmpty(template.lock_table)) {
                            template = template.toObject();
                            table_name = template.lock_table;
                            lock_type = template.lock_type == "table" ? "T" : "R";

                            dbSVC.doTableLock(prg_id, table_name, go_session.user, lock_type, key_cod, socket_id, function (errorMsg, success) {

                                if (!success &&
                                    _.findIndex(ga_lockPrgIDList, {socket_id: socket_id, lockingPrgID: prg_id}) > -1 &&
                                    errorMsg.indexOf(go_session.user.usr_id) > -1) {
                                    success = true;
                                }
                                if (success) {
                                    updateLockList(socket_id, prg_id, table_name);
                                }

                                socket.emit('checkTableLock', {success: success, errorMsg: errorMsg, prg_id: prg_id});
                            });
                        } else {
                            socket.emit('checkTableLock', {success: true, errorMsg: "", prg_id: prg_id});
                        }
                    } else {
                        socket.emit('checkTableLock', {success: false, errorMsg: "Not found Program.", prg_id: prg_id});
                    }

                });
            } catch (ex) {
                socket.emit('checkTableLock', {success: false, errorMsg: ex.message, prg_id: prg_id});
                console.error(ex);
            }

        });

        // table unlock
        socket.on('handleTableUnlock', function (data) {
            doTableUnlock(socket.client.id, go_session, data);
        });

        //檢查session 是否存在
        socket.on("checkSessionExist", function () {

            var chkSessionInterval = setInterval(function () {
                let lastTimes = moment(socket.request.session.cookie._expires).diff(moment(), "seconds");

                if (lastTimes < 0) {
                    clearInterval(chkSessionInterval);
                    socket.emit("sessionStatus", {exist: false});
                } else {
                    socket.emit("sessionTimeLeft", {timeLeft: lastTimes});
                }

            }, 1000);

        });

        socket.on('disconnect', function () {
            let lo_socket = _.findWhere(ga_lockPrgIDList, {socket_id: socket.client.id});
            doTableUnlock(socket.client.id, go_session, {prg_id: lo_socket ? lo_socket.lockingPrgID || "" : ""});


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