/**
 * Created by kaiyue on 2017/11/08.
 */
let _ = require("underscore");
let fs = require('fs');
let moment = require("moment");
let async = require("async");
let queryAgent = require('../plugins/kplug-oracle/QueryAgent');
let path = require('path');
let appRootDir = path.dirname(require.main.filename);
let ruleRootPath = appRootDir + "/ruleEngine/";
let ReturnClass = require(ruleRootPath + "/returnClass");
let ErrorClass = require(ruleRootPath + "/errorClass");
let sysConfig = require("../configs/systemConfig");
let tools = require("../utils/CommonTools");

//[RS0W212010] 取格萊天漾查詢頁資料
exports.qryPageOneData = function (postData, session, callback) {
    let lo_error = null;
    let lo_result = new ReturnClass();
    let lo_params = {
        use_dat: moment(postData.use_dat).format("YYYY/MM/DD")
    };

    async.parallel([
        qryBanquetData,     // 查訂席平面圖資料
        qryBanquetSta       // 查訂席場地狀態
    ], function (err, result) {
        if (err) {
            lo_error = err;
            lo_result.success = false;
        }
        else {
            let la_banquetData = result[0];
            let la_banquetSta = result[1];
            let lo_banquetData = convertDataToDisplay(la_banquetData, la_banquetSta);
            lo_result.defaultValues = lo_banquetData;
        }

        callback(lo_error, lo_result);
    });

    function qryBanquetData(cb) {
        var params = {
            "REVE-CODE": "RS0W212010",
            "program_id": "RS0W212010",
            "func_id": "2040",
            "user": "cio"
        };

        tools.requestApi(sysConfig.api_url, params, function (err, res, result) {
            let errorMsg = null;
            let data = "";
            if (err || !result) {
                errorMsg = err;
            }
            else {
                data = result.tmp_bq3_web_map.data || [];
            }

            cb(errorMsg, data);
        });
    }

    function qryBanquetSta(cb) {
        queryAgent.queryList("QRY_RESV_ORDER_STA", lo_params, 0, 0, function (err, result) {
            cb(null, result);
        });
    }

};

//[RS0W212010] 將資料轉換為顯示用格式
function convertDataToDisplay(la_data, la_sta) {
    let lo_resvBanquetData = new ResvBanquetData(la_data, la_sta);
    let lo_converData = lo_resvBanquetData.convertExec();
    return lo_converData;
}

class ResvBanquetData {
    constructor(la_data, la_order) {
        this.ls_beg_hour = _.findWhere(la_data, {datatype: "BEG_HOUR"}).beg_hour;
        this.ls_end_hour = _.findWhere(la_data, {datatype: "END_HOUR"}).end_hour;
        this.la_rspt = _.where(la_data, {datatype: "RSPT"});
        this.la_place = _.where(la_data, {datatype: "PLACE"});
        this.la_mtim = _.where(la_data, {datatype: "MTIME"});
        this.la_order = la_order;
    }

    convertExec() {
        let la_rtnData = {
            time_range: this.getTimeRange(),
            rowData: this.genRowData()
        };
        return la_rtnData;
    }

    /**
     * 取時間區間
     * @returns {Array}
     */
    getTimeRange() {
        let la_time_range = [];
        let ln_time_range;

        this.ls_beg_hour = moment(this.ls_beg_hour, "HH");
        this.ls_end_hour = moment(this.ls_end_hour, "HH");
        ln_time_range = this.ls_end_hour.diff(this.ls_beg_hour, "hour");
        for (var min = 0; min <= ln_time_range; min++) {
            la_time_range.push(this.ls_beg_hour.clone().add(min, "hour").format("HH:mm"));
        }
        return la_time_range;
    }

    /**
     * 產生地圖資料
     * @returns {Array}
     */
    genRowData() {
        let self = this;
        let la_rowData = [];
        let lo_rowData = {};

        // 餐廳
        _.each(this.la_rspt, function (lo_rspt) {
            lo_rowData = {
                tr_class: "no-cursor-tr h23-tr",
                datatype: lo_rspt.datatype,
                name: lo_rspt.rspt_nam,
                rspt_cod: lo_rspt.rspt_cod,
                parent_cod: null,
                place_cod: null,
                banquet_dt: self.genBanquet_dt(lo_rspt.datatype, lo_rspt.rspt_cod),
                rowspan: 0
            };
            la_rowData.push(lo_rowData);

            // 地區
            let la_place = _.where(self.la_place, {rspt_cod: lo_rspt.rspt_cod});
            let la_parent = _.where(la_place, {is_child: "N"});
            _.each(la_parent, function(lo_parent){
                // 母場地
                lo_rowData = {
                    tr_class: "",
                    datatype: "PLACE",
                    name: lo_parent.place_nam,
                    rspt_cod: lo_parent.rspt_cod,
                    desk_qnt: lo_parent.desk_qnt,
                    parent_cod: "",
                    place_cod: lo_parent.place_cod,
                    banquet_dt: self.genBanquet_dt("Reserve", lo_parent.place_cod),
                    rowspan: 0
                };
                la_rowData.push(lo_rowData);

                // 子場地
                let la_child = _.where(la_place, {parent_cod: lo_parent.place_cod, is_child: "Y"});
                _.each(la_child, function(lo_child){
                    lo_rowData = {
                        tr_class: "",
                        datatype: "PLACE",
                        name: lo_child.place_nam,
                        rspt_cod: lo_child.rspt_cod,
                        desk_qnt: lo_child.desk_qnt,
                        parent_cod: lo_child.parent_cod,
                        place_cod: lo_child.place_cod,
                        banquet_dt: self.genBanquet_dt("Reserve", lo_child.place_cod),
                        rowspan: 0
                    };
                    la_rowData.push(lo_rowData);
                });
            });
        });
        return la_rowData;
    }

    /**
     * 產生訂位資料
     * @param datatype      {string} 判斷餐期或訂席
     * @param parent_cod    {string} 父層
     * @returns {Array}
     */
    genBanquet_dt(datatype, parent_cod) {
        let self = this;
        let la_banquet_dt = [];
        let lo_banquet_dt = {};
        let ln_colspan;

        // 餐期
        if (datatype == "RSPT") {
            let la_mtim = _.where(this.la_mtim, {rspt_cod: parent_cod});
            _.each(la_mtim, function (lo_mtim, index) {
                let lo_begin_tim = moment(lo_mtim.begin_tim, "HHmm");
                let lo_end_tim = moment(lo_mtim.end_tim, "HHmm");

                if (index == 0) {
                    if (self.ls_beg_hour.format("HH:mm") != lo_begin_tim.format("HH:mm")) {
                        ln_colspan = self.calcColSpan(self.ls_beg_hour, lo_begin_tim);
                        lo_banquet_dt = {
                            name: "",
                            beg_tim: self.ls_beg_hour.format("HH:mm"),
                            end_tim: lo_begin_tim.format("HH:mm"),
                            colspan: ln_colspan,
                            mtime_cod: lo_mtim.mtime_cod,
                            datatype: lo_mtim.datatype
                        };
                        if (ln_colspan != 0) {
                            la_banquet_dt.push(lo_banquet_dt);
                        }
                    }
                }
                else if (la_banquet_dt[la_banquet_dt.length - 1].end_tim != lo_begin_tim.format("HH:mm")) {
                    ln_colspan = self.calcColSpan(moment(la_banquet_dt[la_banquet_dt.length - 1].end_tim, "HH:mm"), lo_begin_tim);
                    lo_banquet_dt = {
                        name: "",
                        beg_tim: moment(la_banquet_dt[la_banquet_dt.length - 1].end_tim, "HH:mm").format("HH:mm"),
                        end_tim: lo_begin_tim.format("HH:mm"),
                        colspan: ln_colspan,
                        mtime_cod: lo_mtim.mtime_cod,
                        datatype: lo_mtim.datatype
                    };
                    if (ln_colspan != 0) {
                        la_banquet_dt.push(lo_banquet_dt);
                    }
                }

                ln_colspan = self.calcColSpan(lo_begin_tim, lo_end_tim);
                lo_banquet_dt = {
                    name: lo_mtim.time_nam,
                    beg_tim: lo_begin_tim.format("HH:mm"),
                    end_tim: lo_end_tim.format("HH:mm"),
                    colspan: ln_colspan,
                    mtime_cod: lo_mtim.mtime_cod,
                    datatype: lo_mtim.datatype
                };
                la_banquet_dt.push(lo_banquet_dt);
            });

            let lo_last = _.last(la_banquet_dt);
            if (!_.isUndefined(lo_last) && lo_last.end_tim != self.ls_end_hour.format("HH:mm")) {
                ln_colspan = self.calcColSpan(moment(lo_last.end_tim, "HH:mm"), self.ls_end_hour.clone().add("1", "hours"));
                lo_banquet_dt = {
                    name: "",
                    beg_tim: moment(lo_last.end_tim, "HH:mm").format("HH:mm"),
                    end_tim: self.ls_end_hour.format("HH:mm"),
                    colspan: ln_colspan,
                    mtime_cod: "",
                    datatype: "MTIME"
                };
                la_banquet_dt.push(lo_banquet_dt);
            }

            if (la_banquet_dt.length == 0) {
                ln_colspan = self.calcColSpan(self.ls_beg_hour, self.ls_end_hour.clone().add("1", "hours"));
                lo_banquet_dt = {
                    name: "",
                    beg_tim: self.ls_beg_hour.format("HH:mm"),
                    end_tim: self.ls_end_hour.format("HH:mm"),
                    colspan: ln_colspan,
                    mtime_cod: "",
                    datatype: "MTIME"
                };
                la_banquet_dt.push(lo_banquet_dt);
            }
        }
        // 訂席
        else {
            let la_order = _.where(this.la_order, {place_cod: parent_cod});
            _.each(la_order, function (lo_order, index) {
                let lo_begin_tim = moment(lo_order.begin_tim, "HHmm");
                let lo_end_tim = moment(lo_order.end_tim, "HHmm");
                if (index == 0) {
                    if (self.ls_beg_hour.format("HH:mm") != lo_begin_tim.format("HH:mm")) {
                        ln_colspan = self.calcColSpan(self.ls_beg_hour, lo_begin_tim);
                        lo_banquet_dt = {
                            beg_tim: self.ls_beg_hour.format("HH:mm"),
                            end_tim: lo_begin_tim.format("HH:mm"),
                            datatype: "",
                            repeat: ln_colspan
                        };
                        if (ln_colspan != 0) {
                            la_banquet_dt.push(lo_banquet_dt);
                        }
                    }
                }
                else if (la_banquet_dt[la_banquet_dt.length - 1].end_tim != lo_begin_tim.format("HH:mm")) {
                    ln_colspan = self.calcColSpan(moment(la_banquet_dt[la_banquet_dt.length - 1].end_tim, "HH:mm"), lo_begin_tim);
                    lo_banquet_dt = {
                        beg_tim: moment(la_banquet_dt[la_banquet_dt.length - 1].end_tim, "HH:mm").format("HH:mm"),
                        end_tim: lo_begin_tim.format("HH:mm"),
                        repeat: ln_colspan,
                        datatype: ""
                    };
                    if (ln_colspan != 0) {
                        la_banquet_dt.push(lo_banquet_dt);
                    }
                }

                let order_nam;
                ln_colspan = self.calcColSpan(lo_begin_tim, lo_end_tim);
                if (lo_order.order_sta == "N") {
                    order_nam = lo_order.title_nam;
                }
                else if (lo_order.order_sta == "W") {
                    order_nam = "(等" + lo_order.wait_seq + ") " + lo_order.title_nam;
                }
                else {
                    order_nam = "(詢) " + lo_order.title_nam;
                }
                lo_banquet_dt = {
                    name: order_nam,
                    beg_tim: lo_begin_tim.format("HH:mm"),
                    end_tim: lo_end_tim.format("HH:mm"),
                    colspan: ln_colspan,
                    datatype: "Reserve",
                    order_sta: lo_order.order_sta,
                    bquet_nos: lo_order.bquet_nos
                };
                la_banquet_dt.push(lo_banquet_dt);
            });

            let lo_last = _.last(la_banquet_dt);
            if (!_.isUndefined(lo_last) && lo_last.end_tim != self.ls_end_hour.format("HH:mm")) {
                ln_colspan = self.calcColSpan(moment(lo_last.end_tim, "HH:mm"), self.ls_end_hour.clone().add("1", "hours"));
                lo_banquet_dt = {
                    beg_tim: moment(lo_last.end_tim, "HH:mm").format("HH:mm"),
                    end_tim: self.ls_end_hour.format("HH:mm"),
                    repeat: ln_colspan,
                    datatype: ""
                };
                la_banquet_dt.push(lo_banquet_dt);
            }

            if (la_banquet_dt.length == 0) {
                ln_colspan = self.calcColSpan(self.ls_beg_hour, self.ls_end_hour.clone().add("1", "hours"));
                lo_banquet_dt = {
                    beg_tim: self.ls_beg_hour.format("HH:mm"),
                    end_tim: self.ls_end_hour.format("HH:mm"),
                    repeat: ln_colspan,
                    datatype: ""
                };
                la_banquet_dt.push(lo_banquet_dt);
            }
        }
        return la_banquet_dt;
    }

    /**
     * 計算地圖欄位合併數
     * @param lo_begin_tim  {string} 開始時間
     * @param lo_end_tim    {string} 結束時間
     * @returns {number}    合併格數
     */
    calcColSpan(lo_begin_tim, lo_end_tim) {
        let ln_diffMin = lo_end_tim.diff(lo_begin_tim, "minutes");
        let ln_colspan = Math.round(ln_diffMin / 30);

        return ln_colspan;
    }
}

//[RS0W212010] 取格萊天漾查詢頁資料
exports.qryPageTwoData = function (postData, session, callback) {
    var lo_error = null;

    var lo_params = {
        bquet_nos: postData.bquet_nos
    };

    queryAgent.query("QRY_BQUET_MN_SINGLE", lo_params, function (err, Result) {
        if (!err) {
            if (Result) {
                callback(lo_error, Result);
            }
            else {
                callback(lo_error, "");
            }
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err || "error";
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });
};

//[RS0W212010] 取系統參數
exports.qrySystemParam = function (postData, session, callback) {
    var lo_error = null;

    var paramName = "QRY_" + postData.paramName.toUpperCase();

    var lo_params = {
        comp_cod: session.user.cmp_id
    };

    queryAgent.query(paramName, lo_params, function (err, Result) {
        if (!err) {
            if (Result)
                callback(lo_error, Result);
            else
                callback(lo_error, "");
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err || "error";
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });
};

//[RS0W212010] 取宴席類別
exports.chk_use_typ = function (postData, session, callback) {
    var lo_error = null;

    var lo_params = {
        use_typ: postData.use_typ
    };

    queryAgent.query("CHK_USE_TYP", lo_params, function (err, Result) {
        if (!err) {
            if (Result)
                callback(lo_error, Result);
            else
                callback(lo_error, "");
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err || "error";
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });
};

//[RS0W212010] 取預約處理預設值
exports.def_proc_sta = function (postData, session, callback) {
    var lo_error = null;

    var lo_params = {};

    queryAgent.query("DEF_PROC_STA", lo_params, function (err, Result) {
        if (!err) {
            if (Result)
                callback(lo_error, Result);
            else
                callback(lo_error, "");
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err || "error";
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });
};

//[RS0W212010] 取客戶資料
exports.qry_bqcust_mn = function (postData, session, callback) {
    var lo_error = null;

    var lo_params = {
        cust_cod: postData.cust_cod
    };

    queryAgent.query("QRY_BQCUST_MN", lo_params, function (err, Result) {
        if (!err) {
            if (Result) {

                var lo_params2 = {
                    cust_cod: postData.cust_cod,
                    atten_cod: Result.atten_cod
                };

                queryAgent.query("QRY_ATTEN_NAM", lo_params2, function (err, atten_nam) {
                    if (!err) {
                        if (atten_nam) {
                            Result["atten_nam"] = atten_nam.atten_nam;
                        }
                        else {
                            Result["atten_nam"] = "";
                        }
                        callback(lo_error, Result);
                    }
                    else {
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = err || "error";
                        lo_error.errorCod = "1111";
                        callback(lo_error, Result);
                    }
                });
            }
            else
                callback(lo_error, "");
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err || "error";
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });
};

//[RS0W212010] 異動表單狀態
exports.chgOrderStaAPI = function (postData, session, callback) {
    var apiParams = {
        "REVE-CODE": postData.REVE_CODE,
        "comp_cod": session.user.cmp_id,
        "program_id": postData.prg_id,
        "func_id": postData.func_id,
        "user": session.user.usr_id,
        "table_name": 'bquet_mn',
        "count": 1,
        "ip": '',
        "bquet_nos": postData.bquet_nos,
        "old_sta": postData.old_sta,
        "new_sta": postData.new_sta,
        "upd_usr": postData.upd_usr
    };

    tools.requestApi(sysConfig.api_url, apiParams, function (apiErr, apiRes, data) {
        var log_id = moment().format("YYYYMMDDHHmmss");
        var success = true;
        var errorMsg = "";
        if (apiErr || !data) {
            success = false;
            errorMsg = apiErr;
        } else if (data["RETN-CODE"] != "0000") {
            success = false;
            errorMsg = data["RETN-CODE-DESC"] || '發生錯誤';
            console.error(data["RETN-CODE-DESC"]);
        } else {
            errorMsg = data["RETN-CODE-DESC"];
        }

        callback(errorMsg, success);
    });
};

//[RS0W212010] 取場地單價
exports.getPlaceUnitAmt = function (postData, session, callback) {
    var lo_error = null;

    var lo_params = {
        place_cod: postData.place_cod
    };

    queryAgent.query("QRY_PLACE_UNIT_AMT", lo_params, function (err, Result) {
        if (!err) {
            if (Result)
                callback(lo_error, Result);
            else
                callback(lo_error, "");
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err || "error";
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });

};