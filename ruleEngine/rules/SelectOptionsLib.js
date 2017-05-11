/**
 * Created by Jun on 2017/4/24.
 * 下拉選單內容
 */
var i18n = require("i18n");
var optionsLib =  this;
var ReturnClass = require("../returnClass");

/**
 * 上傳狀態選單
 * @returns {Array}
 */
exports.UploadStaList = function () {

    var uploadOptions = [
        {
            display: '已上傳',
            value: 'Y'
        },
        {
            display: '上傳失敗',
            value: 'F'
        },
        {
            display: '未上傳',
            value: 'N'
        }
    ];

    return uploadOptions;
};

/**
 * 使用狀態選單
 * @returns {Array}
 */
exports.UseStaList = function () {

    var uploadOptions = [
        {
            display: '使用中',
            value: 'Y'
        },
        {
            display: '未使用',
            value: 'N'
        }
    ];

    return uploadOptions;
};

/**
 * 歷史狀態選單
 * @returns {Array}
 */
exports.HistoryStaList = function () {

    var historySta = [
        {
            display: '留歷史資料，可印旅客登記卡',
            value: 'Y'
        },
        {
            display: '不留 不印',
            value: 'N'
        }
    ];

    return historySta;
};

/**
 *  客群選單
 * @returns {Array}
 */
exports.GuestWayList = function () {
    var guestWay = [
        {
            display: '散客',
            value: 'F'
        },
        {
            display: '商務',
            value: 'C'
        },
        {
            display: '團體',
            value: 'G'
        }
    ];

    return guestWay;
};

/**
 * 列印RCARD
 * @returns {Array}
 */
exports.PrintRcardList = function () {
    var Rcard = [
        {
            display: '列印RCARD',
            value: 'Y'
        },
        {
            display: '不印',
            value: 'N'
        }
    ];

    return Rcard;
};

/**
 * FOC設定-Foc rules
 * @returns {Array}
 */
exports.getFocRoleStaList = function () {
    var rolesList = [
        {
            display: '房價最低',
            value: '1'
        },
        {
            display: '房間數最多的房種',
            value: '2'
        },
        {
            display: '指定房號',
            value: '3'
        },
        {
            display: '指定金額',
            value: '4'
        }
    ];

    return rolesList;
};



//TODO 將搬到 [程式編碼]Rule裡

/**
 * 取得房型全部上傳狀態
 * @param params
 * @param callback
 */
exports.getRvrmUploadStaList = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UploadStaList();
    callback(null,lo_result);
};

/**
 * 取得住客類別群組對照檔使用與未使用
 */
exports.getGuestgrprfUseStaList = function (params,callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UseStaList();
    callback(null,lo_result);
};

/**
 * 取得訂房卡來員群組設定對照檔使用與未使用(與住客類別群組對照檔一樣)
 */
exports.getSourcegrprfUseStaList = function (params,callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UseStaList();
    callback(null,lo_result);
};

/**
 * 取得住客類別設定是否留下客戶歷史資料
 */
exports.qry_guest_rf_history_sta = function (params,callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.HistoryStaList();
    callback(null,lo_result);
};

/**
 * 取得住客類別設定有哪些客群
 */
exports.qry_guest_rf_guest_way = function (params,callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.GuestWayList();
    callback(null,lo_result);
};

/**
 * 取得住客類別設定使用還未使用
 */
exports.qry_guest_rf_use_sta = function (params,callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UseStaList();
    callback(null,lo_result);
};

/**
 * 取得住客類別設定列印或不列印
 */
exports.qry_guest_rf_rcard_prtrent = function (params,callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.PrintRcardList();
    callback(null,lo_result);
};

/**
 * PMS0810110取得是否使用
 */
exports.qry_source_rf_use_sta = function (params,callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UseStaList();
    callback(null,lo_result);
};

/**
 * FOC設定(PMS0810140)取得下拉選項
 */
exports.qry_foc_rf_role_sta_list = function (params,callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getFocRoleStaList();
    callback(null,lo_result);
};

/**
 * 交辦事項設定(PMS0810200)取得下拉選項
 */
exports.qry_hfd_todo_list_rf_Is_default = function (params,callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UseStaList();
    callback(null,lo_result);
};

/**
 * 訂房取消設定
 */
exports.getGuestgrprfUseStaList = function(params, callback){
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UseStaList();
    callback(null,lo_result);
};