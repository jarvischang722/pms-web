/** 強制依照參數顯示
 * Created by a17017 on 2017/12/11.
 */

function formatDisplayClass() {

    /**
     * 金額依format轉換
     * @param val {string} 原始金額
     * @param rule_val {string} 參數的值(格式)
     * @returns {string}
     */
    this.amtFormat = function (val, rule_val) {
        var ls_amtValue = _.clone(val).toString();
        var ls_oriAmtValue = '';

        if (ls_amtValue.indexOf(',') > -1) {
            var la_splitAmtValue = ls_amtValue.split(',');
            _.each(la_splitAmtValue, function (ls_splitAmtValue) {
                ls_oriAmtValue = ls_oriAmtValue + ls_splitAmtValue;
            });
        }
        else {
            ls_oriAmtValue = ls_amtValue;
        }

        ls_oriAmtValue = Number(ls_oriAmtValue);

        var patternValue = rule_val;

        var patternLength = patternValue.indexOf('.') > -1 ?
            patternValue.slice(0, patternValue.indexOf('.')).length - 1 : patternValue.length - 1;

        //幾位小數
        var numberOfDecimals = patternValue.indexOf('.') > -1 ?
            patternValue.slice(patternValue.indexOf('.') + 1, patternValue.length).length : 0;

        //幾位數一個逗號
        var commaPosition = patternLength - patternValue.lastIndexOf(',');

        var reStr = '\\d(?=(\\d{' + (commaPosition || 3) + '})+' + (numberOfDecimals > 0 ? '\\.' : '$') + ')';

        //四捨五入
        ls_oriAmtValue = go_MathTool.formatFloat(ls_oriAmtValue, numberOfDecimals);

        ls_oriAmtValue = ls_oriAmtValue.toFixed(numberOfDecimals).toString().replace(new RegExp(reStr, 'g'), '$&,');

        return ls_oriAmtValue;
    };

    /**
     * 資料轉回無format
     * @param val {string} 依format轉換後的值
     */
    this.removeAmtFormat = function (val) {
        var ls_amtValue = "";

        if (val.indexOf(',') > -1) {
            let la_splitAmtValue = val.split(',');
            _.each(la_splitAmtValue, function (ls_splitAmtValue) {
                ls_amtValue = ls_amtValue + ls_splitAmtValue;
            });

            if (ls_amtValue.indexOf('.') > -1) {
                ls_amtValue = ls_amtValue.substring(0, ls_amtValue.indexOf('.'));
            }

            return ls_amtValue;
        }

        if (val.indexOf('.') > -1) {
            ls_amtValue = val.substring(0, val.indexOf('.'));

            return ls_amtValue;
        }
        return val;
    };
}
