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

    var _this = this;
    this._funcPurvs = [];
    $.ajax({
        url: '/api/getUserFuncPurviewByProID',
        type: "post",
        data: {prg_id: prg_id},
        async: false,
        success: function (result) {
            _this.setFuncPurvs(result.funcPurvs);

            //判斷按鈕是否有權限使用
            $(".purview_btn").each(function () {
                var purview_func_id = $(this).data("purview_func_id");

                $("[data-purview_func_id='" + purview_func_id + "']").attr("disabled", false);

                var purIdx = _.findIndex(result.funcPurvs, function (func) {
                    return prg_id + "-" + func.func_id == purview_func_id;
                });

                if (purIdx == -1) {

                    $("[data-purview_func_id='" + purview_func_id + "']").attr("disabled", true);
                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(errorThrown);
        }

    });

}

/**
 * 設定按鈕權限
 * @param funcPurvs{Array} 權限表
 */
FuncPurview.prototype.setFuncPurvs = function (funcPurvs) {
    this._funcPurvs = funcPurvs;
};

/**
 * 取得按鈕權限
 */
FuncPurview.prototype.getFuncPurvs = function () {
    return this._funcPurvs;
};
