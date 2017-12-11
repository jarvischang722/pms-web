/** 強制依照參數顯示
 * Created by a17017 on 2017/12/11.
 */

function formatDisplayClass(){

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

        ls_oriAmtValue = ls_oriAmtValue.toFixed(numberOfDecimals).toString().replace(new RegExp(reStr, 'g'), '$&,');

        return ls_oriAmtValue;
    };
}
