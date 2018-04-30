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
                                        <button
                                                class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="editRow">{{i18nLang.program.PMS0810230.dateRule}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="closeDialog">{{i18nLang.program.PMS0810230.leave}}
                                        </button>
                                    </li>
                                    <li>
                                        <span class="checkbox">
                                              <label class="checkbox-width">
                                                  <input name="form-field-checkbox" type="checkbox" class="ace" v-model="isShowExpire" @change="showTable">
                                                  <span class="lbl font-btn">{{i18nLang.program.PMS0810230.showExpire}}</span>
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

    export default {
        name: 'useTime',
        props: ["rowData", "isUseTime"],
        created() {
            let self = this;
            this.$eventHub.$on('setTimeRule', (timeRuleData) => {
                //新增的試用期限
                if (_.isUndefined(timeRuleData.singleData.supply_nos)) {
                    let ln_maxSupplyNos = this.dataGridRowsData.length > 0 ? _.max(this.dataGridRowsData, (lo_dataGridRowsData) => {
                        return lo_dataGridRowsData.supply_nos
                    }).supply_nos : 0;
                    let lo_createData = {
                        athena_id: this.$store.state.go_userInfo.athena_id,
                        hotel_cod: this.$store.state.go_userInfo.hotel_cod,
                        rate_cod: this.$store.state.gs_rateCod,
                        supply_nos: Number(ln_maxSupplyNos) + 1,
                        begin_dat: moment(timeRuleData.singleData.begin_dat).format("YYYY/MM/DD"),
                        end_dat: moment(timeRuleData.singleData.end_dat).format("YYYY/MM/DD"),
                        command_cod: timeRuleData.singleData.command_cod,
                        command_option: timeRuleData.singleData.command_option,
                        event_time: moment().format(),
                        isCreate: true
                    };
                    this.tmpCUD.createData.push(lo_createData);
                    this.dataGridRowsData.push(lo_createData);
                }
                //編輯的使用期限
                else {
                    let ln_editIndex = _.findIndex(this.dataGridRowsData, {supply_nos: timeRuleData.singleData.supply_nos});
                    this.dataGridRowsData[ln_editIndex].begin_dat = moment(timeRuleData.singleData.begin_dat).format("YYYY/MM/DD");
                    this.dataGridRowsData[ln_editIndex].end_dat = moment(timeRuleData.singleData.end_dat).format("YYYY/MM/DD");
                    this.dataGridRowsData[ln_editIndex].command_cod = timeRuleData.singleData.command_cod;
                    this.dataGridRowsData[ln_editIndex].command_option = timeRuleData.singleData.command_option;

                    let ln_createIndex = _.findIndex(this.tmpCUD.createData, {supply_nos: timeRuleData.singleData.supply_nos});
                    if (ln_createIndex > -1) {
                        this.tmpCUD.createData.splice(ln_createIndex, 1);
                        this.tmpCUD.createData.push(_.extend(this.dataGridRowsData[ln_editIndex], {event_time: moment().format()}));
                    }
                    else {
                        this.tmpCUD.updateData.push(_.extend(this.dataGridRowsData[ln_editIndex], {event_time: moment().format()}));
                        this.tmpCUD.oriData.push(_.extend(this.oriDataGridRowsData[ln_editIndex], {event_time: moment().format()}));
                    }
                }

                //轉換tmpCUD資料
                let lo_param = {
                    page_id: this.fieldsData[0].page_id,
                    tab_page_id: this.fieldsData[0].tab_page_id
                };
                _.each(this.tmpCUD, (val, key) => {
                    _.each(val, (lo_val, idx) => {
                        //增加page_id、tab_page_id
                        _.extend(self.tmpCUD[key][idx], lo_param);
                    })
                });

                //將資料放入Vuex
                this.$store.dispatch("setUseTimeData", {
                    ga_utFieldsData: this.fieldsData,
                    ga_utDataGridRowsData: this.dataGridRowsData,
                    ga_utOriDataGridRowsData: this.oriDataGridRowsData,
                    go_utTmpCUD: this.tmpCUD
                });
                this.showTable();
            });
            this.$eventHub.$on("setUseTimeRateCod", (data) => {
                let self = this;
                this.rateCod = data.rateCod;
                //修改原始資料的 rate_cod
                _.each(this.dataGridRowsData, (lo_dataGridRowsData, idx) => {
                    lo_dataGridRowsData.rate_cod = data.rateCod;
                    if (lo_dataGridRowsData.isCreate) {
                        this.tmpCUD.createData.splice(idx, 1);
                        this.tmpCUD.createData.push(lo_dataGridRowsData);
                    }
                    else {
                        let ln_editIndex = _.findIndex(this.tmpCUD.updateData, {supply_nos: lo_dataGridRowsData.supply_nos});
                        if (ln_editIndex > -1) {
                            this.tmpCUD.updateData.splice(ln_editIndex, 1);
                            this.tmpCUD.oriData.splice(ln_editIndex, 1);
                        }
                        this.tmpCUD.updateData.push(lo_dataGridRowsData);
                        this.tmpCUD.oriData.push(this.oriDataGridRowsData[idx]);
                    }
                });
                //轉換tmpCUD資料
                let lo_param = {
                    page_id: this.fieldsData[0].page_id,
                    tab_page_id: this.fieldsData[0].tab_page_id
                };
                _.each(this.tmpCUD, (tmpCUDVal, tmpCUDKey) => {
                    _.each(tmpCUDVal, (lo_tmpCUDVal, idx) => {
                        //修改 tmpCUD 的 rate_cod
                        if (tmpCUDKey != 'oriData') {
                            self.tmpCUD[tmpCUDKey][idx]['rate_cod'] = data.rateCod;
                        }
                        //增加page_id、tab_page_id
                        _.extend(self.tmpCUD[tmpCUDKey][idx], lo_param);
                    });

                });
            });
            this.$eventHub.$on('setClearData', () => {
                this.tmpCUD = {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                };
            });
        },
        mounted() {
            this.fetchRentCalDat();
        },
        data() {
            return {
                i18nLang: go_i18nLang,
                rentCalDat: "",//滾房租日
                rateCod: "",
                fieldsData: [],
                dataGridRowsData: [],
                oriDataGridRowsData: [],
                //v-table 顯示時所需資料(轉換過)
                useTimeColumns: [],
                useTimeData: [],
                errorContent: "",
                //是否開啟日期規則
                isOpenTimeRule: false,
                //是否過期顯示
                isShowExpire: false,
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
                        this.tmpCUD = this.$store.state.go_utTmpCUD;
                        this.fieldsData = this.$store.state.ga_utFieldsData;
                        this.dataGridRowsData = this.$store.state.go_allData.ga_utDataGridRowsData;
                        this.oriDataGridRowsData = this.$store.state.go_allOriData.ga_utDataGridRowsData;
                        this.showTable();
                    }
                }
            }
        },
        methods: {
            //取滾房租日
            fetchRentCalDat() {
                $.post('/api/qryRentCalDat', {}, (result) => {
                    this.rentCalDat = result.rent_cal_dat;
                });
            },
            initData() {
                this.fieldsData = [];
                this.dataGridRowsData = [];
                this.oriDataGridRowsData = [];
                this.useTimeColumns = [];
                this.useTimeData = [];
            },
            //取使用期間欄位、多筆資料
            fetchData() {
                let lo_params = {
                    prg_id: 'PMS0810230',
                    page_id: 1010,
                    tab_page_id: 1,
                    searchCond: {rate_cod: this.$store.state.gs_oriRateCod}
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
                let lo_funcList = this.$parent.$parent.prgEditionOptions.funcList;
                if(lo_funcList['1010'] == 'LITE'){
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
                            title: _.findWhere(this.fieldsData, {ui_field_name: 'begin_dat'}).ui_display_name,
                            width: 135,
                            titleAlign: 'center',
                            columnAlign: 'center',
                            isResize: true,
                            isEdit: true
                        },
                        {
                            field: 'endDat',
                            title: _.findWhere(this.fieldsData, {ui_field_name: 'end_dat'}).ui_display_name,
                            width: 135,
                            titleAlign: 'center',
                            columnAlign: 'center',
                            isResize: true,
                            isEdit: true
                        },
                        {
                            field: 'datRule',
                            title: _.findWhere(this.fieldsData, {ui_field_name: 'command_option'}).ui_display_name,
                            width: 135,
                            titleAlign: 'center',
                            columnAlign: 'center',
                            isResize: true,
                            isEdit: true
                        }
                    ];
                }
                else{
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
                            title: _.findWhere(this.fieldsData, {ui_field_name: 'begin_dat'}).ui_display_name,
                            width: 135,
                            titleAlign: 'center',
                            columnAlign: 'center',
                            isResize: true,
                        },
                        {
                            field: 'endDat',
                            title: _.findWhere(this.fieldsData, {ui_field_name: 'end_dat'}).ui_display_name,
                            width: 135,
                            titleAlign: 'center',
                            columnAlign: 'center',
                            isResize: true,
                        },
                        {
                            field: 'datRule',
                            title: _.findWhere(this.fieldsData, {ui_field_name: 'command_option'}).ui_display_name,
                            width: 135,
                            titleAlign: 'center',
                            columnAlign: 'center',
                            isResize: true,
                        }
                    ];
                }
                this.useTimeData = [];

                let la_displayDataGridRowsData = this.isShowExpire ?
                    this.dataGridRowsData : _.filter(this.dataGridRowsData, (lo_dataGridRowsData) => {
                        let lo_endDat = moment(lo_dataGridRowsData.end_dat);
                        let lo_rentCalDat = moment(this.rentCalDat);
                        return lo_endDat.diff(lo_rentCalDat, 'days') >= 1
                    });
                if (la_displayDataGridRowsData.length > 0) {
                    _.each(la_displayDataGridRowsData, (lo_dataGridRowsData) => {
                        this.useTimeData.push({
                            "startDat": moment(lo_dataGridRowsData.begin_dat).format("YYYY/MM/DD"),
                            "endDat": moment(lo_dataGridRowsData.end_dat).format("YYYY/MM/DD"),
                            "datRule": this.convertCommandOption(JSON.parse(JSON.stringify(lo_dataGridRowsData))),
                            "supply_nos": lo_dataGridRowsData.supply_nos
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
                try {
                    let la_commandOptionHSelect =
                        JSON.parse(JSON.stringify(_.findWhere(this.fieldsData, {ui_field_name: 'command_option'}).selectDataDisplay));
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
                }
                catch (err) {
                    alert(err);
                }
            },
            //v-table function
            useTimeColumnCellClass(rowIndex, columnName, rowData) {
                if (columnName == 'control') {
                    return 'column-cell-class-delete';
                }
            },
            getRowData(rowIndex, rowData, column) {
                let lb_editIndex = _.findIndex(this.dataGridRowsData, {supply_nos: rowData.supply_nos});
                if (lb_editIndex > -1) {
                    this.timeRuleData = _.extend(rowData, this.dataGridRowsData[lb_editIndex]);
                }
            },
            customCompFunc(params) {
                let self = this;
                //將此筆被刪除的使用期間資料傳給房型資料
                this.$eventHub.$emit('getDeleteUseTimeData', {
                    delUseTimeData: JSON.parse(JSON.stringify(this.dataGridRowsData[params.index]))
                });

                //此筆為剛新增的
                let ln_createIndex = _.findIndex(this.tmpCUD.createData, {supply_nos: this.dataGridRowsData[params.index].supply_nos});
                let ln_editIndex = _.findIndex(this.tmpCUD.updateData, {supply_nos: this.dataGridRowsData[params.index].supply_nos});
                if (ln_createIndex > -1) {
                    this.tmpCUD.createData.splice(ln_createIndex, 1);
                }
                //此筆為剛編輯的
                else if (ln_editIndex > -1) {
                    this.tmpCUD.updateData.splice(ln_editIndex, 1);
                    this.tmpCUD.oriData.splice(ln_editIndex, 1);
                    this.tmpCUD.deleteData.push(_.extend(this.dataGridRowsData[ln_editIndex], {event_time: moment().format()}));
                }
                else {
                    this.tmpCUD.deleteData.push(_.extend(this.dataGridRowsData[params.index], {event_time: moment().format()}));
                }
                //此筆為直接刪除的
                this.$delete(this.useTimeData, params.index);
                this.dataGridRowsData.splice(params.index, 1);

                //轉換tmpCUD資料
                let lo_param = {
                    page_id: this.fieldsData[0].page_id,
                    tab_page_id: this.fieldsData[0].tab_page_id
                };
                _.each(this.tmpCUD, (val, key) => {
                    _.each(val, (lo_val, idx) => {
                        //增加page_id、tab_page_id
                        _.extend(self.tmpCUD[key][idx], lo_param);
                    })
                });

                //將資料放入Vuex
                this.$store.dispatch("setUseTimeData", {
                    ga_utFieldsData: this.fieldsData,
                    ga_utDataGridRowsData: this.dataGridRowsData,
                    ga_utOriDataGridRowsData: this.oriDataGridRowsData,
                    go_utTmpCUD: this.tmpCUD
                });
            },
            appendRow(title, field) {
                if (field == "control") {
                    let lo_funcList = this.$parent.$parent.prgEditionOptions.funcList;
                    this.timeRuleData = {};
                    if(lo_funcList['1010'] == 'LITE'){
                        let lo_createData = {
                            athena_id: this.$store.state.go_userInfo.athena_id,
                            hotel_cod: this.$store.state.go_userInfo.hotel_cod,
                            rate_cod: this.$store.state.gs_rateCod,
                            supply_nos: 1,
                            begin_dat: moment().format("YYYY/MM/DD"),
                            end_dat: moment().format("YYYY/MM/DD"),
                            command_cod: "D",
                            command_option: "D1",
                            event_time: moment().format(),
                            isCreate: true
                        };
                        this.dataGridRowsData.push(lo_createData);
                        this.showTable()
                    }
                    else{
                        this.showTimeRuleDialog();
                    }
                }
            },
            editRow() {
                let lo_funcList = this.$parent.$parent.prgEditionOptions.funcList;
                if(lo_funcList['1010'] != 'LITE'){
                    if (_.isEmpty(this.timeRuleData)) {
                        alert(go_i18nLang["SystemCommon"].SelectData);
                    }
                    else {
                        this.showTimeRuleDialog();
                    }
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