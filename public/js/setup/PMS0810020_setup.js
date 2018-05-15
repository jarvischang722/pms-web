/**
 * Created by Jun on 2017/2/23.
 * 程式編號: PMS0810020
 * 程式名稱: 房型設定檔
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
    vm.editingRow = row;
    vm.editStatus = true;
    vm.fetchSingleData(row, function (success) {
        vm.showSingleGridDialog();
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
                self.openFieldMultiLangDialog();
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
Vue.component('single-grid-pms0810020-tmp', {
    template: '#sigleGridPMS0810020Tmp',
    props: ['editStatus', 'createStatus', 'deleteStatus', 'editingRow', 'pageOneDataGridRows', 'pageTwoDataGridFieldData',
        'singleData', 'pageTwoFieldData', 'tmpCud', 'isModifiable', 'dialogVisible', 'displayFileList', 'imageDisplay'],
    data: function () {
        return {
            tmpCUD: {},
            isFistData: false,
            isLastData: false,
            dialogShowRoomSortVisible: false,
            dialogRmTypeStockVisible: false,
            tabName: 'ERP',
            reset_qnt: false,
            testData: '',   //TODO: 房型顯示排序，需有資料異動才會更新，暫時用此參數當作異動值
            erpSortData: [],
            webSiteSortData: [],
            originSortData: [],
            checkList: [],
            maxRmStock: '2017/06/30',
            begin_dat: '',
            end_dat: '',
            isUpdate: false,
            isSort: false,
            previewList: []
        };
    },
    created: function () {
        var self = this;
        vmHub.$on('tempExecData', function (row) {
            self.tempExecData(row);
        });
    },
    mounted: function () {
        this.fetchRoomCodOrder();
        this.fetchMaxRmStock();
    },
    watch: {
        editingRow: function (newRow, oldRow) {

            this.$parent.editingRow = newRow;
            var nowDatagridRowIndex = $("#PMS0810020_dg").datagrid('getRowIndex', newRow);
            $("#PMS0810020_dg").datagrid('selectRow', nowDatagridRowIndex);

            if ($("#PMS0810020_dg").datagrid('getRowIndex', newRow) == 0) {
                //已經到第一筆
                this.isFistData = true;
                this.isLastData = false;
            } else if ($("#PMS0810020_dg").datagrid('getRowIndex', newRow) == this.pageOneDataGridRows.length - 1) {
                //已經到最後一筆
                this.isFistData = false;
                this.isLastData = true;
            } else {

                this.isFistData = false;
                this.isLastData = false;
            }

        },

        tabName: function (newName) {
            if (newName == "ERP") {
                this.erpSortData = _.sortBy(this.erpSortData, function (item) {
                    return item.view_seq;
                });
            }
            else {
                this.webSiteSortData = _.sortBy(this.webSiteSortData, function (item) {
                    return item.wrs_sort_cod;
                });
            }

        }
    },
    methods: {
        //打開單欄多語編輯
        editFieldMultiLang: function (fieldInfo) {
            vmHub.$emit('editFieldMultiLang', fieldInfo);
        },

        //檢查欄位規則，在離開欄位時
        chkFieldRule: function (ui_field_name, rule_func_name) {
            if (vm.originData[ui_field_name] == this.singleData[ui_field_name]) {
                return;
            }

            var lo_fieldData = _.findWhere(vm.pageTwoDataGridFieldData, {ui_field_name: ui_field_name});

            if (rule_func_name === "" || !this.isModifiable) {
                return;
            }
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
                        //是否要show出訊息
                        if (result.showAlert) {
                            alert(result.alertMsg);
                        }

                        //是否要show出詢問視窗
                        if (result.showConfirm) {
                            if (confirm(result.confirmMsg)) {

                            } else {
                                //有沒有要再打一次ajax到後端
                                if (result.isGoPostAjax && !_.isEmpty(result.ajaxURL)) {
                                    $.post(result.ajaxURL, postData, function (result) {

                                        if (!result.success) {
                                            alert(result.errorMsg);
                                        } else {

                                            if (!_.isUndefined(result.effectValues) && _.size(result.effectValues) > 0) {
                                                self.singleData = _.extend(self.singleData, result.effectValues);
                                            }

                                        }
                                    });
                                }
                            }
                        }

                    } else {
                        alert(result.errorMsg);
                    }

                    //連動帶回的值
                    console.log(result.effectValues);
                    if (!_.isUndefined(result.effectValues) && _.size(result.effectValues) > 0) {

                        self.singleData = _.extend(self.singleData, result.effectValues);
                    }

                });
            }
        },

        // 取得房型排序設定資料
        fetchRoomCodOrder: function () {
            var self = this;
            $.post('/api/PMS0810020/roomCodOrder', function (response) {
                self.originSortData = response.roomCodOrderData;
                self.erpSortData = _.sortBy(self.originSortData, function (item) {
                    return item.view_seq;
                });
                self.webSiteSortData = _.sortBy(self.originSortData, function (item) {
                    return item.wrs_sort_cod;
                });

                _.each(self.webSiteSortData, function (wrsData) {
                    if (wrsData.wrs_sort_cod == "-1") {
                        self.checkList.push(wrsData.room_cod);
                    }
                });
            });
        },

        // 取得庫存
        fetchMaxRmStock: function () {
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
            var q = confirm("Are you sure delete those data?");
            if (q) {
                //刪除前檢查
                $.post("/api/deleteFuncRule", {
                    page_id: 2,
                    prg_id: prg_id,
                    deleteData: [self.singleData]
                }, function (result) {
                    if (result.success) {
                        self.deleteStatus = true;
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
        //新增
        emitAppendRow: function () {
            this.$emit('append-row');
        },
        //儲存新增或修改資料
        doSaveGrid: function (saveAfterAction) {

            var self = this;
            var targetRowAfterDelete = {}; //刪除後要指向的資料
            if (this.deleteStatus) {
                var rowsNum = $("#PMS0810020_dg").datagrid('getRows').length;
                var currentRowIdx = $("#PMS0810020_dg").datagrid('getRowIndex', self.editingRow); //目前索引
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
                self.fetchRoomCodOrder();
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
                    } else {
                        self.emitFetchSingleData();
                    }
                    self.previewList = [];
                    if (self.deleteStatus) {
                        /**
                         * 刪除成功
                         * 1.取下一筆
                         * 2.無下一筆時取datagrid 最後一筆
                         * 3.連一筆都沒有關掉dialog 回多筆
                         **/
                        if ($("#PMS0810020_dg").datagrid('getRows').length > 0) {
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

        appendDtRow: function () {
        },
        removeDtRow: function () {
        },
        showDropdownDisplayName: function (val, selectData) {
            if (_.findIndex(selectData, {value: val}) > -1) {
                return _.findWhere(selectData, {value: val}).display;
            }
            return val + ":";

        },

        tabChange: function (tab) {
            this.tabName = tab.name;
        },

        //上傳官網
        uploadWebSite: function () {
            var self = this;

            var lo_params = {
                room_cod: this.$parent.singleData.room_cod,
                begin_dat: this.$parent.singleData.begin_dat
            };

            if (this.isUpdate) {
                var result = confirm("是否儲存已編輯資料?");
                if (result) {
                    if (self.editStatus) {
                        self.$parent.initTmpCUD();
                        self.$parent.tmpCud.editData = [self.singleData];
                    }
                    self.$parent.doSaveCUD(function (saveResult) {
                        if (saveResult) {
                            self.execUploadRoomType(lo_params);
                            self.isUpdate = false;
                        }
                    });
                }
                self.$parent.loadSingleGridPageField();

            }
            else {
                self.execUploadRoomType(lo_params);
            }
        },

        // 執行上傳官網
        execUploadRoomType: function (lo_params) {
            var params = _.extend({prg_id: prg_id}, lo_params);
            $.post("/api/gateway/uploadRoomType", params, function (result) {
                if (result.success) {
                    alert('uploadRoomType success!');
                } else {
                    alert(result.errorMsg);
                }
            });
        },

        //上傳正圖
        uploadRoomTypePic: function () {
            var self = this;
            var lo_params = {
                room_cod: this.$parent.singleData.room_cod,
                begin_dat: this.$parent.singleData.begin_dat
            };

            if (this.isUpdate) {

                var result = confirm("是否儲存已編輯資料?");
                if (result) {
                    if (self.editStatus) {
                        self.$parent.initTmpCUD();
                        self.$parent.tmpCud.editData = [self.singleData];
                    }
                    self.$parent.doSaveCUD(function (saveResult) {
                        if (saveResult) {
                            if (self.$parent.displayFileList.length != 0) {
                                self.execUploadRoomTypePic(lo_params);
                            }
                            else {
                                alert("無圖片可上傳");
                            }
                            self.isUpdate = false;
                        }
                    });
                }

            }
            else {
                if (self.$parent.displayFileList.length != 0) {
                    self.execUploadRoomTypePic(lo_params);
                }
                else {
                    alert("無圖片可上傳");
                }
            }
        },

        execUploadRoomTypePic: function (lo_params) {
            $.post("/api/gateway/uploadRoomTypePic", lo_params, function (getResult) {
                if (getResult.success) {
                    alert("upload success!");
                }
                else {
                    alert(getResult.errorMsg);
                }
            });
        },

        // 顯示庫存dialog
        showRoomTypeStock: function () {
            var self = this;
            if (this.isUpdate) {

                var result = confirm("是否儲存已編輯資料?");
                if (result) {
                    if (self.editStatus) {
                        self.$parent.initTmpCUD();
                        self.$parent.tmpCud.editData = [self.singleData];
                    }
                    self.$parent.doSaveCUD(function (saveResult) {
                        if (saveResult) {
                            self.execShowRoomTypeStock();
                            self.isUpdate = false;
                        }
                    });
                }

            }
            else {
                self.execShowRoomTypeStock();
            }
        },

        // 執行顯示庫存dialog
        execShowRoomTypeStock: function () {
            this.showRoomTypeMaxStockDate();
            this.dialogRmTypeStockVisible = true;
            this.reset_qnt = false;
            this.begin_dat = this.$parent.singleData.begin_dat;
            this.end_dat = this.$parent.singleData.end_dat;
        },

        // 顯示房型排序dialog
        showRoomTypeSort: function () {
            var self = this;
            if (this.isUpdate) {
                var result = confirm("是否儲存已編輯資料?");
                if (result) {
                    if (self.editStatus) {
                        self.$parent.initTmpCUD();
                        self.$parent.tmpCud.editData = [self.singleData];
                    }
                    self.$parent.doSaveCUD(function (saveResult) {
                        if (saveResult) {
                            self.dialogShowRoomSortVisible = true;
                            self.isUpdate = false;
                        }
                    });
                }

            }
            else {
                self.dialogShowRoomSortVisible = true;
            }
        },

        // 移動排序
        itemMove: function (li_oldIndex, li_newIndex, data) {
            this.testData = li_oldIndex;
            this.testData = "";

            var temp = data[li_oldIndex];
            data[li_oldIndex] = data[li_newIndex];
            data[li_newIndex] = temp;
        },

        // 儲存房型排序
        rmCodSortSave: function () {
            var self = this;
            var fieldData = [
                {ui_field_name: 'room_cod', keyable: 'Y'},
                {ui_field_name: 'athena_id', keyable: 'Y'},
                {ui_field_name: 'hotel_cod', keyable: 'Y'}
            ];

            this.initTmpCud();

            _.each(this.originSortData, function (item, index) {

                var li_view_seq = _.findIndex(self.erpSortData, function (eachErp) {
                    return eachErp.room_cod == item.room_cod;
                });

                var wrsDisable = _.find(self.checkList, function (room_cod) {
                    return room_cod == item.room_cod;
                });

                var li_wrs_sort_order;
                if (!_.isUndefined(wrsDisable)) {
                    li_wrs_sort_order = -1;
                }
                else {
                    li_wrs_sort_order = _.findIndex(self.webSiteSortData, function (eachWebSite) {
                        return eachWebSite.room_cod == item.room_cod;
                    });
                }

                self.tmpCUD.updateData.push({
                    room_cod: item.room_cod,
                    view_seq: li_view_seq,
                    wrs_sort_cod: li_wrs_sort_order
                });
            });

            var params = {
                prg_id: prg_id,
                tmpCUD: this.tmpCUD,
                fieldData: fieldData,
                mainTableName: "room_cod_order"
            };
            this.$parent.execSQLProcessAction(params, function (err, result) {
            });
        },

        // 初始化tmpCUD
        initTmpCud: function () {
            this.tmpCUD = {
                createData: [],
                updateData: [],
                deleteData: []
            };
        },

        // 儲存房型庫存
        genRmStockSave: function () {
            var self = this;
            var lo_params = {
                start_dat: this.begin_dat,
                end_dat: this.end_dat,
                reset_qnt: this.reset_qnt ? "Y" : "N"
            };

            var params = _.extend({prg_id: prg_id}, lo_params);
            $.post("/api/gateway/genRoomTypeStock", params, function (result) {

                if (result.success) {
                    self.dialogRmTypeStockVisible = false;
                    self.showRoomTypeMaxStockDate();
                    alert(go_i18nLang.SystemCommon.saveSuccess);
                } else {
                    alert(result.errorMsg);
                }
            });


        },

        //房型庫存最大日期
        showRoomTypeMaxStockDate: function () {
            var self = this;
            $.post("/api/getRoomTypeMaxStockDate", function (result) {
                self.maxRmStock = moment(result.max_batch_dat).format("YYYY/MM/DD");
            });
        },

        // 圖片change事件
        fileChange: function (file, fileList) {
            this.$parent.uploadFileList.push(file);
        },

        // 刪除預覽圖片
        fileRemove: function (file, fileList) {
            var ls_uploadFileList = this.$parent.uploadFileList;
            this.$parent.uploadFileList = _.without(ls_uploadFileList, file);
            this.$parent.imageDisplay = true;
        }
    }
})
;

var vm = new Vue({
    el: '#GSApp',
    mounted: function () {
        this.initTmpCUD();
        this.fetchUserInfo();
        this.loadDataGridByPrgID();
        this.loadSingleGridPageField();
    },
    components: {
        "search-comp": go_searchComp
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
            deleteData: []
        },
        originData: {},         //原始資料
        singleData: {},         //單檔資訊
        isModifiable: true,       //決定是否可以修改資料
        dialogVisible: false,
        dgIns: {},
        labelPosition: 'right',
        uploadFileList: [],
        displayFileList: [],
        imageDisplay: true,
        isLoading: false,
        searchFields: [], //搜尋的欄位
        searchFieldsByRow: [], //搜尋的欄位
        searchCond: {},   //搜尋條件
        isSaving: false,
        maxWidth: 0
    },
    watch: {
        editingRow: function (val) {
            this.dgIns.clearSelection();
        },
        editStatus: function (newVal) {
            if (newVal) {
                vm.createStatus = false;
                vm.deleteStatus = false;
            }
        },
        createStatus: function (newVal) {
            if (newVal) {
                vm.editStatus = false;
                vm.deleteStatus = false;
            }
        },
        deleteStatus: function (newVal) {
            if (newVal) {
                vm.editStatus = false;
                vm.createStatus = false;
            }
        },
        uploadFileList: function (newVal) {
            if (this.uploadFileList.length != 0) {
                this.imageDisplay = false;
            }
        },
        searchFields: function (newFields) {
            this.searchFieldsByRow = _.values(_.groupBy(_.sortBy(this.searchFields, "row_seq"), "row_seq"));
        }
    },
    methods: {
        //Init CUD
        initTmpCUD: function () {
            this.tmpCud = {
                createData: [],
                editData: [],
                deleteData: []
            };
        },
        //抓取顯示資料
        loadDataGridByPrgID: function (callback) {
            if (_.isUndefined(callback) || _.isNull(callback)) {
                callback = function () {
                };
            }
            $.post("/api/prgDataGridDataQuery", {prg_id: prg_id, searchCond: this.searchCond}, function (result) {

                vm.searchFields = result.searchFields;
                vm.pageOneDataGridRows = result.dataGridRows;
                vm.pageOneFieldData = result.fieldData;
                vm.showDataGrid();
                callback(result.success);
            });
        },
        //抓取page_id 2 單頁顯示欄位
        loadSingleGridPageField: function () {
            var self = this;
            $.post("/api/singleGridPageFieldQuery", {prg_id: prg_id, page_id: 2}, function (result) {
                var fieldData = result.fieldData;
                vm.pageTwoDataGridFieldData = result.fieldData;
                vm.pageTwoFieldData = _.values(_.groupBy(_.sortBy(fieldData, "row_seq"), "row_seq"));

                // 算最小寬度 && 最大行數
                var maxField = _.max(vm.pageTwoFieldData, function (lo_pageTwoField) {
                    return lo_pageTwoField.length;
                });
                _.each(maxField, function (lo_maxField) {
                    self.maxWidth += (lo_maxField.width + lo_maxField.label_width + 14);
                });
            });
        },

        //取得使用者資料
        fetchUserInfo: function () {
            $.post('/api/getUserInfo', function (result) {
                if (result.success) {
                    vm.userInfo = result.userInfo;
                }
            });
        },

        //顯示DataGrid
        showDataGrid: function () {

            var colOption = [{field: 'ck', checkbox: true}];
            colOption = _.union(colOption, DatagridFieldAdapter.combineFieldOption(this.pageOneFieldData, 'PMS0810020_dg'));
            this.dgIns = new DatagridRmSingleGridClass();
            this.dgIns.init(prg_id, 'PMS0810020_dg', colOption, this.pageOneFieldData, {singleSelect: false});
            this.dgIns.loadDgData(this.pageOneDataGridRows);
        },
        //dg row刪除
        removeRow: function () {
            vm.tmpCud.deleteData = [];
            var checkRows = $('#PMS0810020_dg').datagrid('getChecked');
            if (checkRows == 0) {
                alert('Check at least one item.');
                return;
            }
            var q = confirm("Are you sure delete those data?");
            if (q) {
                //刪除Row
                _.each(checkRows, function (row) {
                    vm.tmpCud.deleteData.push(row);
                });
                //刪除前檢查
                $.post("/api/deleteFuncRule", {
                    page_id: 1,
                    prg_id: prg_id,
                    deleteData: vm.tmpCud.deleteData
                }, function (result) {
                    if (result.success) {
                        //刪除Row
                        _.each(checkRows, function (row) {
                            var ln_delIndex = $('#PMS0810020_dg').datagrid('getRowIndex', row);
                            $('#PMS0810020_dg').datagrid('deleteRow', ln_delIndex);
                        });
                        vm.doSaveCUD();
                    } else {
                        vm.tmpCud.deleteData = [];
                        alert(result.errorMsg);
                    }

                });

            }

        },
        //資料驗證
        dataValidate: function () {
            var self = this;
            var lo_chkResult;
            for (var i = 0; i < this.pageTwoDataGridFieldData.length; i++) {
                var lo_field = this.pageTwoDataGridFieldData[i];
                //必填
                if (lo_field.requirable == "Y" && lo_field.modificable != "N") {
                    lo_chkResult = go_validateClass.required(self.singleData[lo_field.ui_field_name], lo_field.ui_display_name);
                    if (lo_chkResult.success == false) {
                        break;
                    }
                }

                //有format
                if (lo_field.format_func_name != "") {
                    lo_chkResult = go_validateClass[lo_field.format_func_name](self.singleData[lo_field.ui_field_name], lo_field.ui_display_name);
                    if (lo_chkResult.success == false) {
                        break;
                    }
                }
            }

            return lo_chkResult;

        },

        //資料儲存
        doSaveCUD: function (callback) {
            if (_.isUndefined(callback)) {
                callback = function () {
                };
            }
            var self = this;
            var params = _.extend({prg_id: prg_id}, vm.tmpCud);
            var lo_chkResult = this.dataValidate();
            if (vm.tmpCud.deleteData.length == 0 && lo_chkResult.success == false) {
                alert(lo_chkResult.msg);
                return;
            }
            self.isSaving = true;
            $.post("/api/saveGridSingleData", params, function (result) {
                self.isSaving = false;
                if (result.success) {
                    if (self.uploadFileList.length != 0) {
                        self.uploadAction(callback);
                        return true;
                    }

                    vm.initTmpCUD();
                    vm.loadDataGridByPrgID();
                    alert(go_i18nLang.SystemCommon.saveSuccess);

                    callback(true);
                } else {
                    alert(result.errorMsg);
                    callback(false);
                }
            });

        },

        // 上傳圖檔預處理
        uploadAction: function (callback) {
            var self = this;
            var li_file_counter = 0;
            var fd = new FormData();
            _.each(self.uploadFileList, function (file) {
                var blobUrl = file.url;

                var xhr = new XMLHttpRequest;
                xhr.responseType = 'blob';

                xhr.onload = function () {
                    var recoveredBlob = xhr.response;
                    var reader = new FileReader;
                    reader.onload = function () {
                        li_file_counter++;
                        var blobAsDataUrl = reader.result;
                        var ext = file.name.split(".")[1];
                        var begin_dat = moment(self.singleData.begin_dat);
                        var year = begin_dat.format("YYYY");
                        var mon = begin_dat.format("MM");
                        var day = begin_dat.format("DD");


                        fd.append('imageURL', blobAsDataUrl);
                        fd.append("info", JSON.stringify({
                            room_cod: self.singleData.room_cod,
                            begin_dat: self.singleData.begin_dat,
                            fileName: self.singleData.room_cod.trim() + "_" + year + mon + day + "." + ext
                        }));

                        if (li_file_counter == self.uploadFileList.length) {
                            self.execFileUpload(fd, callback);
                        }
                    };

                    reader.readAsDataURL(recoveredBlob);
                };

                xhr.open('GET', blobUrl);
                xhr.send();
            });
        },

        // 執行圖片上傳
        execFileUpload: function (fd, callback) {
            var self = this;
            $.ajax({
                type: 'POST',
                url: '/api/uploadFile',
                data: fd,
                cache: false,
                contentType: false,
                processData: false
            }, function (uploadResult) {

                if (uploadResult.success) {
                    self.uploadFileList = [];
                    var fieldData = [
                        {ui_field_name: 'room_cod', keyable: 'Y'},
                        {ui_field_name: 'athena_id', keyable: 'Y'},
                        {ui_field_name: 'hotel_cod', keyable: 'Y'},
                        {ui_field_name: 'begin_dat', keyable: 'Y'}
                    ];

                    var lo_tmpCUD = {
                        createData: [],
                        updateData: [],
                        deleteData: []
                    };

                    _.each(uploadResult.rtnData, function (eachData) {
                        lo_tmpCUD.updateData.push({
                            "room_cod": self.singleData.room_cod,
                            "pic_path": eachData.fileDir,
                            "begin_dat": self.singleData.begin_dat
                        });
                    });

                    var params = {
                        prg_id: prg_id,
                        tmpCUD: lo_tmpCUD,
                        fieldData: fieldData,
                        mainTableName: "wrs_normal_pic"
                    };
                    self.execSQLProcessAction(params, function (err, result) {
                        if (result) {
                            vm.initTmpCUD();

                            vm.loadDataGridByPrgID(function (success) {
                                callback(success);
                            });


                        }
                    });


                }
                else {
                    alert(uploadResult.errorMsg);
                }
            });
        },

        // 執行SQLProcess
        execSQLProcessAction: function (params, callback) {
            var self = this;
            self.isSaving = true;
            $.post("/api/execSQLProcess", params)
                .done(function (response) {
                    self.isSaving = false;
                    if (response.success) {
                        alert(go_i18nLang.SystemCommon.saveSuccess);
                        callback(null, true);
                    } else {
                        alert(response.errorMsg);
                        callback(response.errorMsg, false);
                    }
                })
                .fail(function (error) {
                    self.isSaving = false;
                    callback(error, false);
                });
        },

        //新增按鈕Event
        appendRow: function () {
            vm.initTmpCUD();
            vm.isModifiable = true;
            vm.createStatus = true;
            vm.imageDisplay = false;
            vm.singleData = {};
            $.post("/api/addFuncRule", {prg_id: prg_id, page_id: 1}, function (result) {
                if (result.success) {
                    vm.singleData = result.defaultValues;
                    vm.showSingleGridDialog();
                } else {
                    alert(result.errorMsg);
                }

            });

        },

        //取得單筆資料
        fetchSingleData: function (editingRow, callback) {
            vm.isLoading = true;
            vm.initTmpCUD();
            vm.editStatus = true;
            vm.editingRow = editingRow;

            editingRow["prg_id"] = prg_id;
            $.post('/api/singlePageRowDataQuery', editingRow, function (result) {
                vm.isLoading = false;
                if (result.success) {
                    vm.singleData = result.rowData;
                    vm.originData = _.clone(result.rowData);
                    vm.isModifiable = result.isModifiable;
                    vm.displayFileList = [];
                    if (result.showAlert) {
                        alert(result.alertMsg);
                    }
                    // self.getRoomTypePic(callback);
                    callback(true);

                } else {
                    vm.singleData = {};
                    callback(false);
                }

            });
        },

        // 取房型圖片
        getRoomTypePic: function (callback) {
            var params = {
                room_cod: vm.singleData.room_cod,
                begin_dat: vm.singleData.begin_dat
            };
            $.post("/api/PMS0810020/getRoomTypeUploadPic", params)
                .done(function (getResult) {
                    vm.isLoading = false;
                    if (getResult.success) {
                        vm.singleData.pic_path = getResult.roomTypePicData;
                        _.each(vm.singleData.pic_path, function (eachPic) {
                            var la_filePath = eachPic.pic_path.split("/");
                            var ls_fileName = la_filePath[la_filePath.length - 1];
                            vm.displayFileList.push({
                                name: ls_fileName,
                                url: eachPic.pic_path + "?" + Math.random()
                            });

                        });
                        vm.uploadFileList = [];
                        vm.imageDisplay = true;
                        callback(true);
                    }
                    else {
                        vm.singleData.pic_path = [];
                        callback(true);
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
            // this.initDatePicker();
            this.dialogVisible = true;
            var maxHeight = document.documentElement.clientHeight - 70; //browser 高度 - 70功能列

            var btnWt = $('.right-menu-co').outerWidth();
            var dialogWt = this.maxWidth + btnWt;
            // alert(dialogWt);
            var height = 10 * 50; // 預設一個row 高度
            var dialog = $("#singleGridPMS0810020").dialog({
                autoOpen: false,
                modal: true,
                height: _.min([maxHeight, height]),
                title: prg_id,
                minWidth: _.min([dialogWt, 1000]),
                width: _.min([dialogWt, 1000]),
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
            vm.editingRow = {};
            vm.singleData = {};
            vm.initTmpCUD();
            $("#singleGridPMS0810020").dialog('close');
        }
    }

});


Vue.filter("showDropdownDisplayName", function (val) {

});

