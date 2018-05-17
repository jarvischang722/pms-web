const _ = require("underscore");
const moment = require("moment");
const queryAgent = require("../plugins/kplug-oracle/QueryAgent");
const commonRule = require("../ruleEngine/rules/CommonRule");
const langSvc = require("../services/LangService");
const dbSvc = require("../services/DbTableService");
const tools = require("../utils/CommonTools");
const sysConf = require("../configs/systemConfig");

/**
 * 取得報表
 * @param req
 */
exports.handleReports = (req, callback) => {
    let lo_params = {
        "REVE-CODE": req.body.prg_id,
        "program_id": req.body.prg_id,
        "athena_id": req.session.athena_id,
        "hotel_cod": req.session.user.hotel_cod,
        "user": req.session.user.usr_id,
        "locale": req.cookies.locale,
        "func_id": "0100",
        "conditions": req.body.conditions || [],
        "event_time": moment().format()

    };
    tools.requestApi(sysConf.api_url.common, lo_params, (apiErr, apiRes, res) => {
        let ls_errorMsg = null;
        let ls_pdfUrl = "";

        if (apiErr) {
            ls_errorMsg = apiErr.message;
        }
        else if (res["RETN-CODE"] != "0000") {
            ls_errorMsg = res["RETN-CODE-DESC"];
        }
        else {
            ls_pdfUrl = res.pdfUrl;
        }
        callback(ls_errorMsg, ls_pdfUrl);
    });
};