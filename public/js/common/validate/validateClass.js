/**
 * Created by a16010 on 2017/9/7.
 * value = arguments[0]
 * ui_display_name = arguments[1]
 * 單筆參數value, ui_display_name
 * 多筆參數value
 */

function validateClass() {

    this.ls_msg = go_i18nLang.Validation.Formatter;

    //欄位必填
    this.required = function () {
        var ls_value = arguments[0];
        var ls_ui_display_name = arguments[1];
        var lb_result = !_.isUndefined(ls_value) && ls_value !== "" && !_.isNull(ls_value);
        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.Required, ls_ui_display_name) : sprintf(this.ls_msg.Required, "");

        return {success: lb_result, msg: ls_msg};
    };

    //資料長度驗證
    this.chkLength = function () {
        var ls_value = arguments[0];
        var ls_params = arguments[1];
        var li_minLength = ls_params[0];
        var li_maxLength = ls_params[1];
        var ls_ui_display_name = arguments[3];

        var lb_result = ls_value.length <= li_maxLength && ls_value.length >= li_minLength;
        var ls_msg = (arguments.length == 3) ? sprintf(this.ls_msg.ChkLength, ls_ui_display_name, li_minLength, li_maxLength) : sprintf(this.ls_msg.ChkLength, "", li_minLength, li_maxLength);
        return {success: lb_result, msg: ls_msg};
    };

    //四碼英文數字
    this.FmtFourEngNum = function () {
        var ls_value = arguments[0];
        var ls_ui_display_name = arguments[1];
        var reg = /^[\w\d]{4}$/;
        var lb_result = reg.test(ls_value);
        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.FmtFourEngNum, ls_ui_display_name) : sprintf(this.ls_msg.FmtFourEngNum, "");

        return {success: lb_result, msg: ls_msg};
    };

    //數字文字
    this.FmtCharacters = function () {
        var ls_value = arguments[0];
        var ls_ui_display_name = arguments[1];
        var reg = /[\d\D\w\W]/;
        var lb_result = reg.test(ls_value);
        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.FmtCharacters, ls_ui_display_name) : sprintf(this.ls_msg.FmtCharacters, "");
        return {success: lb_result, msg: ls_msg};
    };

    //一定要輸入兩碼
    this.FmtExactlyTwoWord = function () {
        var ls_value = arguments[0];
        var ls_ui_display_name = arguments[1];
        var reg = /[\w]{2}/;
        var lb_result = reg.test(ls_value);
        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.FmtExactlyTwoWord, ls_ui_display_name) : sprintf(this.ls_msg.FmtExactlyTwoWord, "");
        return {success: lb_result, msg: ls_msg};
    };

    //0到5碼數字
    this.FmtZeroToFiveNum = function () {
        var ls_value = arguments[0];
        var ls_ui_display_name = arguments[1];
        var reg = /^\d{0,5}$/;
        var lb_result = reg.test(ls_value);
        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.FmtZeroToFiveNum, ls_ui_display_name) : sprintf(this.ls_msg.FmtZeroToFiveNum, "");
        return {success: lb_result, msg: ls_msg};
    };

    //0到10碼數字
    this.FmtZeroToTenNum = function () {
        var ls_value = arguments[0];
        var ls_ui_display_name = arguments[1];
        var reg = /^\d{0,10}$/;
        var lb_result = reg.test(ls_value);
        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.FmtZeroToTenNum, ls_ui_display_name) : sprintf(this.ls_msg.FmtZeroToTenNum, "");

        return {success: lb_result, msg: ls_msg};

    };

    //0到10碼數字(數字必須大於等於-1)
    this.FmtZeroToTenNumAndMinusOne = function () {
        var ls_value = arguments[0];
        var ls_ui_display_name = arguments[1];
        var reg = /^-?\d{0,10}$/;
        var lb_result = reg.test(ls_value) && (Number(ls_value) >= -1 && ls_value != "-0");
        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.FmtZeroToTenNumAndMinusOne, ls_ui_display_name) : sprintf(this.ls_msg.FmtZeroToTenNumAndMinusOne, "");
        return {success: lb_result, msg: ls_msg};
    };

    //大於0
    this.ChkGreaterZeroNum = function () {
        var ls_value = arguments[0];
        var ls_ui_display_name = arguments[1];
        var lb_result = Number(ls_value) > 0;
        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.ChkGreaterZeroNum, ls_ui_display_name) : sprintf(this.ls_msg.ChkGreaterZeroNum, "");

        return {success: lb_result, msg: ls_msg};
    };

    //大於等於0
    this.ChkGteZeroNum = function () {
        var ls_value = arguments[0];
        var ls_ui_display_name = arguments[1];
        var lb_result = Number(ls_value) >= 0;
        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.ChkGteZeroNum, ls_ui_display_name) : sprintf(this.ls_msg.ChkGteZeroNum, "");

        return {success: lb_result, msg: ls_msg};
    };

    //小於等於0
    this.ChkLteZeroNum = function () {
        var ls_value = arguments[0];
        var ls_ui_display_name = arguments[1];
        var lb_result = Number(ls_value) <= 0;
        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.ChkLteZeroNum, ls_ui_display_name) : sprintf(this.ls_msg.ChkLteZeroNum, "");
        return {success: lb_result, msg: this.ls_msg.ChkLteZeroNum};
    };

    //小於0
    this.ChkLessZeroNum = function () {
        var ls_value = arguments[0];
        var ls_ui_display_name = arguments[1];
        var lb_result = Number(ls_value) < 0;
        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.ChkLessZeroNum, ls_ui_display_name) : sprintf(this.ls_msg.ChkLessZeroNum, "");
        return {success: lb_result, msg: ls_msg};
    };

    //時間格式HH:MM
    this.FmtHHMM = function () {
        var ls_value = arguments[0];
        var ls_ui_display_name = arguments[1];
        var reg = /([0-1][0-9]|2[0-3])\:[0-5][0-9]/;
        var lb_result = reg.test(ls_value);
        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.FmtHHMM, ls_ui_display_name) : sprintf(this.ls_msg.FmtHHMM, "");
        return {success: lb_result, msg: ls_msg};
    };

    //時間格式HHMM or HH:MM
    this.ChkHHMM = function () {
        var ls_value = arguments[0];
        var ls_ui_display_name = arguments[1];
        var reg = /([0-1][0-9]|2[0-3]):?[0-5][0-9]/;
        var lb_result = reg.test(ls_value);

        if (ls_value.length > 4 && ls_value.indexOf(":") == -1) {
            lb_result = false;
        }

        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.ChkHHMM, ls_ui_display_name) : sprintf(this.ls_msg.ChkHHMM, "");
        return {success: lb_result, msg: ls_msg};
    };

    // 判斷是否為整數
    this.chkInteger = function (ls_value) {
        if (ls_value == null || _.isUndefined(ls_value)) return true;
        var lb_result;
        if (ls_value.toString().indexOf(".") > -1) {
            lb_result = false;
        }
        else {
            lb_result = true;
        }
        return lb_result;
    };

    //只能0~100
    this.ChkZeroToHundred = function () {
        var ls_value = arguments[0];
        var ls_ui_display_name = arguments[1];
        var lb_result;

        if (this.chkInteger(ls_value)) {
            lb_result = Number(ls_value) >= 0 && Number(ls_value) <= 100;
        }
        else {
            lb_result = false;
        }

        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.ChkZeroToHundred, ls_ui_display_name) : sprintf(this.ls_msg.ChkZeroToHundred, "");
        return {success: lb_result, msg: ls_msg};
    };

    //只能0~99999
    this.ChkZeroToMaxNum = function () {
        var ls_value = arguments[0];
        var ls_ui_display_name = arguments[1];
        var lb_result;
        if (this.chkInteger(ls_value)) {
            lb_result = Number(ls_value) >= 0 && Number(ls_value) <= 99999;
        }
        else {
            lb_result = false;
        }
        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.ChkZeroToMaxNum, ls_ui_display_name) : sprintf(this.ls_msg.ChkZeroToMaxNum, "");
        return {success: lb_result, msg: ls_msg};
    };

    //只能小數點第一位
    this.ChkPointOne = function () {

        var ls_value = arguments[0];
        var ls_ui_display_name = arguments[1];
        var reg = /^[0-9]+(\.[0-9]{0,1})?$/;
        var lb_result = reg.test(ls_value);
        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.ChkPointOne, ls_ui_display_name) : sprintf(this.ls_msg.ChkPointOne, "");
        return {success: lb_result, msg: ls_msg};
    };

    //日期格式年月
    this.FmtYYYYMM = function () {
        var ls_value = arguments[0];
        var ls_ui_display_name = arguments[1];
        var reg = /[0-9][0-9][0-9][0-9]\/(0[1-9]|1[0-2])/;
        var lb_result = reg.test(ls_value);
        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.FmtYYYYMM, ls_ui_display_name) : sprintf(this.ls_msg.FmtYYYYMM, "");
        return {success: lb_result, msg: ls_msg};
    };

    //確認統一編號規則
    this.ChkUniCod = function () {
        var ls_value = _.isUndefined(arguments[0]) || _.isNull(arguments[0]) ? "" : arguments[0];
        var ls_ui_display_name = arguments[1];
        var lb_result = ls_value.length != 8 ? false : true;
        if (lb_result) {
            var la_chNo = ls_value.split("");
            var la_chkPara = [1, 2, 1, 2, 1, 2, 4, 1];
            var ln_sum = 0;
            for (var i = 0; i < 8; i++) {
                if (la_chNo[i].charCodeAt(i) >= 0 || la_chNo[i].charCodeAt(i) <= 9) {
                    return lb_result = false;
                }
                ln_sum += computeUniCod(la_chNo[i] * la_chkPara[i]);
            }
            lb_result = ln_sum % 10 == 0 ? true : false;
        }
        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.ChkUniCod, ls_ui_display_name) : sprintf(this.ls_msg.FmtYYYYMM, "");
        return {success: lb_result, msg: ls_msg};
    };

    //確認email格式規則
    this.ChkEmail = function () {
        var ls_value = arguments[0];
        var ls_ui_display_name = arguments[1];
        var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var lb_result = reg.test(ls_value);
        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.ChkEmail, ls_ui_display_name) : sprintf(this.ls_msg.FmtYYYYMM, "");
        return {success: lb_result, msg: ls_msg};
    };

    //確認資料是否異動
    this.chkDataChang = function () {
        var lo_singleData = arguments[0];
        var lo_oriSingleData = arguments[1];
        var lb_result = true;
        _.each(lo_singleData, function (val, key) {
            if (!Array.isArray(val)) {
                _.each(val, function (objVal, objKey) {
                    if (objVal != lo_oriSingleData[key][objKey]) {
                        console.log(objKey, objVal, lo_oriSingleData[key][objKey]);
                    }
                });
                if (!_.isMatch(val, lo_oriSingleData[key])) {
                    lb_result = false;
                    return;
                }
            }
            else {
                _.each(val, function (arrayVal, idx) {
                    if (val.length != lo_oriSingleData[key].length) {
                        lb_result = false;
                        return;
                    }
                    else {
                        if (!_.isMatch(arrayVal, lo_oriSingleData[key][idx])) {
                            _.each(arrayVal, function (objVal, objKey) {
                                if (objVal != lo_oriSingleData[key][idx][objKey]) {
                                    console.log(objKey, objVal, lo_oriSingleData[key][idx][objKey]);
                                }
                            });
                            lb_result = false;
                            return;
                        }
                    }
                });
            }
        });
        return {success: lb_result, msg: this.ls_msg.chkDataChang};
    };

    //確認日期區間是否重疊
    this.chkDateIsNotBetween = function () {
        var lo_compar_begin_dat = arguments[0];
        var lo_compar_end_dat = arguments[1];
        var lo_now_begin_dat = arguments[2];
        var lo_now_end_dat = arguments[3];
        var lb_result = true;

        lo_compar_begin_dat = moment.isMoment(lo_compar_begin_dat) ? lo_compar_begin_dat : moment(new Date(lo_compar_begin_dat));
        lo_compar_end_dat = moment.isMoment(lo_compar_end_dat) ? lo_compar_end_dat : moment(new Date(lo_compar_end_dat));
        lo_now_begin_dat = moment.isMoment(lo_now_begin_dat) ? lo_now_begin_dat : moment(new Date(lo_now_begin_dat));
        lo_now_end_dat = moment.isMoment(lo_now_end_dat) ? lo_now_end_dat : moment(new Date(lo_now_end_dat));

        if (lo_compar_begin_dat.diff(lo_now_end_dat, "days") <= 0 && lo_compar_end_dat.diff(lo_now_begin_dat, "days") >= 0) {
            lb_result = false;
        }
        return {success: lb_result, msg: this.ls_msg.chkDateIsBetween};
    };

    this.chkBeginDatAndEndDat = function () {
        var lo_begin_dat = arguments[0];
        var lo_end_dat = arguments[1];
        var lb_result = true;
        lo_begin_dat = moment.isMoment(lo_begin_dat) ? lo_begin_dat : moment(new Date(lo_begin_dat));
        lo_end_dat = moment.isMoment(lo_end_dat) ? lo_end_dat : moment(new Date(lo_end_dat));
        if (lo_begin_dat.diff(lo_end_dat, "days") > 0) {
            lb_result = false;
        }
        return {success: lb_result, msg: this.ls_msg.chkBeginDatAndEndDat};
    };

}

//計算統一編號
function computeUniCod(num) {
    if (num > 9) {
        var ls_param = num + "";
        var ln_param1 = ls_param.substring(0, 1) * 1;
        var ln_param2 = ls_param.substring(1, 2) * 1;
        num = ln_param1 + ln_param2;
    }
    return num;
}