/**
 * Created by Jun on 2017/6/12.
 * 單筆
 */
function DatagridForSingleGridClass() {

}

DatagridForSingleGridClass.prototype = new DatagridBaseClass();

DatagridForSingleGridClass.prototype.onClickCell = function(idx, row){};

DatagridForSingleGridClass.prototype.onClickRow = function(idx, row){
    alert('row');
};