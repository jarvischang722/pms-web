const _ = require("underscore");
const prgTrimLib = {
};

/**
 * 檢查此作業是否有trim method
 * @param params {object} API格式的儲存資料
 * @param session {object}
 * @returns {*}
 */
function chkRule(params, session) {
    let lo_newSaveExecDatas = {};
    if (_.isUndefined(prgTrimLib[params.prg_id])) {
        lo_newSaveExecDatas = prgTrimLib[params.prg_id](params.saveExecDatas, session);
    }
    else {
        lo_newSaveExecDatas = trimPostData(params.saveExecDatas);
    }
    return lo_newSaveExecDatas;
}

/**
 * 資料去空白
 * @param tmpCUD {Object} postData資料
 * @returns {*}
 */
function trimPostData(saveExecDatas) {
    _.each(saveExecDatas, (lo_postData, ls_tmpType) => {
        _.each(lo_postData, (ls_postData, ls_key) => {
            if (typeof ls_postData === "string") {
                saveExecDatas[ls_tmpType][ls_key] = ls_postData.trim();
            }
        });
    });
    return saveExecDatas;
}

module.exports = chkRule;