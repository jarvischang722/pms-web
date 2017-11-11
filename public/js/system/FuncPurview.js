/**
 * 按鈕權限控制
 * @param prg_id
 * @constructor
 *
 * 按鈕在class 綁上  purview_btn_[func_id] (ex: purview_btn_0200)
 */
function FuncPurview(prg_id) {
    if (prg_id == undefined || prg_id == "") {
        throw new Error('prg_id is require');
    }
    this.funcPurvs = [];
    $.post("/api/getUserFuncPurviewByProID", {prg_id: prg_id}, function (result) {
        FuncPurview.funcPurvs = result.funcPurvs;
        $(".btn").each(function () {
            if ($(this).attr("class").indexOf("purview_btn_") > -1) {
                $(this).attr("disabled", true);
            }
        });
        //判斷按鈕是否有權限使用
        FuncPurview.funcPurvs.forEach(function (func) {
            $(".purview_btn_" + func.func_id).attr("disabled", false);
        });
    });

}

