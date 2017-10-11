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
let dbSvc = require(appRootDir + "/services/DbTableService");

module.exports = {
    /**
     * 連通房檢查
     * 如果有輸入值
     * 1.不能與欄位room_nos相同
     * 2.select conn_room from room_mn where athena_id = ? and hotel_cod = ? and room_nos = '連通房號' and rownum = 1
     * (1)必須有查到
     * (2)如果coon_room有值
     * 訊息:房號【帶入連通房號】已經有設定連通房號【帶入conn_room】,不能再指定
     * 3.欄位character_rmk串上'CTRM'
     * 如果沒有輸入值
     * 1.欄位character_rmk拿掉'CTRM'
     */
    chkRoommnConnroom: function (postData, session, callback) {

        let ls_connRoom = postData.singleRowData.conn_room || "";
        ls_connRoom = ls_connRoom.trim();
        let ls_roomNos = postData.singleRowData.room_nos || "";
        ls_roomNos = ls_roomNos.trim();

        if (!_.isArray(postData.singleRowData.character_rmk)) {
            postData.singleRowData.character_rmk = [];
        }

        let lo_result = new ReturnClass();
        let lo_error = null;

        // 連通房未填
        if (ls_connRoom == "") {
            let ctrmIsExist = _.findIndex(postData.singleRowData.character_rmk, function (eachData) {
                return eachData.trim() == "CTRM";
            });
            if (ctrmIsExist != -1) {
                postData.singleRowData.character_rmk = _.without(postData.singleRowData.character_rmk, "CTRM");
                lo_result.effectValues = postData.singleRowData;
            }
            return callback(lo_error, lo_result);
        }
        // 房號未填
        else if (ls_roomNos == "") {
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = "房號未填";
            lo_error.errorCod = "1111";
            return callback(lo_error, lo_result);
        }

        if (ls_connRoom == ls_roomNos) {
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = "不能與自己房號相同";
            lo_error.errorCod = "1111";
            return callback(lo_error, lo_result);
        }

        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod,
            conn_room: ls_connRoom
        };

        async.waterfall([
            chkRoomNosIsExist,          //檢查房間是否存在
            chkConnRoomIsExist          //檢查是否有設定連通房
        ], function (err, result) {
            callback(err, result);
        });

        function chkRoomNosIsExist(cb) {
            queryAgent.query("QRY_ROOM_NOS_COUNT", lo_params, function (err, getResult) {
                if (getResult.room_count == 0) {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = "查無此房號";
                    lo_error.errorCod = "1111";
                    lo_result.effectValues = postData.oriSingleRowData;
                }

                cb(lo_error, lo_result);
            });
        }

        function chkConnRoomIsExist(result, cb) {
            queryAgent.query("QRY_ROOM_MN_CONN_ROOM", lo_params, function (err, getResult) {
                getResult.conn_room = getResult.conn_room || "";
                if (err) {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = err;
                    lo_error.errorCod = "1111";
                    return cb(lo_error, lo_result);
                }
                else {
                    if (getResult.conn_room.trim() != "" && getResult.conn_room.trim() != ls_roomNos) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = "房號【" + ls_roomNos + "】已經有設定連通房號【" + ls_connRoom + "】,不能再指定";
                        lo_error.errorCod = "1111";
                        cb(lo_error, lo_result);
                    }
                    else {
                        postData.singleRowData.character_rmk.push("CTRM");
                        postData.singleRowData.character_rmk = _.uniq(postData.singleRowData.character_rmk);
                        lo_result.effectValues = postData.singleRowData;
                        cb(lo_error, lo_result);
                    }
                }
            });
        }
    },

    /**
     * 刪除檢查
     * 1.檢查指定房號房間狀況為住人、修理及參觀者不可刪除
     * 2.檢查指定房號於滾房租日(含)以後尚有排房、修理及參觀設定者不可刪除
     *
     * 檢查成功後
     * 3.刪除房號存檔一併刪除滾房租日(含)以後房間庫存資料
     * 4.如果有連通房,一併清除
     */
    r_RoommnDel: function (postData, session, callback) {
        let roomSta = postData.singleRowData.room_sta;
        roomSta = roomSta.trim();
        let lo_result = new ReturnClass();
        let lo_error = null;
        let subFuncArray = [];
        let params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod
        };
        let params4BatchDat = params;

        if (roomSta == "O" || roomSta == "R" || roomSta == "S") {
            lo_result.success = false;
            lo_error = new ErrorClass();
            lo_error.errorMsg = "房間狀況為住人、修理及參觀,不可刪除";
            lo_error.errorCod = "1111";
            callback(lo_error, lo_result);
        } else {

            async.waterfall([
                qryHotelSval,           //滾房租日
                chkRowHourceMinDat,     //檢查指定房號於滾房租日(含)以後尚有排房者不可刪除
                chkFixMinDat,           //檢查指定房號於滾房租日(含)以後尚有修理設定者不可刪除
                chkVisitMinDat          //檢查指定房號於滾房租日(含)以後尚有參觀設定者不可刪除
            ], function (err, result) {
                callback(err, result);
            });

            //滾房租日
            function qryHotelSval(cb) {
                queryAgent.query("QRY_HOTEL_SVAL", params, function (err, getResult) {
                    params4BatchDat.batch_dat = getResult.hotel_sval;
                    params4BatchDat.room_nos = postData.singleRowData.room_nos;
                    cb(null, params4BatchDat);
                });
            }

            //檢查指定房號於滾房租日(含)以後尚有排房者不可刪除
            function chkRowHourceMinDat(result, cb) {
                queryAgent.query("QRY_ROW_HOURCE_MIN_BATCH_DAT", params4BatchDat, function (err, getResult) {
                    if (getResult.batchdat != null) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = "此房間於【" + getResult.batchdat + "】已有排房，請取消排房後再執行刪除";
                        lo_error.errorCod = "1111";
                    }
                    cb(lo_error, lo_result);
                });
            }

            //檢查指定房號於滾房租日(含)以後尚有修理設定者不可刪除
            function chkFixMinDat(result, cb) {
                queryAgent.query("QRY_FIX_MIN_BATCH_DAT", params4BatchDat, function (err, getResult) {
                    if (getResult.batchdat != null) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = "此房間於【" + getResult.batchdat + "】尚有修理設定，請刪除修理後再執行刪除";
                        lo_error.errorCod = "1111";
                    }
                    cb(lo_error, lo_result);
                });
            }

            //檢查指定房號於滾房租日(含)以後尚有參觀設定者不可刪除
            function chkVisitMinDat(result, cb) {
                queryAgent.query("QRY_VISIT_MIN_BATCH_DAT", params4BatchDat, function (err, getResult) {
                    if (getResult.batchdat != null) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = "此房間於【" + getResult.batchdat + "】尚有參觀設定，請刪除參觀後再執行刪除";
                        lo_error.errorCod = "1111";
                    }
                    cb(lo_error, lo_result);
                });
            }
        }
    },

    //檢查成功後,刪除房號存檔一併刪除滾房租日(含)以後房間庫存資料
    //如果有連通房,一併清除【例如自己是101,而連通房舊值是102,新值是空】
    r_RoommDelChangeData: function (postData, session, callback) {
        //組
        let userInfo = session.user;
        let ls_hotel_sval;
        let lo_result = new ReturnClass();
        let lo_error = null;

        let lo_params = {
            athena_id: userInfo.athena_id,
            hotel_cod: userInfo.hotel_cod
        };

        async.waterfall([
            qryHotelSval,       //滾房租日
            delRmInvDt,         //刪除房號存檔一併刪除滾房租日(含)以後房間庫存資料
            updRmMn             //如果有連通房,一併清除【例如自己是101,而連通房舊值是102,新值是空】
        ], function (err, result) {
            callback(err, lo_result);
        });

        //滾房租日
        function qryHotelSval(cb) {
            queryAgent.query("QRY_HOTEL_SVAL", lo_params, function (err, getResult) {
                ls_hotel_sval = getResult.hotel_sval;
                cb(null, ls_hotel_sval);
            });
        }

        //刪除房號存檔一併刪除滾房租日(含)以後房間庫存資料
        function delRmInvDt(hotel_sval, cb) {
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
                    value: hotel_sval
                }, {
                    key: 'room_nos',
                    operation: "=",
                    value: postData.singleRowData.room_nos
                }]
            });
            cb(null, "");
        }

        //如果有連通房,一併清除【例如自己是101,而連通房舊值是102,新值是空】
        function updRmMn(result, cb) {

            if (postData.singleRowData.conn_room == "") {
                cb(null, "");
            }
            else {
                let lo_singleParams = {
                    athena_id: userInfo.athena_id,
                    hotel_cod: userInfo.hotel_cod,
                    room_nos: postData.singleRowData.conn_room
                };
                queryAgent.query("QRY_SINGLE_ROOM_MN", lo_singleParams, function (err, getResult) {
                    var ctrmIsExist = _.findIndex(getResult.character_rmk, function (eachData) {
                        return eachData.trim() == "CTRM";
                    });

                    if (ctrmIsExist != -1) {
                        getResult.character_rmk = _.without(getResult.character_rmk, "CTRM");
                    }

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
                            value: postData.singleRowData.conn_room
                        }],
                        conn_room: "",
                        character_rmk: getResult.character_rmk
                    });
                    cb(null, lo_result);
                });
            }
        }
    },

    r_RoommnIns: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        let chkResult = new ReturnClass();
        let userInfo = session.user;

        if (postData.createData.length > 1) {
            return callback(null, lo_result);
        }

        postData.singleRowData.character_rmk = postData.singleRowData.character_rmk == "" ? [] : postData.singleRowData.character_rmk;
        postData.singleRowData.character_rmk.push("CTRM");
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
                value: postData.singleRowData.room_nos
            }],
            conn_room: postData.singleRowData.conn_room,
            character_rmk: postData.singleRowData.character_rmk
        });

        callback(lo_error, lo_result);
    },

    /**
     * 修改儲存前
     * 1.欄位conn_room連通房,有異動
     * (1)無->有,則被設成「連通房」的room_mn也要加上conn_room與character_rmk
     * (2)有->無,則被設成「連通房」的room_mn也要移除conn_room與character_rmk
     * (3)有舊值->新值,
     * (i)舊值「連通房」的room_mn也要移除conn_room與character_rmk
     * (ii)新值「連通房」的room_mn也要加上conn_room與character_rmk
     *
     * 2.修改時,如果房型有異動,同時修改房間庫存資料於滾房租日(含)以後之該房號房型資料
     */
    r_RoommnUpd: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;
        let lo_newSingleData = postData.singleRowData;
        lo_newSingleData.conn_room = lo_newSingleData.conn_room || "";
        lo_newSingleData.conn_room = lo_newSingleData.conn_room.trim();
        let lo_oldSingleData;
        let userInfo = session.user;

        // if (postData.editData.length > 1) {
        //     return callback(lo_error, lo_result);
        // }

        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod
        };

        async.waterfall([
            qrySingleRoomMn,        //查詢單筆資料
            chkConnRoomIsUse,       //檢查指定房號是否已有連通房設定
            chkConnRoomEditRule,    //檢查連通房異動規則
            chkRoomCodEdit          //如果房型有異動,修改房型
        ], function (err, result) {
            callback(err, result);
        });

        //查詢單筆資料
        function qrySingleRoomMn(cb) {
            qrySingleRoomMnByRoomNos(lo_newSingleData.room_nos, function (err, getResult) {
                lo_oldSingleData = getResult;
                lo_oldSingleData.conn_room = lo_oldSingleData.conn_room || "";
                lo_oldSingleData.conn_room = lo_oldSingleData.conn_room.trim();
                cb(null, lo_oldSingleData);
            });
        }

        //檢查指定房號是否已有連通房設定
        function chkConnRoomIsUse(result, cb) {
            if (lo_newSingleData.conn_room != "") {
                qrySingleRoomMnByRoomNos(lo_newSingleData.conn_room, function (err, getResult) {
                    let ls_conn_room = getResult.conn_room || "";
                    ls_conn_room = ls_conn_room.trim();
                    if (ls_conn_room != "" && ls_conn_room != lo_newSingleData.room_nos) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = "房號 " + lo_newSingleData.conn_room + " 已設定連通房 " + getResult.conn_room + "，不允許指定為連通房";
                        lo_error.errorCod = "1111";
                    }
                    cb(lo_error, lo_result);
                });
            }
            else {
                cb(lo_error, lo_result);
            }

        }

        /**
         * 檢查連通房異動規則
         * (1)無->有【例如自己是101,而連通房舊值是空,新值是102】
         * (2)有->無【例如自己是101,而連通房舊值是102,新值是空】
         * (3)有舊值->新值,【例如自己是101,而連通房舊值是102,新值是333】
         *  (i)舊值「連通房」的room_mn也要移除conn_room與character_rmk
         *  (ii)新值「連通房」的room_mn也要加上conn_room與character_rmk
         */

        function chkConnRoomEditRule(result, cb) {
            //(1)無->有【例如自己是101,而連通房舊值是空,新值是102】
            if (lo_oldSingleData.conn_room == "" && lo_newSingleData.conn_room != "") {
                qrySingleRoomMnByRoomNos(lo_newSingleData.conn_room, function (err, getResult) {
                    let lo_connRoomData = getResult;
                    lo_connRoomData.character_rmk.push("CTRM");
                    if(lo_connRoomData.character_rmk.length == 0){
                        lo_connRoomData.character_rmk = "";
                    }
                    else{
                        lo_connRoomData.character_rmk = "'" + lo_connRoomData.character_rmk.join() + "'";
                    }
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
                            value: lo_newSingleData.conn_room
                        }],
                        conn_room: lo_newSingleData.room_nos || "",
                        character_rmk: lo_connRoomData.character_rmk
                    });
                    cb(lo_error, lo_result);
                });
            }
            //(2)有->無【例如自己是101,而連通房舊值是102,新值是空】
            else if (lo_oldSingleData.conn_room != "" && lo_newSingleData.conn_room == "") {
                qrySingleRoomMnByRoomNos(lo_oldSingleData.conn_room, function (err, getResult) {
                    let lo_connRoomData = getResult;
                    lo_connRoomData.character_rmk = _.without(lo_connRoomData.character_rmk, "CTRM");
                    if(lo_connRoomData.character_rmk.length == 0){
                        lo_connRoomData.character_rmk = "";
                    }
                    else{
                        lo_connRoomData.character_rmk = "'" + lo_connRoomData.character_rmk.join() + "'";
                    }
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
                            value: lo_oldSingleData.conn_room
                        }],
                        conn_room: "",
                        character_rmk: lo_connRoomData.character_rmk
                    });
                    cb(lo_error, lo_result);
                });
            }
            //(3)有舊值->新值,【例如自己是101,而連通房舊值是102,新值是333】
            else if (lo_oldSingleData.conn_room != "" && lo_newSingleData.conn_room != "" && lo_oldSingleData.conn_room != lo_newSingleData.conn_room) {
                async.parallel([
                    //(i)舊值「連通房」的room_mn也要移除conn_room與character_rmk
                    function (par_cb) {
                        qrySingleRoomMnByRoomNos(lo_oldSingleData.conn_room, function (err, getResult) {
                            let lo_connRoomData = getResult;
                            lo_connRoomData.character_rmk = _.without(lo_connRoomData.character_rmk, "CTRM");
                            if(lo_connRoomData.character_rmk.length == 0){
                                lo_connRoomData.character_rmk = "";
                            }
                            else{
                                lo_connRoomData.character_rmk = "'" + lo_connRoomData.character_rmk.join() + "'";
                            }
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
                                    value: lo_oldSingleData.conn_room
                                }],
                                conn_room: "",
                                character_rmk: lo_connRoomData.character_rmk
                            });
                            par_cb(lo_error, lo_result);
                        });
                    },
                    //(ii)新值「連通房」的room_mn也要加上conn_room與character_rmk
                    function (par_cb) {
                        qrySingleRoomMnByRoomNos(lo_newSingleData.conn_room, function (err, getResult) {
                            let lo_connRoomData = getResult;
                            lo_connRoomData.character_rmk.push("CTRM");
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
                                    value: lo_newSingleData.conn_room
                                }],
                                conn_room: lo_newSingleData.room_nos,
                                character_rmk: "'" + lo_connRoomData.character_rmk.join() + "'"
                            });
                            par_cb(lo_error, lo_result);
                        }, function (err, result) {
                            cb(err, result);
                        });
                    }
                ]);
            }
            else {
                lo_result.extendExecDataArrSet.push({
                    character_rmk: ""
                })
                cb(lo_error, lo_result);
            }
        }

        //透過房號查詢單筆資料func
        function qrySingleRoomMnByRoomNos(room_nos, cb) {
            lo_params.room_nos = room_nos.trim();
            queryAgent.query("QRY_SINGLE_ROOM_MN", lo_params, function (err, getResult) {
                getResult.character_rmk = getResult.character_rmk || "";
                if (getResult.character_rmk != "") {
                    var array = getResult.character_rmk.replace(/'/g, "").split(',');
                    valueTemp = [];
                    for (i = 0; i < array.length; i++) {
                        valueTemp.push(array[i]);
                    }
                    getResult.character_rmk = valueTemp;
                }
                else{
                    getResult.character_rmk = [];
                }
                cb(null, getResult);
            });
        }

        function chkRoomCodEdit(result, cb) {
            if (lo_oldSingleData.room_cod != lo_newSingleData.room_cod) {
                queryAgent.query("QRY_HOTEL_SVAL", lo_params, function (err, getResult) {
                    lo_result.extendExecDataArrSet.push({
                        function: '2',
                        table_name: 'RMINV_DT',
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
                            value: lo_newSingleData.room_nos
                        }, {
                            key: "batch_dat",
                            operation: ">=",
                            value: getResult.hotel_sval
                        }],
                        room_cod: lo_newSingleData.room_cod
                    });
                    cb(lo_error, lo_result);
                });
            }
            else {
                cb(lo_error, lo_result);
            }
        }
    },

    r_defaultValueAdd: function (postData, session, callback) {
        var lo_result = new ReturnClass();

        var characterRmk = {"character_rmk": []};
        lo_result.defaultValues = characterRmk;
        callback(null, lo_result);
    },

    //批次產生房號
    PMS0820020_1009: function (postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;
        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.fun_hotel_cod
        };
        queryAgent.queryList("QRY_ROOM_MN_ROOM_COD", lo_params, 0, 0, function (err, getResult) {
            if (!err) {
                lo_return.selectOptions = getResult;
            }
            else {
                lo_error = new ErrorClass();
                lo_return.success = false;
                lo_error.errorMsg = err;
                lo_error.errorCod = "1111";
            }
            callback(lo_error, lo_return);
        });
    },

    //房間清單
    PMS0820020_1010: function (postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;
        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod
        };
        queryAgent.queryList("QRY_ROOM_MN_SORT_BY_VIEW_SEQ", lo_params, 0, 0, function (err, getResult) {
            if (!err) {
                lo_return.roomListData = getResult;
            }
            else {
                lo_error = new ErrorClass();
                lo_return.success = false;
                lo_error.errorMsg = err;
                lo_error.errorCod = "1111";
            }
            callback(lo_error, lo_return);
        });
    },

    //房間顯示排序
    PMS0820020_1011: function (postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;
        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod
        };

        // 畫面顯示依顯示順序及房號排序
        if (postData.sort_typ == '') {
            queryFunc("QRY_ROOM_MN_SORT_BY_VIEW_SEQ", callback);
        }
        // 依房號遞增排序
        else if (postData.sort_typ == "0") {
            queryFunc("QRY_ROOM_MN_SORT_BY_ROOM_NOS", callback);
        }
        // 依房號長度、房號遞增排序
        else if (postData.sort_typ == "1") {
            queryFunc("QRY_ROOM_MN_SORT_BY_ROOM_NOS_LENG", callback);
        }
        // 依棟別、樓層、房號長度、房號遞增排序
        else if (postData.sort_typ == "2") {
            queryFunc("QRY_ROOM_MN_SORT_BY_BUILD_NOS", callback);
        }

        function queryFunc(dao_name, callback) {
            queryAgent.queryList(dao_name, lo_params, 0, 0, function (err, getResult) {
                if (!err) {
                    lo_return.roomNosData = getResult;
                }
                else {
                    lo_error = new ErrorClass();
                    lo_return.success = false;
                    lo_error.errorMsg = err;
                    lo_error.errorCod = "1111";
                }
                callback(lo_error, lo_return);
            });
        }

    },

    // 房號長度:至多不可超過6碼
    chkRoomLeng: function (postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;
        if (postData.singleRowData.room_leng > 6) {
            lo_error = new ErrorClass();
            lo_return.success = false;
            lo_return.effectValues = {room_leng: 6};
            lo_error.errorMsg = "至多不可超過6碼";
            lo_error.errorCod = "1111";
        }
        callback(lo_error, lo_return);
    },

    /**
     * 前置碼:長度1，可指定房號前置碼，包含在房號長度中
     * 開始號碼、結束號碼皆為數字，開始號碼不可大於結束號碼
     */
    chkRoomNosLeng: function (postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;
        let li_room_leng = Number(postData.singleRowData.room_leng) || 0;
        let ls_room_begin_nos = postData.singleRowData.room_begin_nos || "";
        let ls_room_end_nos = postData.singleRowData.room_end_nos || "";
        let ls_front_cod = postData.singleRowData.front_cod || "";

        if (li_room_leng == 0) {
            lo_error = new ErrorClass();
            lo_return.success = false;
            lo_error.errorMsg = "房號長度未填";
            lo_error.errorCod = "1111";
            lo_return.effectValues = {room_leng: "2", room_begin_nos: "", room_end_nos: ""};
            return callback(lo_error, lo_return);
        }

        if (ls_front_cod != "") {
            li_room_leng -= 1;
        }

        if (ls_room_begin_nos != "") {
            if (ls_room_begin_nos.length > li_room_leng) {
                lo_error = new ErrorClass();
                lo_return.success = false;
                lo_return.effectValues = {room_begin_nos: ""};
                lo_error.errorMsg = "房號開始號碼超過房號長度";
                lo_error.errorCod = "1111";
                return callback(lo_error, lo_return);
            }
        }

        if (ls_room_end_nos != "") {
            if (ls_room_end_nos.length > li_room_leng) {
                lo_error = new ErrorClass();
                lo_return.success = false;
                lo_return.effectValues = {room_end_nos: ""};
                lo_error.errorMsg = "房號結束號碼超過房號長度";
                lo_error.errorCod = "1111";
                return callback(lo_error, lo_return);
            }
        }

        if (ls_room_begin_nos != "" && ls_room_end_nos != "") {
            if (Number(ls_room_begin_nos) > Number(ls_room_end_nos)) {
                lo_error = new ErrorClass();
                lo_return.success = false;
                lo_error.errorMsg = "開始號碼不可大於結束號碼";
                lo_error.errorCod = "1111";
                lo_return.effectValues = {room_begin_nos: "", room_end_nos: ""};
                return callback(lo_error, lo_return);
            }
        }

        callback(lo_error, lo_return);
    },

    // 查詢清掃人員
    qry_Room_mn_Clean_cod: function (postData, session, callback) {
        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod,
            comp_id: session.user.cmp_id
        };

        let ui_field_name = _.isUndefined(postData.fields) ? "" : postData.fields.ui_field_name;
        let result = new ReturnClass();
        let updateFieldName = {
            clean_cod: "員工名稱"
        };

        let fieldNameChangeLanguage = {
            clean_cod: "員工代號",
            "員工名稱": "員工名稱",
            "大部門單位": "大部門單位",
            "人事單位": "人事單位"
        };

        if (ui_field_name != "") {
            queryAgent.queryList("QRY_ROOM_MN_CLEAN_COD", lo_params, 0, 0, function (err, getResult) {
                if (!err) {
                    result.effectValues.showDataGrid = getResult;
                    result.effectValues.updateFieldNameTmp = updateFieldName;
                    result.effectValues.fieldNameChangeLanguageTmp = fieldNameChangeLanguage;
                    callback(null, [result]);
                }
            });
        }
        else {
            callback(null, result);
        }
    }
};