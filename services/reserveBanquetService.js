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
        this.day_beg_hour = _.findWhere(la_data, {datatype: "BEG_HOUR"}).beg_hour;
        this.day_end_hour = _.findWhere(la_data, {datatype: "END_HOUR"}).end_hour;
        this.day_beg_min = this.convertToMin(this.day_beg_hour);
        this.day_end_min = this.convertToMin(this.day_end_hour);

        this.la_rspt = _.where(la_data, {datatype: "RSPT"});
        this.la_place = _.where(la_data, {datatype: "PLACE"});
        this.la_mtim = _.where(la_data, {datatype: "MTIME"});
        this.la_mtim = _.sortBy(this.la_mtim, "begin_tim");
        la_order = _.sortBy(la_order, "begin_tim");
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
        let ls_display_beg_hour = moment.utc(moment.duration(this.day_beg_hour + ":00").asMilliseconds());

        let ln_time_range = this.day_end_hour - this.day_beg_hour;
        for (let min = 0; min <= ln_time_range; min++) {
            la_time_range.push(ls_display_beg_hour.clone().add(min, "hour").format("HH:mm"));
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
            _.each(la_parent, function (lo_parent) {
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
                _.each(la_child, function (lo_child) {
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
                let ln_rspt_beg_min = self.convertToMin(lo_mtim.begin_tim);
                let ln_rspt_end_min = self.convertToMin(lo_mtim.end_tim);

                /**
                 * 營業開始時間 != 餐期開始時間 (補空白格子)
                 */
                if (index == 0) {
                    if (self.day_beg_min != ln_rspt_beg_min) {
                        //計算格子數： 營業開始時間 - 餐期開始時間
                        ln_colspan = self.calcColSpan(self.day_beg_min, ln_rspt_beg_min);
                        lo_banquet_dt = {
                            name: "",
                            beg_tim: self.getTimeFromMins(self.day_beg_min),
                            end_tim: self.getTimeFromMins(ln_rspt_end_min),
                            colspan: ln_colspan,
                            mtime_cod: lo_mtim.mtime_cod,
                            datatype: lo_mtim.datatype
                        };
                        if (ln_colspan != 0) {
                            la_banquet_dt.push(lo_banquet_dt);
                        }
                    }
                }
                /**
                 * 上個餐期結束時間 != 此次餐期開始時間 (補空白格子)
                 */
                else if (self.convertToMin(la_banquet_dt[la_banquet_dt.length - 1].end_tim) != ln_rspt_beg_min) {
                    // 計算格子數： 此次餐期開始時間 - 上個餐期結束時間
                    ln_colspan = self.calcColSpan(self.convertToMin(la_banquet_dt[la_banquet_dt.length - 1].end_tim), ln_rspt_beg_min);
                    lo_banquet_dt = {
                        name: "",
                        beg_tim: la_banquet_dt[la_banquet_dt.length - 1].end_tim,
                        end_tim: self.getTimeFromMins(ln_rspt_beg_min),
                        colspan: ln_colspan,
                        mtime_cod: lo_mtim.mtime_cod,
                        datatype: lo_mtim.datatype
                    };
                    if (ln_colspan != 0) {
                        la_banquet_dt.push(lo_banquet_dt);
                    }
                }

                /**
                 * 補完空白格子後，計算餐期格子數： 此餐期結束時間 - 此餐期開始時間
                 */
                ln_colspan = self.calcColSpan(ln_rspt_beg_min, ln_rspt_end_min);
                lo_banquet_dt = {
                    name: lo_mtim.time_nam,
                    beg_tim: self.getTimeFromMins(ln_rspt_beg_min),
                    end_tim: self.getTimeFromMins(ln_rspt_end_min),
                    colspan: ln_colspan,
                    mtime_cod: lo_mtim.mtime_cod,
                    datatype: lo_mtim.datatype
                };
                la_banquet_dt.push(lo_banquet_dt);
            });

            //尋找最後一個餐期
            let lo_last = _.last(la_banquet_dt);
            /**
             * 最後的餐期結束時間 != 營業結束時間 (補空白格子)
             */
            if (!_.isUndefined(lo_last) && this.convertToMin(lo_last.end_tim) != self.day_end_min) {
                //計算格子數 : 營業結束時間 + 1hour - 最後餐期結束時間
                ln_colspan = self.calcColSpan(this.convertToMin(lo_last.end_tim), self.day_end_min + 60);
                lo_banquet_dt = {
                    name: "",
                    beg_tim: lo_last.end_tim,
                    end_tim: self.getTimeFromMins(this.day_end_min),
                    colspan: ln_colspan,
                    mtime_cod: "",
                    datatype: "MTIME"
                };
                la_banquet_dt.push(lo_banquet_dt);
            }

            /**
             * 無任何餐期資料
             */
            if (la_banquet_dt.length == 0) {
                //補滿空白格子 : 營業結束時間 + 1hour - 營業開始時間
                ln_colspan = self.calcColSpan(this.day_beg_min, this.day_end_min + 60);
                lo_banquet_dt = {
                    name: "",
                    beg_tim: self.getTimeFromMins(this.day_beg_min),
                    end_tim: self.getTimeFromMins(this.day_end_min),
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
                let ln_order_beg_min = self.convertToMin(lo_order.begin_tim);
                let ln_order_end_min = self.convertToMin(lo_order.end_tim);

                /**
                 * 營業開始時間 != 訂席開始時間 (補空白格子)
                 */
                if (index == 0) {
                    if (self.day_beg_min != ln_order_beg_min) {
                        //計算空白格子數： 訂席開始時間 - 營業開始時間
                        ln_colspan = self.calcColSpan(self.day_beg_min, ln_order_beg_min);
                        lo_banquet_dt = {
                            beg_tim: self.getTimeFromMins(self.day_beg_min),
                            end_tim: self.getTimeFromMins(ln_order_beg_min),
                            datatype: "",
                            repeat: ln_colspan
                        };
                        if (ln_colspan != 0) {
                            la_banquet_dt.push(lo_banquet_dt);
                        }
                    }
                }
                /**
                 * 上個訂席結束時間 != 此次訂席開始時間 (補空白格子)
                 */
                else if (self.convertToMin(la_banquet_dt[la_banquet_dt.length - 1].end_tim) != ln_order_beg_min) {
                    //計算空白格子數： 此次開始訂席 - 上個訂席結束時間
                    ln_colspan = self.calcColSpan(self.convertToMin(la_banquet_dt[la_banquet_dt.length - 1].end_tim), ln_order_beg_min);
                    lo_banquet_dt = {
                        beg_tim: la_banquet_dt[la_banquet_dt.length - 1].end_tim,
                        end_tim: self.getTimeFromMins(ln_order_beg_min),
                        repeat: ln_colspan,
                        datatype: ""
                    };
                    if (ln_colspan != 0) {
                        la_banquet_dt.push(lo_banquet_dt);
                    }
                }

                let order_nam;
                /**
                 * 補完空白格子後，計算訂席格子數： 訂席結束時間 - 訂席開始時間
                 */
                ln_colspan = self.calcColSpan(ln_order_beg_min, ln_order_end_min);
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
                    beg_tim: self.getTimeFromMins(ln_order_beg_min),
                    end_tim: self.getTimeFromMins(ln_order_end_min),
                    colspan: ln_colspan,
                    datatype: "Reserve",
                    order_sta: lo_order.order_sta,
                    bquet_nos: lo_order.bquet_nos
                };
                la_banquet_dt.push(lo_banquet_dt);
            });

            //尋找最後一個訂席
            let lo_last = _.last(la_banquet_dt);
            /**
             * 最後訂席結束時間 != 營業結束時間 (補空白格子)
             */
            if (!_.isUndefined(lo_last) && this.convertToMin(lo_last.end_tim) != this.day_end_min) {
                //計算空白格子數： 營業結束時間 + 1hour - 最後訂席結束時間
                ln_colspan = self.calcColSpan(this.convertToMin(lo_last.end_tim), this.day_end_min + 60);
                lo_banquet_dt = {
                    beg_tim: lo_last.end_tim,
                    end_tim: self.getTimeFromMins(this.day_end_min),
                    repeat: ln_colspan,
                    datatype: ""
                };
                la_banquet_dt.push(lo_banquet_dt);
            }

            /**
             * 無任何訂席資料，補空白格子
             */
            if (la_banquet_dt.length == 0) {
                //計算空白格子數： 營業結束時間 + 1hour - 營業開始時間
                ln_colspan = self.calcColSpan(this.day_beg_min, this.day_end_min + 60);
                lo_banquet_dt = {
                    beg_tim: self.getTimeFromMins(this.day_beg_min),
                    end_tim: self.getTimeFromMins(this.day_end_min),
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
     * @param ln_begin_tim  {number} 開始時間(min)
     * @param ln_end_tim    {number} 結束時間(min)
     * @returns {number}    合併格數
     */
    calcColSpan(ln_begin_tim, ln_end_tim) {
        let ln_diffMin = ln_end_tim - ln_begin_tim;
        let ln_colspan = Math.round(ln_diffMin / 30);

        return ln_colspan;
    }

    convertToMin(ls_time) {
        ls_time = ls_time.toString();
        let ln_min = 0;
        if (ls_time.length <= 2) {
            ln_min = parseInt(ls_time) * 60;
        }
        else if (ls_time.indexOf(":") > -1) {
            let splitTime = ls_time.split(":");
            ln_min = parseInt(splitTime[0]) * 60 + parseInt(splitTime[1]);
        }
        else {
            let hour = parseInt(ls_time.substring(0, 2));
            let min = parseInt(ls_time.substring(2, 5));
            ln_min = hour * 60 + min;
        }
        return ln_min;
    }

    getTimeFromMins(mins) {
        // do not include the first validation check if you want, for example,
        // getTimeFromMins(1530) to equal getTimeFromMins(90) (i.e. mins rollover)
        if (mins >= 24 * 60) {
            mins -= 24 * 60;
            // throw new RangeError("Valid input should be greater than or equal to 0 and less than 1440.");
        }
        let h = mins / 60 | 0,
            m = mins % 60 | 0;
        return moment.utc().hours(h).minutes(m).format("HH:mm");
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

//[RS0W212010] 取已付訂金預設值
exports.def_banlance_amt = function (postData, session, callback) {
    var lo_error = null;

    var lo_params = {
        bquet_nos: postData.bquet_nos
    };

    queryAgent.query("QRY_BANLANCE_AMT", lo_params, function (err, Result) {
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