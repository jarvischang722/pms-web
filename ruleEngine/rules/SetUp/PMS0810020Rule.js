/**
 * Created by Jun on 2017/3/30.
 * 程式編號 : PMS0810020
 * 房間小類對照檔
 */
let _ = require("underscore");
let moment = require("moment");
let async = require("async");
let path = require('path');
let appRootDir = path.dirname(require.main.filename);
let ruleRootPath = appRootDir + "/ruleEngine/";
let queryAgent = require(appRootDir + '/plugins/kplug-oracle/QueryAgent');
let commandRules = require("./../CommonRule");
let ReturnClass = require(ruleRootPath + "/returnClass");
let ErrorClass = require(ruleRootPath + "/errorClass");


module.exports = {
    /**
     * 房間小類設定存在時，不可刪除
     * @param postData {Object} : 使用者傳來的資料
     * @param session {Object}  : Session
     * @param callback {Function}  :
     */
    // chk_guest_grp_rf_is_exist_rvrmcod_rf: function (postData, session, callback) {
    //     let result = new ReturnClass();
    //     let error = null;
    //     let params = {
    //         athena_id: session.user.athena_id,
    //         room_typ: postData.singleRowData.room_typ || ""
    //     }
    //     queryAgent.query("CHK_GUEST_GRP_RF_IS_EXIST_RVRMCOD_RF", params, function (err, data) {
    //         if (data.room_count > 0) {
    //             result.success = false;
    //             error = new ErrorClass();
    //             error.errorMsg = "房間小類設定存在時，不可刪除";
    //             error.errorCod = "1111";
    //
    //         }
    //         callback(error, result);
    //     })
    //
    // },
    /**
     * 編輯前檢查只能修改房型的結束日大於等於滾房租日的資料
     * @param postData {Object} : 使用者傳來的資料
     * @param session {Object}  : Session
     * @param callback {Function}  :
     */
    chk_edit_rvrmcod_rf: function (postData, session, callback) {
        let singleRowData = postData.singleRowData;
        let athena_id = session.user.athena_id;
        let hotel_cod = session.user.hotel_cod;
        let end_dat = moment(new Date(singleRowData.end_dat));
        let result = new ReturnClass();
        let error = null;
        queryAgent.query("CHK_EDIT_RVEMCOD_RF_DAT", {athena_id: athena_id, hotel_cod: hotel_cod}, function (err, data) {
            if (data) {
                let belong_dat = moment(new Date(data.belong_dat));
                if (end_dat.diff(belong_dat, "days") < 0) {
                    result.success = false;
                    error = new ErrorClass();
                    error.errorMsg = "此房型的結束日小於滾房租日，故無法修改";
                    error.errorCod = "1111";
                }
            }

            callback(error, result);
        });

    },
    /**
     * 1.結束日期不可以早於開始日期
     * 2.結束日大於等於滾房租日
     * 3.開始日大於等於滾房租日
     * @param postData {Object} : 使用者傳來的資料
     * @param session {Object}  : Session
     * @param callback {Function} :
     */
    chk_rvrmcod_rf_begin_end_dat: function (postData, session, callback) {
        let singleRowData = postData.singleRowData;
        let athena_id = session.user.athena_id;
        let hotel_cod = session.user.hotel_cod;
        let begin_dat = singleRowData.begin_dat || "";
        let end_dat = singleRowData.end_dat || "";
        let result = new ReturnClass();
        let error = null;

        if (!_.isEmpty(begin_dat) && !_.isEmpty(end_dat)) {
            queryAgent.query("CHK_EDIT_RVEMCOD_RF_DAT", {
                athena_id: athena_id,
                hotel_cod: hotel_cod
            }, function (err, data) {

                if (data) {
                    let belong_dat = moment(new Date(data.belong_dat));
                    begin_dat = moment(new Date(begin_dat));
                    end_dat = moment(new Date(end_dat));
                    //1)
                    if (end_dat.diff(begin_dat, "days") < 0) {
                        if (!error) {
                            error = new ErrorClass();
                        }
                        result.success = false;
                        error.errorMsg = "結束日期不可以早於開始日期";
                        error.errorCod = "1111";
                    }
                    //2)
                    if (begin_dat.diff(belong_dat, "days") < 0) {
                        if (!error) {
                            error = new ErrorClass();
                        }
                        result.success = false;
                        error.errorMsg = "房型的開始日小於滾房租日";
                        error.errorCod = "1111";
                    }
                    //3)
                    if (end_dat.diff(belong_dat, "days") < 0) {
                        if (!error) {
                            error = new ErrorClass();
                        }
                        result.success = false;
                        error.errorMsg = "房型的結束日小於滾房租日";
                        error.errorCod = "1111";
                    }
                }

                callback(error, result);
            });

        } else {
            callback(error, result);
        }

    },
    /**
     * 取得之前已經有打過的相同房型的資料在table中時，自動帶上舊資料的房型類別、房型名稱、房型簡稱
     * @param postData
     * @param session
     * @param callback {Function} :
     */
    qry_rvrmcod_rf_old_room_cod: function (postData, session, callback) {
        let result = new ReturnClass();
        let error = null;
        let singleRowData = postData.singleRowData;
        queryAgent.query("QRY_RVRMCOD_RF_OLD_ROOM_COD", {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod,
            room_cod: singleRowData.room_cod
        }, function (err, room_data) {
            if (!err && room_data) {
                result.effectValues = room_data;
            }

            callback(error, result);
        });

    },
    /**
     * 1.當資料對應期間庫存rminv_dt中有此房型時,要限制無法執行刪除資料。
     訊息:庫存已有此房型,不能刪除
     * 2.上傳官網,不能刪除
     訊息:上傳官網,不能刪除
     * @param postData
     * @param session
     * @param callback {Function} :
     */
    chk_rvrmcod_rf_is_exist_rminv_dt: function (postData, session, callback) {
        let delDataRows = postData.deleteData || [];  //欲刪除的整筆資料
        let delResult = new ReturnClass();
        let delError = null;
        let delFuncs = [];
        try {
            _.each(delDataRows, function (delDR) {
                delFuncs.push(
                    function (callback) {
                        let params = {
                            hotel_cod: session.hotel_cod,
                            athena_id: session.user.athena_id,
                            room_cod: delDR.room_cod || ""
                        };

                        if (!_.isUndefined(delDR.upload_sta) && delDR.upload_sta == "Y") {
                            delError = new ErrorClass();
                            delError.errorMsg = "上傳官網,不能刪除";
                            delError.errorCod = '1111';
                            delResult.success = false;
                            return callback(delError, delResult);
                        }

                        queryAgent.query("CHK_RVRMCOD_RF_IS_EXIST_RMINV_DT", params, function (err, data) {
                            if (!err) {
                                if (data.room_count > 0) {
                                    delResult.success = false;

                                    delError = new ErrorClass();
                                    delError.errorMsg = "庫存已有此房型[" + delDR.room_cod + "], 不能刪除!";
                                    delError.errorCod = '1111';
                                }
                            } else {
                                delResult.success = false;
                                if (!delError) {
                                    delError = new ErrorClass();
                                }
                                delError.errorMsg = err.message || "";
                                delError.errorCod = '1111';
                            }

                            callback(delError, delResult);
                        });


                    }
                );
            });
        } catch (err) {
            delResult.success = false;
            delError.errorMsg = err;
            delError.errorCod = "1111";
        } finally {
            async.parallel(delFuncs, function (err, result) {
                callback(delError, delResult);
            });
        }


    },
    /**
     * 房間小類儲存前檢查:
     *  新增、修改:
     *      1.檢查相同房型的開始結束日期不可重疊
     *      2.將房型名稱、簡稱,update到相同房型代號不同開始日期的房型資料【原理:相同房型代號,其名稱、簡稱都要相同,但因為會分年份,所以會有很多筆】
     *      3.若房型在房型排序檔不存在時新增一筆,同時UPDATE新的排序方式到房型排序對照檔
     * @param postData
     * @param session
     * @param callback {Function} :
     */
    r_rvrmcod_rf_ins_save: function (postData, session, callback) {
        let saveResult = new ReturnClass();
        let saveError = null;
        try {
            let userInfo = session.user;
            let tmpExtendExecDataArrSet = [];
            let deleteData = postData["deleteData"] || [];
            let createData = postData["createData"] || [];
            let editData = postData["editData"] || [];
            async.parallel([
                //新增
                function (callback) {
                    if (createData.length > 0) {
                        let createSubFunc = [];
                        _.each(createData, function (c_data) {
                            c_data = _.extend(c_data, commandRules.getCreateCommonDefaultDataRule(session));
                            createSubFunc.push(
                                function (callback) {
                                    async.waterfall([
                                        function (callback) {
                                            queryAgent.query("CHK_RVRMCOD_RF_IS_COVER_BEGIN_END_DAT", c_data, function (err, data) {
                                                let thisRuleErr = null;
                                                if (Number(data.cover_count || 0) > 1) {
                                                    thisRuleErr = "相同房型的開始結束日期不可重疊";
                                                }
                                                callback(thisRuleErr, []);
                                            });
                                        },
                                        function (data, callback) {
                                            tmpExtendExecDataArrSet.push({
                                                function: '2',
                                                table_name: 'rvrmcod_rf',
                                                condition: [{
                                                    key: 'athena_id',
                                                    operation: "=",
                                                    value: userInfo.athena_id
                                                }, {
                                                    key: 'hotel_cod',
                                                    operation: "=",
                                                    value: userInfo.hotel_cod
                                                }
                                                    , {
                                                        key: 'room_cod',
                                                        operation: "=",
                                                        value: c_data.room_cod
                                                    }],
                                                room_nam: c_data.room_name || "",
                                                room_sna: c_data.room_sna || ""
                                            });

                                            callback(null, tmpExtendExecDataArrSet);
                                        },
                                        // 新增房型排序
                                        function (data, callback) {
                                            queryAgent.query("CHK_ROOM_COD_ORDER_IS_EXIST_BY_ROOMCOD", c_data, function (err, data) {
                                                if (!err && data) {
                                                    let tmpObj = {
                                                        table_name: 'room_cod_order'
                                                    };
                                                    if (Number(data.room_count) == 0) {
                                                        //新增room_cod_order
                                                        tmpObj["function"] = "1";
                                                        tmpObj["view_seq"] = 0;
                                                        tmpObj["wrs_sort_cod"] = 0;
                                                        tmpObj = _.extend(tmpObj, c_data);

                                                        tmpExtendExecDataArrSet.push(tmpObj);
                                                    }


                                                }

                                                callback(err, tmpExtendExecDataArrSet);
                                            });
                                        },
                                        // 檢查wrs_normal_pic
                                        function (data, callback) {
                                            queryAgent.query("CHK_WRS_NORMAL_PIC_IS_EXIST_BY_ROOM_COD", c_data, function (err, data) {
                                                if (!err && data) {
                                                    let tmpObj = {
                                                        table_name: "wrs_normal_pic"
                                                    };
                                                    if (Number(data.pic_count) == 0) {
                                                        //新增wrs_normal_pic
                                                        tmpObj["function"] = "1";
                                                        tmpObj["sys_cod"] = "HFD";
                                                        tmpObj["pic_cod"] = "";
                                                        tmpObj["upload_sta"] = "N";

                                                        tmpObj = _.extend(tmpObj, c_data);

                                                        tmpExtendExecDataArrSet.push(tmpObj);
                                                    }
                                                }
                                                callback(err, tmpExtendExecDataArrSet);
                                            });
                                        }
                                    ], function (errMsg, result) {
                                        if (errMsg) {
                                            callback(errMsg, []);
                                            return;
                                        }
                                        callback(null, tmpExtendExecDataArrSet);
                                    });

                                }
                            );
                        });

                        async.parallel(createSubFunc, function (err, result) {
                            callback(err, 'create');
                        });

                    } else {
                        callback(null, 'create');
                    }


                },
                //修改
                function (callback) {
                    if (editData.length > 0) {
                        let editSubFunc = [];

                        _.each(editData, function (e_data) {
                            e_data = _.extend(e_data, commandRules.getCreateCommonDefaultDataRule(session));
                            editSubFunc.push(
                                function (callback) {
                                    async.waterfall([
                                        // function(callback){
                                        //     queryAgent.query("CHK_RVRMCOD_RF_IS_COVER_BEGIN_END_DAT",e_data,function (err,data) {
                                        //         if (Number(data.cover_count || 0) > 0) {
                                        //             callback("相同房型的開始結束日期不可重疊", []);
                                        //         }
                                        //     })
                                        // },
                                        function (callback) {
                                            tmpExtendExecDataArrSet.push({
                                                function: '2',
                                                table_name: 'rvrmcod_rf',
                                                condition: [{
                                                    key: 'athena_id',
                                                    operation: "=",
                                                    value: userInfo.athena_id
                                                }, {
                                                    key: 'room_cod',
                                                    operation: "=",
                                                    value: e_data.room_cod
                                                }],
                                                room_nam: e_data.room_nam || "",
                                                room_sna: e_data.room_sna || ""
                                            });

                                            callback(null, tmpExtendExecDataArrSet);
                                        },
                                        function (data, callback) {
                                            queryAgent.query("CHK_ROOM_COD_ORDER_IS_EXIST_BY_ROOMCOD", e_data, function (err, data) {
                                                if (!err && data) {
                                                    let tmpObj = {
                                                        table_name: 'room_cod_order'
                                                    };
                                                    if (Number(data.room_count) == 0) {
                                                        //新增room_cod_order
                                                        tmpObj["function"] = "1";
                                                        tmpObj["view_seq"] = 0;
                                                        tmpObj["wrs_sort_cod"] = 0;
                                                        tmpObj = _.extend(tmpObj, e_data);
                                                        tmpExtendExecDataArrSet.push(tmpObj);
                                                    }

                                                }
                                                callback(null, tmpExtendExecDataArrSet);
                                            });
                                        }
                                    ], function (errMsg, result) {
                                        if (errMsg) {
                                            callback(errMsg, []);
                                            return;
                                        }
                                        callback(null, tmpExtendExecDataArrSet);
                                    });

                                }
                            );
                        });

                        async.parallel(editSubFunc, function (err, result) {
                            callback(err, 'create');
                        });

                    } else {
                        callback(null, 'edit');
                    }

                }
            ], function (err, result) {

                if (err) {
                    saveError = new ErrorClass();
                    saveError.errorMsg = err;
                    saveError.errorCod = "1111";
                    saveResult.success = false;
                }
                saveResult.extendExecDataArrSet = tmpExtendExecDataArrSet;

                callback(saveError, saveResult);
            });
        } catch (err) {
            saveError = new ErrorClass();
            saveError.errorMsg = err;
            saveError.errorCod = "1111";
            saveResult.success = false;
            callback(saveError, saveResult);
        }
    },
    /**
     * 房間小類儲存前檢查:
     *  刪除:
     *     1.如果刪除的房型是同房型最後一筆,則房型排序檔、房型圖片也一併刪除
     *      (1)檢查是否是同房型最後一筆
     *      (2)如果是,則delete from room_cod_order where athena_id = ? and room_cod = ?
     * @param postData
     * @param session
     * @param callback {Function} :
     */
    r_rvrmcod_rf_del_save: function (postData, session, callback) {
        let self = this;
        let chkResult = new ReturnClass();
        let chkError = null;
        let params = postData["singleRowData"] || {};
        let userInfo = session.user;
        params["begin_dat"] = moment(params["begin_dat"] ).format("YYYY/MM/DD");
        try {
            async.waterfall([
                function (cb) {
                    self.chk_rvrmcod_rf_is_exist_rminv_dt(postData, session, function(err, lo_checkResult){
                        if(lo_checkResult.success && !err){
                            cb(null, "chk success");
                        }
                        else{
                            cb(err, lo_checkResult);
                        }
                    });
                },
                function (lo_checkResult, cb){
                    let lo_params = {
                        athena_id: params.athena_id,
                        hotel_cod: params.hotel_cod,
                        room_cod: params.room_cod
                    };
                    queryAgent.query("CHK_RVRMCOD_RF_ROOM_DATA", lo_params, function (err, data) {
                        if (err) {
                            cb(new ErrorClass(), null);
                        }

                        if (!err && Number(data.room_count) == 1) {
                            // 房型排序
                            chkResult.extendExecDataArrSet.push({
                                function: '0',
                                table_name: 'room_cod_order',
                                condition: [{
                                    key: 'athena_id',
                                    operation: "=",
                                    value: userInfo.athena_id
                                }, {
                                    key: 'hotel_cod',
                                    operation: "=",
                                    value: userInfo.hotel_cod
                                }
                                    , {
                                        key: 'room_cod',
                                        operation: "=",
                                        value: params.room_cod
                                    }]
                            });

                            // 房型圖片
                            chkResult.extendExecDataArrSet.push({
                                function: '0',
                                table_name: 'wrs_normal_pic',
                                condition: [{
                                    key: 'athena_id',
                                    operation: "=",
                                    value: userInfo.athena_id
                                }, {
                                    key: 'hotel_cod',
                                    operation: "=",
                                    value: userInfo.hotel_cod
                                }
                                    , {
                                        key: 'room_cod',
                                        operation: "=",
                                        value: params.room_cod
                                    }]
                            });
                        }
                        cb(chkError, chkResult);
                    });
                }
            ], function(err, result){
                if(err){
                    chkError = new ErrorClass();
                    chkError.errorCod = "1111";
                    chkError.errorMsg = err.message;
                    chkResult.success = false;
                }
                callback(chkError, chkResult);
            });
        } catch (err) {
            chkError = new ErrorClass();
            chkError.errorMsg = err;
            chkError.errorCod = "1111";
            chkResult.success = false;
            callback(chkError, chkResult);
        }
    },
    /**
     * 修改房型名稱時,如果同時有相同房型其他期間,則提醒『 [[%%room_cod%%]] 房型的名稱與其他期間設定不同，是否確定修改?』
     * 如果yes,則修改其他期間房型對照檔資料
     * 如果no,則不能變更
     * @param postData
     * @param session
     * @param callback {Function} :
     */
    chk_rvrmcod_rf_room_nam: function (postData, session, callback) {
        let result = new ReturnClass();
        let error = null;
        let singleRowData = postData.singleRowData;
        let athena_id = session.user.athena_id;
        let params = {
            athena_id: athena_id,
            room_cod: singleRowData.room_cod.trim(),
            begin_dat: moment(new Date(singleRowData.begin_dat)).format("YYYY/MM/DD")
        };
        if (!_.isEmpty(singleRowData.room_cod.trim())) {
            queryAgent.query("CHK_RVRMCOD_RF_ROOM_DATA", params, function (err, roomData) {
                if (!err && roomData && roomData.room_count > 0) {
                    result.showConfirm = true;
                    result.isGoPostAjax = true;
                    result.ajaxURL = "";
                    result.confirmMsg = "『 [" + singleRowData.room_cod.trim() + "] 房型的名稱與其他期間設定不同，是否確定修改?』";
                }
                callback(error, result);
            });
        } else {
            callback(error, result);
        }

    },
    /**
     * 修改房型簡稱時,如果同時有相同房型其他期間,則提醒『 [[%%room_cod%%]] 房型的簡稱與其他期間設定不同，是否確定修改?』
     * 如果yes,則修改其他期間房型對照檔資料,
     * 如果no,則不能變更
     * @param postData
     * @param session
     * @param callback {Function} :
     */
    chk_rvrmcod_rf_room_sna: function (postData, session, callback) {
        let result = new ReturnClass();
        let error = null;
        let singleRowData = postData.singleRowData;
        let athena_id = session.user.athena_id;
        let params = {
            athena_id: athena_id,
            room_cod: singleRowData.room_cod.trim(),
            begin_dat: moment(new Date(singleRowData.begin_dat)).format("YYYY/MM/DD")
        };
        if (!_.isEmpty(singleRowData.room_cod.trim())) {
            queryAgent.query("CHK_RVRMCOD_RF_ROOM_DATA", params, function (err, roomData) {
                if (!err && roomData && roomData.room_count > 0) {
                    result.showConfirm = true;
                    result.confirmMsg = "『 [" + singleRowData.room_cod.trim() + "] 房型的簡稱與其他期間設定不同，是否確定修改?』";
                }
                callback(error, result);
            });
        } else {
            callback(error, result);
        }
    },
    /**
     * 修改房價room_amt自動帶10%到服務費欄位serv_amt
     * @param postData
     * @param session
     * @param callback {Function} :
     */
    modifyRoomPriceAfterToService: function (postData, session, callback) {
        let result = new ReturnClass();
        let error = null;
        let singleRowData = postData.singleRowData;
        if (!_.isUndefined(singleRowData.room_amt) && typeof Number(singleRowData.room_amt) === "number") {
            result.effectValues["serv_amt"] = Math.floor(Number(singleRowData.room_amt) * 0.1);
        }
        callback(error, result);
    },
    r_rvrmcod_rf_add: function (postData, session, callback) {
        let result = new ReturnClass();
        let error = null;
        result.defaultValues["rest_tim"] = 0; //到鐘時間
        result.defaultValues["pre_alram_min"] = 0;  //休息到鐘提醒分鐘數
        callback(error, result);
    },
    /**
     * 比較已經有打過的相同房型的資料在table中,房型類別要一樣,不能改成不一樣,不一樣時提示訊息
     訊息:房型類別不可修改
     如果沒有已經打過的資料,就不用比較
     * @param postData
     * @param session
     * @param callback
     */
    chk_rvrmcod_rf_room_typ: function (postData, session, callback) {
        let ruleResult = new ReturnClass();
        let chkError = null;
        let singleRowData = postData.singleRowData;
        let userInfo = session.user;
        let params = {
            hotel_cod: userInfo.hotel_cod,
            athena_id: userInfo.athena_id,
            room_cod: singleRowData.room_cod,
            begin_dat: moment(singleRowData.begin_dat).format("YYYY/MM/DD")
        };
        queryAgent.query("CHK_RVRMCOD_RF_ROOM_TYP", params, function (err, room) {
            if (err) {
                console.error(err);
                chkError = new ErrorClass();
                chkError.errorMsg = err;
                chkError.errorCod = "1111";
            } else {

                if (room && !_.isEqual(room.room_typ, singleRowData.room_typ)) {

                    ruleResult.showAlert = true;
                    ruleResult.alertMsg = "房型類別不可修改";
                    ruleResult.effectValues = {
                        room_typ: room.room_typ
                    };

                }
            }
            callback(chkError, ruleResult);
        });

    }
};