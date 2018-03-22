<template>
    <div id="useTimeDialog" class="hide padding-5" style="">
        <div class="businessCompanyData">
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <!-------- 多筆 -------->
                    <div class="col-xs-10 col-sm-10">
                        <div class="row no-margin-right">
                            <div class="main-content-data">
                                <v-table
                                        row-hover-color="#eee"
                                        row-click-color="#edf7ff"
                                        is-horizontal-resize
                                        style="width:100%"
                                        :columns="useTimeColumns"
                                        :table-data="useTimeData"
                                        :error-content="errorContent"
                                        :column-cell-class-name="useTimeColumnCellClass"
                                        :title-click="appendRow"
                                        :row-click="getRowData"
                                        @on-custom-comp="customCompFunc"
                                >
                                </v-table>
                            </div>
                        </div>
                    </div>
                    <!--------/. 多筆 -------->
                    <!-------- 按鈕 -------->
                    <div class="col-xs-2 col-sm-2">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="editRow">日期規則
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="closeDialog">離開
                                        </button>
                                    </li>
                                    <li>
                                        <span class="checkbox">
                                              <label class="checkbox-width">
                                                  <input name="form-field-checkbox" type="checkbox" class="ace">
                                                  <span class="lbl font-btn">過期顯示</span>
                                              </label>
                                          </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--------/. 按鈕 -------->
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
        <div class="clearfix"></div>
    </div>
</template>

<script>
    import moment from 'moment';

    // 自定义列组件
    Vue.component('table-operation', {
        template: '<span class="column-cell-class-delete" @click.stop.prevent="deleteRow(rowData,index)">▬</span>',
        props: {
            rowData: {
                type: Object
            },
            field: {
                type: String
            },
            index: {
                type: Number
            }
        },
        methods: {
            deleteRow() {
                // 参数根据业务场景随意构造
                let params = {type: 'delete', index: this.index};
                this.$emit('on-custom-comp', params);
            }
        }
    });

    export default {
        name: 'useTime',
        props: ["rowData", "isUseTime"],
        created() {
            this.$eventHub.$on('setTimeRule', (timeRuleData) => {
                //新增的試用期限
                if (_.isUndefined(timeRuleData.singleData.supply_nos)) {
                    let ln_maxSupplyNos = this.dataGridRowsData.length > 0 ? _.max(this.dataGridRowsData, (lo_dataGridRowsData) => {
                        return lo_dataGridRowsData.supply_nos
                    }).supply_nos : 0;
                    let lo_createData = {
                        rate_cod: this.$store.state.gs_rateCod,
                        supply_nos: Number(ln_maxSupplyNos) + 1,
                        begin_dat: moment(timeRuleData.singleData.begin_dat).format("YYYY/MM/DD"),
                        end_dat: moment(timeRuleData.singleData.end_dat).format("YYYY/MM/DD"),
                        command_cod: timeRuleData.singleData.command_cod,
                        command_option: timeRuleData.singleData.command_option
                    };
                    this.tmpCUD.createData.push(lo_createData);
                    this.dataGridRowsData.push(lo_createData);
                    this.useTimeData.push({
                        "startDat": moment(timeRuleData.singleData.begin_dat).format("YYYY/MM/DD"),
                        "endDat": moment(timeRuleData.singleData.end_dat).format("YYYY/MM/DD"),
                        "datRule": this.convertCommandOption(JSON.parse(JSON.stringify(timeRuleData.singleData)))
                    });
                }
                //編輯的使用期限
                else {
                    let ln_editIndex = _.findIndex(this.dataGridRowsData, {supply_nos: timeRuleData.singleData.supply_nos});
                    this.dataGridRowsData[ln_editIndex].begin_dat = moment(timeRuleData.singleData.begin_dat).format("YYYY/MM/DD");
                    this.dataGridRowsData[ln_editIndex].end_dat = moment(timeRuleData.singleData.end_dat).format("YYYY/MM/DD");
                    this.dataGridRowsData[ln_editIndex].command_cod = timeRuleData.singleData.command_cod;
                    this.dataGridRowsData[ln_editIndex].command_option = timeRuleData.singleData.command_option;
                    this.useTimeData[ln_editIndex].startDat = moment(timeRuleData.singleData.begin_dat).format("YYYY/MM/DD");
                    this.useTimeData[ln_editIndex].endDat = moment(timeRuleData.singleData.end_dat).format("YYYY/MM/DD");
                    this.useTimeData[ln_editIndex].datRule = this.convertCommandOption(JSON.parse(JSON.stringify(timeRuleData.singleData)));
                    let ln_createIndex = _.findIndex(this.tmpCUD.createData, {supply_nos: timeRuleData.singleData.supply_nos});
                    if(ln_createIndex > -1){
                        this.tmpCUD.createData.splice(ln_createIndex, 1);
                        this.tmpCUD.createData.push(this.dataGridRowsData[ln_editIndex]);
                    }
                    else{
                        this.tmpCUD.updateData.push(this.dataGridRowsData[ln_editIndex]);
                        this.tmpCUD.oriData.push(this.oriDataGridRowsData[ln_editIndex]);
                    }
                }
                //將資料放入Vuex
                this.$store.dispatch("setUseTimeData", {
                    ga_utFieldsData: this.fieldsData,
                    ga_utDataGridRowsData: this.dataGridRowsData,
                    ga_utOriDataGridRowsData: this.oriDataGridRowsData,
                    go_utTmpCUD: this.tmpCUD
                });
            });
        },
        mounted() {
        },
        data() {
            return {
                fieldsData: [],
                dataGridRowsData: [],
                oriDataGridRowsData: [],
                //v-table 顯示時所需資料(轉換過)
                useTimeColumns: [],
                useTimeData: [],
                errorContent: "",
                //是否開啟日期規則
                isOpenTimeRule: false,
                timeRuleData: {},
                tmpCUD: {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                }
            }
        },
        watch: {
            isUseTime(val) {
                if (val) {
                    this.initData();
                    if (this.$store.state.ga_utFieldsData.length <= 0) {
                        this.fetchData();
                    }
                    else {
                        this.fieldsData = this.$store.state.ga_utFieldsData;
                        this.dataGridRowsData = this.$store.state.go_allData.ga_utDataGridRowsData;
                        this.oriDataGridRowsData = this.$store.state.go_allOriData.ga_utDataGridRowsData;
                        this.showTable();
                    }
                }
            }
        },
        methods: {
            initData() {
                this.fieldsData = [];
                this.dataGridRowsData = [];
                this.oriDataGridRowsData = [];
                this.useTimeColumns = [];
                this.useTimeData = [];
                this.tmpCUD = {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                }
            },
            //取使用期間欄位、多筆資料
            fetchData() {
                let lo_params = {
                    prg_id: 'PMS0810230',
                    page_id: 1010,
                    tab_page_id: 1,
                    searchCond: {rate_cod: this.$store.state.gs_rateCod}
                };

                $.post("/api/fetchDataGridFieldData", lo_params, (result) => {
                    if (result.success) {
                        _.each(result.dgRowData, (lo_dgRowData, idx) => {
                            result.dgRowData[idx]["begin_dat"] = moment(lo_dgRowData["begin_dat"]).format("YYYY/MM/DD");
                            result.dgRowData[idx]["end_dat"] = moment(lo_dgRowData["end_dat"]).format("YYYY/MM/DD");
                        });
                        this.fieldsData = result.dgFieldsData;
                        this.dataGridRowsData = result.dgRowData;
                        this.oriDataGridRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                        this.showTable();
                        //將資料放入Vuex
                        this.$store.dispatch("setUseTimeData", {
                            ga_utFieldsData: this.fieldsData,
                            ga_utDataGridRowsData: this.dataGridRowsData,
                            ga_utOriDataGridRowsData: this.oriDataGridRowsData,
                            go_utTmpCUD: this.tmpCUD
                        });
                    }
                    else {
                        alert(result.errorMsg);
                    }
                });
            },
            showTable() {
                this.useTimeColumns = [
                    {
                        field: 'control',
                        title: '<i class="fa fa-plus green pointer"></i>',
                        width: 40,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        componentName: 'table-operation',
                        isResize: true
                    },
                    {
                        field: 'startDat',
                        title: 'Start date',
                        width: 135,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isResize: true,
                    },
                    {
                        field: 'endDat',
                        title: 'End date',
                        width: 135,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isResize: true,
                    },
                    {
                        field: 'datRule',
                        title: 'Date rule',
                        width: 135,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isResize: true,
                    }
                ];
                if (this.dataGridRowsData.length > 0) {
                    _.each(this.dataGridRowsData, (lo_dataGridRowsData) => {
                        this.useTimeData.push({
                            "startDat": moment(lo_dataGridRowsData.begin_dat).format("YYYY/MM/DD"),
                            "endDat": moment(lo_dataGridRowsData.end_dat).format("YYYY/MM/DD"),
                            "datRule": this.convertCommandOption(JSON.parse(JSON.stringify(lo_dataGridRowsData)))
                        });
                    });
                }
                else {
                    this.useTimeData = [{}];
                    setTimeout(() => {
                        this.$delete(this.useTimeData, 0);
                    }, 0.1);
                }
            },
            convertCommandOption(data) {
                let la_commandOptionHSelect =
                    JSON.parse(JSON.stringify(_.findWhere(this.fieldsData, {ui_field_name: 'command_option'}).selectData));
                _.each(la_commandOptionHSelect, (lo_select, idx) => {
                    la_commandOptionHSelect[idx].value = 'H' + lo_select.value;
                });

                let la_commandOptionWSelect = [
                    {value: 'W1', display: go_i18nLang.program.PMS0810230.sunday},
                    {value: 'W2', display: go_i18nLang.program.PMS0810230.monday},
                    {value: 'W3', display: go_i18nLang.program.PMS0810230.tuesday},
                    {value: 'W4', display: go_i18nLang.program.PMS0810230.wednesday},
                    {value: 'W5', display: go_i18nLang.program.PMS0810230.thursday},
                    {value: 'W6', display: go_i18nLang.program.PMS0810230.friday},
                    {value: 'W7', display: go_i18nLang.program.PMS0810230.saturday}
                ];

                let ls_commandOptionDisplay = '';
                if (data.command_cod == 'H') {
                    let la_commandOption = data.command_option.split(',');
                    if (la_commandOption.length > 1) {
                        _.each(la_commandOption, (ls_commandOption) => {
                            ls_commandOptionDisplay =
                                ls_commandOptionDisplay + _.findWhere(la_commandOptionHSelect, {value: ls_commandOption}).display + ', ';
                        });
                        ls_commandOptionDisplay = ls_commandOptionDisplay.substring(0, ls_commandOptionDisplay.length - 2);
                    }
                    else {
                        ls_commandOptionDisplay = _.findWhere(la_commandOptionHSelect, {value: data.command_option}).display
                    }
                }
                else if (data.command_cod == 'W') {
                    let la_commandOption = data.command_option.split(',');
                    if (la_commandOption.length > 1) {
                        _.each(la_commandOption, (ls_commandOption) => {
                            ls_commandOptionDisplay =
                                ls_commandOptionDisplay + _.findWhere(la_commandOptionWSelect, {value: ls_commandOption}).display + ', ';
                        });
                        ls_commandOptionDisplay = ls_commandOptionDisplay.substring(0, ls_commandOptionDisplay.length - 2);
                    }
                    else {
                        ls_commandOptionDisplay = _.findWhere(la_commandOptionWSelect, {value: data.command_option}).display
                    }
                }
                else {
                    ls_commandOptionDisplay = "每一天";
                }
                return ls_commandOptionDisplay;
            },
            //v-table function
            useTimeColumnCellClass(rowIndex, columnName, rowData) {
                if (columnName == 'control') {
                    return 'column-cell-class-delete';
                }
            },
            getRowData(rowIndex, rowData, column) {
                this.timeRuleData = _.extend(rowData, this.dataGridRowsData[rowIndex]);
            },
            customCompFunc(params) {
                //此筆為剛新增的
                let ln_createIndex = _.findIndex(this.tmpCUD.createData, {supply_nos: this.dataGridRowsData[params.index].supply_nos});
                let ln_editIndex = _.findIndex(this.tmpCUD.updateData, {supply_nos: this.dataGridRowsData[params.index].supply_nos});
                if(ln_createIndex > -1){
                    this.tmpCUD.createData.splice(ln_createIndex, 1);
                }
                //此筆為剛編輯的
                else if(ln_editIndex > -1){
                    this.tmpCUD.updateData.splice(ln_editIndex, 1);
                    this.tmpCUD.oriData.splice(ln_editIndex, 1);
                    this.tmpCUD.deleteData.push(this.dataGridRowsData[ln_editIndex]);
                }
                else{
                    this.tmpCUD.deleteData.push(this.dataGridRowsData[params.index]);
                }
                //此筆為直接刪除的
                this.$delete(this.useTimeData, params.index);
                this.dataGridRowsData.splice(params.index, 1);
            },
            appendRow(title, field) {
                if (field == "control") {
                    this.timeRuleData = {};
                    this.showTimeRuleDialog();
                }
            },
            editRow() {
                if (_.isEmpty(this.timeRuleData)) {
                    alert(go_i18nLang["SystemCommon"].SelectData);
                }
                else {
                    this.showTimeRuleDialog();
                }
            },
            //日期規則
            showTimeRuleDialog() {
                this.isOpenTimeRule = true;
                this.$eventHub.$emit('getTimeRuleData', {
                    openTimeRule: this.isOpenTimeRule,
                    commandOptionSelectOption: _.findWhere(this.fieldsData, {ui_field_name: 'command_option'}),
                    singleData: this.timeRuleData
                });
            },
            closeDialog() {
                $("#useTimeDialog").dialog('close');
            }
        }
    }
</script>