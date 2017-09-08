/**
 * Created by a16010 on 2017/9/7.
 */

function validateClass() {

    this.ls_msg = go_i18nLang.Validation.Formatter;

    //欄位必填
    this.required = function () {
        var ls_value = arguments[0];
        var ls_ui_display_name = arguments[1];
        var lb_result = ls_value != "";
        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.Required, ls_ui_display_name) : sprintf(this.ls_msg.Required, "");

        return {success: lb_result, msg: ls_msg};
    };

    //資料長度驗證
    this.chkLength = function (value, params) {
        var li_minLength = params[0];
        var li_maxLength = params[1];

        var lb_result = value.length <= li_maxLength && value.length >= li_minLength;
        var ls_msg = sprintf(this.ls_msg.ChkLength, li_minLength, li_maxLength);
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
        var reg = /-?^\d{0,10}$/;
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

    //只能0~100
    this.ChkZeroToHundred = function () {
        var ls_value = arguments[0];
        var ls_ui_display_name = arguments[1];
        var reg = /^(([1-9]\d?)|0|100)$/;
        var lb_result = reg.test(ls_value);
        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.ChkZeroToHundred, ls_ui_display_name) : sprintf(this.ls_msg.ChkZeroToHundred, "");
        return {success: lb_result, msg: ls_msg};
    };

    //只能0~99999
    this.ChkZeroToMaxNum = function () {
        var ls_value = arguments[0];
        var ls_ui_display_name = arguments[1];
        var reg = /\b([0-9]{1,5}\d)\b/;
        var lb_result = reg.test(ls_value);
        console.log(lb_result, ls_value);
        var ls_msg = (arguments.length == 2) ? sprintf(this.ls_msg.ChkZeroToMaxNum, ls_ui_display_name) : sprintf(this.ls_msg.ChkZeroToMaxNum, "");
        return {success: lb_result, msg: ls_msg};
    };
}