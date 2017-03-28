/**
 * Created by jun on 2017/3/22.
 * 房間小類設定檔規則
 */
var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var queryAgent = require('../../plugins/kplug-oracle/QueryAgent');
var commandRules = require("./commonRule");
var ReturnClass = require("../returnClass");
var ErrorClass = require("../errorClass");


module.exports = {
    /**
     * 房間小類設定存在時，不可刪除
     * @param postData {Object} : 使用者傳來的資料
     * @param session {Object}  : Session
     * @param callback {Function}  :
     */
    chk_guest_grp_rf_is_exist_rvrmcod_rf: function (postData, session, callback) {
        var result = new ReturnClass();
        var error = null;
        var params = {
            athena_id: session.user.athena_id,
            room_typ: postData.singleRowData.room_typ || ""
        }
        queryAgent.query("CHK_GUEST_GRP_RF_IS_EXIST_RVRMCOD_RF", params, function (err, data) {
            if (data.room_count > 0) {
                result.success = false;
                error = new ErrorClass();
                error.errorMsg = "房間小類設定存在時，不可刪除";
                error.errorCod = "1111";

            }
            callback(error, result);
        })

    },
    /**
     * 編輯前檢查只能修改房型的結束日大於等於滾房租日的資料
     * @param postData {Object} : 使用者傳來的資料
     * @param session {Object}  : Session
     * @param callback {Function}  :
     */
    chk_edit_rvrmcod_rf: function (postData, session, callback) {
        var singleRowData = postData.singleRowData;
        var athena_id = session.user.athena_id;
        var end_dat = moment(new Date(singleRowData.end_dat));
        var result = new ReturnClass();
        var error = null;
        queryAgent.query("CHK_EDIT_RVEMCOD_RF_DAT", {athena_id: athena_id}, function (err, data) {
            if (data) {
                var belong_dat = moment(new Date(data.belong_dat));
                if (end_dat.diff(belong_dat, "days") < 0) {
                    result.success = false;
                    error = new ErrorClass();
                    error.errorMsg = "此房型的結束日小於滾房租日，故無法修改";
                    error.errorCod = "1111";
                }
            }

            callback(error, result);
        })

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
        var singleRowData = postData.singleRowData;
        var athena_id = session.user.athena_id;
        var begin_dat = singleRowData.begin_dat || "";
        var end_dat = singleRowData.end_dat || "";
        var result = new ReturnClass();
        var error = null;
        if (!_.isEmpty(begin_dat) && !_.isEmpty(end_dat)) {
            queryAgent.query("CHK_EDIT_RVEMCOD_RF_DAT", {athena_id: athena_id}, function (err, data) {

                if (data) {
                    var belong_dat = moment(new Date(data.belong_dat));
                    begin_dat = moment(new Date(begin_dat));
                    end_dat = moment(new Date(end_dat));
                    //1)
                    if (end_dat.diff(begin_dat, "days") < 0) {
                        if (!error) {
                            error = new ErrorClass();
                        }
                        result.success = false;
                        result.showAlert = true;
                        result.alertMsg = "結束日期不可以早於開始日期";
                        error.errorMsg = "結束日期不可以早於開始日期";
                        error.errorCod = "1111";
                    }
                    //2,3)
                    if (begin_dat.diff(belong_dat, "days") < 0 || end_dat.diff(belong_dat, "days") < 0) {
                        if (!error) {
                            error = new ErrorClass();
                        }
                        result.success = false;
                        result.showAlert = true;
                        result.alertMsg = "此房型的開始日或結束日小於滾房租日";
                        error.errorMsg = "此房型的開始日或結束日小於滾房租日";
                        error.errorCod = "1111";
                    }
                }

                callback(error, result);
            })

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
        var result = new ReturnClass();
        var error = null;
        var singleRowData = postData.singleRowData;
        var athena_id = session.user.athena_id;
        queryAgent.query("QRY_RVRMCOD_RF_OLD_ROOM_COD", {
            athena_id: athena_id,
            room_cod: singleRowData.room_cod
        }, function (err, room_data) {
            if (!err && room_data) {
                result.effectValues = room_data;
            }

            callback(error, result);
        })

    },
    /**
     * 比較已經有打過的相同房型的資料在table中,房型類別要一樣,不能改成不一樣,不一樣時提示訊息
     * 訊息:庫存已有此房型,不能刪除
     * @param postData
     * @param session
     * @param callback {Function} :
     */
    chk_rvrmcod_rf_is_exist_rminv_dt: function (postData, session, callback) {
        var delDataRows = postData.deleteData || [];  //欲刪除的整筆資料
        var delResult = new ReturnClass();
        var delError = null;
        var delFuncs = [];
        try {
            _.each(delDataRows, function (delDR) {
                delFuncs.push(
                    function (callback) {
                        var params = {
                            athena_id: session.user.athena_id,
                            room_cod: delDR.room_cod || ""
                        };
                        queryAgent.query("CHK_RVRMCOD_RF_IS_EXIST_RMINV_DT", params, function (err, data) {
                            if (!err) {
                                if (data.room_count > 0) {
                                    if (!delError) {
                                        delError = new ErrorClass();
                                    }
                                    delResult.success = false;
                                    delResult.errorMsg = "庫存已有此房型[" + delDR.room_cod + "], 不能刪除!";
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
                        })


                    }
                )
            });
        } catch (err) {
            delResult.success = false;
            delError.errorMsg = err;
            delError.errorCod = "1111";
        } finally {
            async.parallel(delFuncs, function (err, result) {
                callback(delError, delResult);
            })
        }


    },
    /**
     * 房間小類儲存時:
     *  新增、修改:
     *      1.檢查相同房型的開始結束日期不可重疊
     *      2.將房型名稱、簡稱,update到相同房型代號不同開始日期的房型資料【原理:相同房型代號,其名稱、簡稱都要相同,但因為會分年份,所以會有很多筆】
     *      3.若房型在房型排序檔不存在時新增一筆,同時UPDATE新的排序方式到房型排序對照檔
     *  刪除:
     *     1.如果刪除的房型是同房型最後一筆,則房型排序檔也一併刪除
     *      (1)檢查是否是同房型最後一筆
     *      (2)如果是,則delete from room_cod_order where athena_id = ? and room_cod = ?
     * @param postData
     * @param session
     * @param callback {Function} :
     */
    r_rvrmcod_rf_save: function (postData, session, callback) {
        try {
            var userInfo = session.user;
            var saveResult = new ReturnClass();
            var saveError = null;
            var tmpExtendExecDataArrSet = [];
            var deleteData = postData["deleteData"] || [];
            var createData = postData["createData"] || [];
            var editData = postData["editData"] || [];
            async.parallel([
                //新增
                function (callback) {
                    if (createData.length > 0) {
                        var createSubFunc = [];
                        _.each(createData, function (c_data) {
                            createSubFunc.push(
                                function (callback) {
                                    async.waterfall([
                                        function (callback) {
                                            queryAgent.query("CHK_RVRMCOD_RF_IS_COVER_BEGIN_END_DAT", c_data, function (err, data) {
                                                var thisRuleErr = null;
                                                if (Number(data.cover_count || 0) > 0) {
                                                    thisRuleErr = "相同房型的開始結束日期不可重疊";
                                                }
                                                callback(thisRuleErr, []);
                                            })
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
                                                    key: 'room_cod',
                                                    operation: "=",
                                                    value: c_data.room_cod
                                                }],
                                                room_nam: c_data.room_name || "",
                                                room_sna: c_data.room_sna || ""
                                            });

                                            callback(null, tmpExtendExecDataArrSet);
                                        },
                                        function (data, callback) {
                                            queryAgent.query("CHK_ROOM_COD_ORDER_IS_EXIST_BY_ROOMCOD", c_data, function (err, data) {
                                                if (!err && data) {
                                                    var tmpObj = {
                                                        table_name: 'room_cod_order',
                                                    }
                                                    if (Number(data.room_count) > 0) {
                                                        //更新room_cod_order
                                                        tmpObj["function"] = "2";
                                                        tmpObj["condition"] = [{
                                                            key: 'athena_id',
                                                            operation: "=",
                                                            value: userInfo.athena_id
                                                        }, {
                                                            key: 'room_cod',
                                                            operation: "=",
                                                            value: c_data.room_cod
                                                        }]

                                                    } else {
                                                        //新增room_cod_order
                                                        tmpObj["function"] = "1";

                                                    }
                                                    tmpObj = _.extend(tmpObj, c_data);
                                                    tmpExtendExecDataArrSet.push(tmpObj);
                                                }

                                                callback(err, tmpExtendExecDataArrSet);
                                            })
                                        }
                                    ], function (errMsg, result) {
                                        if (errMsg) {
                                            callback(errMsg, []);
                                            return;
                                        }
                                        callback(null, tmpExtendExecDataArrSet)
                                    })

                                }
                            )
                        });

                        async.parallel(createSubFunc, function (err, result) {
                            callback(err, 'create');
                        })

                    } else {
                        callback(null, 'create');
                    }


                },
                //修改
                function (callback) {
                    if (editData.length > 0) {
                        var editSubFunc = [];

                        _.each(editData, function (e_data) {
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
                                                    var tmpObj = {
                                                        table_name: 'room_cod_order',
                                                    }
                                                    if (Number(data.room_count) > 0) {
                                                        //更新room_cod_order
                                                        tmpObj["function"] = "2";
                                                        tmpObj["condition"] = [{
                                                            key: 'athena_id',
                                                            operation: "=",
                                                            value: userInfo.athena_id
                                                        }, {
                                                            key: 'room_cod',
                                                            operation: "=",
                                                            value: e_data.room_cod
                                                        }]

                                                    } else {
                                                        //新增room_cod_order
                                                        tmpObj["function"] = "1";

                                                    }
                                                    tmpObj = _.extend(tmpObj, e_data);
                                                    tmpExtendExecDataArrSet.push(tmpObj);
                                                }
                                                callback(null, tmpExtendExecDataArrSet);
                                            })
                                        }
                                    ], function (errMsg, result) {
                                        if (errMsg) {
                                            callback(errMsg, []);
                                            return;
                                        }
                                        callback(null, tmpExtendExecDataArrSet)
                                    })

                                }
                            )
                        });

                        async.parallel(editSubFunc, function (err, result) {
                            callback(err, 'create');
                        })

                    } else {
                        callback(null, 'edit');
                    }

                },
                //刪除
                function (callback) {
                    if (deleteData.length > 0) {
                        var deleteSubFunc = [];
                        _.each(deleteData, function (d_data) {
                            deleteSubFunc.push(
                                function (callback) {
                                    queryAgent.query("CHK_RVRMCOD_RF_ROOM_DATA", params, function (err, data) {
                                        if (Number(data.room_count) == 1) {
                                            tmpExtendExecDataArrSet.push({
                                                function: '0',
                                                table_name: 'room_cod_order',
                                                condition: [{
                                                    key: 'athena_id',
                                                    operation: "=",
                                                    value: userInfo.athena_id
                                                }, {
                                                    key: 'room_cod',
                                                    operation: "=",
                                                    value: deleteData.room_cod
                                                }]
                                            });
                                        }
                                    });
                                }
                            );

                            async.parallel(deleteSubFunc, function (err, result) {
                                callback(err, tmpExtendExecDataArrSet);
                            })
                        })

                    } else {
                        callback(null, 'delete');
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
            })
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
     *  新增、修改:
     *      1.檢查相同房型的開始結束日期不可重疊
     *      2.將房型名稱、簡稱,update到相同房型代號不同開始日期的房型資料【原理:相同房型代號,其名稱、簡稱都要相同,但因為會分年份,所以會有很多筆】
     *      3.若房型在房型排序檔不存在時新增一筆,同時UPDATE新的排序方式到房型排序對照檔
     * @param postData
     * @param session
     * @param callback {Function} :
     */
    r_rvrmcod_rf_ins_save: function (postData, session, callback) {
        try {

            var chkResult = new ReturnClass();
            var chkError = null;
            var params = postData["singleRowData"] || {};
            var userInfo = session.user;
            async.waterfall([
                function (callback) {
                    queryAgent.query("CHK_RVRMCOD_RF_IS_COVER_BEGIN_END_DAT", params, function (err, data) {
                        var thisRuleErr = null;
                        if (Number(data.cover_count || 0) > 0) {
                            thisRuleErr = "相同房型的開始結束日期不可重疊";
                        }
                        callback(thisRuleErr, chkResult);
                    })
                },
                function (result, callback) {
                    chkResult.extendExecDataArrSet.push({
                        function: '2',
                        table_name: 'rvrmcod_rf',
                        condition: [{
                            key: 'athena_id',
                            operation: "=",
                            value: userInfo.athena_id
                        }, {
                            key: 'room_cod',
                            operation: "=",
                            value: params.room_cod
                        }],
                        room_nam: params.room_name || "",
                        room_sna: params.room_sna || ""
                    });

                    callback(null, chkResult.extendExecDataArrSet);
                },
                function (extendExecDataArrSet, callback) {
                    queryAgent.query("CHK_ROOM_COD_ORDER_IS_EXIST_BY_ROOMCOD", params, function (err, data) {
                        if (!err && data) {
                            var tmpObj = {
                                table_name: 'room_cod_order'
                            }
                            if (Number(data.room_count) > 0) {
                                //更新room_cod_order
                                tmpObj["function"] = "2";
                                tmpObj["condition"] = [{
                                    key: 'athena_id',
                                    operation: "=",
                                    value: userInfo.athena_id
                                }, {
                                    key: 'room_cod',
                                    operation: "=",
                                    value: params.room_cod
                                }]

                            } else {
                                //新增room_cod_order
                                tmpObj["function"] = "1";

                            }

                            chkResult.extendExecDataArrSet.push(tmpObj);
                        }

                        callback(err, chkResult.extendExecDataArrSet);
                    })
                }
            ], function (err, result) {
                if (err) {
                    chkError = new ErrorClass();
                    chkError.errorMsg = err;
                    chkError.errorCod = "1111";
                }
                callback(chkError, chkResult);
            })
        } catch (err) {
            chkError = new ErrorClass();
            chkError.errorMsg = err;
            chkError.errorCod = "1111";
            chkResult.success = false;
            callback(chkError, chkResult);
        }
    },
    /**
     * 房間小類儲存前檢查:
     *  刪除:
     *     1.如果刪除的房型是同房型最後一筆,則房型排序檔也一併刪除
     *      (1)檢查是否是同房型最後一筆
     *      (2)如果是,則delete from room_cod_order where athena_id = ? and room_cod = ?
     * @param postData
     * @param session
     * @param callback {Function} :
     */
    r_rvrmcod_rf_del_save: function (postData, session, callback) {
        try {

            var chkResult = new ReturnClass();
            var chkError = null;
            var params = postData["singleRowData"] || {};
            var userInfo = session.user;

            queryAgent.query("CHK_RVRMCOD_RF_ROOM_DATA", params, function (err, data) {
                if (err) {
                    chkError = new ErrorClass();
                    chkError.errorMsg = err;
                    chkError.errorCod = "1111";
                    chkResult.success = false;
                }

                if (!err && Number(data.room_count) > 0) {
                    chkResult.extendExecDataArrSet.push({
                        function: '0',
                        table_name: 'room_cod_order',
                        condition: [{
                            key: 'athena_id',
                            operation: "=",
                            value: userInfo.athena_id
                        }, {
                            key: 'room_cod',
                            operation: "=",
                            value: params.room_cod
                        }]
                    });
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
        var result = new ReturnClass();
        var error = null;
        var singleRowData = postData.singleRowData;
        var athena_id = session.user.athena_id;
        var params = {
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
            })
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
        var result = new ReturnClass();
        var error = null;
        var singleRowData = postData.singleRowData;
        var athena_id = session.user.athena_id;
        var params = {
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
            })
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
        var result = new ReturnClass();
        var error = null;
        var singleRowData = postData.singleRowData;
        if (!_.isUndefined(singleRowData.room_amt) && typeof Number(singleRowData.room_amt) === "number") {
            result.effectValues["serv_amt"] = Math.floor(Number(singleRowData.room_amt) * 0.1);
        }
        callback(error, result);
    }
}