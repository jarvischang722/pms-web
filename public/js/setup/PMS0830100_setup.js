/**
 * Created by a16010 on 2017/7/31.
 * 程式編號: PMS0830100
 * 程式名稱: 逾時計價相關設定
 */

var prg_id = $("#prg_id").val();
var vmHub = new Vue;

/** DatagridRmSingleGridClass ***/
function DatagridRmSingleGridClass() {
}
DatagridRmSingleGridClass.prototype = new DatagridBaseClass();
DatagridRmSingleGridClass.prototype.onClickCell = function (idx, row) {
    //
};
DatagridRmSingleGridClass.prototype.onClickRow = function (idx, row) {
    PMS0830100VM.editingRow = row;
    PMS0830100VM.editStatus = true;
    PMS0830100VM.fetchSingleData(row, function (success) {
        PMS0830100VM.showSingleGridDialog();
    });
};
/*** Class End  ***/

/** 欄位多語系Dialog **/
Vue.component("field-multi-lang-dialog-tmp", {
    template: '#fieldMultiLangDialogTmp',
    props: ['sys_locales', 'singleData'],
    data: function () {
        return {
            editingMultiLangFieldName: '',
            showMultiLangDialog: false,
            editingLangField: "",
            multiLangContentList: [],
            fieldMultiLang: {}
        };
    },
    created: function () {
        var self = this;
        vmHub.$on('editFieldMultiLang', function (fieldInfo) {
            self.getFieldMultiLangContent(fieldInfo);
        });
    },
    methods: {
        getFieldMultiLangContent: function (fieldInfo) {
            this.editingLangField = fieldInfo.ui_field_name;
            var self = this;
            var params = {
                dataType: 'gridsingle',
                rowData: this.singleData,
                prg_id: fieldInfo.prg_id,
                page_id: 2,
                ui_field_name: fieldInfo.ui_field_name
            };

            $.post("/api/fieldAllLocaleContent", params, function (result) {
                self.multiLangContentList = result.multiLangContentList;
                self.editingMultiLangFieldName = fieldInfo.ui_display_name;
                self.openFieldMultiLangDialog(fieldInfo.ui_display_name);
            });
        },
        openFieldMultiLangDialog: function () {
            this.showMultiLangDialog = true;
        },
        closeFieldMultiLangDialog: function () {
            this.showMultiLangDialog = false;
        },
        saveFieldMultiLang: function () {

            var multiLang = [];
            //TODO 暫時用jquery 取資料
            $(".multi_lang_input").each(function () {
                var tmpObj = {};
                tmpObj['locale'] = $(this).data("locale");
                tmpObj[$(this).attr("id")] = $(this).val();
                if (!_.isEmpty($(this).val())) {
                    multiLang.push(tmpObj);
                }
            });

            this.singleData["multiLang"] = multiLang;
            this.closeFieldMultiLangDialog();
        },
        filterLocaleContent: function (langContent, locale, field_name) {
            var m_lang_val = "";
            var fIdx = _.findIndex(langContent, {locale: locale});
            if (fIdx > -1) {
                m_lang_val = langContent[fIdx][field_name] || "";
            }

            return m_lang_val;
        }
    }

});


/** 編輯新增Dialog Component **/
Vue.component('single-grid-pms0830100-tmp', {
    template: '#sigleGridPMS0830100Tmp',
    props: ['editStatus', 'createStatus', 'deleteStatus', 'editingRow', 'pageOneDataGridRows', 'pageTwoDataGridFieldData',
        'singleData', 'pageTwoFieldData', 'tmpCud', 'modificableForData'],
    data: function () {
        return {
            tmpCUD: {},
            isFistData: false,
            isLastData: false
        };
    },
    created: function () {
        var self = this;
        vmHub.$on('showDtDataGrid', function (dtDataGridRows) {
            self.showDtDataGrid(dtDataGridRows);
        });
        vmHub.$on('tempExecData', function (row) {
            self.tempExecData(row);
        });
    },

    watch: {
        editingRow: function (newRow, oldRow) {

            this.$parent.editingRow = newRow;
            var nowDatagridRowIndex = $("#PMS0830100_dg").datagrid('getRowIndex', newRow);
            $("#PMS0830100_dg").datagrid('selectRow', nowDatagridRowIndex);

            if ($("#PMS0830100_dg").datagrid('getRowIndex', newRow) == 0) {
                //已經到第一筆
                this.isFistData = true;
                this.isLastData = false;
            } else if ($("#PMS0830100_dg").datagrid('getRowIndex', newRow) == this.pageOneDataGridRows.length - 1) {
                //已經到最後一筆
                this.isFistData = false;
                this.isLastData = true;
            } else {

                this.isFistData = false;
                this.isLastData = false;
            }

        }
    },
    methods: {
        //打開單欄多語編輯
        editFieldMultiLang: function (fieldInfo) {
            vmHub.$emit('editFieldMultiLang', fieldInfo);
        },

        showDropdownDisplayName: function (val, selectData) {
            if (_.findIndex(selectData, {value: val}) > -1) {
                return _.findWhere(selectData, {value: val}).display;
            } else {
                return val;
            }
        },

        //檢查欄位規則，在離開欄位時
        chkFieldRule: function (ui_field_name, rule_func_name) {

            var self = this;
            var la_originData = [this.$parent.originData];
            var la_singleData = [this.singleData];

            var la_diff = _.difference(la_originData, la_singleData);
            // 判斷資料是否有異動
            if (la_diff.length != 0) {
                this.isUpdate = true;
            }

            if (!_.isEmpty(rule_func_name.trim())) {
                var postData = {
                    prg_id: prg_id,
                    rule_func_name: rule_func_name,
                    validateField: ui_field_name,
                    singleRowData: JSON.parse(JSON.stringify(this.singleData))
                };
                $.post('/api/chkFieldRule', postData, function (result) {
                    if (result.success) {
                        //連動帶回的值
                        if (!_.isUndefined(result.effectValues)) {
                            var effectValues = result.effectValues;
                            _.each(Object.keys(effectValues), function (key) {
                                self.singleData[key] = effectValues[key] || "";
                            });
                        }

                        //是否要show出訊息
                        if (result.showAlert) {
                            alert(result.alertMsg);
                        }

                        //是否要show出詢問視窗
                        if (result.showConfirm) {
                            if (confirm(result.confirmMsg)) {
                                //有沒有要再打一次ajax到後端
                                if (result.isGoPostAjax) {
                                    $.post(result.ajaxURL, postData, function (result) {
                                        if (!result.success) {
                                            alert(result.errorMsg);
                                        }
                                    });
                                }
                            }
                        }


                    } else {
                        alert(result.errorMsg);
                    }

                });
            }
        },

        //page2 顯示dt的datagrid欄位屬性與資料
        showDtDataGrid: function (dtDataGridRows) {
            var self = this;
            var columnsData = EZfieldClass.combineFieldOption(this.pageTwoDataGridFieldData, 'dt_dg');
            var firstCol = [];
            var secondCol = [];

            var restField = _.clone(columnsData[0]);
            restField.field = "rest";
            restField.ui_type = "text";
            // restField.title = '<%= __("program")["PMS0830100"].rest %>';
            restField.title = "休息";
            restField.width = 100;
            restField.colspan = 4;
            restField.sortable = false;
            restField.halign = "center";

            var stayField = _.clone(columnsData[0]);
            stayField.field = "stay";
            stayField.ui_type = "text";
            // stayField.title = '<%= __("program")["PMS0830100"].stay %>';
            stayField.title = "住宿";
            stayField.width = 100;
            stayField.colspan = 4;
            stayField.sortable = false;
            stayField.halign = "center";

            var insCol = [restField, stayField];
            _.each(columnsData, function (eachCol, colIdx) {
                eachCol.align = "center";
                if (eachCol.field.match("free_tim") || eachCol.field.match("over_tim") || eachCol.field.match("over_amt") || eachCol.field.match("item_nos")) {
                    firstCol = _.union(firstCol, insCol);
                    secondCol.push(eachCol);
                }
                else {
                    eachCol.rowspan = 2;
                    firstCol.push(eachCol);
                }
            });

            $('#dt_dg').datagrid({
                toolbar: '#tb',
                columns: [firstCol, secondCol],
                fitColumns: true,
                collapsible: true,
                remoteSort: false,
                singleSelect: true,
                selectOnCheck: true,
                checkOnSelect: true,
                data: dtDataGridRows,
                onEndEdit: function (index, row, changes) {
                    self.tempExecData(row);
                },
                onDropColumn: function () {
                    //當移動順序欄位時
                    self.doSaveColumnFields();
                },
                onResizeColumn: function () {
                    //當欄位時寬度異動時
                    self.doSaveColumnFields();
                },
                onClickCell: self.onClickDtCell

                // onClickRow: self.onClickDtRow


            }).datagrid('columnMoving');

            var lo_rest_field = $("[field='rest']", $("#dt_dg_DIV"));
            var lo_stay_field = $("[field='stay']", $("#dt_dg_DIV"));
            if (!_.isUndefined(lo_rest_field.attr("rowspan"))) {
                lo_rest_field.removeAttr("rowspan");
            }
            if (!_.isUndefined(lo_stay_field.attr("rowspan"))) {
                lo_stay_field.removeAttr("rowspan");
            }
        },

        onClickDtCell: function (index, field) {
            if (this.dtEditIndex != index) {
                if (this.endDtEditing()) {
                    $("#dt_dg").datagrid('selectRow', index).datagrid('beginEdit', index);

                    var ed = $("#dt_dg").datagrid('getEditor', {index: index, field: field});
                    if (ed) {
                        ($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).focus();
                    }
                    this.dtEditIndex = index;
                } else {
                    setTimeout(function () {
                        $("#dt_dg").datagrid('selectRow', this.dtEditIndex);
                    }, 0);
                }
            }
        },

        //結束編輯dt
        endDtEditing: function () {
            if (this.dtEditIndex == undefined) {
                return true;
            }
            if ($("#dt_dg").datagrid('validateRow', this.dtEditIndex)) {
                $("#dt_dg").datagrid('endEdit', this.dtEditIndex);
                this.dtEditIndex = undefined;
                return true;
            }
            return false;

        },

        //到第一筆
        toFirstData: function () {
            this.isFistData = true;
            this.isLastData = false;
            this.editingRow = _.first(this.pageOneDataGridRows);
            this.emitFetchSingleData();
        },

        //上一筆
        toPreData: function () {
            var nowRowIndex = $("#PMS0810020_dg").datagrid('getRowIndex', this.editingRow);
            this.editingRow = this.pageOneDataGridRows[nowRowIndex - 1];
            this.emitFetchSingleData();

        },

        //下一筆
        toNextData: function () {
            var nowRowIndex = $("#PMS0810020_dg").datagrid('getRowIndex', this.editingRow);
            this.editingRow = this.pageOneDataGridRows[nowRowIndex + 1];
            this.emitFetchSingleData();

        },

        //最後一筆
        toLastData: function () {
            this.isFistData = false;
            this.isLastData = true;
            this.editingRow = _.last(this.pageOneDataGridRows);
            this.emitFetchSingleData();
        },

        //刪除單筆EVENT
        handleDeleteSingleData: function () {
            var self = this;
            $.messager.confirm("Delete", "Are you sure delete those data?", function (q) {
                if (q) {
                    //刪除前檢查
                    $.post("/api/deleteFuncRule", {
                        page_id: 2,
                        prg_id: prg_id,
                        deleteData: [self.singleData]
                    }, function (result) {
                        if (result.success) {
                            self.deleteStatue = true;
                            self.tmpCud.deleteData = [self.singleData];
                            self.doSaveGrid();
                            if (result.showAlert) {
                                alert(result.alertMsg);
                            }
                        } else {
                            alert(result.errorMsg);
                        }
                    });
                }
            });
        },

        //關閉
        emitCloseGridDialog: function () {
            this.dtEditIndex = undefined;
            this.$emit('close-single-grid-dialog');
        },

        //抓取單筆資料
        emitFetchSingleData: function () {
            var params = this.editingRow;
            this.$emit('fetch-single-data', params, function (success) {
            });
        },

        //新增
        emitAppendRow: function () {
            this.$emit('append-row');
        },

        //儲存新增或修改資料
        doSaveGrid: function (saveAfterAction) {

            if (this.endDtEditing()) {
                var self = this;
                var targetRowAfterDelete = {}; //刪除後要指向的資料
                if (this.deleteStatue) {
                    var rowsNum = $("#PMS0830100_dg").datagrid('getRows').length;
                    var currentRowIdx = $("#PMS0830100_dg").datagrid('getRowIndex', self.editingRow); //目前索引
                    if (currentRowIdx == rowsNum - 1) {
                        //刪除的資料已經是最後一筆 就取datagrid最末筆
                        targetRowAfterDelete = self.pageOneDataGridRows[currentRowIdx - 1];

                    } else {
                        //取下一筆
                        targetRowAfterDelete = self.pageOneDataGridRows[currentRowIdx + 1];
                    }
                }

                if (this.createStatus) {
                    this.tmpCud.createData = [this.singleData];
                } else if (this.editStatus) {
                    this.tmpCud.editData = [this.singleData];
                }

                //先驗證有無欄位沒驗證過的
                this.$emit('do-save-cud', function (success) {
                    if (success) {

                        //儲存後離開
                        if (saveAfterAction == "closeDialog") {
                            self.singleData = {};
                            self.emitCloseGridDialog();
                        }
                        //新增完再新增另一筆
                        else if (saveAfterAction == "addOther") {
                            self.singleData = {};
                            self.emitAppendRow();
                        }

                        if (self.deleteStatue) {
                            /**
                             * 刪除成功
                             * 1.取下一筆
                             * 2.無下一筆時取datagrid 最後一筆
                             * 3.連一筆都沒有關掉dialog 回多筆
                             **/
                            if ($("#PMS0830100_dg").datagrid('getRows').length > 0) {
                                self.editingRow = targetRowAfterDelete;
                                self.emitFetchSingleData();
                            } else {
                                //連一筆都沒有就關掉視窗
                                self.emitCloseGridDialog();
                            }

                        }


                    }
                });
            }
        },

        //DT datagrid資料放入暫存
        tempExecData: function (rowData) {
            var self = this;

            if(!_.isUndefined(rowData.day_sta_color)){

                var lo_day_sta = $('#dt_dg').datagrid('getSelected').day_sta;
                console.log(lo_day_sta);

                delete rowData["day_sta_color"];
            }

            rowData["mnRowData"] = this.singleData;
            //判斷此筆是新增或更新
            var dataType = rowData.createRow == 'Y'
                ? "dt_createData" : "dt_editData";
            var fieldDataList = this.pageTwoDataGridFieldData;
            var keyVals = _.pluck(_.where(fieldDataList, {keyable: 'Y'}), "ui_field_name");
            var condKey = {};
            _.each(keyVals, function (field_name) {
                condKey[field_name] = rowData[field_name] || "";
            });

            //判斷資料有無在暫存裡, 如果有先刪掉再新增新的
            var existIdx = _.findIndex(this.tmpCud[dataType], condKey);
            if (existIdx > -1) {
                this.tmpCud[dataType].splice(existIdx, 1);
            }
            rowData.key_nos = this.key_nos;
            this.tmpCud[dataType].push(rowData);
        },

        //新增一個Dt Row
        appendDtRow: function () {
            var self = this;
            if (this.endDtEditing()) {
                $.post("/api/handleDataGridAddEventRule", {prg_id: prg_id, page_id: 2}, function (result) {
                    var prgDefaultObj = {createRow: 'Y'};
                    if (result.success) {
                        prgDefaultObj = _.extend(prgDefaultObj, result.prgDefaultObj);
                    }
                    $("#dt_dg").datagrid('appendRow', prgDefaultObj);
                    self.dtEditIndex = $("#dt_dg").datagrid('getRows').length - 1;
                    $("#dt_dg").datagrid('selectRow', self.dtEditIndex)
                        .datagrid('beginEdit', self.dtEditIndex);
                });

            }
        },

        //刪除選定Dt的Row
        removeDtRow: function () {
            var self = this;
            var delRow = $("#dt_dg").datagrid('getSelected');
            if (!delRow) {
                alert("請選擇要刪除的資料");
            }
            delRow["mnRowData"] = this.singleData;  //存放此筆DT 對應mn 的資料

            PMS0830100VM.tmpCud.dt_deleteData.push(delRow);

            $.post("/api/handleDataGridDeleteEventRule", {
                prg_id: prg_id,
                page_id: 2,
                deleteData: PMS0830100VM.tmpCud.dt_deleteData
            }, function (result) {
                if (result.success) {
                    $("#dt_dg").datagrid('deleteRow', $("#dt_dg").datagrid('getRowIndex', delRow));
                } else {
                    PMS0830100VM.tmpCud.deleteData = _.without(PMS0830100VM.tmpCud.deleteData, delRow);  //刪除在裡面的暫存
                    PMS0830100VM.tmpCud.dt_deleteData = _.without(PMS0830100VM.tmpCud.dt_deleteData, delRow);  //刪除在裡面的暫存
                    self.endDtEditing();
                    alert(result.errorMsg);
                }

            });
        }
    }
});


var PMS0830100VM = new Vue({
    el: '#GSApp',
    mounted: function () {
        var self = this;
        this.initTmpCUD();
        this.fetchUserInfo();
        this.loadDataGridByPrgID(function (success) {
        });
        this.loadSingleGridPageField();
    },
    data: {
        isDatepickerInit: false,
        sys_locales: JSON.parse(decodeURIComponent(getCookie("sys_locales")).replace("j:", "")),
        createStatus: false,    //新增狀態
        editStatus: false,      //編輯狀態
        deleteStatus: false,    //刪除狀態
        pageOneDataGridRows: [],//page_id 1 的 datagrid資料
        pageOneFieldData: [],   //page_id 1 datagird欄位
        pageTwoFieldData: [],   //page_id 2 欄位
        pageTwoDataGridFieldData: [],   //page_id 2 datagird欄位
        editingRow: {},         //編輯中的資料
        userInfo: {},            //登入的使用者資料
        tmpCud: {               //新刪修暫存
            createData: [],
            editData: [],
            deleteData: [],
            dt_createData: [],
            dt_editData: [],
            dt_deleteData: []
        },
        originData: {},         //原始資料
        singleData: {},         //單檔資訊
        modificableForData: true,       //決定是否可以修改資料
        dgIns: {},
        labelPosition: 'right'
    },
    methods: {
        //Init CUD
        initTmpCUD: function () {
            this.tmpCud = {
                createData: [],
                editData: [],
                deleteData: [],
                dt_createData: [],
                dt_editData: [],
                dt_deleteData: []
            };
        },
        //抓取顯示資料
        loadDataGridByPrgID: function (callback) {
            $.post("/api/prgDataGridDataQuery", {prg_id: prg_id}, function (result) {
                waitingDialog.hide();
                PMS0830100VM.pageOneDataGridRows = result.dataGridRows;
                PMS0830100VM.pageOneFieldData = result.fieldData;
                PMS0830100VM.showCheckboxDG();
                PMS0830100VM.showDataGrid();
                callback(result.success);
            });
        },

        //顯示DataGrid
        showDataGrid: function () {

            this.dgIns = new DatagridRmSingleGridClass();
            this.dgIns.init(prg_id, 'PMS0830100_dg', EZfieldClass.combineFieldOption(this.pageOneFieldData, 'PMS0830100_dg'));
            this.dgIns.loadDgData(this.pageOneDataGridRows);
            PMS0830100VM.pageOneDataGridRows = $("#dgCheckbox").datagrid('getRows');
        },

        //取得使用者資料
        fetchUserInfo: function () {
            $.post('/api/getUserInfo', function (result) {
                if (result.success) {
                    PMS0830100VM.userInfo = result.userInfo;
                }
            });
        },

        //Show Checkbox
        showCheckboxDG: function () {
            var dgData = {total: this.pageOneDataGridRows.length, rows: this.pageOneDataGridRows};
            $('#dgCheckbox').datagrid({
                columns: [
                    [
                        {
                            field: 'ck',
                            checkbox: true
                        }
                    ]
                ],
                singleSelect: false,
                data: dgData
            });
        },

        //新增按鈕Event
        appendRow: function () {
            PMS0830100VM.initTmpCUD();
            PMS0830100VM.createStatus = true;
            PMS0830100VM.singleData = {};
            $.post("/api/addFuncRule", {prg_id: prg_id, page_id: 1}, function (result) {
                if (result.success) {
                    PMS0830100VM.singleData = result.defaultValues;
                    PMS0830100VM.showSingleGridDialog();
                    vmHub.$emit('showDtDataGrid', []);
                } else {
                    alert(result.errorMsg);
                }
            });
        },

        //dg row刪除
        removeRow: function () {
            PMS0830100VM.tmpCud.deleteData = [];
            var checkRows = $('#dgCheckbox').datagrid('getSelections');
            if (checkRows == 0) {
                $.messager.alert("Warning", 'Check at least one item');
                return;
            }
            $.messager.confirm("Delete", "Are you sure delete those data?", function (q) {
                if (q) {
                    //刪除前檢查

                    _.each(checkRows, function (row) {
                        PMS0830100VM.tmpCud.deleteData.push(row);
                    });

                    $.post("/api/deleteFuncRule", {
                        page_id: 1,
                        prg_id: prg_id,
                        deleteData: PMS0830100VM.tmpCud.deleteData
                    }, function (result) {
                        if (result.success) {
                            //刪除Row
                            _.each(checkRows, function (row) {
                                var DelIndex = $('#PMS0830100_dg').datagrid('getRowIndex', row);
                                $('#PMS0830100_dg').datagrid('deleteRow', DelIndex);
                            });
                            PMS0830100VM.showCheckboxDG($("#PMS0830100_dg").datagrid("getRows"));
                            PMS0830100VM.doSaveCUD();
                        } else {
                            alert(result.errorMsg);
                        }

                    });

                }
            });
        },

        //資料儲存
        doSaveCUD: function (callback) {
            var self = this;
            waitingDialog.show('Saving...');
            var params = _.extend({prg_id: prg_id}, PMS0830100VM.tmpCud);
            $.post("/api/saveGridSingleData", params, function (result) {
                if (result.success) {
                    PMS0830100VM.initTmpCUD();
                    PMS0830100VM.loadDataGridByPrgID(function (success) {
                        callback(success);
                    });
                    alert('save success!');
                    waitingDialog.hide();

                } else {
                    waitingDialog.hide();
                    alert(result.errorMsg);
                }

            });

        },

        tempExecData: function(rowData){
            vmHub.$emit("tempExecData", rowData);
        },

        //抓取page_id 2 單頁顯示欄位
        loadSingleGridPageField: function () {
            $.post("/api/singleGridPageFieldQuery", {prg_id: prg_id, page_id: 2}, function (result) {
                var fieldData = result.fieldData;
                PMS0830100VM.pageTwoFieldData = _.values(_.groupBy(_.sortBy(fieldData, "row_seq"), "row_seq"));

                //page2  datagrid 欄位屬性
                if (_.findIndex(fieldData, {ui_type: 'grid'}) > -1) {
                    $("#dt_dg_DIV").show();
                    PMS0830100VM.pageTwoDataGridFieldData = fieldData[_.findIndex(fieldData, {ui_type: 'grid'})].datagridFields || [];
                    PMS0830100VM.dtMultiLangField = _.filter(PMS0830100VM.pageTwoDataGridFieldData, function (field) {
                        return field.multi_lang_table != "";
                    });


                    vmHub.$emit("updateDtMultiLangField", {dtMultiLangField: PMS0830100VM.dtMultiLangField});
                }
            });
        },

        //取得單筆資料
        fetchSingleData: function (editingRow, callback) {
            PMS0830100VM.initTmpCUD();
            PMS0830100VM.editStatus = true;
            PMS0830100VM.editingRow = editingRow;
            editingRow["prg_id"] = prg_id;
            $.post('/api/singlePageRowDataQuery', editingRow, function (result) {
                var dtData = result.dtData || [];
                if (result.success) {
                    PMS0830100VM.singleData = result.rowData;
                    PMS0830100VM.originData = _.clone(result.rowData);
                    PMS0830100VM.modificableForData = result.modificable || true;
                    PMS0830100VM.dtData = dtData;
                    vmHub.$emit('showDtDataGrid', dtData);
                    callback(true);

                } else {
                    PMS0830100VM.singleData = {};
                    callback(false);
                }

            });
        },

        //init datepicker
        initDatePicker: function () {
            if (!this.isDatepickerInit) {
                this.isDatepickerInit = true;
                $('.date_picker').datepicker({
                    autoclose: true,
                    format: 'yyyy/mm/dd'
                }).on("changeDate", function (e) {
                });

                $('.date_timepicker').datetimepicker({
                    format: 'YYYY/MM/DD hh:mm:ss ',//use this option to display seconds
                    icons: {
                        time: 'fa fa-clock-o',
                        date: 'fa fa-calendar',
                        up: 'fa fa-chevron-up',
                        down: 'fa fa-chevron-down',
                        previous: 'fa fa-chevron-left',
                        next: 'fa fa-chevron-right',
                        today: 'fa fa-arrows ',
                        clear: 'fa fa-trash',
                        close: 'fa fa-times'
                    }

                });
            }
        },

        //打開單檔dialog
        showSingleGridDialog: function () {
            this.initDatePicker();
            var maxHeight = document.documentElement.clientHeight - 70; //browser 高度 - 70功能列
            var height = 19 * 50; // 預設一個row 高度
            var dialog = $("#singleGridPMS0830100").dialog({
                autoOpen: false,
                modal: true,
                height: _.min([maxHeight, height]),
                title: prg_id,
                minWidth: 750,
                maxHeight: maxHeight,
                resizable: true,
                buttons: "#dialogBtns"
            });
            dialog.dialog("open");
            // 給 dialog "內容"高 值
            $(".singleGridContent").css("height", _.min([maxHeight, height]) + 20);
        },

        //關閉單檔dialog
        closeSingleGridDialog: function () {
            PMS0830100VM.editingRow = {};
            PMS0830100VM.singleData = {};
            PMS0830100VM.editStatus = false;
            PMS0830100VM.initTmpCUD();
            $("#singleGridPMS0830100").dialog('close');
        }

    }

});

function editDtMultiLang(rowIdx) {
    vmHub.$emit('editDtMultiLang', {rowIdx: rowIdx});
}

Vue.filter("showDropdownDisplayName", function (val) {
    console.log(val);
    console.log(selectData);
});

var adpterDg = new AdapterDatagrid(PMS0830100VM);