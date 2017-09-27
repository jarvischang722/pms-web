/**
 * Created by a14020 on 2017/9/12.
 */
var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var ruleRootPath = appRootDir + "/ruleEngine/";
var queryAgent = require(appRootDir + '/plugins/kplug-oracle/QueryAgent');
var commandRules = require("./../CommonRule");
var ReturnClass = require(ruleRootPath + "/returnClass");
var ErrorClass = require(ruleRootPath + "/errorClass");

module.exports = {
    chkRoommnConnroom: function (postData, session, callback) {

        var connRoom = postData.singleRowData.conn_room;
        var lo_result = new ReturnClass();
        var lo_error = null;

        if (connRoom != "") {

            var roomNos = postData.singleRowData.room_nos.trim();
            var params = {
                athenaid: postData.singleRowData.athena_id,
                hotel_cod: postData.singleRowData.hotel_cod,
                room_nos: postData.singleRowData.room_nos,
            };

            if (roomNos != connRoom) {
                queryAgent.query("QRY_ROOM_MN_CONN_ROOM", params, function (err, guestData) {
                    if (!err) {
                        if (!_.isNull(guestData)) {
                            if (guestData.conn_room != "" && guestData.conn_room == postData.singleRowData.room_nos) {
                                lo_error = new ErrorClass();
                                lo_result.success = false;
                                lo_error.errorMsg = "房號【" + postData.singleRowData.room_nos + "】已經有設定連通房號【" + guestData.conn_room + "】,不能再指定";
                                lo_error.errorCod = "1111";
                                callback(lo_error, lo_result);
                            } else {
                                //通過
                                lo_result.success = true;
                                postData.singleRowData.character_rmk = postData.singleRowData.character_rmk.push("CTRM");
                                lo_result.effectValues = postData.singleRowData;
                                callback(lo_error, lo_result);
                            }

                        } else {
                            lo_error = new ErrorClass();
                            lo_result.success = false;
                            lo_error.errorMsg = "查不到連通房號";
                            lo_error.errorCod = "1111";
                            callback(lo_error, lo_result);
                        }
                    } else {
                        lo_result.success = true;
                        postData.singleRowData.character_rmk = postData.singleRowData.character_rmk;//還要再修改
                        lo_result.effectValues = postData.singleRowData;
                        callback(err, lo_result);
                    }
                });
            } else {

                lo_result.success = false;
                lo_error = new ErrorClass();
                lo_error.errorMsg = "不能與自己房號相同";
                lo_error.errorCod = "1111";
                callback(lo_error, lo_result);

            }
        } else {
            callback(lo_error, lo_result);
        }

    },
    r_RoommnDel: function (postData, session, callback) {
        var roomSta = postData.singleRowData.room_sta;
        var lo_result = new ReturnClass();
        var subFuncArray = [];
        var params = {
            athena_id: postData.singleRowData.athena_id,
            hotel_cod: postData.singleRowData.hotel_cod
        };

        if (roomSta == "O" || roomSta == "R" || roomSta == "S") {
            lo_result.success = false;
            lo_error = new ErrorClass();
            lo_error.errorMsg = "房間狀況為住人、修理及參觀,不可刪除";
            lo_error.errorCod = "1111";
            callback(lo_error, lo_result);
        } else {

            queryAgent.query("QRY_HOTEL_SVAL", params, function (err, guestData) {

                var params4BatchDat = {
                    athena_id: postData.singleRowData.athena_id,
                    hotel_cod: postData.singleRowData.hotel_cod,
                    batch_dat: guestData.hotel_sval,
                    room_nos: postData.singleRowData.room_nos

                };

                //檢查指定房號於滾房租日(含)以後尚有排房者不可刪除
                queryAgent.query("QRY_ROW_HOURCE_MIN_BATCH_DAT", params4BatchDat, function (err, guestData) {
                    if (guestData.batchdat != null) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = "此房間於【" + guestData.batchDat + "】已有排房，請取消排房後再執行刪除";
                        lo_error.errorCod = "1111";
                        callback(lo_error, lo_result);
                    }
                });

                //檢查指定房號於滾房租日(含)以後尚有修理設定者不可刪除
                queryAgent.query("QRY_FIX_MIN_BATCH_DAT", params4BatchDat, function (err, guestData) {
                    if (guestData.batchdat != null) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = "此房間於【" + guestData.batchDat + "】尚有修理設定，請刪除修理後再執行刪除";
                        lo_error.errorCod = "1111";
                        callback(lo_error, lo_result);
                    }
                });

                //檢查指定房號於滾房租日(含)以後尚有修理設定者不可刪除
                queryAgent.query("QRY_VISIT_MIN_BATCH_DAT", params4BatchDat, function (err, guestData) {
                    if (guestData.batchdat != null) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = "此房間於【" + guestData.batchDat + "】尚有參觀設定，請刪除參觀後再執行刪除";
                        lo_error.errorCod = "1111";
                        callback(lo_error, lo_result);
                    }
                });
                //lo_result.success = true;

                //檢查成功後,刪除房號存檔一併刪除滾房租日(含)以後房間庫存資料
                //如果有連通房,一併清除【例如自己是101,而連通房舊值是102,新值是空】  放在0531

            })
            lo_result.success = true;
            callback(null, lo_result);
        }
    },
    r_RoommDelChangeData: function (postData, session, callback) {
        //組
        let lo_result = new ReturnClass();
        let userInfo = session.user;
        let lo_error = null;
        var params = {
            athena_id: postData.singleRowData.athena_id,
            hotel_cod: postData.singleRowData.hotel_cod
        };

        queryAgent.query("QRY_HOTEL_SVAL", params, function (err, guestlData) {
            lo_result.extendExecDataArrSet.push({
                function: '0',
                table_name: 'rminv_dt',
                condition: [{
                    key: 'athena_id',
                    operation: "=",
                    value: userInfo.athena_id
                }, {
                    key: 'hotel_cod',
                    operation: "=",
                    value: userInfo.hotel_cod
                }, {
                    key: 'batch_dat',
                    operation: ">=",
                    value: guestlData.batch_dat
                }, {
                    key: 'romm_nos',
                    operation: "=",
                    value: postData.singleRowData.romm_nos
                }]
            });

            lo_result.extendExecDataArrSet.push({
                function: '2',
                table_name: 'room_mn',
                condition: [{
                    key: 'athena_id',
                    operation: "=",
                    value: userInfo.athena_id
                }, {
                    key: 'hotel_cod',
                    operation: "=",
                    value: userInfo.hotel_cod
                }, {
                    key: 'room_nos',
                    operation: "=",
                    value: postData.singleRowData.romm_nos
                }],
                conn_room:"",
                character_rmk: postData.singleRowData.character_rmk.push("CTRM")
            });
        });

        callback(lo_error, lo_result);
    },
    r_RoommnIns: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        let chkResult = new ReturnClass();
        let userInfo = session.user;

        chkResult.extendExecDataArrSet.push({
            function: '2',
            table_name: 'room_mn',
            condition: [{
                key: 'athena_id',
                operation: "=",
                value: userInfo.athena_id
            }, {
                key: 'hotel_cod',
                operation: "=",
                value: userInfo.hotel_cod
            }, {
                key: 'room_nos',
                operation: "=",
                value: postData.singleRowData.romm_nos
            }],
            conn_room: postData.singleRowData.conn_room,
            character_rmk: postData.singleRowData.character_rmk.push("CTRM")
        });

        callback(lo_error, lo_result);
    },
    r_RoommnUpd: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var singleRowData = postData.singleRowData;
        let chkResult = new ReturnClass();
        let userInfo = session.user;

        var params = {
            athena_id: singleRowData.athena_id,
            hotel_cod: singleRowData.hotel_cod.trim(),
            room_nos: singleRowData.room_nos
        };

        queryAgent.query("QRY_SINGLE_ROOM_MN", params, function (err, guestData) {
            if ((guestData.connn_room == "" && singleRowData.conn_room != "") || (guestData.connn_room != singleRowData.conn_room)) {
                chkResult.extendExecDataArrSet.push({
                    function: '2',
                    table_name: 'room_mn',
                    condition: [{
                        key: 'athena_id',
                        operation: "=",
                        value: userInfo.athena_id
                    }, {
                        key: 'hotel_cod',
                        operation: "=",
                        value: userInfo.hotel_cod
                    }, {
                        key: 'room_nos',
                        operation: "=",
                        value: singleRowData.room_nos
                    }],
                    conn_room: singleRowData.conn_room || "",
                    character_rmk: singleRowData.character_rmk.push("CTRM")
                });
            }
            if ((guestData.connn_room != "" && singleRowData.conn_room == "") || (guestData.connn_room != singleRowData.conn_room)) {
                chkResult.extendExecDataArrSet.push({
                    function: '2',
                    table_name: 'room_mn',
                    condition: [{
                        key: 'athena_id',
                        operation: "=",
                        value: userInfo.athena_id
                    }, {
                        key: 'hotel_cod',
                        operation: "=",
                        value: userInfo.hotel_cod
                    }, {
                        key: 'room_nos',
                        operation: "=",
                        value: singleRowData.room_nos
                    }],
                    conn_room: "",
                    character_rmk: singleRowData.character_rmk.splice("0","0","CTRM")
                });
            }

            queryAgent.query("QRY_HOTEL_SVAL", params, function (err, hotelData) {
                if (guestData.room_nos != singleRowData.room_nos) {
                    chkResult.extendExecDataArrSet.push({
                        function: '2',
                        table_name: 'room_mn',
                        condition: [{
                            key: 'athena_id',
                            operation: "=",
                            value: userInfo.athena_id
                        }, {
                            key: 'hotel_cod',
                            operation: "=",
                            value: userInfo.hotel_cod
                        }, {
                            key: 'batch_dat',
                            operation: "=",
                            value: hotelData.batch_dat
                        }, {
                            key: 'room_nos',
                            operation: "=",
                            value: singleRowData.room_nos
                        }],
                        conn_cod: singleRowData.conn_cod
                    });
                }
            });
        });

        callback(lo_error, lo_result);
    }
}