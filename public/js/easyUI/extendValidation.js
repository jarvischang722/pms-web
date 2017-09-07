/**
 * easyUI validatebox 自訂義欄位驗證規則
 * **/

$.extend($.fn.validatebox.defaults.rules, {
    ChkLength: {
        //資料長度驗證
        validator: function (value, params) {
            var lo_checkResult = go_validateClass.chkLength(value, params);
            $.fn.validatebox.defaults.rules.ChkLength.message = lo_checkResult.msg;
            return lo_checkResult.success;
        },
        message:    ''
    },
    //四碼英文數字
    FmtFourEngNum: {
        validator: function (value) {
            $.fn.validatebox.defaults.rules.FmtFourEngNum.message = go_i18nLang.Validation.Formatter["FmtFourEngNum"]  ;
            return go_validateClass.FmtFourEngNum(value).success;
        },
        message: '格式為四碼英文數字.'
    },
    //數字文字
    FmtCharacters: {
        validator: function (value) {
            $.fn.validatebox.defaults.rules.FmtCharacters.message = go_i18nLang.Validation.Formatter["FmtCharacters"]  ;
            return go_validateClass.FmtCharacters(value).success;
        },
        message: '請輸入文字'
    },
    //一定要輸入兩碼
    FmtExactlyTwoWord: {
        validator: function (value) {
            $.fn.validatebox.defaults.rules.FmtExactlyTwoWord.message = go_i18nLang.Validation.Formatter["FmtExactlyTwoWord"]  ;
            return go_validateClass.FmtExactlyTwoWord(value).success;
        },
        message: '一定要輸入2碼'
    },
    //0到5碼數字
    FmtZeroToFiveNum: {
        validator: function (value) {
            $.fn.validatebox.defaults.rules.FmtZeroToFiveNum.message = go_i18nLang.Validation.Formatter["FmtZeroToFiveNum"]  ;
            return go_validateClass.FmtZeroToFiveNum(value).success;
        },
        message: '0到5碼數字'
    },
    //0到10碼數字
    FmtZeroToTenNum: {
        validator: function (value) {
            $.fn.validatebox.defaults.rules.FmtZeroToTenNum.message = go_i18nLang.Validation.Formatter["FmtZeroToTenNum"]  ;
            return go_validateClass.FmtZeroToTenNum(value).success;
        },
        message: '0到10碼數字'
    },
    //0到10碼數字(數字必須大於等於-1)
    FmtZeroToTenNumAndMinusOne: {
        validator: function (value) {
            $.fn.validatebox.defaults.rules.FmtZeroToTenNum.message = go_i18nLang.Validation.Formatter["FmtZeroToTenNumAndMinusOne"]  ;
            return go_validateClass.FmtZeroToTenNumAndMinusOne(value).success;
        },
        message: '0到10碼數字(數字必須大於等於-1)'
    },
    //大於0
    ChkGreaterZeroNum: {
        validator: function (value) {
            var lo_checkResult = go_validateClass.ChkGreaterZeroNum(value);
            $.fn.validatebox.defaults.rules.ChkGreaterZeroNum.message = lo_checkResult.msg;
            return lo_checkResult.success;
        },
        message: '請輸入大於0的數字'
    },
    //大於等於0
    ChkGteZeroNum: {
        validator: function (value) {
            var lo_checkResult = go_validateClass.ChkGreaterZeroNum(value);
            $.fn.validatebox.defaults.rules.ChkGteZeroNum.message = lo_checkResult.msg;
            return lo_checkResult.success;
        },
        message: '請輸入大於等於0的數字'
    },
    //小於等於0
    ChkLteZeroNum: {
        validator: function (value) {
            $.fn.validatebox.defaults.rules.ChkLteZeroNum.message = go_i18nLang.Validation.Formatter["ChkLteZeroNum"]  ;
            return go_validateClass.ChkLteZeroNum(value).success;
        },
        message: '請輸入小於等於0的數字'
    },
    //小於0
    ChkLessZeroNum: {
        validator: function (value) {
            $.fn.validatebox.defaults.rules.ChkLessZeroNum.message = go_i18nLang.Validation.Formatter["ChkLessZeroNum"]  ;
            return go_validateClass.ChkLessZeroNum(value).success;
        },
        message: '請輸入小於0的數字'
    },
    //時間格式HH:MM
    FmtHHMM : {
        validator: function (value) {
            var reg = /([0-1][0-9]|2[0-3])\:[0-5][0-9]/;
            $.fn.validatebox.defaults.rules.FmtHHMM.message = go_i18nLang.Validation.Formatter["FmtHHMM"]  ;
            return go_validateClass.FmtHHMM(value).success;
        },
        message: '時間格式HH:MM'
    },
    //只能0~100
    ChkKeepday : {
        validator: function (value) {
            var reg = /^(([1-9]\d?)|0|100)$/;
            $.fn.validatebox.defaults.rules.FmtHHMM.message = go_i18nLang.Validation.Formatter["chkKeepday"]  ;
            return go_validateClass.ChkKeepday(value).success;
        },
        message: '只能0~100'
    },
    //只能0~100
    ChkDprat : {
        validator: function (value) {
            var reg = /^(([1-9]\d?)|0|100)$/;
            $.fn.validatebox.defaults.rules.FmtHHMM.message = go_i18nLang.Validation.Formatter["ChkDprat"]  ;
            return go_validateClass.ChkDprat(value).success;
        },
        message: '只能0~100'
    },
    //只能0~99999
    ChkViewseq : {
        validator: function (value) {
            var reg = /^(([1-9]\d?){4})$/;
            $.fn.validatebox.defaults.rules.FmtHHMM.message = go_i18nLang.Validation.Formatter["chkKeepday"]  ;
            return go_validateClass.ChkViewseq(value).success;
        },
        message: '只能0~99999'
    }
});
