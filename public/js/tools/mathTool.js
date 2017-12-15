/**
 * Created by Mike on 2017/10/03.
 * 數值運算處理工具
 */

function MathTool(){

    /**
     * 解決js相乘的浮點運算bug
     * @param arg1 : 被乘數
     * @param arg2 : 乘數
     * @returns {Number} : 結果
     */
    this.accMul = function(arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length;
        } catch (e) {
        }
        try {
            m += s2.split(".")[1].length;
        } catch (e) {
        }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    };

    /**
     * 四捨五入
     * @param num : 數字
     * @param pos : 四捨五入到幾位
     * @returns {Number} : 結果
     */
    this.formatFloat = function(num, pos)
    {
        var size = Math.pow(10, pos);
        return Math.round(num * size) / size;
    };
}