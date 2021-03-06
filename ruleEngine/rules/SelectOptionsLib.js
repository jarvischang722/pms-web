/**
 * Created by Jun on 2017/4/24.
 * 下拉選單內容
 */
let i18n = require("i18n");
let optionsLib = this;
let ReturnClass = require("../returnClass");

//region //selectOption Lib
/**
 * 上傳狀態選單
 * @returns {Array}
 */
exports.UploadStaList = function () {

    let uploadOptions = [
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

    let uploadOptions = [
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

    let uploadOptions = [
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

    let historySta = [
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
    let guestWay = [
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
    let Rcard = [
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
    let roleStaList = [
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
    let contractTypList = [
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
    let contractTypList = [
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
    let contractTypList = [
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
    let contractTypList = [
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
    let contractTypList = [
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
    let deleteFlagList = [
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
    let useList = [
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
    let useList = [
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
 * 取得欄位keep_way 下拉資料
 */
exports.getGuarenteerfKeepway = function () {
    let keepWayList = [
        {
            display: '依新增日',
            value: 'OR'
        },
        {
            display: '依CI日期',
            value: 'CI'
        }
    ];

    return keepWayList;
};

/**
 * checkbox是否使用
 * @returns
 */
exports.checkStaList = function () {
    let checkList = [{
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
    let checkList = [{
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
    let checkList = [{
        on: 'Y',
        off: 'N'
    }, {
        Y: '打勾',
        N: '不打勾'
    }];

    return checkList;
};

/**
 * [PMS0830010_出納員設定] 啟用狀態checkbox
 * @returns {[array]}
 */
exports.getCashierrfUseSta = function () {
    let lo_optionList = [
        {
            on: 'Y',
            off: 'N'
        }, {
            Y: '啟用',
            N: '不啟用'
        }
    ];
    return lo_optionList;
};

/**
 * [PMS0210010_住客歷史]
 * status_cod 下拉資料
 */
exports.getStatuscod = function () {
    let lo_optionList = [
        {
            display: "VIP",
            value: "V"
        },
        {
            display: "一般",
            value: "N"
        },
        {
            display: "黑名單",
            value: "B"
        }
    ];
    return lo_optionList;
};

/**
 * [PMS0210010_住客歷史]
 * dmFlag 下拉資料
 */
exports.getGhistMnDmFlag = function () {
    let dmFlagList = [
        {
            display: '是',
            value: 'Y'
        },
        {
            display: '否',
            value: 'N'
        }
    ];

    return dmFlagList;
};

/**
 * [PMS0210010_住客歷史]
 * 生日月分 下拉資料
 */
exports.getCustIdxBirthDat = function () {
    let lo_optionList = [
        {
            display: "01",
            value: "01"
        },
        {
            display: "02",
            value: "02"
        },
        {
            display: "03",
            value: "03"
        },
        {
            display: "04",
            value: "04"
        },
        {
            display: "05",
            value: "05"
        },
        {
            display: "06",
            value: "06"
        },
        {
            display: "07",
            value: "07"
        },
        {
            display: "08",
            value: "08"
        },
        {
            display: "09",
            value: "09"
        },
        {
            display: "10",
            value: "10"
        },
        {
            display: "11",
            value: "11"
        },
        {
            display: "12",
            value: "12"
        }
    ];
    return lo_optionList;
};

/**
 * [PMS0210060_C/I清單]
 * 入住狀態 下拉資料
 * @returns {*[]}
 */
exports.getStatus = function () {
    let lo_optionList = [
        {
            display: "未入住",
            value: "N"
        },
        {
            display: "已入住",
            value: "Y"
        }
    ];
    return lo_optionList;
};

/**
 * [PMS0210060_C/I清單]
 * 入住狀態 下拉資料
 */
exports.getGuestmnGuest_sta = function () {
    let lo_optionList = [
        {
            display: "未入住",
            value: "E"
        },
        {
            display: "關帳",
            value: "K"
        },
        {
            display: "開帳",
            value: "O"
        },
        {
            display: "結帳",
            value: "C"
        }
    ];
    return lo_optionList;
};

/**
 *清掃狀態 下拉資料
 */
exports.get_RoommnClean_sta = function () {
    let lo_optionList = [
        {
            display: "Clean",
            value: "C"
        },
        {
            display: "Dirty",
            value: "D"
        }
    ];
    return lo_optionList;
};

exports.getVIPSta = function () {
    let lo_optionList = [
        {
            display: "0",
            value: "0"
        },
        {
            display: "1",
            value: "1"
        },
        {
            display: "2",
            value: "2"
        },
        {
            display: "3",
            value: "3"
        },
        {
            display: "4",
            value: "4"
        },
        {
            display: "5",
            value: "5"
        },
        {
            display: "6",
            value: "6"
        },
        {
            display: "7",
            value: "7"
        },
        {
            display: "8",
            value: "8"
        },
        {
            display: "9",
            value: "9"
        },
        {
            display: "10",
            value: "10"
        },
        {
            display: "11",
            value: "11"
        },
        {
            display: "12",
            value: "12"
        },
        {
            display: "13",
            value: "13"
        },
        {
            display: "14",
            value: "14"
        },
        {
            display: "15",
            value: "15"
        },
        {
            display: "16",
            value: "16"
        },
        {
            display: "17",
            value: "17"
        },
        {
            display: "18",
            value: "18"
        },
        {
            display: "19",
            value: "19"
        },
        {
            display: "20",
            value: "20"
        }
    ];
    return lo_optionList;
};

/**
 * [PMS0610010_商務公司]
 * credit_sta 下拉資料
 */
exports.getCreditSta = function () {
    let lo_optionList = [
        {
            display: "可簽帳",
            value: "Y"
        },
        {
            display: "不可簽帳",
            value: "N"
        }
    ];
    return lo_optionList;
};

/**
 * [PMS0610010_商務公司] 業務員指派(修改業務員PMS0620030) 是否更新未來房卡
 */
exports.getUpdateOrderMn = function () {
    let lo_optionList = [
        {
            on: 'Y',
            off: 'N'
        }, {
            Y: '是',
            N: '否'
        }
    ];
    return lo_optionList;
};

/**
 * [PMS0610020_商務公司資料編輯] 是否可簽帳
 */
exports.getCustMnCreditSta = function () {
    let lo_optionList = [
        {
            on: 'Y',
            off: 'N'
        }, {
            Y: '是',
            N: '否'
        }
    ];
    return lo_optionList;
};

/**
 * [PMS0610020_商務公司資料編輯] 取得公司類別下拉資料
 */
exports.getCustMnRankNos = function () {
    let rankNosList = [
        {
            display: '0',
            value: '0'
        },
        {
            display: '1',
            value: '1'
        },
        {
            display: '2',
            value: '2'
        },
        {
            display: '3',
            value: '3'
        },
        {
            display: '4',
            value: '4'
        },
        {
            display: '5',
            value: '5'
        },
        {
            display: '6',
            value: '6'
        },
        {
            display: '7',
            value: '7'
        },
        {
            display: '8',
            value: '8'
        },
        {
            display: '9',
            value: '9'
        }
    ];

    return rankNosList;
};


/**
 * [PMS0610020_商務公司資料編輯] 取得公司類別下拉資料
 */
exports.getCustMnRelatCod = function () {
    let relatCodList = [
        {
            display: '關係',
            value: '1'
        },
        {
            display: '非關係',
            value: '2'
        }
    ];

    return relatCodList;
};

/**
 * [PMS0610020_商務公司資料編輯] 取得欄位收取DM閜拉資料
 */
exports.getCustMnCreditStaDmFlag = function () {
    let relatCodList = [
        {
            display: '是',
            value: 'Y'
        },
        {
            display: '否',
            value: 'N'
        }
    ];

    return relatCodList;
};

/**
 * [PMS0610020_商務公司資料編輯] 相關人員 欄位狀態下拉資料
 */
exports.getCustmnPersdtJobSta = function () {
    let jobStaList = [
        {
            display: '在職',
            value: 'N'
        },
        {
            display: '離職',
            value: 'Q'
        }
    ];

    return jobStaList;
};

/**
 * [PMS0610020_商務公司資料編輯] 相關人員 欄位性別下拉資料
 */
exports.getCustIdxSexTyp = function () {
    let sexList = [
        {
            display: '男',
            value: 'M'
        },
        {
            display: '女',
            value: 'F'
        }
    ];

    return sexList;
};


/**
 * [PMS0620020_業務員資料編輯] 是否飯店、餐飲、會員業務
 */
exports.getSalesChkeckedList = function () {
    let lo_optionList = [
        {
            on: 'Y',
            off: 'N'
        }, {
            Y: '是',
            N: '否'
        }
    ];
    return lo_optionList;
};

/**
 * [PMS0830010_出納員設定] 啟用狀態select
 * @returns {[array]}
 */
exports.getCashierrfUsestaSelect = function () {
    let lo_optionList = [
        {
            display: "啟用",
            value: "Y"
        },
        {
            display: "不啟用",
            value: "N"
        }
    ];
    return lo_optionList;
};

/**
 * [PMS0810240_房價分類設訂] 是否使用下拉
 * @returns {*[]}
 */
exports.getRateGrpRfUseSta = function () {
    let lo_optionList = [
        {
            display: "使用中",
            value: "Y"
        },
        {
            display: "不使用",
            value: "N"
        }
    ];
    return lo_optionList;
};


/**
 * [PMS0820010_房間特色設定] 系統預設
 * @returns {array}
 */
exports.getCharacterrfSysdefaultList = function () {
    let lo_SysdefaultList = [
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
 * checkbox是否使用(PMS0860070)
 * @returns
 */

/**
 * PS0110041 訂房卡單筆
 * 欄位 order_dt.is_prtrent 下拉資料
 * @param params
 * @param callback
 */
exports.getIsPrtrent = function () {
    let checkList = [{
        on: 'Y',
        off: 'N'
    }, {
        Y: '預設',
        N: '非預設'
    }];

    return checkList;
};

/**
 * PS0110041 訂房卡單筆
 * 欄位 fixed_order (fixed_order) 下拉資料
 * @param params
 * @param callback
 */
exports.get_OrdermnMastersta = function () {

    let useList = [
        {
            display: '是',
            value: 'Y'
        },
        {
            display: '否',
            value: 'N'
        },
        {
            display: 'C/I',
            value: 'I'
        }
    ];

    return useList;
};
/**
 * PS0110041 訂房卡單筆
 * 欄位 atten_by (From) 下拉資料
 * @param params
 * @param callback
 */
exports.get_OrdermnAttenby = function () {

    let useList = [
        {
            display: '訂房公司',
            value: 'C'
        },
        {
            display: '住客',
            value: 'P'
        }
    ];

    return useList;
};

/**
 * PS0110041 訂房卡單筆
 * 欄位 fixed_order (fixed_order) 下拉資料
 * @param params
 * @param callback
 */
exports.get_OrdermnFixedorder = function () {

    let useList = [
        {
            display: 'FIXED',
            value: 'Y'
        },
        {
            display: 'NO FIXED',
            value: 'N'
        }
    ];

    return useList;
};

/**
 * PS0110041 訂房卡單筆
 * 欄位 prtconfirm_sta (旅客登記卡印房租) 下拉資料
 * @param params
 * @param callback
 */
exports.get_OrdermnPrtconfirmsta = function () {

    let useList = [
        {
            display: '已列印',
            value: 'Y'
        },
        {
            display: '未印',
            value: 'N'
        }
    ];
    return useList;
};

exports.getMastertyp = function () {
    let useList = [
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
    return useList;
};

/**
 * PS0110041 訂房卡單筆
 * 欄位 master_sta (公帳狀態) 下拉資料
 * @param params
 * @param callback
 */
exports.getMastersta = function () {
    let useList = [
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
        },
        {
            display: '指定中',
            value: 'T'
        }
    ];
    return useList;
};


//房間狀況
exports.roomMnRoomSta = function () {
    return [
        {
            display: "空房",
            value: "V"
        },
        {
            display: "住人",
            value: "O"
        },
        {
            display: "修理",
            value: "R"
        },
        {
            display: "參觀",
            value: "S"
        }
    ];
};

//排房狀況
exports.roomMnAssignSta = function () {
    return [
        {
            display: "有排房",
            value: "Y"
        },
        {
            display: "無排房",
            value: "N"
        }
    ];
};

//清掃狀況
exports.roomMnCleanSta = function () {
    return [
        {
            display: "乾淨",
            value: "C"
        },
        {
            display: "髒",
            value: "D"
        }
    ];
};

//清掃狀況
exports.roomMnBedSta = function () {
    return [
        {
            display: "無設定",
            value: "N"
        },
        {
            display: "拆床",
            value: "S"
        },
        {
            display: "併床",
            value: "M"
        }
    ];
};

/**
 * [PMS0820050_櫃檯備品庫存設定] 退房提醒
 * @returns {array}
 */
exports.getChkOutOption = function () {
    let lo_optionList = [
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
 * [PMS0820050_櫃檯備品庫存設定] 系統預設顯示
 * @returns {array}
 */
exports.getHfdusedtSysdefault = function () {
    let lo_optionList = [
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
exports.getVisiableOption = function () {
    let lo_optionList = [
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
exports.getHfdarriverfday = function () {
    let la_optionList = [
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

/**
 * PMS0810230 設定類別下拉資料
 * @returns {[null,null,null]}
 */
exports.getRateProp = function () {
    let la_optionList = [
        {
            display: "一般",
            value: "GR"
        },
        {
            display: "HOUSE USE",
            value: "HU"
        },
        {
            display: "COMPLIMENT",
            value: "CMP"
        }

    ];
    return la_optionList;
};

/**
 * PMS0810230 屬性下拉資料
 * @returns {[null,null,null]}
 */
exports.getBaserateFlag = function () {
    let la_optionList = [
        {
            display: "INDEPEND",
            value: "ID"
        },
        {
            display: " BASE",
            value: "BS"
        },
        {
            display: "DEPEND",
            value: "DP"
        }

    ];
    return la_optionList;
};

/**
 * PMS0810230 使用期間 取得計算方式下拉資料
 *  @returns {[null,null,null]}
 */
exports.getCommandCod = function () {
    let la_optionList = [
        {
            display: "依日",
            value: "D"
        },
        {
            display: "依星期",
            value: "W"
        },
        {
            display: "依假日對照檔設定",
            value: "H"
        }

    ];
    return la_optionList;
};

/**
 * PMS0830110 平板作業區域設定
 * 搜尋AreapntSta下拉資料
 * @returns {[*,*]}
 */
exports.searchAreapntSta = function () {
    let la_optionList = [
        {
            display: "使用",
            value: "Y"
        },
        {
            display: "非使用",
            value: "N"
        }
    ];
    return la_optionList;
};

/**
 * RS0W212010 定席作業
 * order_sta下拉資料
 * @returns {[*,*]}
 */
exports.order_sta = function () {
    let la_optionList = [
        {
            display: "預約",
            value: "N"
        },
        {
            display: "等待",
            value: "W"
        },
        {
            display: "詢價",
            value: "Q"
        },
        {
            display: "取消",
            value: "X"
        }
    ];
    return la_optionList;
};

/**
 * RS0W212010 定席作業
 * is_allplace checkbox
 * @returns {[*,*]}
 */
exports.is_allplace = function () {
    let lo_optionList = [
        {
            on: 'Y',
            off: 'N'
        }, {
            Y: '是',
            N: '否'
        }
    ];
    return lo_optionList;
};

/**
 * PMS0620010 業務員作業
 * 欄位 status下拉資料
 * @returns {[*,*]}
 */
exports.getSalesStatus = function () {
    let la_optionList = [
        {
            display: "在職",
            value: "N"
        },
        {
            display: "離職",
            value: "Q"

        }
    ];
    return la_optionList;
};

/**
 * PMS0610020 商務公司資料編輯 相關人員 主要聯絡人是否打勾
 * @returns {array}
 */
exports.getCustMnPersPrmaryPers = function () {
    let la_optionList = [
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

/**
 * PMS0620020 業務員資料編輯
 * 館別 欄位 status下拉資料
 * @returns {[null,null]}
 */
exports.getSalesHotelDtStatus = function () {
    let la_optionList = [
        {
            display: "正常",
            value: "N"
        },
        {
            display: "停用",
            value: "X"

        }
    ];
    return la_optionList;
};

/**
 * PMS0620050 業務員拜訪記錄
 * cust mn status 下拉資料
 * @returns {[null,null]}
 */
exports.getCustMnStatusCod = function () {
    let la_optionList = [
        {
            display: "正常",
            value: "N"
        },
        {
            display: "刪除",
            value: "D"

        },
        {
            display: "黑名單",
            value: "B"

        },
        {
            display: "潛力",
            value: "P"

        }
    ];
    return la_optionList;
};

/**
 * PMS0620050 業務員拜訪記錄
 * ps visit dt visit status 下拉資料
 * @returns {[null,null]}
 */
exports.getPsVisitDtVisitSta = function () {
    let la_optionList = [
        {
            display: "預計拜訪",
            value: "N"
        },
        {
            display: "已經拜訪",
            value: "Y"

        }
    ];
    return la_optionList;
};

/**
 * [PMS0110040訂房卡多筆] 搜尋狀態下拉
 */
exports.qryLangOrderDtOrderSta = function () {
    let lo_optionList = [
        {
            display: "正常",
            value: "N"
        },
        {
            display: "取消",
            value: "D"
        },
        {
            display: "等待",
            value: "W"
        },
        {
            display: "已到",
            value: "O"
        },
        {
            display: "NO-SHOW",
            value: "S"
        },
        {
            display: "今日到達",
            value: "I"
        },
        {
            display: "詢價",
            value: "T"
        }
    ];
    return lo_optionList;
};

/**
 * [PMS0110040訂房卡多筆] 搜尋種類下拉
 */
exports.qryGuestRfGuestWay = function () {
    let lo_optionList = [
        {
            display: "散客",
            value: "F"
        },
        {
            display: "團體",
            value: "G"
        },
        {
            display: "商務",
            value: "C"
        }
    ];
    return lo_optionList;
};

exports.qryLangMasterRfMasterSta = function () {
    let lo_optionList = [
        {
            display: "使用中",
            value: "Y"
        },
        {
            display: "未使用",
            value: "N"
        },
        {
            display: "暫停使用",
            value: "P"
        }
    ];
    return lo_optionList;
};

exports.OrderSta = () => {
    let lo_optionList = [
        {
            display: "正常",
            value: "N"
        },
        {
            display: "取消",
            value: "D"
        },
        {
            display: "等待",
            value: "W"
        },
        {
            display: "已到",
            value: "O"
        },
        {
            display: "NO-SHOW",
            value: "S"
        },
        {
            display: "暫定",
            value: "T"
        }
        ,
        {
            display: "今日到達",
            value: "I"
        }
    ];
    return lo_optionList;
};

exports.qryLangStatus = () => {
    let lo_optionList = [
        {
            display: "排房",
            value: "Y"
        },
        {
            display: "未排房",
            value: "N"
        },
        {
            display: "全部",
            value: ""
        }
    ];
    return lo_optionList;
};

/**
 * [PMS0210030 排房作業] 房間狀況
 * @returns {*[]}
 */
exports.qryLangRoommnRoomsta = () => {
    let lo_optionList = [
        {
            display: "空房",
            value: "V"
        },
        {
            display: "住人",
            value: "O"
        },
        {
            display: "修理",
            value: "R"
        },
        {
            display: "參觀",
            value: "S"
        }
    ];
    return lo_optionList;
};

/**
 * [PMS0210030 排房作業] 清掃狀態
 * @returns {*[]}
 */
exports.qryLangRoommnCleansta = () => {
    let lo_optionList = [
        {
            display: "Clean",
            value: "C"
        },
        {
            display: "Dirty",
            value: "D"
        }
    ];
    return lo_optionList;
};

/**
 * [PMS0210030 排房作業] 排房狀態
 * @returns {*[]}
 */
exports.qryLangOrderdtAssignsta = () => {
    let lo_optionList = [
        {
            display: "已排房",
            value: "Y"
        },
        {
            display: "未排房",
            value: "N"
        },
        {
            display: "已入住",
            value: "I"
        }
    ];
    return lo_optionList;
};

//endregion

//TODO 將搬到 [程式編碼]Rule裡

//region selectData function
/**
 * PMS0820030
 * @param params
 * @param callback
 */
exports.getHfdroomcolorrfColortyp = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.roomcolorrfColortyp();
    callback(null, lo_result);
};

/**
 * PMS0820030
 * @param params
 * @param callback
 */
exports.getHfdroomcolorrfProtyp = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.HfdroomcolorrfProtyp();
    callback(null, lo_result);
};
/**
 * 取得房型全部上傳狀態
 * @param params
 * @param callback
 */
exports.getRvrmUploadStaList = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UploadStaList();
    callback(null, lo_result);
};

/**
 * 取得住客類別群組對照檔使用與未使用
 */
exports.getGuestgrprfUseStaList = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UseStaList();
    callback(null, lo_result);
};

/**
 * 取得訂房卡來員群組設定對照檔使用與未使用(與住客類別群組對照檔一樣)
 */
exports.getSourcegrprfUseStaList = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UseStaList();
    callback(null, lo_result);
};

/**
 * 取得住客類別設定是否留下客戶歷史資料
 */
exports.qry_guest_rf_history_sta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.HistoryStaList();
    callback(null, lo_result);
};

/**
 * 取得住客類別設定有哪些客群
 */
exports.qry_guest_rf_guest_way = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.GuestWayList();
    callback(null, lo_result);
};

/**
 * 取得住客類別設定使用還未使用
 */
exports.qry_guest_rf_use_sta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UseStaList();
    callback(null, lo_result);
};

/**
 * 取得住客類別設定列印或不列印
 */
exports.qry_guest_rf_rcard_prtrent = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.PrintRcardList();
    callback(null, lo_result);
};

/**
 * PMS0810110取得是否使用
 */
exports.qry_source_rf_use_sta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UseStaList();
    callback(null, lo_result);
};

/**
 * PMS0810120取得是否可升等、改房價
 */
exports.qry_rvdiscpers_rf_y_n = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getIsCanUse();
    callback(null, lo_result);
};

/**
 * FOC設定(PMS0810140)取得下拉選項
 */
exports.qry_foc_rf_role_sta_list = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getFocRfRoleStaList();
    callback(null, lo_result);
};

/**
 * 交辦事項設定(PMS0810200)取得下拉選項
 */
exports.qry_hfd_todo_list_rf_Is_default = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UseStaList();
    callback(null, lo_result);
};

/**
 * 訂房取消原因設定
 */
exports.getRvcancelrfFlag1sta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UseRvancelRfFlagStaList();
    callback(null, lo_result);
};

/**
 * 住客帳調整原因bincome
 */
exports.qry_hc_adjrmk_rf_bincome_sta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.checkStaList();
    callback(null, lo_result);
};

/**
 * 合約狀態設定
 */
exports.qry_contract_status_rf_default_sta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.checkStaIsDefaultList();
    callback(null, lo_result);
};

/**
 * 住客帳調整原因cancel
 */
exports.qry_hc_adjrmk_rf_cancel_sta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.checkStaList();
    callback(null, lo_result);
};

/**
 * PMS0830110平展作業區設定是否啟用
 */
exports.qry_a6hfd_areapnt_rf_areapnt_sta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.checkStaList();
    callback(null, lo_result);
};

/**
 * 聯絡設定取得聯絡類別
 */
exports.qry_contact_rf_contact_typ = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getContactContractTypList();
    callback(null, lo_result);
};

/**
 * 地址設定取得地址類別
 */
exports.qry_address_rf_contact_typ = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getAddressContractTypList();
    callback(null, lo_result);
};

/**
 * 聯絡設定取得是否可刪除
 */
exports.qry_contact_rf_delete_flag = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getDeleteFlagList();
    callback(null, lo_result);
};

/**
 * 地址設定取得是否可刪除
 */
exports.qry_address_rf_delete_flag = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getDeleteFlagList();
    callback(null, lo_result);
};

/**
 * 地址設定取得商務公司使用
 */
exports.qry_address_rf_cust_use = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getIsCanUse();
    callback(null, lo_result);
};

/**
 * 地址設定取得住客歷史使用
 */
exports.qry_address_rf_ghist_use = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getIsCanUse();
    callback(null, lo_result);
};

/**
 * PS0110041 訂房卡單筆
 * 欄位 confirm_sta (確認狀態) 下拉資料
 * @param params
 * @param callback
 */
exports.lang_YN = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getIsCanUse();
    callback(null, lo_result);
};

/**
 * PS0110041 訂房卡單筆
 * 欄位 atten_by (From) 下拉資料
 * @param params
 * @param callback
 */
exports.lang_OrdermnAttenby = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.get_OrdermnAttenby();
    callback(null, lo_result);
};

/**
 * PS0110041 訂房卡單筆
 * 欄位 fixed_order (fixed_order) 下拉資料
 * @param params
 * @param callback
 */
exports.lang_OrdermnFixedorder = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.get_OrdermnFixedorder();
    callback(null, lo_result);
};

/**
 * PS0110041 訂房卡單筆
 * 欄位 fixed_order (fixed_order) 下拉資料
 * @param params
 * @param callback
 */
exports.lang_OrdermnMastersta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.get_OrdermnMastersta();
    callback(null, lo_result);
};

/**
 * PS0110041 訂房卡單筆
 * 欄位 order_sta (狀態) 下拉資料
 * @param params
 * @param callback
 */
exports.langOrderdtOrdersta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.qryLangOrderDtOrderSta();
    callback(null, lo_result);
};

/**
 * PS0110041 訂房卡單筆
 * 欄位 prtconfirm_sta (旅客登記卡印房租) 下拉資料
 * @param params
 * @param callback
 */
exports.lang_OrdermnPrtconfirmsta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.get_OrdermnPrtconfirmsta();
    callback(null, lo_result);
};

/**
 * PS0110041 訂房卡單筆
 * 欄位 master_sta (公帳狀態) 下拉資料
 * @param params
 * @param callback
 */
exports.langMastersta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getMastersta();
    callback(null, lo_result);
};

/**
 * PS0110041 訂房卡單筆
 * 欄位 master_typ 下拉資料
 * @param params
 * @param callback
 */
exports.langMastertyp = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getMastertyp();
    callback(null, lo_result);
};

/**
 * PS0110041 訂房卡單筆
 * 欄位 order_dt.is_prtrent 下拉資料
 * @param params
 * @param callback
 */
exports.isPrtrent = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getIsPrtrent();
    callback(null, lo_result);
};


/**
 * 住客歷史(PMS0210010) 取得狀況下拉資料
 */
exports.lang_GhistMnStatuscod = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getStatuscod();
    callback(null, lo_result);
};

/**
 * 住客歷史(PMS0210010) 取得下拉資料
 */
exports.lang_GhistMnDmFlag = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getGhistMnDmFlag();
    callback(null, lo_result);
};

/**
 * 住客歷史(PMS0210010) 取得狀況下拉資料
 */
exports.lang_CustIdxBirthDat = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getCustIdxBirthDat();
    callback(null, lo_result);
};

/**
 * 住客歷史(PMS0210011) 取得VIP狀況下拉資料
 */
exports.lang_vip_sta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getVIPSta();
    callback(null, lo_result);
};

/**
 * 取得入住狀態下拉資料
 * @param params
 * @param callback
 */
exports.langStatus = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getStatus();
    callback(null, lo_result);
};

/**
 *  取得 guest mn 狀態下拉資料
 * @param params
 * @param callback
 */
exports.langGuestmnGuest_sta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getGuestmnGuest_sta();
    callback(null, lo_result);
};

/**
 *  取得 room_mn  清掃狀態下拉資料
 * @param params
 * @param callback
 */
exports.lang_RoommnClean_sta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.get_RoommnClean_sta();
    callback(null, lo_result);
};

/**
 * 商務公司(PMS0610010) 取得是否可簽帳
 */
exports.lang_CustidxCreditsta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getCreditSta();
    callback(null, lo_result);
};

/**
 * 商務公司(PMS0610010) 取得業務員指派(修改業務員PMS0620030)中是否更新未來房卡
 */
exports.lang_UpdateOrderMn = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getUpdateOrderMn();
    callback(null, lo_result);
};

/**
 * 商務公司資料編輯(PMS0610020) 取得等級下拉資料
 */
exports.lang_CustMnRankNos = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getCustMnRankNos();
    callback(null, lo_result);
};

/**
 * 商務公司資料編輯(PMS0610020) 取得公司類別下拉資料
 */
exports.lang_CustMnRelatCod = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getCustMnRelatCod();
    callback(null, lo_result);
};

exports.lang_CustMnCreditSta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getCustMnCreditSta();
    callback(null, lo_result);
};

/**
 * 商務公司資料編輯(PMS0610020) 取得欄位收取DM閜拉資料
 */
exports.lang_CustMnDmFlag = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getCustMnCreditStaDmFlag();
    callback(null, lo_result);
};

/**
 * 商務公司資料編輯(PMS0610020) 相關人員 欄位狀態下拉資料
 */
exports.lang_CustmnPersdtJobSta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getCustmnPersdtJobSta();
    callback(null, lo_result);
};

/**
 * 商務公司資料編輯(PMS0610020) 相關人員 欄位性別下拉資料
 */
exports.lang_CustIdxSexTyp = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getCustIdxSexTyp();
    callback(null, lo_result);
};

/**
 * 商務公司資料編輯(PMS0610020) 相關人員 是否為主要聯絡人
 */
exports.qry_CustMnPerPrmaryPers = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getCustMnPersPrmaryPers();
    callback(null, lo_result);
};


/**
 *
 * 業務員作業(PMS0620010)取得狀態是否在職
 */
exports.lang_status_cod = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getSalesStatus();
    callback(null, lo_result);
};

/**
 *
 * 業務員作業(PMS0620010)取得是否飯店、餐飲、會員業務
 **/
exports.lang_yn = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getIsCanUse();
    callback(null, lo_result);
};

/**
 * 業務員資料編輯(PMS0620020)取得是否飯店、餐飲、會員業務
 */
exports.lang_yn_chkBox = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getSalesChkeckedList();
    callback(null, lo_result);
};

/**
 *
 *業務員資料編輯(PMS0620020)取得狀態是否停用
 */
exports.lang_sales_hotel_dt_status_cod = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getSalesHotelDtStatus();
    callback(null, lo_result);
};

/**
 *
 *業務員拜訪記錄(PMS0620050) cust mn status 下拉資料
 */
exports.lang_CustmnStatuscod = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getCustMnStatusCod();
    callback(null, lo_result);
};

/**
 *
 *業務員拜訪記錄(PMS0620050) visit status 下拉資料
 */
exports.lang_PsvisitdtVisitsta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getPsVisitDtVisitSta();
    callback(null, lo_result);
};

/**
 * rate cod(PMS0810230)取得設定分類下拉資料
 * @param params
 * @param callback
 */
exports.lang_rate_prop = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getRateProp();
    callback(null, lo_result);
};

/**
 * rate cod(PMS0810230)取得屬性下拉資料
 * @param params
 * @param callback
 */
exports.lang_baserate_flag = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getBaserateFlag();
    callback(null, lo_result);
};

/**
 * rate cod(PMS0810230) 使用期間 取得計算方式下拉資料
 * @param params
 * @param callback
 */
exports.lang_command_cod = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getCommandCod();
    callback(null, lo_result);
};

/**
 * 房間特色設定(PMS0820010)取得系統預設下拉選項
 */
exports.qryCharacterrfSysdefault = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getCharacterrfSysdefaultList();
    callback(null, lo_result);
};

/**
 * 訂房類別設定(PMS0810150)取得是否使用下拉選項
 */
exports.qryGuarenteerfUsesta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.UseStaList();
    callback(null, lo_result);
};

/**
 * 訂房類別設定(PMS0810150)取得是否需要訂金
 */
exports.qryGuarenteerfDpreq = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getIsNeed();
    callback(null, lo_result);
};

/**
 * 訂房類別設定(PMS0810150)取得欄位 keep_way下拉資料
 */
exports.qryGuarenteerfKeepway = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getGuarenteerfKeepway();
    callback(null, lo_result);
};

/**
 * PMS0810190
 * @param params
 */
exports.chkHfdorderconfirmrfContent = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getOrderConfirmRf();
    callback(null, lo_result);
};


/**
 * [PMS0820050_櫃檯備品庫存設定] 退房提醒
 * @param params
 */
exports.qryHfdusedtConotice = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getChkOutOption();
    callback(null, lo_result);
};

/**
 * [PMS0820050_櫃檯備品庫存設定] 系統預設顯示
 * @param params
 */
exports.qryHfdusedtSysdefault = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getHfdusedtSysdefault();
    callback(null, lo_result);
};


/**
 * [PMS0820050_櫃檯備品庫存設定] 顯示狀態
 * @returns params
 */
exports.qryHfdusedtIsvisiable = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getVisiableOption();
    callback(null, lo_result);
};

/**
 * PMS0830090 MasterTyp
 * @param params
 */
exports.qryMasterrfMastertyp = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getMasteRrfMasterTypList();
    callback(null, lo_result);
};

/**
 * PMS0830090 MasterSta
 * @param params
 */
exports.qryMasterrfMastersta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getMasteRrfMasterStaList();
    callback(null, lo_result);
};

/**
 * PMS0840030 是否打勾可修改金額
 * @param params
 */
exports.qryHkproductrfAmodifysta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.checkStaIsCheckedList();
    callback(null, lo_result);
};

/**
 * PMS0840030 是否打勾要服務費
 * @param params
 */
exports.qryHkproductrfServicesta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.checkStaIsCheckedList();
    callback(null, lo_result);
};

/**
 * PMS0840030 是否要扣庫存
 * @param params
 */
exports.qryHkproductrfInvsta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getIsCanUse();
    callback(null, lo_result);
};

/**
 * PMS0840030 是否要使用狀態
 * @param params
 */
exports.qryHkproductrfUsesta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getIsCanUseStaList();
    callback(null, lo_result);
};

/**
 * [PMS0830010_出納員設定] 啟用狀態checkbox
 * @param params
 */
exports.qryCashierrfUsesta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getCashierrfUseSta();
    callback(null, lo_result);
};

/**
 * [PMS0830010_出納員設定] 啟用狀態select
 * @param params
 */
exports.qryCashierrfUsestaSelect = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getCashierrfUsestaSelect();
    callback(null, lo_result);
};

/**
 * PMS0810050
 * @param params
 */
exports.qryHfdarriverfday = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getHfdarriverfday();
    callback(null, lo_result);
};

/**
 * PMS0820020 房間狀況
 * @param params
 */
exports.qryRoommnRoomsta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.roomMnRoomSta();
    callback(null, lo_result);
};

/**
 * PMS0820020 排房狀況
 * @param params
 */
exports.qryRoommnAssignsta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.roomMnAssignSta();
    callback(null, lo_result);
};

/**
 * PMS0820020 清掃狀況
 * @param params
 */
exports.qryRoommnCleansta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.roomMnCleanSta();
    callback(null, lo_result);
};

/**
 * PMS0820020 清掃狀況
 * @param params
 */
exports.qryRoommnBedsta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.roomMnBedSta();
    callback(null, lo_result);
};

/**
 * PMS0830110 平板作業區域設定
 * 搜尋AreapntSta下拉資料
 * @returns {[*,*]}
 */
exports.qrySearchAreapntSta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.searchAreapntSta();
    callback(null, lo_result);
};


/**
 * RS0W212010 定席作業
 * order_sta下拉資料
 * @returns {[*,*]}
 */
exports.lang_bquet_mn_order_sta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.order_sta();
    callback(null, lo_result);
};

/**
 * RS0W212010 定席作業
 * is_allplace checkbox資料
 * @returns {[*,*]}
 */
exports.lang_bqplace_dt_isallplace = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.is_allplace();
    callback(null, lo_result);
};

/**
 * PMS0810240房價分類設定
 * @param params {object}
 * @param callback
 */
exports.langRategrpRfUseSta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.getRateGrpRfUseSta();
    callback(null, lo_result);
};

/**
 * [PMS0110040訂房卡多筆] 搜尋狀態下拉
 * @param params
 * @param callback
 */
exports.getOrderdtOrdersta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.qryLangOrderDtOrderSta();
    callback(null, lo_result);
};

/**
 * [PMS0110040訂房卡多筆] 搜尋種類下拉
 * @param params
 * @param callback
 */
exports.langGuestrfGuestway = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.qryGuestRfGuestWay();
    callback(null, lo_result);
};

exports.langMasterrfMastersta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.qryLangMasterRfMasterSta();
    callback(null, lo_result);
};

exports.qryOrderSta = function (params, callback) {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.OrderSta();
    callback(null, lo_result);
};

exports.langStatus = (params, callback) => {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.qryLangStatus();
    callback(null, lo_result);
};

/**
 * * [PMS0210030 排房作業] 房間狀況
 * @param params
 * @param callback
 */
exports.langRoommnRoomsta = (params, callback) => {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.qryLangRoommnRoomsta();
    callback(null, lo_result);
};

/**
 * * [PMS0210030 排房作業] 清掃狀態
 * @param params
 * @param callback
 */
exports.langRoommnCleansta = (params, callback) => {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.qryLangRoommnCleansta();
    callback(null, lo_result);
};

/**
 * * [PMS0210030 排房作業] 排房狀態
 * @param params
 * @param callback
 */
exports.langOrderdtAssignsta = (params, callback) => {
    let lo_result = new ReturnClass();
    lo_result.selectOptions = optionsLib.qryLangOrderdtAssignsta();
    callback(null, lo_result);
};
//endregion