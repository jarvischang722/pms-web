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
            var lo_checkResult = go_validateClass.chkLength(value);
            $.fn.validatebox.defaults.rules.FmtFourEngNum.message = lo_checkResult.msg;
            return lo_checkResult.success;
        },
        message: '格式為四碼英文數字.'
    },
    //數字文字
    FmtCharacters: {
        validator: function (value) {
            var lo_checkResult = go_validateClass.FmtCharacters(value);
            $.fn.validatebox.defaults.rules.FmtCharacters.message = lo_checkResult.msg;
            return lo_checkResult.success;
        },
        message: '請輸入文字'
    },
    //一定要輸入兩碼
    FmtExactlyTwoWord: {
        validator: function (value) {
            var lo_checkResult = go_validateClass.FmtExactlyTwoWord(value);
            $.fn.validatebox.defaults.rules.FmtExactlyTwoWord.message = lo_checkResult.msg;
            return lo_checkResult.success;
        },
        message: '一定要輸入2碼'
    },
    //0到5碼數字
    FmtZeroToFiveNum: {
        validator: function (value) {
            var lo_checkResult = go_validateClass.FmtZeroToFiveNum(value);
            $.fn.validatebox.defaults.rules.FmtZeroToFiveNum.message = lo_checkResult.msg;
            return lo_checkResult.success;
        },
        message: '0到5碼數字'
    },
    //0到10碼數字
    FmtZeroToTenNum: {
        validator: function (value) {
            var lo_checkResult = go_validateClass.FmtZeroToTenNum(value);
            $.fn.validatebox.defaults.rules.FmtZeroToTenNum.message = lo_checkResult.msg;
            return lo_checkResult.success;
        },
        message: '0到10碼數字'
    },
    //0到10碼數字(數字必須大於等於-1)
    FmtZeroToTenNumAndMinusOne: {
        validator: function (value) {
            var lo_checkResult = go_validateClass.FmtZeroToTenNumAndMinusOne(value);
            $.fn.validatebox.defaults.rules.FmtZeroToTenNumAndMinusOne.message = lo_checkResult.msg;
            return lo_checkResult.success;
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
            var lo_checkResult = go_validateClass.ChkGteZeroNum(value);
            $.fn.validatebox.defaults.rules.ChkGteZeroNum.message = lo_checkResult.msg;
            return lo_checkResult.success;
        },
        message: '請輸入大於等於0的數字'
    },
    //小於等於0
    ChkLteZeroNum: {
        validator: function (value) {
            var lo_checkResult = go_validateClass.ChkLteZeroNum(value);
            $.fn.validatebox.defaults.rules.ChkLteZeroNum.message = lo_checkResult.msg;
            return lo_checkResult.success;
        },
        message: '請輸入小於等於0的數字'
    },
    //小於0
    ChkLessZeroNum: {
        validator: function (value) {
            var lo_checkResult = go_validateClass.ChkLessZeroNum(value);
            $.fn.validatebox.defaults.rules.ChkLessZeroNum.message = lo_checkResult.msg;
            return lo_checkResult.success;
        },
        message: '請輸入小於0的數字'
    },
    //時間格式HH:MM
    FmtHHMM : {
        validator: function (value) {
            var lo_checkResult = go_validateClass.FmtHHMM(value);
            $.fn.validatebox.defaults.rules.FmtHHMM.message = lo_checkResult.msg;
            return lo_checkResult.success;
        },
        message: '時間格式HH:MM'
    },
    //只能0~100
    ChkZeroToHundred : {
        validator: function (value) {
            var lo_checkResult = go_validateClass.ChkZeroToHundred(value);
            $.fn.validatebox.defaults.rules.ChkZeroToHundred.message = lo_checkResult.msg;
            return lo_checkResult.success;
        },
        message: '只能0~100'
    },
    //只能0~99999
    ChkZeroToMaxNum : {
        validator: function (value) {
            var lo_checkResult = go_validateClass.ChkZeroToMaxNum(value);
            $.fn.validatebox.defaults.rules.ChkZeroToMaxNum.message = lo_checkResult.msg;
            return lo_checkResult.success;
        },
        message: '只能0~99999'
    },
    //只能0~99999
    ChkPointOne : {
        validator: function (value) {
            var lo_checkResult = go_validateClass.ChkPointOne(value);
            $.fn.validatebox.defaults.rules.ChkPointOne.message = lo_checkResult.msg;
            return lo_checkResult.success;
        },
        message: '僅能輸入到小數點1位'
    }
});
