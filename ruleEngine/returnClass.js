/**
 * Created by Jun on 2017/3/10.
 * 規則回傳訊息類別
 */

function rtnObject () {
    this.success = true;
    this.defaultValues = {};     //新增時預設用的值
    this.effectValues = {};      //連動的值
    this.showConfirm  = false;   //是否要顯示選擇視窗
    this.confirmMsg  = "";       //confirm 要顯示的文字訊息
    this.showAlert  = false;     //是否要顯示回傳訊息
    this.alertMsg  = "";         //alert訊息
    this.isGoPostAjax  = false;  //是否在打一次ajax到後端
    this.ajaxURL = "";           //ajax要打的路徑
    this.extendExecDataArrSet = [];    //存放額外要組合sql的資料集合
    this.selectOptions = []      //下拉選單選項
}


module.exports = rtnObject;