/**
 * Created by Jun on 2017/3/10.
 * 規則錯誤訊息類別
 */
function errorObject () {
    this.success = false;       //回傳失敗
    this.errorMsg = "";           //錯誤訊息
    this.errorCod = "";           //錯誤代碼
}


module.exports = errorObject;