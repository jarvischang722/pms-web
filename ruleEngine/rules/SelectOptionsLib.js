/**
 * Created by Jun on 2017/4/24.
 * 下拉選單內容
 */
var i18n = require("i18n");
var optionsLib = this;
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
 * 可修改狀態選單
 * @returns {Array}
 */
exports.UseRvancelRfFlagStaList = function () {

    var uploadOptions = [
        {
            display: '可修改',
            value: 'Y'
        },
        {
            display: '不可修改',
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
 * 取得FOC角色狀態
 * @returns {Array}
 */
exports.getFocRfRoleStaList = function () {
    var roleStaList = [
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

    return roleStaList;
};

/**
 * 取得聯絡類別
 * @returns {Array}
 */
exports.getContactContractTypList = function () {
    var contractTypList = [
        {
            display: '電話',
            value: 'T'
        },
        {
            display: '傳真',
            value: 'F'
        },
        {
            display: '行動電話',
            value: 'M'
        }
    ];

    return contractTypList;
};

/**
 * 取得PMS0830090 MasterTyp
 * @returns {Array}
 */
exports.getMasteRrfMasterTypList = function () {
    var contractTypList = [
        {
            display: '指定使用',
            value: 'N'
        },
        {
            display: '系統自動給號',
            value: 'A'
        },
        {
            display: '現金帳',
            value: 'C'
        }
    ];

    return contractTypList;
};

/**
 * 取得PMS0830090 MasterSta
 * @returns {Array}
 */
exports.getMasteRrfMasterStaList = function () {
    var contractTypList = [
        {
            display: '使用中',
            value: 'Y'
        },
        {
            display: '未使用',
            value: 'N'
        },
        {
            display: '暫停使用',
            value: 'P'
        }
    ];

    return contractTypList;
};

/**
 * 取得PMS0840030 使用狀態
 * @returns {Array}
 */
exports.getIsCanUseStaList = function () {
    var contractTypList = [
        {
            display: '使用中',
            value: 'Y'
        },
        {
            display: '停用',
            value: 'N'
        }
    ];

    return contractTypList;
};

/**
 * 取得地址類別
 * @returns {Array}
 */
exports.getAddressContractTypList = function () {
    var contractTypList = [
        {
            display: '地址',
            value: 'A'
        },
        {
            display: '電子郵件',
            value: 'E'
        }
    ];

    return contractTypList;
};

/**
 * 取得聯絡設定是否刪除
 * @returns {Array}
 */
exports.getDeleteFlagList = function () {
    var deleteFlagList = [
        {
            display: '不可刪除',
            value: 'N'
        },
        {
            display: '可刪除',
            value: 'Y'
        }
    ];

    return deleteFlagList;
};

/**
 * 取得聯絡設定是否刪除
 * @returns {Array}
 */
exports.getIsCanUse = function () {
    var useList = [
        {
            display: '是',
            value: 'Y'
        },
        {
            display: '否',
            value: 'N'
        }
    ];

    return useList;
};

/**
 * 取得需收訂金
 * @returns {Array}
 */
exports.getIsNeed = function () {
    var useList = [
        {
            display: '需要',
            value: 'Y'
        },
        {
            display: '不需要',
            value: 'N'
        }
    ];

    return useList;
};

/**
 * checkbox是否使用
 * @returns
 */
exports.checkStaList = function () {
    var checkList = [{
        on: 'Y',
        off: 'N'
    }, {
        Y: '使用',
        N: '非使用'
    }];

    return checkList;
};

/**
 * checkbox是否使用(PMS0860070)
 * @returns
 */
exports.checkStaIsDefaultList = function () {
    var checkList = [{
        on: 'Y',
        off: 'N'
    }, {
        Y: '預設',
        N: '非預設'
    }];

    return checkList;
};

/**
 * checkbox是否使用(PMS0860070)
 * @returns
 */
exports.checkStaIsCheckedList = function () {
    var checkList = [{
        on: 'Y',
        off: 'N'
    }, {
        Y: '打勾',
        N: '不打勾'
    }];

    return checkList;
};

/**
 * [PMS0830010_出納員設定] 啟用狀態
 * @returns {[array]}
 */
exports.getCashierrfUseSta = function(){
    var lo_optionList= [
        {
            on: 'Y',
            off: 'N'
        }, {
            Y: '啟用',
            N: '不啟用'
        }
    ];
    return lo_optionList;
}


/**
 * [PMS0820010_房間特色設定] 系統預設
 * @returns {array}
 */
exports.getCharacterrfSysdefaultList = function () {
    var lo_SysdefaultList = [
        {
            display: "是",
            value: "Y"
        },
        {
            display: "否",
            value: "N"
        }
    ];
    return lo_SysdefaultList;
};
exports.roomcolorrfColortyp = function () {
    return [
        {
            display: "文字",
            value: "FONT"
        },
        {
            display: "背景",
            value: "BK"
        }
    ];
};
exports.HfdroomcolorrfProtyp = function () {
    return [
        {
            display: "排房作業",
            value: "ASI"
        },
        {
            display: "房間管理",
            value: "RM"
        },
        {
            display: "房務管理",
            value: "HK"
        }
    ];
};
exports.roomcolorrfColortyp = function () {
    return [
        {
            display: "文字",
            value: "FONT"
        },
        {
            display: "背景",
            value: "BK"
        }
    ];
};
exports.HfdroomcolorrfProtyp = function () {
    return [
        {
            display: "排房作業",
            value: "ASI"
        },
        {
            display: "房間管理",
            value: "RM"
        },
        {
            display: "房務管理",
            value: "HK"
        }
    ];
};

/**
 * [PMS0820050_櫃檯備品庫存設定] 退房提醒
 * @returns {array}
 */
exports.getChkOutOption = function(){
    var lo_optionList = [
        {
            display: "是",
            value: "Y"
        },
        {
            display: "否",
            value: "N"
        }
    ];
    return lo_optionList;
};

/**
 * [PMS0820050_櫃檯備品庫存設定] 顯示狀態
 * @returns {[array]}
 */
exports.getVisiableOption = function(){
    var lo_optionList = [
        {
            display: "顯示",
            value: "Y"
        },
        {
            display: "不顯示",
            value: "N"
        },
        {
            display: "全部",
            value: "all"
        }
    ];
    return lo_optionList;
};

/**
 * PMS0810050 交通接駁設定
 * @return {[*,*]}
 */
exports.getHfdarriverfday  = function(){
    var la_optionList= [
        {
            on: 'Y',
            off: 'N'
        }, {
            Y: '<input type="checkbox" checked>',
            N: '<input type="checkbox" >'
        }
    ];
    return la_optionList;
};

//TODO 將搬到 [程式編碼]Rule裡

/**
 * PMS0820030
 * @param params
 * @param callback
 */
exports.getHfdroomcolorrfColortyp = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.roomcolorrfColortyp();
    callback(null, lo_result);
};

/**
 * PMS0820030
 * @param params
 * @param callback
 */
exports.getHfdroomcolorrfProtyp = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.HfdroomcolorrfProtyp();
    callback(null, lo_result);
};
/**
 * 取得房型全部上傳狀態
 * @param params
 * @param callback
 */
exports.getRvrmUploadStaList = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UploadStaList();
    callback(null, lo_result);
};

/**
 * 取得住客類別群組對照檔使用與未使用
 */
exports.getGuestgrprfUseStaList = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UseStaList();
    callback(null, lo_result);
};

/**
 * 取得訂房卡來員群組設定對照檔使用與未使用(與住客類別群組對照檔一樣)
 */
exports.getSourcegrprfUseStaList = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UseStaList();
    callback(null, lo_result);
};

/**
 * 取得住客類別設定是否留下客戶歷史資料
 */
exports.qry_guest_rf_history_sta = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.HistoryStaList();
    callback(null, lo_result);
};

/**
 * 取得住客類別設定有哪些客群
 */
exports.qry_guest_rf_guest_way = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.GuestWayList();
    callback(null, lo_result);
};

/**
 * 取得住客類別設定使用還未使用
 */
exports.qry_guest_rf_use_sta = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UseStaList();
    callback(null, lo_result);
};

/**
 * 取得住客類別設定列印或不列印
 */
exports.qry_guest_rf_rcard_prtrent = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.PrintRcardList();
    callback(null, lo_result);
};

/**
 * PMS0810110取得是否使用
 */
exports.qry_source_rf_use_sta = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UseStaList();
    callback(null, lo_result);
};

/**
 * FOC設定(PMS0810140)取得下拉選項
 */
exports.qry_foc_rf_role_sta_list = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getFocRfRoleStaList();
    callback(null, lo_result);
};

/**
 * 交辦事項設定(PMS0810200)取得下拉選項
 */
exports.qry_hfd_todo_list_rf_Is_default = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UseStaList();
    callback(null, lo_result);
};

/**
 * 訂房取消原因設定
 */
exports.getRvcancelrfFlag1sta = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UseRvancelRfFlagStaList();
    callback(null, lo_result);
};

/**
 * 住客帳調整原因bincome
 */
exports.qry_hc_adjrmk_rf_bincome_sta = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.checkStaList();
    callback(null, lo_result);
};

/**
 * 合約狀態設定
 */
exports.qry_contract_status_rf_default_sta = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.checkStaIsDefaultList();
    callback(null, lo_result);
};

/**
 * 住客帳調整原因cancel
 */
exports.qry_hc_adjrmk_rf_cancel_sta = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.checkStaList();
    callback(null, lo_result);
};

/**
 * PMS0830110平展作業區設定是否啟用
 */
exports.qry_a6hfd_areapnt_rf_areapnt_sta = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.checkStaList();
    callback(null, lo_result);
};

/**
 * 聯絡設定取得聯絡類別
 */
exports.qry_contact_rf_contact_typ = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getContactContractTypList();
    callback(null, lo_result);
};

/**
 * 地址設定取得地址類別
 */
exports.qry_address_rf_contact_typ = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getAddressContractTypList();
    callback(null, lo_result);
};

/**
 * 聯絡設定取得是否可刪除
 */
exports.qry_contact_rf_delete_flag = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getDeleteFlagList();
    callback(null, lo_result);
};

/**
 * 地址設定取得是否可刪除
 */
exports.qry_address_rf_delete_flag = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getDeleteFlagList();
    callback(null, lo_result);
};

/**
 * 地址設定取得商務公司使用
 */
exports.qry_address_rf_cust_use = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getIsCanUse();
    callback(null, lo_result);
};

/**
 * 地址設定取得住客歷史使用
 */
exports.qry_address_rf_ghist_use = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getIsCanUse();
    callback(null, lo_result);
};

/**
 * 房間特色設定(PMS0820010)取得系統預設下拉選項
 */
exports.qryCharacterrfSysdefault = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getCharacterrfSysdefaultList();
    callback(null, lo_result);
};

/**
 * 訂房類別設定(PMS0810150)取得是否使用下拉選項
 */
exports.qryGuarenteerfUsesta = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UseStaList();
    callback(null, lo_result);
};

/**
 * 訂房類別設定(PMS0810150)取得是否需要訂金
 */
exports.qryGuarenteerfDpreq = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getIsNeed();
    callback(null, lo_result);
};

/**
 * PMS0810190
 * @param params
 */
exports.chkHfdorderconfirmrfContent = function (params, callback) {
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getOrderConfirmRf();
    callback(null, lo_result);
};

/**
 * [PMS0820050_櫃檯備品庫存設定] 退房提醒
 * @param params
 */
exports.qryHfdusedtConotice = function(params, callback){
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getChkOutOption();
    callback(null, lo_result);
};

/**
 * [PMS0820050_櫃檯備品庫存設定] 顯示狀態
 * @returns params
 */
exports.qryHfdusedtIsvisiable = function(params, callback){
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getVisiableOption();
    callback(null, lo_result);
};

/**
 * PMS0830090 MasterTyp
 * @param params
 */
exports.qryMasterrfMastertyp = function(params,callback){
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getMasteRrfMasterTypList();
    callback(null,lo_result);
};

/**
 * PMS0830090 MasterSta
 * @param params
 */
exports.qryMasterrfMastersta = function(params,callback){
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getMasteRrfMasterStaList();
    callback(null,lo_result);
};

/**
 * PMS0840030 是否打勾可修改金額
 * @param params
 */
exports.qryHkproductrfAmodifysta = function(params,callback){
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.checkStaIsCheckedList();
    callback(null,lo_result);
};

/**
 * PMS0840030 是否打勾要服務費
 * @param params
 */
exports.qryHkproductrfServicesta = function(params,callback){
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.checkStaIsCheckedList();
    callback(null,lo_result);
};

/**
 * PMS0840030 是否要扣庫存
 * @param params
 */
exports.qryHkproductrfInvsta = function(params,callback){
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getIsCanUse();
    callback(null,lo_result);
};

/**
 * PMS0840030 是否要使用狀態
 * @param params
 */
exports.qryHkproductrfUsesta = function(params,callback){
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getIsCanUseStaList();
    callback(null,lo_result);
};

exports.qryCashierrfUsesta = function (params, callback){
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getCashierrfUseSta();
    callback(null, lo_result);
};

/**
 * PMS0810050
 * @param params
 */
exports.qryHfdarriverfday = function(params,callback){
    var lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getHfdarriverfday();
    callback(null,lo_result);
};