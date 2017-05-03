/**
 * easyUI validatebox 自訂義欄位驗證規則
 * **/

$.extend($.fn.validatebox.defaults.rules, {
    ChkLength: {
        //資料長度驗證
        validator: function (value, params) {

            var minLength = params[0];
            var maxLength = params[1];

            return value.length <= maxLength && value.length >= minLength;
        },
        message: 'Length limit between {0} to {1}'
    },
    //驗證中文字
    CHS: {
        validator: function (value, param) {
            $.fn.validatebox.defaults.rules.CHS.message = "只輸入漢字";
            return /^[\u0391-\uFFE5]+$/.test(value);
        },
        message: '只能输入汉字'
    },
    //四碼英文數字
    FmtFourEngNum: {
        validator: function (value) {
            var reg = /^[\w\d]{4}$/;
            return reg.test(value);
        },
        message: '格式為四碼英文數字.'
    },
    //數字文字
    FmtCharacters: {
        validator: function (value) {
            var reg = /[\d\D\w\W]/;
            return reg.test(value);
        },
        message: '請輸入文字'
    },
    //0到5碼數字
    FmtZeroToFiveNum: {
        validator: function (value) {
            var reg = /^\d{0,5}$/;
            return reg.test(value);
        },
        message: '0到5碼數字'
    },
    //0到10碼數字
    FmtZeroToTenNum: {
        validator: function (value) {
            var reg = /^\d{0,10}$/;
            return reg.test(value);
        },
        message: '0到10碼數字'
    },
    //大於0
    ChkGreaterZeroNum: {
        validator: function (value) {
            return Number(value) >= 0;
        },
        message: '請輸入大於0的數字'
    },
    //大於等於0
    ChkGteZeroNum: {
        validator: function (value) {
            return Number(value) >= 0;
        },
        message: '請輸入大於等於0的數字'
    },
    //小於等於0
    ChkLteZeroNum: {
        validator: function (value) {
            return Number(value) <= 0;
        },
        message: '請輸入小於等於0的數字'
    },
    //小於0
    ChkLessZeroNum: {
        validator: function (value) {
            return Number(value) < 0;
        },
        message: '請輸入小於0的數字'
    }
});
