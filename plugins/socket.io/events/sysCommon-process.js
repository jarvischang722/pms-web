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

            let socket_id = socket.client.id;
            try {
                if (go_session) {
                    if (data) {
                        let prg_id = data.prg_id || "";
                        let page_id = data.page_id || 1;
                        let table_name = "";
                        let lock_type = "";
                        let key_cod = "";
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

                        _.each(_.where(ga_lockPrgIDList, {socket_id: socket_id}), function (data, idx) {
                            let tmpPrgID = data.lockingPrgID;
                            let table_name = data.table_name;
                            ga_lockPrgIDList.slice(idx, 1);
                            dbSVC.doTableUnLock(tmpPrgID, table_name, go_session.user,
                                'T', '', socket_id, function () {
                                });

                        });
                    }
                }
            } catch (ex) {
                console.error(ex);
            }
        });

        //檢查session 是否存在
        socket.on("checkSessionExist", function () {

            var chkSessionInterval = setInterval(function () {

                mongoAgent.Sessions.findOne({_id: socket.request.session.id}, function (err, sessionData) {
                    let lastTimes = 0;
                    if (!err && sessionData) {
                        lastTimes = moment(sessionData.expires).diff(moment(), "seconds");
                    }

                    if (lastTimes < 0) {
                        clearInterval(chkSessionInterval);
                        socket.emit("sessionStatus", {exist: false});
                    } else {
                        socket.emit("sessionTimeLeft", {timeLeft: lastTimes});
                    }

                });

            }, 1000);

        });
    });

    function updateLockList(socket_id, prg_id, table_name) {
        let lo_lock = {socket_id: socket_id, lockingPrgID: prg_id, table_name};
        let idx = _.findIndex(ga_lockPrgIDList, {socket_id})
        if (idx > -1) {
            ga_lockPrgIDList[idx] = lo_lock;
        } else {
            ga_lockPrgIDList.push(lo_lock);
        }
    }

    function deleteLockList(socket_id, lockingPrgID) {
        ga_lockPrgIDList = _.filter(ga_lockPrgIDList, function (data) {
            if (!_.isUndefined(lockingPrgID)) {
                return _.findIndex(ga_lockPrgIDList, {socket_id, lockingPrgID}) == -1;
            } else {
                return _.findIndex(ga_lockPrgIDList, {socket_id}) == -1;
            }
        });

    }
};