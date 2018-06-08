const ReturnClass = require('../../returnClass');
const ErrorClass = require('../../errorClass');
const queryAgent = require('../../../plugins/kplug-oracle/QueryAgent');
const commandRules = require('../CommonRule');

module.exports = {
    async r_ContractdtRatecod_dgSelectClick(params, session) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {
            let ls_beginDat = params.rowData.begin_dat || "";
            let ls_endDat = params.rowData.end_dat || "";
            let ls_hotelCod = params.rowData.hotel_cod || "";
            if (ls_beginDat != "" && ls_endDat != "") {
                let la_rateCodSelectData = await new Promise((resolve, reject) => {
                    queryAgent.queryList("QRY_CONTRACT_DT_RATE_COD", {
                        athena_id: session.user.athena_id,
                        hotel_cod: ls_hotelCod,
                        end_dat: ls_endDat,
                        begin_dat: ls_beginDat
                    }, 0, 0, function (err, result) {
                        if (err) {
                            reject(err)
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
                lo_result.selectField = ["rate_cod"];
                lo_result.selectOptions = la_rateCodSelectData;
            }
            else {
                lo_result.success = false;
                lo_error = new ErrorClass();
                lo_error.errorMsg = "請先設定試用期間";
            }
        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
        }
        return {return: lo_result, error: lo_error};
    }
};

