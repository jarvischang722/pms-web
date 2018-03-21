/**
 * Created by kaiyue on 2017/10/22.
 * 作業儲存轉接器
 */

let _ = require("underscore");
let async = require("async");
let moment = require("moment");
let mongoAgent = require("../../plugins/mongodb");
let commonRule = require("../../ruleEngine/rules/CommonRule");
let commonTools = require("../../utils/CommonTools");
let langSvc = require("../../services/LangService");

class saveDataAdapter {
    constructor(postData, session) {
        this.session = session;
        this.params = {
            prg_id: postData.prg_id,
            func_id: postData.func_id,
            createData: postData.tmpCUD.createData || [],
            updateData: postData.tmpCUD.updateData || [],
            deleteData: postData.tmpCUD.deleteData || [],
            oriData: postData.tmpCUD.oriData || []
        };
    }



    async formating() {

    }
}

module.exports = saveDataAdapter;