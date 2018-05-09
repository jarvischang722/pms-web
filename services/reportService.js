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
    // lo_params = {
    //     "REVE-CODE": "PMS01R0010",
    //     "athena_id": 1,
    //     "hotel_cod": "02",
    //     "program_id": "PMS01R0010",
    //     "user": "a17017",
    //     "locale": "en",
    //     "func_id": "0100",
    //     "conditions": [
    //         {
    //             "field": "ins_dat",
    //             "operator": "gte",
    //             "values": [
    //                 "2013/1/21"
    //             ]
    //         },
    //         {
    //             "field": "ins_usr",
    //             "operator": "like",
    //             "values": [
    //                 "SM1"
    //             ]
    //         },
    //         {
    //             "field": "atten_nam",
    //             "operator": "in",
    //             "values": [
    //                 "alex",
    //                 "ssss",
    //                 "ssssddd"
    //             ]
    //         },
    //         {
    //             "field": "ci_dat",
    //             "operator": "gte",
    //             "values": [
    //                 "2013/12/03"
    //             ]
    //         },
    //         {
    //             "field": "co_dat",
    //             "operator": "gte",
    //             "values": [
    //                 "2013/12/4"
    //             ]
    //         }
    //     ],
    //     "event_time": "2018-04-11T18:23:51+08:00"
    // };
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