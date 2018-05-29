const prgTrimLib = {
    // PMS0210011(saveExecDatas, session) {
    //     return saveExecDatas;
    // }
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
        lo_newSaveExecDatas = params.saveExecDatas;
    }
    return lo_newSaveExecDatas;
}

module.exports = chkRule;