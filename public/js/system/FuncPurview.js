/**
 * 按鈕權限控制
 * @param prg_id : 作業編號
 * @constructor
 * 按鈕Class 綁上 purview_btn
 * 按鈕在屬性data-purview_func_id  [作業編號+func_id] (ex: PMS081000010200)
 */
function FuncPurview(prg_id) {
    if (prg_id == undefined || prg_id == "") {
        throw new Error('prg_id is require');
    }
    this.funcPurvs = [];
    $.post("/api/getUserFuncPurviewByProID", {prg_id: prg_id}, function (result) {
        FuncPurview.funcPurvs = result.funcPurvs.slice(0, 1);
        //判斷按鈕是否有權限使用
        $(".purview_btn").each(function () {
            var purview_func_id = $(this).data("purview_func_id");
            var purIdx = _.findIndex(FuncPurview.funcPurvs, function (func) {
                return prg_id + func.func_id == purview_func_id;
            });
            if (purIdx == -1) {
                $("[data-purview_func_id='" + purview_func_id + "']").attr("disabled", true);
            }
        });
    });


}

