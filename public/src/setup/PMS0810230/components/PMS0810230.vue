<template>
    <div v-loading="isLoading" :element-loading-text="loadingText">
        <div class="col-xs-12">
            <search-comp
                    :search-fields="searchFields"
                    :search-cond.sync="searchCond"
                    :fetch-data="loadDataGridByPrgID"
            ></search-comp>
        </div> <!-- /.col-sm-12 -->
        <div class="clearfix"></div>
        <div class="col-xs-12">
            <div class="col-sm-11 col-xs-11">
                <div class="row no-margin-right">
                    <div class="tableHt">
                        <table id="PMS0810230_dg" style="height:560px;"></table>
                    </div>
                </div>
            </div>
            <!--按鈕-->
            <div class="col-xs-1 col-sm-1">
                <div class="row">
                    <div class="right-menu-co">
                        <ul>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth"
                                        role="button" @click="appendRow">{{i18nLang.program.PMS0810230.add}}
                                </button>
                            </li>

                            <li>
                                <button class="btn btn-danger btn-white btn-defaultWidth"
                                        role="button" @click="removeRow">{{i18nLang.program.PMS0810230.delete}}
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth"
                                        role="button" @click="editRow">{{i18nLang.program.PMS0810230.edit}}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!--/. 按鈕-->
        </div> <!-- /.col-sm-12 -->
        <div class="clearfix"></div>
        <pms0810230-single-grid
                :row-data="editingRow"
                :is-modifiable="isModifiable"
                :is-create-status="isCreateStatus"
                :is-edit-status="isEditStatus"
                :version-state="versionState"
        ></pms0810230-single-grid>
        <!--欄位內容多語系-->
        <field-multi-lang
                :sys_locales="sys_locales"
                :single-data="singleData"
                :field-info="fieldInfo"
                :open-multi-lang-dialog="openMultiLangDialog"
        ></field-multi-lang>
        <!--/.欄位內容多語系-->
    </div>
</template>

<script>
    import pms0810230SingleGrid from './PMS0810230SingleGrid.vue';
    import fieldMultiLang from './fieldMultiLang';

    let gs_prgId = "PMS0810230";

    Vue.prototype.$eventHub = new Vue();


    /** DataGridRmSingleGridClass **/
    function DatagridSingleGridClass() {
    }

    DatagridSingleGridClass.prototype = new DatagridBaseClass();
    DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
    };
    DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {
    };
    /*** Class End  ***/

    export default {
        name: 'pms0810230',
        created() {
            var self = this;
            //取得版本資料
            BacchusMainVM.doGetVersionData("PMS0810230");
            this.prgEditionOptions = BacchusMainVM.prgEditionOptions;

            g_socket.on("checkTableLock", (result) => {
                if (!result.success) {
                   alert("lock failed");
                }
            });

            //取得使用期間下拉資料
            this.$eventHub.$on('getTimeRuleData', (timeRuleData) => {
                this.isOpenTimeRule = timeRuleData.openTimeRule;
                this.commandOptionSelectOption = JSON.parse(JSON.stringify(timeRuleData.commandOptionSelectOption));
                _.each(this.commandOptionSelectOption.selectData, (lo_select, idx) => {
                    this.commandOptionSelectOption.selectData[idx].value = 'H' + lo_select.value;
                });
                if (!_.isEmpty(timeRuleData.singleData)) {
                    this.timeRuleSingleData = _.extend(this.timeRuleSingleData, timeRuleData.singleData);
                    this.timeRuleSingleData.begin_dat = timeRuleData.singleData.startDat;
                    this.timeRuleSingleData.end_dat = timeRuleData.singleData.endDat;
                    this.timeRuleSingleData.command_cod = timeRuleData.singleData.command_cod;
                    if (this.timeRuleSingleData.command_cod == 'H') {
                        let la_commandOption = timeRuleData.singleData.command_option.split(',');
                        if (la_commandOption.length > 1) {
                            _.each(la_commandOption, (ls_commandOption) => {
                                self.commandHVal.push(ls_commandOption)
                            });
                        }
                        else {
                            this.commandHVal.push(timeRuleData.singleData.command_option)
                        }
                    }
                    else if (this.timeRuleSingleData.command_cod == 'W') {
                        let la_commandOption = timeRuleData.singleData.command_option.split(',');
                        if (la_commandOption.length > 1) {
                            _.each(la_commandOption, (ls_commandOption) => {
                                self.commandVal.push(ls_commandOption)
                            });
                        }
                        else {
                            this.commandVal.push(timeRuleData.singleData.command_option)
                        }
                    }
                }
            });
            //開啟內容多語頁面
            this.$eventHub.$on('openMultiLang', (data) => {
                this.singleData = data.singleData;
                this.fieldInfo = data.fieldInfo;
                this.openMultiLangDialog = true;
            });
        },
        mounted() {
            this.fetchRentCalDat();//過濾使用期間日期
            this.fetchUserInfo();
            this.loadDataGridByPrgID();
        },
        components: {pms0810230SingleGrid, fieldMultiLang},
        data() {
            return {
                sys_locales: JSON.parse(decodeURIComponent(getCookie("sys_locales")).replace("j:", "")),//語系
                i18nLang: go_i18nLang,//多語系資料
                go_funcPurview: [],//按鈕權限
                versionState: "lite", //版本設定
                prgEditionOptions: {}, //版本設定資料
                userInfo: {},//使用者資訊
                pageOneDataGridRows: [],//多筆資料
                pageOneFieldData: [],//多筆欄位資料
                searchFields: [],//搜尋欄位資料
                searchCond: {},//搜尋資料
                dgIns: {},//dataGrid 實體
                isLoading: false,//是否載入成功
                loadingText: "Loading...",
                isCreateStatus: false,//是否為新增狀態
                isEditStatus: false, //是否為編輯狀態
                isModifiable: true,
                //單筆內容多語系
                singleData: {}, //單筆資料
                fieldInfo: {}, //單筆欄位資料
                openMultiLangDialog: false, // 是否顯示多語dialog
                //日期規則
                isOpenTimeRule: false, //是否開起日期規則
                timeRuleTabName: "D",
                commandOptionSelectOption: [], //依假日類別下拉選單
                commandVal: [],//依星期別
                commandHVal: [],//依假日類別
                timeRuleSingleData: {
                    command_cod: 'H',
                    command_option: '',
                    begin_dat: '',
                    end_dat: ''
                },
                allDatData: [],
                pickerOptions: {}
            }
        },
        watch: {
            isOpenTimeRule(val) {
                if (!val) {
                    this.timeRuleSingleData = {
                        command_cod: 'D',
                        command_option: '',
                        begin_dat: '',
                        end_dat: ''
                    };
                    this.allDatData = [];
                    this.commandHVal = [];
                    this.commandVal = [];
                }
            }
        },
        methods: {
            fetchRentCalDat() {
                BacUtils.doHttpPostAgent('/api/qryRentCalDat', {}, (result) => {
                    this.pickerOptions = {
                        disabledDate(time) {
                            let lo_date = moment(time);
                            let lo_rentCalDat = moment(result.rent_cal_dat);
                            return lo_date.diff(lo_rentCalDat, 'days') < 1;
                        }
                    };
                });
            },
            fetchUserInfo() {
                this.isLoading = true;
                let self = this;
                BacUtils.doHttpPostAgent('/api/getUserInfo', function (result) {
                    if (result.success) {
                        self.userInfo = result.userInfo;
                        self.$store.dispatch("setUserInfo", {
                            go_userInfo: result.userInfo,
                        });
                    }
                });
            },
            loadDataGridByPrgID() {
                let self = this;
                let lo_searchCond = _.clone(this.searchCond);
                let lo_params = {
                    prg_id: gs_prgId,
                    searchCond: lo_searchCond
                };

                BacUtils.doHttpPostAgent("/api/prgDataGridDataQuery", lo_params, function (result) {
                    self.pageOneFieldData = result.fieldData;
                    if (self.searchFields.length <= 0) {
                        self.searchFields = result.searchFields;
                    }
                    else {
                        self.pageOneDataGridRows = result.dataGridRows;
                    }
                    self.showDataGrid();
                });
            },
            showDataGrid() {
                //一開始只載入20筆資料
                let ln_pageSize = 20;

                this.dgIns = new DatagridSingleGridClass();
                this.dgIns.init("PMS0810230", "PMS0810230_dg", DatagridFieldAdapter.combineFieldOption(this.pageOneFieldData, 'PMS0810230_dg'), this.pageOneFieldData, {
                    pagination: true,
                    rownumbers: true,
                    pageSize: ln_pageSize //一開始只載入20筆資料
                });
                this.dgIns.loadPageDgData(this.pageOneDataGridRows);

                this.isLoading = false;
            },
            appendRow() {
                this.isLoading = true;
                this.isCreateStatus = true;
                this.isEditStatus = false;
                this.editingRow = {rate_cod: "", rate_prop: ""};

                this.showSingleGridDialog();
                this.isLoading = false;
            },
            editRow() {
                this.isLoading = true;
                this.isCreateStatus = false;
                this.isEditStatus = true;
                this.editingRow = {};

                var lo_editRow = $('#PMS0810230_dg').datagrid('getSelected');

                if (!lo_editRow) {
                    alert(go_i18nLang["SystemCommon"].SelectOneData);
                }
                else {
                    this.doRowLock(gs_prgId, lo_editRow.rate_cod);
                    this.editingRow = $('#PMS0810230_dg').datagrid('getSelected');
                    this.showSingleGridDialog();
                }
                this.isLoading = false;
            },
            async removeRow() {
                this.isLoading = true;
                this.loadingText = "Deleting...";
                let lo_delRow = $('#PMS0810230_dg').datagrid('getSelected');

                if (!lo_delRow) {
                    alert(go_i18nLang["SystemCommon"].SelectOneData);
                }
                else {
                    let lb_chkDelRow = confirm(go_i18nLang["SystemCommon"].check_delete);
                    if (lb_chkDelRow) {
                        this.doRowLock(gs_prgId, lo_delRow.rate_cod);
                        let lo_params = {
                            page_id: this.pageOneFieldData[0].page_id,
                            tab_page_id: this.pageOneFieldData[0].tab_page_id,
                            event_time: moment().format()
                        };
                        lo_delRow = _.extend(lo_delRow, lo_params);

                        await BacUtils.doHttpPromisePostProxy('/api/execNewFormatSQL', {
                            prg_id: 'PMS0810230',
                            func_id: "0530",
                            tmpCUD: {deleteData: [lo_delRow]}
                        }).then(
                            result => {
                                if (result.success) {
                                    alert(go_i18nLang.program.PMS0810230.save_success);
                                    this.loadDataGridByPrgID();
                                }
                                else {
                                    alert(result.errorMsg);
                                }
                                this.isLoading = false;
                                this.loadingText = "Loading...";
                            },
                            err => {
                                throw Error(err);
                            }
                        );
                    }
                }
                this.isLoading = false;
                this.loadingText = "Loading...";
            },
            showSingleGridDialog() {
                let self = this;

                let dialog = $('#PMS0810230SingleGrid').removeClass('hide').dialog({
                    modal: true,
                    title: "Rate code",
                    title_html: true,
                    width: 1000,
                    maxwidth: 1920,
                    dialogClass: "test",
                    resizable: true,
                    onBeforeClose() {
                        self.editingRow = {};
                        self.isEditStatus = false;
                        self.isCreateStatus = false;
                        self.$eventHub.$emit('setTabName', {tabName: ""});
                        self.$eventHub.$emit('setClearData');
                        self.$store.dispatch('setAllDataClear');
                        self.loadDataGridByPrgID();
                        self.doRowUnLock();
                    }
                }).dialog('open');
            },
            //房型使用期間 日期規則
            chkTimeRule() {
                let ln_diffDate = moment(this.timeRuleSingleData.begin_dat).diff(moment(this.timeRuleSingleData.end_dat), "days");
                if (ln_diffDate > 1) {
                    alert(go_i18nLang.program.PMS0810230.begBiggerEnd);
                }
                else if (!_.isNull(this.timeRuleSingleData.begin_dat) || !_.isNull(this.timeRuleSingleData.end_dat)) {
                    let ls_commandCod = this.timeRuleSingleData.command_cod;
                    this.timeRuleSingleData.command_option = [];

                    if (ls_commandCod == 'D') {
                        this.timeRuleSingleData.command_option = 'D1'
                    }
                    else if (ls_commandCod == 'H') {
                        _.each(this.commandHVal, (ls_val) => {
                            this.timeRuleSingleData.command_option = this.timeRuleSingleData.command_option + ls_val + ',';
                        });
                    }
                    else if (ls_commandCod == 'W') {
                        _.each(this.commandVal, (ls_val) => {
                            this.timeRuleSingleData.command_option = this.timeRuleSingleData.command_option + ls_val + ',';
                        });
                    }

                    this.timeRuleSingleData.command_option = this.timeRuleSingleData.command_option != 'D1' ? this.timeRuleSingleData.command_option.substring(0, this.timeRuleSingleData.command_option.length - 1) : this.timeRuleSingleData.command_option;

                    this.$eventHub.$emit('setTimeRule', {
                        singleData: this.timeRuleSingleData
                    });
                    this.isOpenTimeRule = false;
                }
                else {
                    alert(go_i18nLang.program.PMS0810230.selectDate)
                }
            },
            doCloseTimeRuleDialog() {
                this.isOpenTimeRule = false;
            },
            doRowLock: function (prg_id, rate_cod) {
                let ls_keyCod = this.userInfo.athena_id + this.userInfo.hotel_cod + rate_cod.trim();
                let lo_param = {
                    prg_id: prg_id,
                    table_name: "ratecod_mn",
                    lock_type: "R",
                    key_cod: ls_keyCod.trim()
                };
                g_socket.emit('handleTableLock', lo_param);
            },
            doRowUnLock() {
                let lo_param = {
                    prg_id: gs_prgId
                };
                g_socket.emit('handleTableUnlock', lo_param);
            }
        }
    }
</script>