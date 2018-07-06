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
                                                role="button" @click="confirmData">{{i18nLang.program.PMS0810230.OK}}
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

    import {VTable} from 'vue-easytable';
    import 'vue-easytable/libs/themes-base/index.css';
    import moment from 'moment';

    let vmHub4EasyTable = new Vue();

    //刪除按鈕
    Vue.component('table-operation', {
        template: '<span class="column-cell-class-delete" ' +
        '@click.stop.prevent="deleteRow(rowData,index)">▬</span>',
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
                let params = {type: 'delete', index: this.index, rowData: this.rowData};
                this.$emit('on-custom-comp', params);
            }
        }
    });
    //起始日
    Vue.component('table-begin-date', {
        template: '<el-date-picker v-model="rowData.begin_dat" type="date" format="yyyy/MM/dd"' +
        'style="width: 135px; height: 35px;line-height: 25px;" editable="false" @change="changeRowData(rowData, index)" :readonly="rowData.isEdit"' +
        ':editable="false" :clearable="false"></el-date-picker>',
        props: {
            rowData: {
                type: Object
            },
            index: {
                type: Number
            }
        },
        watch: {
            "rowData.begin_dat": function (val, oldVal) {
                if (moment(val).diff(moment(this.rowData.end_dat), "days") > 0) {
                    alert(go_i18nLang.program.PMS0810230.begBiggerEnd);
                    this.rowData.begin_dat = oldVal;
                }
            }
        },
        methods: {
            changeRowData(rowData, index) {
                rowData.begin_dat = moment(rowData.begin_dat).format("YYYY/MM/DD");
                let lo_params = {type: 'begin_dat', index: index, rowData: rowData};
                this.$emit('on-custom-comp', lo_params);
            }
        }
    });
    //結束日
    Vue.component('table-end-date', {
        template: '<el-date-picker v-model="rowData.end_dat" type="date" format="yyyy/MM/dd" class="input_sta_required "' +
        'style="width: 135px; height: 35px; line-height: 25px;"  @change="changeRowData(rowData, index)"' +
        ':editable="false" :clearable="false"></el-date-picker>',
        props: {
            rowData: {
                type: Object
            },
            index: {
                type: Number
            }
        },
        watch: {
            "rowData.end_dat": function (val, oldVal) {
                if (moment(val).diff(moment(this.rowData.begin_dat), "days") < 0) {
                    alert(go_i18nLang.program.PMS0810230.begBiggerEnd);
                    this.rowData.end_dat = oldVal;
                }
            }
        },
        methods: {
            changeRowData(rowData, index) {
                this.rowData.end_dat = moment(this.rowData.end_dat).format("YYYY/MM/DD");
                let lo_params = {type: 'end_dat', index: this.index, rowData: this.rowData};
                this.$emit('on-custom-comp', lo_params);
            }
        }
    });
    //計算方式
    Vue.component('table-command-cod', {
        template: '<bac-select v-model="rowData.command_cod" :field="rowData.cmFieldsData" :data="rowData.cmFieldsData.selectData" ' +
        ':data-display="rowData.cmFieldsData.selectData" style="width: 135px; height: 25px;"' +
        ':default-val="rowData.command_cod" is-qry-src-before="Y" value-field="value" text-field="display"' +
        '@update:v-model="val => rowData.command_cod = val" @change="changeRowData(rowData, index)"></bac-select>',
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
        watch: {
            "rowData.command_cod": function (val) {
                vmHub4EasyTable.$emit('getTableRowData', {
                    command_cod: val,
                    index: this.index
                });
            }
        },
        methods: {
            changeRowData(rowData, index) {
                let lo_params = {type: 'command_cod', index: index, rowData: rowData};
                this.$emit('on-custom-comp', lo_params);
            }
        }
    });
    //日其規則
    Vue.component('table-command-option', {
        template: '<bac-select v-model="rowData.command_option" :field="rowData.dtdFieldsData" :data="rowData.dtdFieldsData.selectData" ' +
        ':data-display="rowData.dtdFieldsData.selectDataDisplay" style="width: 135px; height: 25px;" :multiple="true"' +
        ':default-val="rowData.command_option" is-qry-src-before="Y" value-field="value" text-field="display"' +
        '@update:v-model="val => rowData.command_option = val" @change="changeRowData(rowData, index)"></bac-select>',
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
        watch: {
            "rowData.command_option": function (val, oldVal) {
                if (!Array.isArray(val)) {
                    let la_returnData = [];
                    if (val.split(",").length > 0) {
                        _.each(val.split(","), (ls_data) => {
                            la_returnData.push(ls_data);
                        })
                    }
                    else {
                        la_returnData.push(val);
                    }
                    this.rowData.command_option = la_returnData;
                }
                if (val.length <= 0) {
                    let ls_mag = sprintf(go_i18nLang.Validation.Formatter.Required, this.rowData.dtdFieldsData.ui_display_name);
                    alert(ls_mag);
                    this.rowData.command_option = [oldVal];
                }
            }
        },
        methods: {
            changeRowData(rowData, index) {
                let lo_params = {type: 'command_option', index: index, rowData: rowData};
                this.$emit('on-custom-comp', lo_params);
            }
        }
    })
    ;
    //房型
    Vue.component('table-room-cods', {
        template: '<bac-select v-model="rowData.room_cods" :field="rowData.rcFieldsData" :data="rowData.rcFieldsData.selectData" ' +
        ':data-display="rowData.rcFieldsData.selectData" style="width: 135px; height: 25px;" :multiple="true"' +
        ':default-val="rowData.room_cods" is-qry-src-before="Y" value-field="value" text-field="display"' +
        '@update:v-model="val => rowData.room_cods = val" @change="changeRowData(rowData, index)"></bac-select>',
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
        watch: {
            "rowData.room_cods": function (val, oldVal) {
                if (!Array.isArray(val)) {
                    let la_returnData = [];
                    if (val.split(",").length > 0) {
                        _.each(val.split(","), (ls_data) => {
                            la_returnData.push(ls_data);
                        })
                    }
                    else {
                        la_returnData.push(val);
                    }
                    this.rowData.room_cods = la_returnData;
                }
                if (val.length <= 0) {
                    let ls_mag = sprintf(go_i18nLang.Validation.Formatter.Required, this.rowData.rcFieldsData.ui_display_name);
                    alert(ls_mag);
                    this.rowData.room_cods = [oldVal];
                }
            }
        },
        methods: {
            changeRowData(rowData, index) {
                let lo_params = {type: 'room_cods', index: index, rowData: rowData};
                this.$emit('on-custom-comp', lo_params);
            }
        }
    });

    export default {
        name: 'useTime',
        props: ["rowData", "isUseTime"],
        created() {
            this.$eventHub.$on("setUseTimeRateCod", (data) => {
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
                            this.tmpCUD[tmpCUDKey][idx]['rate_cod'] = data.rateCod;
                        }
                        //增加page_id、tab_page_id
                        _.extend(this.tmpCUD[tmpCUDKey][idx], lo_param);
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
            this.$eventHub.$on("getUseTimeData4Ratecod", () => {
                this.confirmData();
            });
            vmHub4EasyTable.$on('getTableRowData', (data) => {
                this.dataGridRowsData[data.index].command_cod = data.command_cod;
                let lb_isChange = data.command_cod == this.dataGridRowsData[data.index].command_option.substring(0, 1) ? false : true;
                this.dataGridRowsData[data.index].command_option = lb_isChange ? "" : data.command_cod;
                this.showTable();
            });
        },
        mounted() {
            this.fetchRentCalDat();
            this.fetchRoomCodSelectData();
        },
        data() {
            return {
                i18nLang: go_i18nLang,
                rentCalDat: "",//滾房租日
                rateCod: "",
                fieldsData: [],
                dataGridRowsData: [],
                chgDataGridRowsData: [],
                oriDataGridRowsData: [],
                dataGridRowsData4Table: [],
                roomCodSelectData: [],
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
                        this.dataGridRowsData = JSON.parse(JSON.stringify(this.$store.state.go_allData.ga_utDataGridRowsData));
                        this.oriDataGridRowsData = this.$store.state.go_allOriData.ga_utDataGridRowsData;
                        this.showTable();
                    }
                }
            }
        },
        methods: {
            //取滾房租日
            async fetchRentCalDat() {
                this.rentCalDat = await BacUtils.doHttpPromisePostProxy('/api/qryRentCalDat', {}).then((result) => {
                    return result.rent_cal_dat;
                });
            },
            //取房型下拉資料
            async fetchRoomCodSelectData() {
                BacUtils.doHttpPostAgent('/api/chkFieldRule', {rule_func_name: 'qry_ratesupplydt_room_cod'}, (result) => {
                    this.roomCodSelectData = result.selectOptions;
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
                let ls_apiUrl = lo_params.searchCond.rate_cod == "" ? "/api/fetchOnlyDataGridFieldData" : "/api/fetchDataGridFieldData";

                BacUtils.doHttpPromisePostProxy(ls_apiUrl, lo_params).then(result => {
                    if (result.success) {
                        //房型下拉資料動態產生
                        let ln_roomCodIdx = _.findIndex(result.dgFieldsData, {ui_field_name: 'room_cods'});
                        if (ln_roomCodIdx > -1) {
                            result.dgFieldsData[ln_roomCodIdx].selectData = this.roomCodSelectData;
                            result.dgFieldsData[ln_roomCodIdx].selectDataDisplay = this.roomCodSelectData;
                        }
                        //開始、結束日期調整
                        let la_dgRowData = result.dgRowData || [];
                        _.each(la_dgRowData, (lo_dgRowData, idx) => {
                            la_dgRowData[idx]["begin_dat"] = moment(lo_dgRowData["begin_dat"]).format("YYYY/MM/DD");
                            la_dgRowData[idx]["end_dat"] = moment(lo_dgRowData["end_dat"]).format("YYYY/MM/DD");
                            la_dgRowData[idx]["isEdit"] = moment(lo_dgRowData["end_dat"]).format("YYYY/MM/DD");
                        });

                        this.fieldsData = result.dgFieldsData;
                        this.dataGridRowsData = la_dgRowData;
                        this.oriDataGridRowsData = JSON.parse(JSON.stringify(la_dgRowData));
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
                }, err => {
                    console.error(err);
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
                        field: 'begin_dat',
                        title: _.findWhere(this.fieldsData, {ui_field_name: 'begin_dat'}).ui_display_name,
                        width: 135,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isResize: true,
                        componentName: 'table-begin-date'
                    },
                    {
                        field: 'end_dat',
                        title: _.findWhere(this.fieldsData, {ui_field_name: 'end_dat'}).ui_display_name,
                        width: 135,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isResize: true,
                        componentName: 'table-end-date'
                    },
                    {
                        field: 'command_option',
                        title: _.findWhere(this.fieldsData, {ui_field_name: 'command_option'}).ui_display_name,
                        width: 135,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isResize: true,
                        componentName: 'table-command-option'
                    },
                    {
                        field: 'room_cods',
                        title: _.findWhere(this.fieldsData, {ui_field_name: 'room_cods'}).ui_display_name,
                        width: 135,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isResize: true,
                        componentName: 'table-room-cods'
                    }
                ];
                let lo_funcList = this.$parent.$parent.prgEditionOptions.funcList;
                if (lo_funcList['1010'] != 'LITE') {
                    let lo_commandCod = {
                        field: 'command_cod',
                        title: _.findWhere(this.fieldsData, {ui_field_name: 'command_cod'}).ui_display_name,
                        width: 135,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isResize: true,
                        componentName: 'table-command-cod'
                    };
                    this.useTimeColumns.splice(3, 0, lo_commandCod);
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
                            "begin_dat": moment(lo_dataGridRowsData.begin_dat).format("YYYY/MM/DD"),
                            "end_dat": moment(lo_dataGridRowsData.end_dat).format("YYYY/MM/DD"),
                            "command_cod": lo_dataGridRowsData.command_cod,
                            "command_option": this.convertSelectData(lo_dataGridRowsData.command_option),
                            "room_cods": _.isUndefined(lo_dataGridRowsData.room_cods) ? "" : this.convertSelectData(lo_dataGridRowsData.room_cods),
                            "supply_nos": lo_dataGridRowsData.supply_nos,
                            "cmFieldsData": _.findWhere(this.fieldsData, {ui_field_name: 'command_cod'}),
                            "dtdFieldsData": this.convertCommandOption(lo_dataGridRowsData),
                            "rcFieldsData": _.findWhere(this.fieldsData, {ui_field_name: 'room_cods'}),
                            "isEdit": _.isUndefined(lo_dataGridRowsData.isEdit) ? false : true
                        });
                    });
                }
                else {
                    this.useTimeData = [{
                        "cmFieldsData": _.findWhere(this.fieldsData, {ui_field_name: 'command_cod'}),
                        "dtdFieldsData": _.findWhere(this.fieldsData, {ui_field_name: 'command_option'}),
                        "rcFieldsData": _.findWhere(this.fieldsData, {ui_field_name: 'room_cods'})
                    }];
                    setTimeout(() => {
                        this.$delete(this.useTimeData, 0);
                    }, 0.1);
                }
            },
            convertCommandOption(data) {
                try {
                    //計算方式影響日期規則下拉資料
                    let lo_commandOptionFieldData = JSON.parse(JSON.stringify(_.findWhere(this.fieldsData, {ui_field_name: 'command_option'})));
                    let la_selectData = [];

                    //依日
                    if (data.command_cod == 'D') {
                        la_selectData = [{value: 'D1', display: '每一天'}];
                    }
                    //依星期
                    else if (data.command_cod == 'W') {
                        la_selectData = [
                            {value: 'W1', display: go_i18nLang.program.PMS0810230.sunday},
                            {value: 'W2', display: go_i18nLang.program.PMS0810230.monday},
                            {value: 'W3', display: go_i18nLang.program.PMS0810230.tuesday},
                            {value: 'W4', display: go_i18nLang.program.PMS0810230.wednesday},
                            {value: 'W5', display: go_i18nLang.program.PMS0810230.thursday},
                            {value: 'W6', display: go_i18nLang.program.PMS0810230.friday},
                            {value: 'W7', display: go_i18nLang.program.PMS0810230.saturday}
                        ];
                    }
                    //依假日對照檔
                    else {
                        _.each(lo_commandOptionFieldData.selectDataDisplay, (lo_selectDataDisplay) => {
                            let ls_value = 'H' + lo_selectDataDisplay.value;
                            la_selectData.push({value: ls_value, display: lo_selectDataDisplay.display});
                        });
                    }

                    lo_commandOptionFieldData.selectData = la_selectData;
                    lo_commandOptionFieldData.selectDataDisplay = la_selectData;

                    return lo_commandOptionFieldData;
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
                if (params.type == 'delete') {
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
                }
                else {
                    _.each(this.dataGridRowsData[params.index], (ls_value, ls_key) => {
                        let la_modifyKey = ["begin_dat", "end_dat", "command_cod", "command_option", "room_cods"];
                        console.log(_.indexOf(la_modifyKey, ls_key));
                        if (_.indexOf(la_modifyKey, ls_key) > -1) {
                            this.dataGridRowsData[params.index][ls_key] = params.rowData[ls_key];
                        }
                    });
                }
            },
            appendRow(title, field) {
                let la_commandOptionHSelect =
                    JSON.parse(JSON.stringify(_.findWhere(this.fieldsData, {ui_field_name: 'command_option'}).selectDataDisplay));
                _.each(la_commandOptionHSelect, (lo_select, idx) => {
                    la_commandOptionHSelect[idx].value = 'H' + lo_select.value;
                });

                let la_roomCosSelect = _.findWhere(this.fieldsData, {ui_field_name: 'room_cods'}).selectDataDisplay;

                if (field == "control") {
                    this.timeRuleData = {};
                    let la_RowData = this.dataGridRowsData.length >= this.oriDataGridRowsData.length ?
                        this.dataGridRowsData : this.oriDataGridRowsData;
                    let ln_maxSupplyNos = la_RowData.length > 0 ? Number(_.max(la_RowData, (lo_dataGridRowsData) => {
                        return lo_dataGridRowsData.supply_nos
                    }).supply_nos) : 0;
                    let lo_createData = {
                        athena_id: this.$store.state.go_userInfo.athena_id,
                        hotel_cod: this.$store.state.go_userInfo.hotel_cod,
                        rate_cod: this.$store.state.gs_rateCod,
                        supply_nos: Number(ln_maxSupplyNos) + 1,
                        begin_dat: moment().format("YYYY/MM/DD"),
                        end_dat: moment().add(1, "day").format("YYYY/MM/DD"),
                        command_cod: "H",
                        command_option: la_commandOptionHSelect.length > 0 ? _.first(la_commandOptionHSelect).value : "",
                        room_cods: la_roomCosSelect.length > 0 ? _.first(la_roomCosSelect).value : "",
                        event_time: moment().format(),
                        isCreate: true
                    };
                    this.dataGridRowsData.push(lo_createData);
                    this.showTable();
                }
            },
            async doValidate() {
                //FENG LOOK PART
                let lo_checkResult = {success: true, msg: ""};

                if (this.chgDataGridRowsData.length == 0) {
                    this.chgDataGridRowsData = this.oriDataGridRowsData;
                }
                let la_oriDataGridRowsData = this.chgDataGridRowsData;
                let la_dataGridRowsData = this.dataGridRowsData;

                let lo_postData = {
                    prg_id: "PMS0810230",
                    rule_func_name: "chk_ratesupply_dt_data",
                    rowsData: la_dataGridRowsData,
                    oriRowsData: la_oriDataGridRowsData
                };

                let lo_chkRule = await BacUtils.doHttpPromisePostProxy('/api/chkFieldRule', lo_postData).then(result => {
                    return result;
                });

                lo_checkResult.success = lo_chkRule.success;
                lo_checkResult.msg = lo_chkRule.errorMsg;

                return lo_checkResult;
            },
            async confirmData() {
                let lo_chkResult = await this.doValidate();
                if (lo_chkResult.success) {
                    _.each(this.dataGridRowsData, (lo_dataGridRowsData, idx) => {
                        lo_dataGridRowsData.command_option = this.convertMultiData(lo_dataGridRowsData.command_option);
                        lo_dataGridRowsData.room_cods = this.convertMultiData(lo_dataGridRowsData.room_cods);
                        if (lo_dataGridRowsData.isCreate) {
                            let ln_createIndex = _.findIndex(this.tmpCUD.createData, {
                                athena_id: lo_dataGridRowsData.athena_id,
                                hotel_cod: lo_dataGridRowsData.hotel_cod,
                                rate_cod: lo_dataGridRowsData.rate_cod,
                                supply_nos: lo_dataGridRowsData.supply_nos
                            });
                            if (ln_createIndex > -1) {
                                this.tmpCUD.createData.splice(ln_createIndex, 1);
                            }
                            this.tmpCUD.createData.push(lo_dataGridRowsData);
                        }
                        else {
                            let lo_compareParam = {
                                begin_dat: lo_dataGridRowsData.begin_dat,
                                end_dat: lo_dataGridRowsData.end_dat,
                                command_cod: lo_dataGridRowsData.command_cod,
                                command_option: lo_dataGridRowsData.command_option,
                                room_cods: lo_dataGridRowsData.room_cods,
                            };
                            let lb_isChanged = _.findIndex(this.$store.state.go_allData.ga_utDataGridRowsData, lo_compareParam) > -1 ? false : true;
                            if (lb_isChanged) {
                                let ln_editIndex = _.findIndex(this.tmpCUD.updateData, {supply_nos: lo_dataGridRowsData.supply_nos});
                                if (ln_editIndex > -1) {
                                    this.tmpCUD.updateData.splice(ln_editIndex, 1);
                                    this.tmpCUD.oriData.splice(ln_editIndex, 1);
                                }
                                this.tmpCUD.updateData.push(lo_dataGridRowsData);
                                this.tmpCUD.oriData.push(this.oriDataGridRowsData[idx]);
                            }
                        }
                        this.$eventHub.$emit("setUseTimeData", {
                            data: this.tmpCUD
                        });
                    });
                    //轉換tmpCUD資料
                    let lo_param = {
                        page_id: this.$store.state.ga_utFieldsData[0].page_id,
                        tab_page_id: this.$store.state.ga_utFieldsData[0].tab_page_id
                    };
                    _.each(this.tmpCUD, (tmpCUDVal, tmpCUDKey) => {
                        _.each(tmpCUDVal, (lo_tmpCUDVal, idx) => {
                            //增加page_id、tab_page_id
                            _.extend(this.tmpCUD[tmpCUDKey][idx], lo_param);
                        });
                    });
                    //將資料放入Vuex
                    this.$store.dispatch("setUseTimeData", {
                        ga_utFieldsData: this.fieldsData,
                        ga_utDataGridRowsData: this.dataGridRowsData,
                        ga_utOriDataGridRowsData: this.oriDataGridRowsData,
                        go_utTmpCUD: this.tmpCUD
                    });

                    //更新房型的使用期間資料
                    this.$eventHub.$emit("setUseTimeSelectData");

                    $("#useTimeDialog").dialog('close');
                    console.log(this.tmpCUD);
                }
                else {
                    alert(lo_chkResult.msg);
                }
            },
            closeDialog() {
                //將資料放入Vuex
                this.$store.dispatch("setUseTimeData", {
                    ga_utFieldsData: this.fieldsData,
                    ga_utDataGridRowsData: this.$store.state.go_allData.ga_utDataGridRowsData,
                    ga_utOriDataGridRowsData: this.oriDataGridRowsData,
                    go_utTmpCUD: this.tmpCUD
                });
                $("#useTimeDialog").dialog('close');
            },
            convertMultiData(data) {
                let ls_returnData = "";

                if (!Array.isArray(data)) {
                    ls_returnData = data;
                }
                else {
                    _.each(data, (ls_data) => {
                        ls_returnData = ls_returnData + ls_data + ',';
                    });
                    ls_returnData = ls_returnData.substring(ls_returnData.length - 1, ls_returnData.length) == ',' ?
                        ls_returnData.substring(0, ls_returnData.length - 1) : ls_returnData;
                }
                return ls_returnData;
            },
            convertSelectData(data) {
                let la_returnData = [];
                if (data.split(",").length > 0) {
                    _.each(data.split(","), (ls_data) => {
                        la_returnData.push(ls_data);
                    })
                }
                else {
                    la_returnData.push(data);
                }
                return la_returnData;
            }
        }
    }
</script>