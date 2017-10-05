/**
 * Created by a16010 on 2017/7/31.
 * 程式編號: PMS0820020
 * 程式名稱: 逾時計價相關設定
 */

var prg_id = $("#prg_id").val();
var vmHub = new Vue;

var go_Field_Data_Tmp;

/** DatagridRmSingleGridClass ***/
function DatagridRmSingleGridClass() {
}

DatagridRmSingleGridClass.prototype = new DatagridBaseClass();
DatagridRmSingleGridClass.prototype.onClickRow = function (idx, row) {
    PMS0820020VM.editingRow = row;
    PMS0820020VM.editStatus = true;
    PMS0820020VM.fetchSingleData(row, function (success) {
        PMS0820020VM.pageTwoFieldData = _.values(_.groupBy(_.sortBy(go_Field_Data_Tmp, "row_seq"), "row_seq"));
        PMS0820020VM.oriPageTwoFieldData = go_Field_Data_Tmp;
        PMS0820020VM.showSingleGridDialog();
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
Vue.component('single-grid-pms0820020-tmp', {
    template: '#sigleGridPMS0820020Tmp',
    props: ['editStatus', 'createStatus', 'deleteStatus', 'editingRow', 'pageOneDataGridRows', 'pageTwoDataGridFieldData',
        'singleData', 'pageTwoFieldData', 'tmpCud', 'isModifiable'],
    data: function () {
        return {
            tmpCUD: {},
            isFistData: false,
            isLastData: false,
            dtDataGridIsCreate: false,
            BTN_action: false
        };
    },
    created: function () {
    },

    watch: {
        editingRow: function (newRow, oldRow) {

            this.$parent.editingRow = newRow;
            var nowDatagridRowIndex = $("#PMS0820020_dg").datagrid('getRowIndex', newRow);
            $("#PMS0820020_dg").datagrid('selectRow', nowDatagridRowIndex);

            if ($("#PMS0820020_dg").datagrid('getRowIndex', newRow) == 0) {
                //已經到第一筆
                this.isFistData = true;
                this.isLastData = false;
            } else if ($("#PMS0820020_dg").datagrid('getRowIndex', newRow) == this.pageOneDataGridRows.length - 1) {
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
        //到第一筆
        toFirstData: function () {
            this.isFistData = true;
            this.isLastData = false;
            this.editingRow = _.first(this.pageOneDataGridRows);
            this.emitFetchSingleData();
        },

        //上一筆
        toPreData: function () {
            var nowRowIndex = $("#PMS0820020_dg").datagrid('getRowIndex', this.editingRow);
            this.editingRow = this.pageOneDataGridRows[nowRowIndex - 1];
            this.emitFetchSingleData();

        },

        //下一筆
        toNextData: function () {
            var nowRowIndex = $("#PMS0820020_dg").datagrid('getRowIndex', this.editingRow);
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
            var self = this;
            var targetRowAfterDelete = {}; //刪除後要指向的資料
            if (this.deleteStatue) {
                var rowsNum = $("#PMS0820020_dg").datagrid('getRows').length;
                var currentRowIdx = $("#PMS0820020_dg").datagrid('getRowIndex', self.editingRow); //目前索引
                if (currentRowIdx == rowsNum - 1) {
                    //刪除的資料已經是最後一筆 就取datagrid最末筆
                    targetRowAfterDelete = self.pageOneDataGridRows[currentRowIdx - 1];

                } else {
                    //取下一筆
                    targetRowAfterDelete = self.pageOneDataGridRows[currentRowIdx + 1];
                }
            }

            if (this.createStatus) {
                if (PMS0820020VM.isbatchAdd) {    //判斷是否為批次新增
                    var lo_tmpCud = [];
                    var li_room_nos_leng = (!_.isUndefined(this.singleData.front_cod) && this.singleData.front_cod != "") ? Number(this.singleData.room_leng) - 1 : Number(this.singleData.room_leng);
                    for (var i = Number(this.singleData.room_begin_nos); i <= Number(this.singleData.room_end_nos); i++) {

                        if (this.singleData.room_nos_typ == 1) {
                            if (i % 2 == 0) {
                                continue;
                            }
                        }
                        else if (this.singleData.room_nos_typ == 2) {
                            if (i % 2 == 1) {
                                continue;
                            }
                        }

                        var li_room_nos = padLeft(i.toString(), li_room_nos_leng);
                        var ls_front_cod = (_.isUndefined(this.singleData.front_cod) && this.singleData.front_cod != "") ? "" : this.singleData.front_cod.trim();
                        li_room_nos = ls_front_cod + li_room_nos;

                        //判斷是否已經存在
                        var existIdx = _.findIndex(this.pageOneDataGridRows, function (lo_rows) {
                            return lo_rows.room_nos.trim() == li_room_nos.trim();
                        });

                        if (existIdx != -1) {
                            continue;
                        }

                        this.singleData.room_nos = li_room_nos;
                        lo_tmpCud.push(_.clone(this.singleData));
                    }
                    this.tmpCud.createData = lo_tmpCud;
                }
                else {
                    this.tmpCud.createData = [this.singleData];
                }
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
                        if ($("#PMS0820020_dg").datagrid('getRows').length > 0) {
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

        //檢查欄位規則，在離開欄位時
        chkFieldRule: function (ui_field_name, rule_func_name) {
            var self = this;
            var lo_singleData = this.singleData;

            if (!_.isEmpty(rule_func_name.trim())) {
                var postData = {
                    prg_id: prg_id,
                    rule_func_name: rule_func_name,
                    validateField: ui_field_name,
                    singleRowData: lo_singleData,
                    oriSingleRowData: PMS0820020VM.originData
                };
                $.post('/api/chkFieldRule', postData, function (result) {
                    if (result.success) {
                        // PMS0820020VM.originData = _.clone(lo_singleData);
                        //是否要show出訊息
                        if (result.showAlert) {
                            alert(result.alertMsg);
                        }

                        //是否要show出詢問視窗
                        if (result.showConfirm) {
                            if (confirm(result.confirmMsg)) {
                            }
                        }
                    } else {
                        alert(result.errorMsg);
                    }

                    //連動帶回的值
                    if (!_.isUndefined(result.effectValues) && !_.isEmpty(result.effectValues)) {
                        PMS0820020VM.singleData = _.extend(PMS0820020VM.singleData, result.effectValues);
                    }
                });
            }
        },

        chkClickPopUpGrid: function (field) {

        }
    }
});


var PMS0820020VM = new Vue({
    el: '#GSApp',
    mounted: function () {
        this.initTmpCUD();
        this.fetchUserInfo();
        this.loadDataGridByPrgID(function (success) {
        });
        this.loadSingleGridPageField();
    },
    components: {
        "search-comp": go_searchComp
    },
    data: {
        isDatepickerInit: false,
        sys_locales: JSON.parse(decodeURIComponent(getCookie("sys_locales")).replace("j:", "")),
        createStatus: false,            //新增狀態
        editStatus: false,              //編輯狀態
        deleteStatus: false,            //刪除狀態
        isbatchAdd: false,              //是否為批次新增
        pageOneDataGridRows: [],        //page_id 1 的 datagrid資料
        pageOneFieldData: [],           //page_id 1 datagird欄位
        pageTwoFieldData: [],           //page_id 2 欄位
        oriPageTwoFieldData: [],        //page_id 2 原始欄位資料
        pageTwoDataGridFieldData: [],   //page_id 2 datagird欄位
        editingRow: {},                 //編輯中的資料
        userInfo: {},                   //登入的使用者資料
        tmpCud: {                       //新刪修暫存
            createData: [],
            editData: [],
            deleteData: []
        },
        originData: {},                 //原始資料
        singleData: {},                 //單檔資訊
        dgIns: {},
        labelPosition: 'right',
        searchFields: [],               //搜尋的欄位
        searchCond: {},                 //搜尋條件
        isModifiable: true,             //決定是否可以修改資料
        showRoomSortDialog: false,      //是否顯示房間排序dialog
        roomSortData: [],               //房間排序資料
        testData: '',                    //TODO: 排序，需有資料異動才會更新，暫時用此參數當作異動值
        sort_typ: "",
        isAction: false
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
            $.post("/api/prgDataGridDataQuery", {prg_id: prg_id, searchCond: this.searchCond}, function (result) {
                PMS0820020VM.searchFields = result.searchFields;
                PMS0820020VM.pageOneDataGridRows = result.dataGridRows;
                PMS0820020VM.pageOneFieldData = result.fieldData;
                PMS0820020VM.showCheckboxDG();
                PMS0820020VM.showDataGrid();
                callback(result.success);
            });
        },

        //顯示DataGrid
        showDataGrid: function () {

            this.dgIns = new DatagridRmSingleGridClass();
            this.dgIns.init(prg_id, 'PMS0820020_dg', EZfieldClass.combineFieldOption(this.pageOneFieldData, 'PMS0820020_dg'));
            this.dgIns.loadDgData(this.pageOneDataGridRows);
            // PMS0820020VM.pageOneDataGridRows = $("#dgCheckbox").datagrid('getRows');
        },

        //取得使用者資料
        fetchUserInfo: function () {
            $.post('/api/getUserInfo', function (result) {
                if (result.success) {
                    PMS0820020VM.userInfo = result.userInfo;
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
            PMS0820020VM.initTmpCUD();
            PMS0820020VM.createStatus = true;
            PMS0820020VM.editStatus = false;
            PMS0820020VM.isbatchAdd = false;
            PMS0820020VM.singleData = {};
            PMS0820020VM.isModifiable = true;
            PMS0820020VM.pageTwoFieldData = _.values(_.groupBy(_.sortBy(go_Field_Data_Tmp, "row_seq"), "row_seq"));
            PMS0820020VM.oriPageTwoFieldData = go_Field_Data_Tmp;

            $.post("/api/addFuncRule", {prg_id: prg_id, page_id: 1}, function (result) {
                if (result.success) {
                    PMS0820020VM.singleData = result.defaultValues;
                    PMS0820020VM.showSingleGridDialog();
                } else {
                    alert(result.errorMsg);
                }
            });
        },

        //批次新增按鈕Event
        batchappendRow: function () {
            PMS0820020VM.initTmpCUD();
            PMS0820020VM.createStatus = true;
            PMS0820020VM.editStatus = false;
            PMS0820020VM.isbatchAdd = true;
            PMS0820020VM.singleData = {
                room_sta: "V",
                assign_sta: "N",
                clean_sta: "C",
                bed_sta: "N",
                adult_qnt: 0,
                child_qnt: 0,
                baby_qnt: 0,
                view_seq: 99999
            };

            //塞欄位
            this.fetchBatchFieldData(function (fieldData) {
                PMS0820020VM.pageTwoFieldData = _.values(_.groupBy(_.sortBy(fieldData, "row_seq"), "row_seq"));
                PMS0820020VM.oriPageTwoFieldData = fieldData;

                PMS0820020VM.showSingleGridDialog();
            });
        },

        fetchBatchFieldData: function (callback) {
            var self = this;
            var lo_params = {
                prg_id: prg_id,
                func_id: "1009"
            };
            $.post("/api/specialDataGridBtnEventRule", lo_params, function (getResult) {
                if (getResult.success) {
                    var lo_fieldData = [];
                    var la_ui_field_name = ["room_leng", "front_cod", "room_begin_nos", "build_nos", "room_end_nos", "floor_nos",
                        "room_cod", "room_nos_typ", "bed_sta"];
                    var li_row_seq = 1;
                    var li_col_seq = 1;

                    _.each(la_ui_field_name, function (ui_field_name, index) {
                        var la_option_field_name = [];
                        var ls_ui_type = "text";
                        var li_width = 165;
                        var ls_requirable = (ui_field_name == "front_cod") ? "N" : "Y";
                        var ls_keyable = "N";

                        if (ui_field_name == "room_cod" || ui_field_name == "room_nos_typ" || ui_field_name == "bed_sta") {
                            li_col_seq = 1;
                            li_width = 420;
                            li_row_seq++;
                            ls_ui_type = "select";

                            if (ui_field_name == "room_cod") {
                                la_option_field_name = getResult.selectOptions;
                                PMS0820020VM.singleData.room_cod = la_option_field_name[0].value;
                            }
                            else if (ui_field_name == "room_nos_typ") {
                                la_option_field_name = [
                                    {
                                        display: "both_nos",
                                        value: 0
                                    },
                                    {
                                        display: "single_nos",
                                        value: 1
                                    },
                                    {
                                        display: "double_nos",
                                        value: 2
                                    }
                                ];
                                PMS0820020VM.singleData.room_nos_typ = la_option_field_name[0].value;
                            }
                            else if (ui_field_name == "bed_sta") {
                                la_option_field_name = [
                                    {
                                        display: "noset_bed",
                                        value: "N"
                                    },
                                    {
                                        display: "single_bed",
                                        value: "S"
                                    },
                                    {
                                        display: "double_bed",
                                        value: "M"
                                    }
                                ];
                            }
                        }
                        else {
                            if (index != 0) {
                                if (index % 2 == 0) {
                                    li_row_seq++;
                                    li_col_seq = 1;
                                }
                                else {
                                    li_col_seq++;
                                }
                            }
                        }

                        var lo_fieldAttrObj = new fieldAttrClass(prg_id, ui_field_name, ls_ui_type, li_row_seq, li_col_seq);
                        lo_fieldAttrObj.width = li_width;
                        lo_fieldAttrObj.ui_field_length = self.chkUiFieldLength(ui_field_name);
                        lo_fieldAttrObj.set_selectData(la_option_field_name);
                        lo_fieldAttrObj.requirable = ls_requirable;
                        lo_fieldAttrObj.keyable = ls_keyable;
                        lo_fieldAttrObj.rule_func_name = self.chkFieldHasRule(ui_field_name);
                        lo_fieldAttrObj.format_func_name = self.chkFieldHasFormat(ui_field_name);

                        lo_fieldData.push(lo_fieldAttrObj);
                    });

                    callback(lo_fieldData);
                }
            });
        },

        // 檢查欄位是否需要規則
        chkFieldHasRule: function (ui_field_name) {
            var ls_rule_func_name = "";
            if (ui_field_name == "room_leng") {
                ls_rule_func_name = "chkRoomLeng";
            }
            else if (ui_field_name == "room_begin_nos" || ui_field_name == "room_end_nos") {
                ls_rule_func_name = "chkRoomNosLeng";
            }
            return ls_rule_func_name;
        },

        // 檢查欄位是否需要格式規則
        chkFieldHasFormat: function (ui_field_name) {
            var ls_format_func_name = "";
            return ls_format_func_name;
        },

        // 檢查欄位長度
        chkUiFieldLength: function (ui_field_name) {
            var li_ui_field_length = 10;
            if (ui_field_name == "room_leng") {
                li_ui_field_length = 1;
            }
            else if (ui_field_name == "front_cod") {
                li_ui_field_length = 1;
            }
            else if (ui_field_name == "build_nos") {
                li_ui_field_length = 2;
            }
            else if (ui_field_name == "floor_nos") {
                li_ui_field_length = 3;
            }

            return li_ui_field_length;
        },

        sortRoomEvent: function (ls_sort_typ) {
            var self = this;
            var lo_params = {
                prg_id: prg_id,
                func_id: "1011",
                sort_typ: ls_sort_typ
            };
            $.post("/api/specialDataGridBtnEventRule", lo_params, function (getResult) {
                if (getResult.success) {
                    self.roomSortData = getResult.roomNosData;
                    self.showRoomSortDialog = true;
                }
            });
        },

        // 移動排序
        itemMove: function (li_oldIndex, li_newIndex) {
            this.testData = li_oldIndex;
            this.testData = "";

            var data = this.roomSortData;
            var temp = data[li_oldIndex];
            data[li_oldIndex] = data[li_newIndex];
            data[li_newIndex] = temp;
        },

        // 重新產生房間排序
        reSortByTyp: function () {
            this.sortRoomEvent(this.sort_typ);
        },

        // 房間排序儲存
        roomSortSave: function () {
            var self = this;
            this.isAction = true;
            var tmpCud = {
                updateData: []
            };
            _.each(this.roomSortData, function (lo_roomSortData, index) {
                index++;
                tmpCud.updateData.push({
                    room_nos: lo_roomSortData.room_nos,
                    view_seq: index
                });
            });
            var fieldData = [
                {ui_field_name: 'hotel_cod', keyable: 'Y'},
                {ui_field_name: 'room_nos', keyable: 'Y'}
            ];

            var params = {
                prg_id: prg_id,
                tmpCUD: tmpCud,
                fieldData: fieldData,
                mainTableName: "room_mn"
            };

            $.post('/api/execSQLProcess', params)
                .done(function (response) {
                    if (response.success) {
                        self.initTmpCUD();
                        self.sortRoomEvent('');
                        self.loadDataGridByPrgID(function(){});
                        alert('save success!');
                        self.isAction = false;
                    }
                    else {
                        alert(response.errorMsg);
                    }
                })
                .fail(function (error) {
                    console.log(error);
                    self.isAction = false;
                });
        },

        //dg row刪除
        removeRow: function () {
            PMS0820020VM.tmpCud.deleteData = [];
            var checkRows = $('#dgCheckbox').datagrid('getSelections');
            if (checkRows == 0) {
                alert("Warning", 'Check at least one item');
                return;
            }
            var q = confirm("Are you sure delete those data?");
            if (q) {
                //刪除前檢查

                _.each(checkRows, function (row) {
                    PMS0820020VM.tmpCud.deleteData.push(row);
                });

                $.post("/api/deleteFuncRule", {
                    page_id: 1,
                    prg_id: prg_id,
                    deleteData: PMS0820020VM.tmpCud.deleteData
                }, function (result) {
                    if (result.success) {
                        //刪除Row
                        _.each(checkRows, function (row) {
                            var DelIndex = $('#PMS0820020_dg').datagrid('getRowIndex', row);
                            $('#PMS0820020_dg').datagrid('deleteRow', DelIndex);
                        });
                        PMS0820020VM.showCheckboxDG($("#PMS0820020_dg").datagrid("getRows"));
                        PMS0820020VM.doSaveCUD();
                    } else {
                        alert(result.errorMsg);
                    }

                });

            }

        },

        //資料驗證
        dataValidate: function () {
            var self = this;
            var lo_chkResult;

            for (var i = 0; i < this.oriPageTwoFieldData.length; i++) {
                var lo_field = this.oriPageTwoFieldData[i];
                //必填
                if (lo_field.requirable == "Y" && lo_field.modificable == "Y") {
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

            var lo_chkResult = this.dataValidate();
            if (!_.isUndefined(lo_chkResult) && lo_chkResult.success == false && PMS0820020VM.tmpCud.deleteData.length == 0) {
                alert(lo_chkResult.msg);
                return;
            }

            waitingDialog.show('Saving...');

            var params = _.extend({prg_id: prg_id}, PMS0820020VM.tmpCud);
            $.post("/api/saveGridSingleData", params, function (result) {
                if (result.success) {
                    PMS0820020VM.initTmpCUD();
                    PMS0820020VM.loadDataGridByPrgID(function (success) {
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

        tempExecData: function (rowData) {
            vmHub.$emit("tempExecData", rowData);
        },

        //抓取page_id 2 單頁顯示欄位
        loadSingleGridPageField: function () {
            var self = this;
            $.post("/api/singleGridPageFieldQuery", {prg_id: prg_id, page_id: 2}, function (result) {
                var fieldData = _.clone(result.fieldData);
                go_Field_Data_Tmp = _.clone(result.fieldData);

                self.pageTwoFieldData = _.values(_.groupBy(_.sortBy(fieldData, "row_seq"), "row_seq"));

            });
        },

        //取得單筆資料
        fetchSingleData: function (editingRow, callback) {
            PMS0820020VM.initTmpCUD();
            PMS0820020VM.editStatus = true;
            PMS0820020VM.editingRow = editingRow;
            editingRow["prg_id"] = prg_id;
            $.post('/api/singlePageRowDataQuery', editingRow, function (result) {
                if (result.success) {
                    PMS0820020VM.singleData = result.rowData;
                    PMS0820020VM.originData = _.clone(result.rowData);
                    PMS0820020VM.isModifiable = result.isModifiable || true;
                    callback(true);

                } else {
                    PMS0820020VM.singleData = {};
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
            var height = 10 * 50; // 預設一個row 高度
            var dialog = $("#sigleGridPMS0820020").dialog({
                autoOpen: false,
                modal: true,
                title: prg_id,
                minWidth: 760,
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
            PMS0820020VM.editingRow = {};
            PMS0820020VM.singleData = {};
            PMS0820020VM.editStatus = false;
            PMS0820020VM.initTmpCUD();

            $("#sigleGridPMS0820020").dialog('close');
        }
    }

});

function editDtMultiLang(rowIdx) {
    vmHub.$emit('editDtMultiLang', {rowIdx: rowIdx});
}

Vue.filter("showDropdownDisplayName", function (val) {
});

var adpterDg = new AdapterDatagrid(PMS0820020VM);


function padLeft(str, length) {
    var ls_return = (str.length >= length) ? str : padLeft("0" + str, length);
    return ls_return;
}