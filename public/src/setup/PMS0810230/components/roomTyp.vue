<template>
    <div class="row">
        <!--房型-->
        <div class="roomCodeTable pull-left width-15">
            <div>
                <v-table
                        style="width: 100%;"
                        :height="150"
                        row-hover-color="#eee"
                        row-click-color="#edf7ff"
                        :columns="roomTypColumns"
                        :table-data="roomTypData"
                        :error-content="errorContent"
                        :column-cell-class-name="roomTypColumnCellClass"
                        :title-click="appendRow"
                        :cell-edit-done="roomTypCellEditDone"
                        :row-click="roomTypRowClick"
                        @on-custom-comp="removeRow">
                </v-table>
            </div>
        </div>
        <!--房型-->
        <!--房型明細-->
        <div class="roomCodeDetail  pull-left width-85">
            <div>
                <v-table
                        :height="150"
                        :columns="roomTypDetailColumns"
                        :table-data="roomTypDetailData"
                        :error-content="errorContent"
                        :column-cell-class-name="columnCellClass"
                        :cell-edit-done="roomTypDetailCellEditDone"
                        row-hover-color="#eee"
                        row-click-color="#edf7ff">
                </v-table>
            </div>
        </div>
        <!--房型明細-->
        <!-- 選擇房型代號 彈出視窗 -->
        <div id="roomTypSelect_dialog" class="hide padding-5" style="top: 20px;">
            <div class="businessCompanyData">
                <div class="col-xs-12 col-sm-12">
                    <div class="row">
                        <div class="col-xs-11 col-sm-11">
                            <div class="row no-margin-right">
                                <v-table
                                        :columns="roomTypSelectColumns"
                                        :table-data="roomTypSelectData"
                                        row-hover-color="#eee" row-click-color="#edf7ff"
                                        :select-all="selectRoomTypSelectALL"
                                        :column-cell-class-name="columnCellClass"
                                        :select-change="selectRoomTypSelectChange">
                                </v-table>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                        <div class="col-xs-1 col-sm-1">
                            <div class="row">
                                <div class="right-menu-co">
                                    <ul>
                                        <li>
                                            <button class="btn btn-primary btn-white btn-defaultWidth"
                                                    role="button" @click="chkRoomTypSelect">{{i18nLang.program.PMS0810230.OK}}
                                            </button>
                                        </li>
                                        <li>
                                            <button class="btn btn-primary btn-white btn-defaultWidth"
                                                    role="button" @click="closeRoomTypSelect">
                                                {{i18nLang.program.PMS0810230.cancel}}
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="clearfix"></div>
        </div>
        <!-- /.選擇房型 彈出視窗 -->
        <div class="clearfix"></div>
    </div>
</template>

<script>
    import {VTable} from 'vue-easytable';
    import 'vue-easytable/libs/themes-base/index.css';
    import moment from 'moment';

    export default {
        name: 'roomTyp',
        props: ["rowData", "isRoomType"],
        components: {VTable},
        created() {
            this.$eventHub.$on("getUseTimeData", (data) => {
                this.useTimeData = data.useTimeData;
                if (this.roomTypRowsData.length > 0) {
                    this.roomTypRowClick(0, this.roomTypRowsData[0].room_cod, this.roomTypColumns);
                }
            });
            this.$eventHub.$on("getDeleteUseTimeData", (data) => {
                this.deleteRoomTypData("useTime", data.delUseTimeData);
            });
        },
        mounted() {
            this.fetchRoomTypSelectData();
        },
        data() {
            return {
                i18nLang: go_i18nLang,
                editingIndex: -1, //正在編輯的index
                //房型原始資料
                roomTypFieldsData: [],
                roomTypRowsData: [],
                oriRoomTypRowsData: [],
                roomTypDetailFieldsData: [],
                roomTypDetailRowsData: [],
                oriRoomTypDetailRowsData: [],
                roomTypSelectRowsData: [],
                oriRoomTypSelectRowsData: [],
                tmpCUD: {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                },
                //v-table(房型) 顯示時所需資料(轉換過)
                roomTypColumns: [],
                roomTypData: [],
                roomTypDetailColumns: [],
                roomTypDetailData: [],
                errorContent: "",
                //v-table(選擇房型) 顯示時所需資料(轉換過)
                roomTypSelectColumns: [],
                roomTypSelectData: [],
                oriRoomTypSelectData: [],
                selectedRoomTypSelect: [],
                //使用期間資料
                useTimeData: [], //使用期間資料
                delUseTimeData: {} //被刪除的使用期間
            }
        },
        watch: {
            isRoomType(val) {
                if (val) {
                    this.fetchRoomTypLeftData();//取房型資料
                }
            },
            roomTypDetailRowsData: {
                handler(val, oldVal) {
                    //新增、修改房型資料
                    _.each(val, (lo_val, idx) => {
                        let ln_oriDgCreateIdx = _.findIndex(this.oriRoomTypDetailRowsData, {
                            supply_nos: lo_val.supply_nos,
                            room_cod: lo_val.room_cod
                        });
                        let ln_tmpCUDCreateIdx = _.findIndex(this.tmpCUD.createData, {
                            supply_nos: lo_val.supply_nos,
                            room_cod: lo_val.room_cod
                        });
                        let ln_tmpCUDUpdateIdx = _.findIndex(this.tmpCUD.updateData, {
                            supply_nos: lo_val.supply_nos,
                            room_cod: lo_val.room_cod
                        });
                        //新增房型資料
                        //刪除暫存重複的資料,再新增新資料
                        if (ln_tmpCUDCreateIdx > -1) {
                            this.tmpCUD.createData.splice(ln_tmpCUDCreateIdx, 1);
                        }
                        if (ln_oriDgCreateIdx == -1) {
                            this.tmpCUD.createData.push(_.extend(lo_val, {event_time: moment().format()}));
                        }
                        //修改房型資料
                        else {
                            //刪除暫存重複的資料,再新增新資料
                            if (ln_tmpCUDUpdateIdx > -1) {
                                this.tmpCUD.updateData.splice(ln_tmpCUDUpdateIdx, 1);
                                this.tmpCUD.oriData.splice(ln_tmpCUDUpdateIdx, 1);
                            }
                            if (JSON.stringify(lo_val) != JSON.stringify(this.oriRoomTypDetailRowsData[idx])) {
                                this.tmpCUD.updateData.push(_.extend(lo_val, {event_time: moment().format()}));
                                this.tmpCUD.oriData.push(_.extend(this.oriRoomTypDetailRowsData[idx], {event_time: moment().format()}));
                            }
                        }
                    });
                },
                deep: true
            },
            tmpCUD: {
                handler(val) {
                    _.each(val.createData, (lo_createData) => {
                        _.extend(lo_createData, {page_id: 1, tab_page_id: 12});
                    });
                    _.each(val.updateData, (lo_updateData) => {
                        _.extend(lo_updateData, {page_id: 1, tab_page_id: 12});
                    });
                    _.each(val.deleteData, (lo_deleteData) => {
                        _.extend(lo_deleteData, {page_id: 1, tab_page_id: 12});
                    });
                    _.each(val.oriData, (lo_oriData) => {
                        _.extend(lo_oriData, {page_id: 1, tab_page_id: 12});
                    });

                    //將資料放入Vuex
                    this.$store.dispatch("setRoomTypData", {
                        go_rtTmpCUD: this.tmpCUD
                    });
                },
                deep: true
            }
        },
        methods: {
            initData() {
                this.roomTypFieldsData = [];
                this.roomTypRowsData = [];
                this.oriRoomTypRowsData = [];
                this.roomTypDetailFieldsData = [];
                this.roomTypDetailRowsData = [];
                this.oriRoomTypDetailRowsData = [];
                this.roomTypColumns = [];
                this.roomTypData = [];
                this.roomTypDetailColumns = [];
                this.roomTypDetailData = [];
            },
            fetchRoomTypSelectData() {
                $.post('/api/chkFieldRule', {rule_func_name: 'get_room_typ_select'}, (result) => {
                    this.roomTypSelectColumns = [
                        {
                            width: 60,
                            titleAlign: 'center',
                            columnAlign: 'center',
                            type: 'selection',
                            isResize: true,
                            titleCellClassName: 'easytb-ht-title'
                        },
                        {
                            field: 'room_cod',
                            title: '房型代號',
                            width: 90,
                            titleAlign: 'center',
                            columnAlign: 'center',
                            isResize: true,
                            titleCellClassName: 'easytb-ht-title'
                        },
                        {
                            field: 'room_nam',
                            title: '房型名稱',
                            width: 90,
                            titleAlign: 'center',
                            columnAlign: 'center',
                            isResize: true,
                            titleCellClassName: 'easytb-ht-title'
                        },
                        {
                            field: 'room_sna',
                            title: '房型別名',
                            width: 90,
                            titleAlign: 'center',
                            columnAlign: 'center',
                            isResize: true,
                            titleCellClassName: 'easytb-ht-title'
                        }
                    ];
                    this.oriRoomTypSelectRowsData = JSON.parse(JSON.stringify(result.multiSelectOptions));
                    this.roomTypSelectRowsData = result.multiSelectOptions;
                    this.roomTypSelectData = JSON.parse(JSON.stringify(this.roomTypSelectRowsData));
                });
            },
            fetchRoomTypLeftData() {
                this.initData();
                this.isLoading = true;

                let lo_params = {
                    prg_id: 'PMS0810230',
                    page_id: 2,
                    tab_page_id: 11,
                    searchCond: {rate_cod: this.$store.state.gs_rateCod}
                };

                $.post("/api/fetchDataGridFieldData", lo_params, (result) => {
                    if (result.success) {
                        this.roomTypFieldsData = result.dgFieldsData;
                        this.roomTypRowsData = result.dgRowData;
                        this.oriRoomTypRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                        this.fetchRoomTypRightData();
                    }
                    else {
                        alert(result.errorMsg);
                    }
                });
            },
            fetchRoomTypRightData() {
                let lo_params = {
                    prg_id: 'PMS0810230',
                    page_id: 2,
                    tab_page_id: 12,
                    searchCond: {rate_cod: this.$store.state.gs_rateCod}
                };

                $.post("/api/fetchDataGridFieldData", lo_params, (result) => {
                    if (result.success) {
                        this.setUseTimeData(JSON.parse(JSON.stringify(result.dgRowData)));
                        _.each(result.dgRowData, (lo_dgRowData, idx) => {
                            let ls_beginDat = lo_dgRowData["ratesupply_dt.between_dat"].split("~")[0];
                            let ls_endDat = lo_dgRowData["ratesupply_dt.between_dat"].split("~")[1];
                            result.dgRowData[idx]["ratesupply_dt.between_dat"] =
                                moment(ls_beginDat).format("YYYY/MM/DD") + "~" + moment(ls_endDat).format("YYYY/MM/DD")
                        });
                        this.roomTypDetailFieldsData = result.dgFieldsData;
                        this.roomTypDetailRowsData = result.dgRowData;
                        this.oriRoomTypDetailRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                        this.showRoomTypTable();

                    }
                    else {
                        alert(result.errorMsg);
                    }
                });
            },
            //設定使用期間(未開啟使用日期dialog)
            setUseTimeData(roomTypDetailData) {
                let la_useTimeData = [];
                _.each(roomTypDetailData, (lo_data) => {
                    la_useTimeData.push({
                        begin_dat: moment(lo_data["ratesupply_dt.between_dat"].split("~")[0]).format("YYYY/MM/DD"),
                        end_dat: moment(lo_data["ratesupply_dt.between_dat"].split("~")[1]).format("YYYY/MM/DD"),
                        command_cod: lo_data["ratesupply_dt.command_option"].substring(0, 1),
                        command_option: lo_data["ratesupply_dt.command_option"],
                        rate_cod: lo_data["rate_cod"],
                        supply_nos: lo_data["supply_nos"]
                    });
                });
                this.useTimeData = la_useTimeData;
            },
            //使用期間資料被刪除
            deleteRoomTypData(field, deleteData) {
                let self = this;
                let lo_condition = field == 'useTime' ? {supply_nos: deleteData.supply_nos} : {room_cod: deleteData.roomCode};
                let ln_delIndex = -1;
                //刪除房型資料(原本在oracle的資料)
                ln_delIndex = _.findIndex(this.oriRoomTypDetailRowsData, lo_condition);
                if (ln_delIndex > -1) {
                    this.tmpCUD.deleteData.push(_.extend(this.oriRoomTypDetailRowsData[ln_delIndex], {event_time: moment().format()}));
                }
                //刪除房型資料(頁面上顯示)
                let la_delete = _.where(this.roomTypDetailRowsData, lo_condition);
                _.each(la_delete, lo_delete => {
                    ln_delIndex = _.findIndex(this.roomTypDetailRowsData, lo_condition);
                    if (ln_delIndex > -1) {
                        this.roomTypDetailRowsData.splice(ln_delIndex, 1);
                    }
                });

                //刪除在暫存的資料
                la_delete = _.where(this.tmpCUD.createData, lo_condition);
                _.each(la_delete, (lo_delete) => {
                    ln_delIndex = _.findIndex(this.tmpCUD.createData, lo_condition);
                    if (ln_delIndex > -1) {
                        this.tmpCUD.createData.splice(ln_delIndex, 1);
                    }
                });
                la_delete = _.where(this.tmpCUD.updateData, lo_condition);
                _.each(la_delete, (lo_delete) => {
                    ln_delIndex = _.findIndex(this.tmpCUD.updateData, lo_condition);
                    if (ln_delIndex > -1) {
                        this.tmpCUD.updateData.splice(ln_delIndex, 1);
                        this.tmpCUD.oriData.splice(ln_delIndex, 1);
                    }
                });
            },
            showRoomTypTable() {
                this.roomTypColumns = [
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
                        field: 'roomCode',
                        title: _.findWhere(this.roomTypFieldsData, {ui_field_name: 'room_cod'}).ui_display_name,
                        width: 90,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isResize: true
                    }
                ];
                if (this.roomTypRowsData.length > 0) {
                    _.each(this.roomTypRowsData, (lo_roomTypRowsData) => {
                        this.roomTypData.push({"roomCode": lo_roomTypRowsData.room_cod});
                    });
                    this.roomTypRowClick(0, this.roomTypRowsData[0].room_cod, this.roomTypColumns);
                }
                else {
                    this.roomTypData = [{}];
                    setTimeout(() => {
                        this.removeRow({type: "delete", index: 0});
                    }, 0.1);
                    this.showRoomTypDetailTable("");
                }
            },
            showRoomTypDetailTable(room_cod) {
                this.roomTypDetailData = [];
                this.roomTypDetailColumns = [
                    {
                        field: 'useRange',
                        title: _.findWhere(this.roomTypDetailFieldsData, {ui_field_name: 'ratesupply_dt.between_dat'}).ui_display_name,
                        width: 220,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isResize: true
                    },
                    {
                        field: 'dateRule',
                        title: _.findWhere(this.roomTypDetailFieldsData, {ui_field_name: 'ratesupply_dt.command_option'}).ui_display_name,
                        width: 140,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isResize: true
                    },
                    {
                        field: 'rent_amt',
                        title: _.findWhere(this.roomTypDetailFieldsData, {ui_field_name: 'rent_amt'}).ui_display_name,
                        width: 120,
                        titleAlign: 'center',
                        columnAlign: 'right',
                        isResize: true,
                        isEdit: true
                    },
                    {
                        field: 'add_adult',
                        title: _.findWhere(this.roomTypDetailFieldsData, {ui_field_name: 'add_adult'}).ui_display_name,
                        width: 120,
                        titleAlign: 'center',
                        columnAlign: 'right',
                        isResize: true,
                        isEdit: true
                    },
                    {
                        field: 'add_child',
                        title: _.findWhere(this.roomTypDetailFieldsData, {ui_field_name: 'add_child'}).ui_display_name,
                        width: 120,
                        titleAlign: 'center',
                        columnAlign: 'right',
                        isResize: true,
                        isEdit: true
                    }
                ];
                if (this.useTimeData.length > 0) {
                    _.each(this.useTimeData, (lo_useTimeData) => {
                        let ls_betweenDat =
                            JSON.parse(JSON.stringify(lo_useTimeData.begin_dat)) + "~" + JSON.parse(JSON.stringify(lo_useTimeData.end_dat));

                        let ln_changedIndex = _.findIndex(this.roomTypDetailRowsData, {
                            supply_nos: lo_useTimeData.supply_nos,
                            room_cod: room_cod
                        });
                        //使用期間被修改
                        if (ln_changedIndex > -1) {
                            this.roomTypDetailRowsData[ln_changedIndex]["ratesupply_dt.between_dat"] = ls_betweenDat;
                            this.roomTypDetailRowsData[ln_changedIndex]["ratesupply_dt.command_option"] = lo_useTimeData.command_option;
                        }
                        //新增使用期間
                        else {
                            this.roomTypDetailRowsData.push({
                                "add_adult": 0,
                                "add_child": 0,
                                "rent_amt": 0,
                                "room_cod": room_cod,
                                "supply_nos": lo_useTimeData.supply_nos,
                                "ratesupply_dt.between_dat": ls_betweenDat,
                                "ratesupply_dt.command_option": lo_useTimeData.command_option
                            });
                        }
                    });
                }
                else {
                    this.roomTypDetailRowsData = [];
                }
                if (this.roomTypDetailRowsData.length > 0) {
                    _.each(_.where(this.roomTypDetailRowsData, {room_cod: room_cod}), (lo_roomTypDetailRowsData) => {
                        this.roomTypDetailData.push({
                            "useRange": lo_roomTypDetailRowsData["ratesupply_dt.between_dat"],
                            "dateRule": this.convertCommandOption(lo_roomTypDetailRowsData["ratesupply_dt.command_option"]),
                            "rent_amt": lo_roomTypDetailRowsData["rent_amt"],
                            "add_adult": lo_roomTypDetailRowsData["add_adult"],
                            "add_child": lo_roomTypDetailRowsData["add_child"],
                            "room_cod": lo_roomTypDetailRowsData["room_cod"],
                            "supply_nos": lo_roomTypDetailRowsData["supply_nos"]
                        });
                    });
                }
                else {
                    this.roomTypDetailData = [{}];
                    setTimeout(() => {
                        this.$delete(this.roomTypDetailData, 0);
                    }, 0.1);
                }
            },
            //轉換command_option資料
            convertCommandOption(command_option) {
                let la_commandOptionHSelect =
                    JSON.parse(JSON.stringify(_.findWhere(this.roomTypDetailFieldsData, {ui_field_name: 'ratesupply_dt.command_option'}).selectData));
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
                if (command_option.substring(0, 1) == 'H') {
                    let la_commandOption = command_option.split(',');
                    _.each(la_commandOption, (ls_commandOption) => {
                        ls_commandOptionDisplay =
                            ls_commandOptionDisplay + _.findWhere(la_commandOptionHSelect, {value: ls_commandOption}).display + ', ';
                    });
                    ls_commandOptionDisplay = ls_commandOptionDisplay.substring(0, ls_commandOptionDisplay.length - 2);
                }
                else if (command_option.substring(0, 1) == 'W') {
                    let la_commandOption = command_option.split(',');
                    if (la_commandOption.length > 1) {
                        _.each(la_commandOption, (ls_commandOption) => {
                            ls_commandOptionDisplay =
                                ls_commandOptionDisplay + _.findWhere(la_commandOptionWSelect, {value: ls_commandOption}).display + ', ';
                        });
                        ls_commandOptionDisplay = ls_commandOptionDisplay.substring(0, ls_commandOptionDisplay.length - 2);
                    }
                    else {
                        ls_commandOptionDisplay = _.findWhere(la_commandOptionWSelect, {value: command_option}).display
                    }
                }
                else {
                    ls_commandOptionDisplay = "每一天";
                }

                return ls_commandOptionDisplay;
            },
            //房型
            roomTypColumnCellClass(rowIndex, columnName, rowData) {
                if (columnName == 'control') {
                    return 'column-cell-class-delete';
                }
                if (rowIndex == this.editingIndex) {
                    return 'row-actice-c';
                }
            },
            removeRow(params) {//刪除房型
                let la_roomTypData = JSON.parse(JSON.stringify(this.roomTypData));
                this.deleteRoomTypData("roomTyp", this.roomTypData[params.index]);
                this.$delete(this.roomTypData, params.index);
                if (this.roomTypData.length == 0) {
                    this.roomTypDetailData = [];
                }
                else if (this.roomTypData.length > 0) {
                    this.editingIndex = params.index;
                    if (params.index >= la_roomTypData.length - 1) {
                        this.editingIndex = params.index - 1;
                    }
                    this.roomTypRowClick(this.editingIndex, this.roomTypData[this.editingIndex], this.roomTypColumns[1])
                }
            },
            appendRow(title, field) {//新增房型
                let self = this;
                if (field == "control") {
                    var dialog = $("#roomTypSelect_dialog").removeClass('hide').dialog({
                        modal: true,
                        title: "選擇房型代號",
                        title_html: true,
                        width: 560,
                        maxwidth: 1920,
                        dialogClass: "test",
                        resizable: true,
                        onBeforeClose() {
                            self.roomTypSelectData = JSON.parse(JSON.stringify(self.oriRoomTypSelectRowsData));
                            self.selectedRoomTypSelect = [];
                        }
                    });
                    _.each(this.roomTypData, (lo_roomTyp) => {
                        let ln_deleteIndex = _.findIndex(this.roomTypSelectData, {room_cod: lo_roomTyp.roomCode});
                        this.roomTypSelectData.splice(ln_deleteIndex, 1);
                    });
                }
            },
            roomTypCellEditDone(newValue, oldValue, rowIndex, rowData, field) {
                this.roomTypData[rowIndex][field] = newValue;
                this.roomTypRowsData[rowIndex].room_cod = newValue;
                let la_changingRoomTypDetailRowsData = _.where(this.roomTypDetailRowsData, {room_cod: oldValue});
                _.each(la_changingRoomTypDetailRowsData, (lo_changingRoomTypDetailRowsData) => {
                    let ln_changingIdx = _.findIndex(this.roomTypDetailRowsData, lo_changingRoomTypDetailRowsData);
                    this.roomTypDetailRowsData[ln_changingIdx].room_cod = newValue;
                });

                this.showRoomTypDetailTable(newValue);
            },
            roomTypRowClick(rowIndex, rowData, column) {
                this.editingIndex = rowIndex;
                if (typeof rowData === "object") {
                    rowData = rowData.roomCode;
                }
                this.showRoomTypDetailTable(rowData);
            },
            //選擇房型
            columnCellClass(rowIndex, columnName, rowData) {
                // 给第二行设置className
                if (rowIndex != -1) {
                    return 'easytb-ht';
                }
            },
            selectRoomTypSelectALL(selection) {
                this.selectedRoomTypSelect = selection;
            },
            selectRoomTypSelectChange(selection, rowData) {
                this.selectedRoomTypSelect = selection;
            },
            chkRoomTypSelect() {
                let la_oriRoomTypData = JSON.parse(JSON.stringify(this.roomTypData));
                let ln_selectIndex = this.selectedRoomTypSelect.length > 0 ? la_oriRoomTypData.length : this.editingIndex;
                _.each(this.selectedRoomTypSelect, (lo_selectedRoomTyp) => {
                    this.roomTypData.push({"roomCode": lo_selectedRoomTyp.room_cod})
                });
                this.roomTypRowClick(0, this.roomTypData[ln_selectIndex], this.roomTypColumns[1]);
                this.roomTypColumnCellClass(ln_selectIndex, "roomCode", this.roomTypData[ln_selectIndex]);
                this.editingIndex = ln_selectIndex;
                $("#roomTypSelect_dialog").dialog('close');
            },
            closeRoomTypSelect() {
                $("#roomTypSelect_dialog").dialog('close');
            },
            //房型明細
            roomTypDetailCellEditDone(newValue, oldValue, rowIndex, rowData, field) {
                let ln_editIndex = _.findIndex(this.roomTypDetailRowsData, {
                    supply_nos: rowData.supply_nos,
                    room_cod: rowData.room_cod
                });
                this.roomTypDetailRowsData[ln_editIndex][field] = newValue;
                this.roomTypDetailData[rowIndex][field] = newValue;
            },
        }
    }


</script>

<style>
    .row-actice-c {
        background-color: #edf7ff;
    }
</style>