/**
 * Created by a16010 on 2017/9/7.
 */

function validateClass() {

    this.ls_msg = go_i18nLang.Validation.Formatter;

    this.required = function(value){
        var lb_result = value == "";
        return {success: lb_result, msg: this.ls_msg.required};
    }

    //資料長度驗證
    this.chkLength = function (value, params) {
        var li_minLength = params[0];
        var li_maxLength = params[1];

        var lb_result = value.length <= li_maxLength && value.length >= li_minLength;
        var ls_msg = sprintf(this.ls_msg.ChkLength, li_minLength, li_maxLength);
        return {success: lb_result, msg: ls_msg};
    };

    //四碼英文數字
    this.FmtFourEngNum = function (value) {
        var reg = /^[\w\d]{4}$/;
        var lb_result = reg.test(value);
        return {success: lb_result, msg: this.ls_msg.FmtFourEngNum};
    };

    //數字文字
    this.FmtCharacters = function (value) {
        var reg = /[\d\D\w\W]/;
        var lb_result = reg.test(value);
        return {success: lb_result, msg: this.ls_msg.FmtCharacters};
    };

    //一定要輸入兩碼
    this.FmtExactlyTwoWord = function (value) {
        var reg = /[\w]{2}/;
        var lb_result = reg.test(value);
        return {success: lb_result, msg: this.ls_msg.FmtExactlyTwoWord};
    };

    //0到5碼數字
    this.FmtZeroToFiveNum = function (value) {
        var reg = /^\d{0,5}$/;
        var lb_result = reg.test(value);
        return {success: lb_result, msg: this.ls_msg.FmtZeroToFiveNum};
    };

    //0到10碼數字
    this.FmtZeroToTenNum = function (value) {
        var reg = /^\d{0,10}$/;
        var lb_result = reg.test(value);
        return {success: lb_result, msg: this.ls_msg.FmtZeroToTenNum};
    };

    //0到10碼數字(數字必須大於等於-1)
    this.FmtZeroToTenNumAndMinusOne = function (value) {
        var reg = /-?^\d{0,10}$/;
        var lb_result = reg.test(value);
        return {success: lb_result, msg: this.ls_msg.FmtZeroToTenNumAndMinusOne};
    };

    //大於0
    this.ChkGreaterZeroNum = function (value) {
        var lb_result = Number(value) >= 0;
        return {success: lb_result, msg: this.ls_msg.ChkGreaterZeroNum};
    };

    //大於等於0
    this.ChkGteZeroNum = function (value) {
        var lb_result = Number(value) >= 0;
        return {success: lb_result, msg: this.ls_msg.ChkGreaterZeroNum};
    };

    //小於等於0
    this.ChkLteZeroNum = function (value) {
        var lb_result = Number(value) <= 0;
        return {success: lb_result, msg: this.ls_msg.ChkLteZeroNum};
    };

    //小於0
    this.ChkLessZeroNum = function (value) {
        var lb_result = Number(value) < 0;
        return {success: lb_result, msg: this.ls_msg.ChkLteZeroNum};
    };

    //時間格式HH:MM
    this.FmtHHMM = function (value) {
        var lb_result = Number(value) < 0;
        return {success: lb_result, msg: this.ls_msg.ChkLteZeroNum};
    };

    //只能0~100
    this.ChkKeepday = function (value) {
        var reg = /^(([1-9]\d?)|0|100)$/;
        var lb_result = reg.test(value);
        return {success: lb_result, msg: this.ls_msg.ChkKeepday};
    };

    //只能0~99999
    this.ChkViewseq = function (value) {
        var reg = /^(([1-9]\d?){4})$/;
        var lb_result = reg.test(value);
        return {success: lb_result, msg: this.ls_msg.ChkViewseq};
    };
}