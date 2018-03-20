/**
 * Created by kaiyue on 2017/10/22.
 * 作業儲存轉接器
 */

let _ = require("underscore");
let async = require("async");
let moment = require("moment");
let mongoAgent = require("../plugins/mongodb");
let commonRule = require("../ruleEngine/rules/CommonRule");
let commonTools = require("../utils/CommonTools");
let langSvc = require("../services/LangService");

class saveDataAdapter {
    constructor(postData, session) {
        this.session = session;
        this.lo_params = {
            trans_cod: postData.trans_cod,
            prg_id: postData.prg_id,
            page_id: postData.page_id,
            func_id: postData.func_id,
            oriData: postData.tmpCUD.oriData || [],
            createData: postData.tmpCUD.createData || [],
            updateData: postData.tmpCUD.updateData || [],
            deleteData: postData.tmpCUD.deleteData || [],
            dtOriData: postData.tmpCUD.dt_oriData || [],
            dtCreateData: postData.tmpCUD.dt_createData || [],
            dtUpdateData: postData.tmpCUD.dt_updateData || [],
            dtDeleteData: postData.tmpCUD.dt_deleteData || [],
            saveExecDatas: {},
            exec_seq: 1
        };
    }

    set_saveExecDatas(exec_seq, saveExecDatas) {
        this.lo_params.exec_seq = exec_seq;
        this.lo_params.saveExecDatas = saveExecDatas;
    }

    async formating() {

    }
}

module.exports = saveDataAdapter;