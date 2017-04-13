/**
 * Created by Jun on 2017/2/23.
 */
var prg_id = $("#prg_id").val();
var $prg_dtdg = $("#dt_dg");
var vmHub = new Vue;
/** 編輯新增Dialog Component **/
Vue.component('sigle-grid-dialog-tmp', {
    template: '#sigleGridDialogTmp',
    props: ['editStatus', 'createStatus', 'deleteStatus', 'editingRow', 'pageOneDataGridRows', 'pageTwoGridFieldData',
        'singleData', 'pageTwoFieldData', 'tmpCUD', 'modificableForData'],
    data: function () {
        return {
            isFistData: false,
            isLastData: false,
            testTime: "2017/03/20",
            dtEditIndex: undefined
        }
    },
    watch: {

        editingRow: function (newRow, oldRow) {

            this.$parent.editingRow = newRow;
            var nowDatagridRowIndex = $("#dg").datagrid('getRowIndex', newRow);
            $("#dg").datagrid('selectRow', nowDatagridRowIndex);

            if ($("#dg").datagrid('getRowIndex', newRow) == 0) {
                //已經到第一筆
                this.isFistData = true;
                this.isLastData = false;
            } else if ($("#dg").datagrid('getRowIndex', newRow) == this.pageOneDataGridRows.length - 1) {
                //已經到最後一筆
                this.isFistData = false;
                this.isLastData = true;
            } else {

                this.isFistData = false;
                this.isLastData = false;
            }

        }
    },
    created: function () {
        var self = this;
        vmHub.$on('showDtDataGrid', function (dtDataGridRows) {
            self.showDtDataGrid(dtDataGridRows)
        });

    },
    methods: {
        //檢查欄位規則，在離開欄位時
        chk_field_rule: function (ui_field_name, rule_func_name) {
            var self = this;
            if (!_.isEmpty(rule_func_name.trim())) {
                var postData = {
                    prg_id: prg_id,
                    rule_func_name: rule_func_name,
                    validateField: ui_field_name,
                    singleRowData: JSON.parse(JSON.stringify(this.singleData))
                };
                $.post('/api/chkFieldRule', postData, function (result) {
                    console.log(result);
                    if (result.success) {
                        //連動帶回的值
                        if (!_.isUndefined(result.effectValues)) {
                            var effectValues = result.effectValues;
                            _.each(Object.keys(effectValues), function (key) {
                                console.log("key:" + key + "@" + effectValues[key]);
                                self.singleData[key] = effectValues[key] || "";
                            })
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
                                    })
                                }
                            }
                        }


                    } else {
                        alert(result.errorMsg);
                    }

                })
            }
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
            var nowRowIndex = $("#dg").datagrid('getRowIndex', this.editingRow);
            this.editingRow = this.pageOneDataGridRows[nowRowIndex - 1];
            this.emitFetchSingleData();

        },
        //下一筆
        toNextData: function () {
            var nowRowIndex = $("#dg").datagrid('getRowIndex', this.editingRow);
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
                        page_id:2,
                        prg_id: prg_id,
                        deleteData: [self.singleData]
                    }, function (result) {
                        if (result.success) {
                            self.deleteStatue = true;
                            self.tmpCUD.deleteData = [self.singleData];
                            self.doSaveGrid();
                            if (result.showAlert) {
                                alert(result.alertMsg);
                            }
                        } else {
                            alert(result.errorMsg);
                        }
                    })
                }
            });
        },
        //關閉
        emitCloseGridDialog: function () {
            this.$emit('close-single-grid-dialog');
        },
        //抓取單筆資料
        emitFetchSingleData: function () {
            var params = this.editingRow;
            this.$emit('fetch-single-data', params, function (success) {
            });
        },
        //新增模式
        emitSwitchToCreateStatus: function () {
            this.$emit('switch-to-create-status');
        },
        //儲存新增或修改資料
        doSaveGrid: function (saveAfterAction) {

            var self = this;
            var targetRowAfterDelete = {}; //刪除後要指向的資料
            if (this.deleteStatue) {
                var rowsNum = $("#dg").datagrid('getRows').length;
                var currentRowIdx = $("#dg").datagrid('getRowIndex', self.editingRow); //目前索引
                if (currentRowIdx == rowsNum - 1) {
                    //刪除的資料已經是最後一筆 就取datagrid最末筆
                    targetRowAfterDelete = self.pageOneDataGridRows[currentRowIdx - 1];

                } else {
                    //取下一筆
                    targetRowAfterDelete = self.pageOneDataGridRows[currentRowIdx + 1];
                }
            }

            if (this.createStatus) {
                this.tmpCUD.createData = [this.singleData];
            } else if (this.editStatus) {
                this.tmpCUD.editData = [this.singleData];
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
                        self.emitSwitchToCreateStatus();
                    }

                    if (self.deleteStatue) {
                        /**
                         * 刪除成功
                         * 1.取下一筆
                         * 2.無下一筆時取datagrid 最後一筆
                         * 3.連一筆都沒有關掉dialog 回多筆
                         **/
                        if ($("#dg").datagrid('getRows').length > 0) {
                            self.editingRow = targetRowAfterDelete;
                            self.emitFetchSingleData();
                        } else {
                            //連一筆都沒有就關掉視窗
                            self.emitCloseGridDialog();
                        }

                    }


                }
            });


        },
        /**  DT Data grid event**/
        //page2 顯示dt的datagrid欄位屬性與資料
        showDtDataGrid: function (dtDataGridRows) {

            var self = this;
            var columnsData = [];
                this.$emit("combine-field", this.pageTwoGridFieldData, function (columns) {
                columnsData =  columns;
            });

            $('#dt_dg').datagrid({
                toolbar: '#tb',
                columns: [columnsData],
                collapsible: true,
                remoteSort: false,
                singleSelect: true,
                selectOnCheck: true,
                checkOnSelect: true,
                data: dtDataGridRows,
                onEndEdit: function (index, row, changes) {

                    row["mnRowData"] = self.singleData;
                    if (row.createRow == 'Y') {
                        self["tmpCUD"].dt_createData.push(row);
                    } else {
                        self["tmpCUD"].dt_editData.push(row);
                    }
                    console.log("==== Edit end ====");
                    console.log(self["tmpCUD"]);
                },
                // onEndEdit: onEndEdit,
                onDropColumn: function () {
                    //當移動順序欄位時
                    //vm.doSaveColumnFields();
                },
                onResizeColumn: function () {
                    //當欄位時寬度異動時
                    //vm.doSaveColumnFields();
                },
                onClickCell: self.onClickDtCell,


            }).datagrid('columnMoving');
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
                return true
            }
            if ($("#dt_dg").datagrid('validateRow', this.dtEditIndex)) {
                $("#dt_dg").datagrid('endEdit', this.dtEditIndex);
                this.dtEditIndex = undefined;
                return true;
            } else {
                return false;
            }
        },
        //新增一個Dt Row
        appendDtRow: function () {

            if (this.endDtEditing()) {
                // $.post("/api/getRowDefaultObject", {prg_id: prg_id}, function (result) {
                //
                //     var prgDefaultObj = {createRow: 'Y'};
                //     if (result.success) {
                //         prgDefaultObj = result.prgDefaultObj;
                //     }
                //     $("#dt_dg").datagrid('appendRow', prgDefaultObj);
                //     this.dtEditIndex = $("#dt_dg").datagrid('getRows').length - 1;
                //     $("#dt_dg").datagrid('selectRow', this.dtEditIndex)
                //         .datagrid('beginEdit', this.dtEditIndex);
                // })
                var dtRowObj = {createRow: 'Y'};
                $("#dt_dg").datagrid('appendRow', dtRowObj);
                this.dtEditIndex = $("#dt_dg").datagrid('getRows').length - 1;
                $("#dt_dg").datagrid('selectRow', this.dtEditIndex).datagrid('beginEdit', this.dtEditIndex);


            }
        },
        //刪除選定Dt的Row
        removeDtRow: function () {
            var delRow = $("#dt_dg").datagrid('getSelected');
            if (!delRow) {
                alert("請選擇要刪除的資料");
            }
            delRow["mnRowData"] = this.singleData;
            $("#dt_dg").datagrid('deleteRow', $("#dt_dg").datagrid('getRowIndex', delRow));
            this.tmpCUD.dt_deleteData.push(delRow);
            this.endDtEditing();

            // $.post("/api/handleDataGridDeleteEventRule", {
            //     prg_id: prg_id,
            //     deleteData: vm.tmpCUD.deleteData
            // }, function (result) {
            //
            //     console.log(result);
            //     if(result.success){
            //         $prg_dg.datagrid('deleteRow', $prg_dg.datagrid('getRowIndex', delRow));
            //     }else{
            //         vm.tmpCUD.deleteData = _.without(vm.tmpCUD.deleteData, delRow);  //刪除在裡面的暫存
            //         vm.endEditing();
            //         alert(result.errorMsg);
            //     }
            //
            // })

        }
    }
});


vm = new Vue({
    el: '#app',
    // mounted: function () {
    //     // vue 2.0 寫法
    // },
    compiled: function () {

    },
    ready: function () {
        this.initTmpCUD();
        this.fetchUserInfo();
        this.loadDataGridByPrgID(function (success) {});
        this.loadSingleGridPageField();
    },
    data: {
        createStatus: false,    //新增狀態
        editStatus: false,      //編輯狀態
        deleteStatus: false,    //刪除狀態
        pageOneDataGridRows: [],//page_id 1 的 datagrid資料
        pageOneFieldData: [],   //page_id 1 datagird欄位
        pageTwoFieldData: [],   //page_id 2 欄位
        pageTwoGridFieldData: [],   //page_id 2 datagird欄位
        editingRow: {},         //編輯中的資料
        userInfo: {},            //登入的使用者資料
        tmpCUD: {               //新刪修暫存
            createData: [],
            editData: [],
            deleteData: [],
            dt_createData : [],
            dt_editData : [],
            dt_deleteData : [],
        },
        singleData: {},         //單檔資訊
        modificableForData: true       //決定是否可以修改資料
    },
    watch: {
        pageTwoFieldData:function(newObj, oldObj){
            console.log("-----pageTwoFieldData -----");
            console.log(newObj);
            console.log(oldObj);
        },
        editStatus: function (newVal) {
            if (newVal) {
                vm.createStatus = false;
                vm.deleteStatue = false;
            }
        },
        createStatus: function (newVal) {
            if (newVal) {
                vm.editStatus = false;
                vm.deleteStatue = false;
            }
        },
        deleteStatus: function (newVal) {
            if (newVal) {
                vm.editStatus = false;
                vm.createStatus = false;
            }
        }
    },
    methods: {
        //init CUD
        initTmpCUD: function () {
            this.tmpCUD = {
                createData: [],
                editData: [],
                deleteData: [],
                dt_createData : [],
                dt_editData : [],
                dt_deleteData : []
            }
        },
        //抓取顯示資料
        loadDataGridByPrgID: function (callback) {
            //waitingDialog.show("Loading...");
            $.post("/api/prgDataGridDataQuery", {prg_id: prg_id}, function (result) {
                waitingDialog.hide();
                vm.pageOneDataGridRows = result.dataGridRows;
                vm.pageOneFieldData = result.fieldData;
                vm.showCheckboxDG();
                vm.showDataGrid();
                callback(result.success);
            });
        },
        //抓取page_id 2 單頁顯示欄位
        loadSingleGridPageField: function () {
            $.post("/api/singleGridPageFieldQuery", {prg_id: prg_id, page_id: 2}, function (result) {

                var fieldData = result.fieldData;

                vm.pageTwoFieldData = _.values(_.groupBy(_.sortBy(fieldData, "row_seq"), "row_seq"));
                console.log("-----------");
                console.log(vm.pageTwoFieldData);
                //page2  datagrid 欄位屬性
                if (_.findIndex(fieldData, {ui_type: 'grid'}) > -1) {
                    $("#dt_dg_DIV").show();
                    vm.pageTwoGridFieldData = fieldData[_.findIndex(fieldData, {ui_type: 'grid'})].datagridFields || [];
                }

            })

        },
        //取得使用者資料
        fetchUserInfo: function () {
            $.post('/api/getUserInfo', function (result) {
                if (result.success)
                    vm.userInfo = result.userInfo;
            })
        },
        //show checkbox
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
            })
        },
        //顯示資料
        showDataGrid: function () {

            var columnsData = [];
            this.combineField(this.pageOneFieldData, function (columns) {
                columnsData = columns
            });
            var dgData = {total: this.pageOneDataGridRows.length, rows: this.pageOneDataGridRows};
            var dg = $('#dg').datagrid({
                columns: [columnsData],
                remoteSort: false,
                singleSelect: true,
                selectOnCheck: true,
                checkOnSelect: true,
                data: dgData,
                // onEndEdit: onEndEdit,
                onDropColumn: function () {
                    //當移動順序欄位時
                    vm.doSaveColumnFields();
                },
                onResizeColumn: function () {
                    //當欄位時寬度異動時
                    vm.doSaveColumnFields();
                },
                onSortColumn: function () {
                    vm.pageOneDataGridRows = $("#dgCheckbox").datagrid('getRows');
                    $("#dgCheckbox").datagrid('uncheckAll');
                },
                onClickRow: function (index, row) {

                    // EZfieldClass.pageTwoFieldOptionsActive(vm.pageTwoFieldData);
                    vm.editingRow = row;
                    vm.editStatus = true;
                    vm.fetchSingleData(row, function (success) {
                        vm.showSingleGridDialog();
                    })

                }
            }).datagrid('columnMoving');

            vm.pageOneDataGridRows = $("#dgCheckbox").datagrid('getRows');
        },

        //根據欄位屬性組資料
        combineField: function (fieldData, callback) {
            var columnsData = [];

            _.each(fieldData, function (field) {
                //決定欄位是否顯示
                if (field.visiable == "Y") {
                    columnsData.push(EZfieldClass.fieldConvEzAttr(field));
                }
            });

            callback(columnsData);
        },
        //dg row刪除
        removeRow: function () {
            vm.tmpCUD.deleteData = [];
            var checkRows = $('#dgCheckbox').datagrid('getSelections');
            if (checkRows == 0) {
                $.messager.alert("Warning", 'Check at least one item');
                return;
            }
            $.messager.confirm("Delete", "Are you sure delete those data?", function (q) {
                if (q) {
                    //刪除前檢查

                    _.each(checkRows, function (row) {
                        vm.tmpCUD.deleteData.push(row);
                    });

                    $.post("/api/deleteFuncRule", {
                        page_id:1,
                        prg_id: prg_id,
                        deleteData: vm.tmpCUD.deleteData
                    }, function (result) {
                        if (result.success) {
                            //刪除Row
                            _.each(checkRows, function (row) {
                                var DelIndex = $('#dg').datagrid('getRowIndex', row);
                                $('#dg').datagrid('deleteRow', DelIndex);
                            });
                            vm.showCheckboxDG($("#dg").datagrid("getRows"));
                            vm.doSaveCUD();
                        } else {
                            alert(result.errorMsg);
                        }

                    })

                }
            });
        },
        //資料儲存
        doSaveCUD: function (callback) {

            var params = _.extend({ prg_id: prg_id} , vm.tmpCUD);
            console.log("===Save params===");
            console.log(params);
            $.post("/api/saveGridSingleData", params, function (result) {
                waitingDialog.hide();
                console.log(result);
                if (result.success) {
                    vm.initTmpCUD();
                    vm.loadDataGridByPrgID(function (success) {
                        callback(success);
                    });
                    alert('save success!');
                } else {
                    alert(result.errorMsg);
                }

            })

        },
        //新增按鈕Event
        switchToCreateStatus: function () {
            vm.createStatus = true;
            vm.singleData = {};
            $.post("/api/addFuncRule", {prg_id: prg_id}, function (result) {

                if (result.success) {
                    console.log(result);
                    vm.singleData = result.defaultValues;
                    vm.showSingleGridDialog();
                    vmHub.$emit('showDtDataGrid',[]);
                } else {
                    alert(result.errorMsg);
                }

            })

        },
        //取得單筆資料
        fetchSingleData: function (editingRow, callback) {
            vm.initTmpCUD();
            vm.editStatus = true;
            vm.editingRow = editingRow;
            editingRow["prg_id"] = prg_id;
            $.post('/api/singlePageRowDataQuery', editingRow, function (result) {
                var dtData = result.dtData || [];
                if (result.success) {
                    vm.singleData = result.rowData;
                    vm.modificableForData = result.modificable || true;
                    if(dtData.length>0){
                        vmHub.$emit('showDtDataGrid', dtData);
                    }
                    callback(true);
                } else {
                    vm.singleData = {};
                    callback(false);
                }

            })
        },
        //打開單檔dialog
        showSingleGridDialog: function () {

            var dialog = $("#singleGridDialog").dialog({
                autoOpen: false,
                modal: true,
                title: "<div class='widget-header widget-header-small'><h4 class='smaller'></h4></div>",
                title_html: true,
                minWidth: 800,
                maxHeight: 600,
                resizable: true
            });
            dialog.dialog("open");

        },
        //關閉單檔dialog
        closeSingleGridDialog: function () {
            vm.editingRow = {};
            vm.singleData = {};
            vm.initTmpCUD();
            $("#singleGridDialog").dialog('close');
        },
        //儲存page1 datagrid欄位屬性
        doSaveColumnFields: function () {

            var saveField = [];
            var allField = $("#dg").datagrid("getColumnFields");

            _.each(allField, function (field, fIdx) {
                var currentColumOption = $("#dg").datagrid("getColumnOption", field);
                var editType = currentColumOption.editor.type;
                var ui_type = "text";
                if (editType == "textbox") {
                    ui_type = "text";
                } else if (editType == "numberbox") {
                    ui_type = "number";
                } else if (editType == "datebox") {
                    ui_type = "date";
                } else if (editType == "datetimebox") {
                    ui_type = "datetime";
                }

                var columnOption = {
                    "prg_id": prg_id,
                    "ui_field_name": field,
                    "ui_type": ui_type,
                    "col_seq": fIdx,
                    "visiable": "Y"
                };
                columnOption  = _.extend(columnOption,currentColumOption)
                saveField.push(columnOption);

            });

            $.post("/api/saveFieldOptionByUser", {
                prg_id: prg_id,
                fieldOptions: saveField
            });
        }


    }

});

