/**
 * Created by Jun on 2017/5/31.
 * 繼承DatagridBase的類別
 */
//TODO DatagridBase this 與self 指向相沖
function DatagridExtPMS0810050Class() {

    //console.log("DatagridExtPMS0810050Class constructor");
}

DatagridExtPMS0810050Class.prototype = new DatagridBaseClass();

DatagridExtPMS0810050Class.prototype.filterRowData = function (row) {
    var lao_columns = this.columns;
    _.each(row, function (val, key) {
        if (_.findIndex(lao_columns, {field: key}) > -1
            && _.findWhere(lao_columns, {field: key}).ui_type == 'time') {
            row[key] = val.replace(":", "");
        }
    });
    return row;
};
