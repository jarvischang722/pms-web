/**
 * easyUI validatebox 自訂義欄位驗證規則
 * **/

$.extend($.fn.validatebox.defaults.rules, {
    ChkLength: {
        //資料長度驗證
        validator: function (value, params) {

            var minLength = params[0];
            var maxLength = params[1];
            $.fn.validatebox.defaults.rules.ChkLength.message = sprintf(go_i18nLang.Validation.Formatter["ChkLength"],minLength,maxLength)  ;
            return value.length <= maxLength && value.length >= minLength;
        },
        message:    ''
    },
    //四碼英文數字
    FmtFourEngNum: {
        validator: function (value) {
            var reg = /^[\w\d]{4}$/;
            $.fn.validatebox.defaults.rules.FmtFourEngNum.message = go_i18nLang.Validation.Formatter["FmtFourEngNum"]  ;
            return reg.test(value);
        },
        message: '格式為四碼英文數字.'
    },
    //數字文字
    FmtCharacters: {
        validator: function (value) {
            var reg = /[\d\D\w\W]/;
            $.fn.validatebox.defaults.rules.FmtCharacters.message = go_i18nLang.Validation.Formatter["FmtCharacters"]  ;
            return reg.test(value);
        },
        message: '請輸入文字'
    },
    //一定要輸入兩碼
    FmtExactlyTwoWord: {
        validator: function (value) {
            var reg = /[\w]{2}/;
            $.fn.validatebox.defaults.rules.FmtExactlyTwoWord.message = go_i18nLang.Validation.Formatter["FmtExactlyTwoWord"]  ;
            return reg.test(value);
        },
        message: '一定要輸入2碼'
    },
    //0到5碼數字
    FmtZeroToFiveNum: {
        validator: function (value) {
            var reg = /^\d{0,5}$/;
            $.fn.validatebox.defaults.rules.FmtZeroToFiveNum.message = go_i18nLang.Validation.Formatter["FmtZeroToFiveNum"]  ;
            return reg.test(value);
        },
        message: '0到5碼數字'
    },
    //0到10碼數字
    FmtZeroToTenNum: {
        validator: function (value) {
            var reg = /^\d{0,10}$/;
            $.fn.validatebox.defaults.rules.FmtZeroToTenNum.message = go_i18nLang.Validation.Formatter["FmtZeroToTenNum"]  ;
            return reg.test(value);
        },
        message: '0到10碼數字'
    },
    //大於0
    ChkGreaterZeroNum: {
        validator: function (value) {
            $.fn.validatebox.defaults.rules.ChkGreaterZeroNum.message = go_i18nLang.Validation.Formatter["ChkGreaterZeroNum"]  ;
            return Number(value) >= 0;
        },
        message: '請輸入大於0的數字'
    },
    //大於等於0
    ChkGteZeroNum: {
        validator: function (value) {
            $.fn.validatebox.defaults.rules.ChkGteZeroNum.message = go_i18nLang.Validation.Formatter["ChkGteZeroNum"]  ;
            return Number(value) >= 0;
        },
        message: '請輸入大於等於0的數字'
    },
    //小於等於0
    ChkLteZeroNum: {
        validator: function (value) {
            $.fn.validatebox.defaults.rules.ChkLteZeroNum.message = go_i18nLang.Validation.Formatter["ChkLteZeroNum"]  ;
            return Number(value) <= 0;
        },
        message: '請輸入小於等於0的數字'
    },
    //小於0
    ChkLessZeroNum: {
        validator: function (value) {
            $.fn.validatebox.defaults.rules.ChkLessZeroNum.message = go_i18nLang.Validation.Formatter["ChkLessZeroNum"]  ;
            return Number(value) < 0;
        },
        message: '請輸入小於0的數字'
    },
    //時間格式HH:MM
    FmtHHMM : {
        validator: function (value) {
            var reg = /([0-1][0-9]|2[0-3])\:[0-5][0-9]/;
            $.fn.validatebox.defaults.rules.FmtHHMM.message = go_i18nLang.Validation.Formatter["FmtHHMM"]  ;
            return reg.test(value);
        },
        message: '時間格式HH:MM'
    },
    //只能0~100
    ChkKeepday : {
        validator: function (value) {
            var reg = /^(([1-9]\d?)|0|100)$/;
            $.fn.validatebox.defaults.rules.FmtHHMM.message = go_i18nLang.Validation.Formatter["chkKeepday"]  ;
            return reg.test(value);
        },
        message: '只能0~100'
    },
    //只能0~100
    ChkDprat : {
        validator: function (value) {
            var reg = /^(([1-9]\d?)|0|100)$/;
            $.fn.validatebox.defaults.rules.FmtHHMM.message = go_i18nLang.Validation.Formatter["ChkDprat"]  ;
            return reg.test(value);
        },
        message: '只能0~100'
    },
    //只能0~99999
    ChkViewseq : {
        validator: function (value) {
            var reg = /^(([1-9]\d?){4})$/;
            $.fn.validatebox.defaults.rules.FmtHHMM.message = go_i18nLang.Validation.Formatter["chkKeepday"]  ;
            return reg.test(value);
        },
        message: '只能0~99999'
    }
});
