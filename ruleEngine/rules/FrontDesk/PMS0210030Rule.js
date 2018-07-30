const _ = require("underscore");
const _s = require("underscore.string");
const moment = require("moment");
const clusterQueryAgent = require("../../../plugins/kplug-oracle/ClusterQueryAgent");
const queryAgent = require("../../../plugins/kplug-oracle/QueryAgent");
const commonRule = require("./../CommonRule");
const ReturnClass = require("../../returnClass");
const ErrorClass = require("../../errorClass");
const tools = require("../../../utils/CommonTools");
const sysConf = require("../../../configs/systemConfig");
const encryptTools = require("../../../utils/encryptTools");

module.exports = {

    getRoomType(postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;

        let lo_default_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod,
            // ci_dat: '2018/06/29'
            ci_dat: postData.ci_dat
        };

        try {
            let lo_clusterParam = commonRule.ConvertToQueryParams(session.athena_id, "QRY_ROOM_TYPE_DT");
            clusterQueryAgent.queryList(lo_clusterParam, lo_default_params, function (err, result) {
                if (err) {
                    lo_error = new ErrorClass();
                    lo_return.success = false;
                    lo_error.errorMsg = err;
                }
                else {
                    lo_return.success = true;
                    lo_return.effectValues = result;
                }
                callback(lo_error, lo_return);
            });
        }
        catch (err) {
            lo_error = new ErrorClass();
            lo_return.success = false;
            lo_error.errorMsg = err;
        }
    },

    getRoomMnQryFloorNos(postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;

        let lo_default_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod,
        };

        try {
            let lo_clusterParam = commonRule.ConvertToQueryParams(session.athena_id, "QRY_ROOM_MN_QRY_FLOOR_NOS");
            clusterQueryAgent.queryList(lo_clusterParam, lo_default_params, function (err, result) {
                if (err) {
                    lo_error = new ErrorClass();
                    lo_return.success = false;
                    lo_error.errorMsg = err;
                }
                else {
                    result = result.map(lo_data => {
                        lo_data.value = parseInt(lo_data.value);
                        lo_data.display = parseInt(lo_data.display);
                        return lo_data;
                    });
                    result = _.sortBy(result, 'value');

                    lo_return.success = true;
                    lo_return.effectValues = result;
                }
                callback(lo_error, lo_return);
            });
        }
        catch (err) {
            lo_error = new ErrorClass();
            lo_return.success = false;
            lo_error.errorMsg = err;
        }
    }
};