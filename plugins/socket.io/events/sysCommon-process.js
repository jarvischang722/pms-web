/**
 * Created by user on 2017/4/7.
 * 系統共用socket
 */
let _ = require("underscore");
let mongoAgent = require("../../mongodb");
let moment = require("moment");
let dbSVC = require("../../../services/DbTableService");
let tools = require("../../../utils/CommonTools");
let queryAgent = require("../../kplug-oracle/QueryAgent");

module.exports = function (io) {

    let ga_lockedPrgIDList = []; //紀錄目前有被lock table的object

    io.of("/system").on('connection', function (socket) {

        let go_session = socket.request.session;
        /**
         * 監聽從前端發動table lock事件
         */
        socket.on('handleTableLock', function (clientData) {
            doTableLock(socket, go_session, clientData);
        });

        /**
         * 監聽從前端發動table unclock事件
         */
        socket.on('handleTableUnlock', function (clientData) {
            doTableUnlock(socket, go_session, clientData);
        });

        /**
         * 與前端斷線觸發事件
         */
        socket.on('disconnect', function () {
            let lo_socketClientData = _.findWhere(ga_lockedPrgIDList, {socket_id: socket.client.id}) || {};
            doTableUnlock(socket, go_session, lo_socketClientData);
            doReleaseOnlineUser(go_session, socket.client.request.sessionID);
        });

        /**
         * 記錄使用者使用button的狀態(資訊)
         */
        socket.on("recordUserAction", function(clientData){
            doRecordUserAction(socket, clientData, go_session);
        });

        /**
         * 檢查session 是否存在
         * @return  回傳emit function name :
         *   1. sessionStatus : session在不在
         *   2. sessionTimeLeft : session剩餘時間
         */
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

        /**
         * 檢查登入者的集團或館別可使用人數
         */
        socket.on("checkOnlineUser", function () {
            doCheckOnlineUser(socket, go_session, socket.client.request.sessionID);
        });


    });

    /**
     * Table lock
     * @param socket {Object}
     * @param go_session {Object}
     * @param clientData {Object} :{
     *    prg_id {String} : 程式編號
     *    table_name {String} : 資料表
     *    lock_type {String} : T -> table lock 或 R -> row lock
     *    key_cod {String} : row key
     * }
     */
    function doTableLock(socket, go_session, clientData) {
        try {
            let socket_id = socket.client.id;
            let prg_id = clientData.prg_id || "";
            let table_name = clientData.table_name || "";
            let lock_type = clientData.lock_type || "T";
            let key_cod = clientData.key_cod || "";
            dbSVC.doTableLock(prg_id, table_name, go_session.user, lock_type, key_cod, socket_id, function (errorMsg, success) {

                if (!success &&
                    _.findIndex(ga_lockedPrgIDList, {socket_id: socket_id, lockingPrgID: prg_id}) > -1 &&
                    errorMsg.indexOf(go_session.user.usr_id) > -1) {
                    success = true;
                }
                if (success) {
                    updateLockList(socket, clientData);
                }

                socket.emit('checkTableLock', {success: success, errorMsg: errorMsg, prg_id: prg_id});
            });

        } catch (ex) {
            socket.emit('checkTableLock', {success: false, errorMsg: ex.message, prg_id: prg_id});
        }
    }

    /**
     * 解Table Lock
     * @param socket {Object}
     * @param go_session {Object}
     * @param clientData {Object} :{
     *    prg_id {String} : 程式編號
     * }
     */
    function doTableUnlock(socket, go_session, clientData) {
        try {
            let socket_id = socket.client.id;
            let prg_id = clientData.prg_id || "";

            if (clientData && !_.isEmpty(prg_id)) {
                let lo_singleSocketData = _.findWhere(ga_lockedPrgIDList, {socket_id: socket_id, lockingPrgID: prg_id});
                if (lo_singleSocketData != null) {
                    dbSVC.doTableUnLock(prg_id, lo_singleSocketData.table_name, go_session.user, lo_singleSocketData.lock_type, lo_singleSocketData.key_cod, socket_id, function (errorMsg, success) {
                        deleteLockList(clientData);
                    });
                }
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
     * 更新暫存的lock中的Object
     * @param socket {Object}
     * @param clientData {Object}
     */
    function updateLockList(socket, clientData) {
        let lo_singelSocket = {
            socket_id: socket.client.id,
            socket: socket,
            lockingPrgID: clientData.prg_id || "",
            table_name: clientData.table_name || "",
            lock_type: clientData.lock_type || "T",
            key_cod: clientData.key_cod || ""
        };
        let ln_existSocketIdx = _.findIndex(ga_lockedPrgIDList, {socket_id: socket.client.id, key_cod: clientData.key_cod});
        if (ln_existSocketIdx > -1) {
            ga_lockedPrgIDList[ln_existSocketIdx] = lo_singelSocket;
        } else {
            ga_lockedPrgIDList.push(lo_singelSocket);
        }
    }

    /**
     * 刪除暫存
     * @param clientData {Object}
     */
    function deleteLockList(clientData) {
        ga_lockedPrgIDList = _.filter(ga_lockedPrgIDList, function (socketData) {
            return _.findIndex(ga_lockedPrgIDList, {
                socket_id: socketData.socket_id,
                lockingPrgID: clientData.lockingPrgID || ""
            }) == -1;
        });

    }

    /**
     * 記錄使用者使用button的資訊
     * user id、 session id、prg id、func id、url、event time、athena id、hotel id、comp cod、hotel cod
     * @param socket{object}
     * @param clientData{object}
     * @param session{object}
     * @param session_id{string}
     */
    function doRecordUserAction(socket, clientData, session){
        try{
            dbSVC.doRecordUserAction(session, socket.client.request.sessionID, clientData.prg_id, clientData.func_id, socket.client.request.headers.referer, function(err, success){
                if(err){
                    console.error(err);
                }
            });
        }
        catch (ex){
            console.error(ex);
        }

    }

    /**
     * 刪除指定SocketID暫存
     * @param socket_id {String}
     */
    function deleteLockListBySocketID(socket_id) {
        ga_lockedPrgIDList = _.filter(ga_lockedPrgIDList, function (data) {
            return !_.isEqual(socket_id, data.socket_id);
        });

    }

    /**
     * 授權控管 人數(確認館別、公司、集團是否超過人數)
     * @param socket{object}
     * @param socket{object}
     * @param go_session{object}
     * @param gs_sessionId{string}
     */
    function doCheckOnlineUser(socket, go_session, gs_sessionId) {
        try {
            dbSVC.doCheckOnlineUser(go_session, gs_sessionId, function (err, success) {
                socket.emit('checkOnlineUserResult', {success: success, errorMsg: err});
            });
        }
        catch (ex) {
            console.error(ex);
        }
    }

    /**
     * 刪除 mongo 裡collection OnlineUser 相對應的 session_id
     * @param go_session{object}
     * @param gs_sessionId{string}
     */
    function doReleaseOnlineUser(go_session, gs_sessionId) {
        dbSVC.doReleaseOnlineUser(go_session, gs_sessionId, function (err, success) {
            if (err) {
                console.error(err);
            }
        });
    }
};