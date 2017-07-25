/**
 * Created by a14020 on 2017/7/24.
 */
module.exports = {
    chkA6hfdareapntrfIsexistA6hfdprintdt: function(postData, session, callback){
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params = {
            athena_id: session.user.athena_id,
            type_cod: postData.singleRowData.type_cod
        }
        queryAgent.query("QRY_AREAPNT_COD_A6HFD_PRINT_DT_COUNT".toUpperCase(), params, function (err, chkResult) {
            if (chkResult) {
                if (chkResult.cust_mn_count > 0) {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = "區域「（區域代號）」已有相關列印資料，不可刪除";
                    lo_error.errorCod = "1111";
                }
                callback(lo_error, lo_result);
            }
        });
    }
}