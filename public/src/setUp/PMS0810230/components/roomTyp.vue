<template>
    <div class="row">
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
                        @on-custom-comp="customCompFunc">
                </v-table>
            </div>
        </div>
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
        <div class="clearfix"></div>
    </div>
</template>

<script>
    import {VTable} from 'vue-easytable';
    import 'vue-easytable/libs/themes-base/index.css';
    import moment from 'moment';

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
        },
        mounted() {
        },
        data() {
            return {
                //房型原始資料
                roomTypFieldsData: [],
                roomTypRowsData: [],
                oriRoomTypRowsData: [],
                roomTypDetailFieldsData: [],
                roomTypDetailRowsData: [],
                oriRoomTypDetailRowsData: [],
                //v-table 顯示時所需資料(轉換過)
                roomTypColumns: [],
                roomTypData: [],
                roomTypDetailColumns: [],
                roomTypDetailData: [],
                errorContent: "",
                useTimeData: [] //使用期間資料
            }
        },
        watch: {
            isRoomType(val) {
                if (val) {
                    this.fetchRoomTypLeftData();//取房型資料
                }
            },
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
                        begin_dat: moment( lo_data["ratesupply_dt.between_dat"].split("~")[0]).format("YYYY/MM/DD"),
                        end_dat: moment(lo_data["ratesupply_dt.between_dat"].split("~")[1]).format("YYYY/MM/DD"),
                        command_cod: lo_data["ratesupply_dt.command_option"].substring(0, 1),
                        command_option: lo_data["ratesupply_dt.command_option"],
                        rate_cod: lo_data["rate_cod"],
                        supply_nos: lo_data["supply_nos"]
                    });
                });
                this.useTimeData = la_useTimeData;
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
                        isResize: true,
                        isEdit: true
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
                        this.customCompFunc({type: "delete", index: 0});
                    }, 0.1);
                    this.showRoomTypDetailTable("");
                }
            },
            showRoomTypDetailTable(room_cod) {
                if (this.useTimeData.length > 0) {
                    _.each(this.useTimeData, (lo_useTimeData) => {
                        let ls_betweenDat =
                            JSON.parse(JSON.stringify(lo_useTimeData.begin_dat)) + "~" + JSON.parse(JSON.stringify(lo_useTimeData.end_dat));
                        let ls_commandOption = JSON.parse(JSON.stringify(lo_useTimeData.command_option));

                        let ln_changedIndex = _.findIndex(this.roomTypDetailRowsData, {supply_nos: lo_useTimeData.supply_nos, room_cod: room_cod});
                        //使用期間被修改
                        if (ln_changedIndex > -1) {
                            this.roomTypDetailRowsData[ln_changedIndex]["ratesupply_dt.between_dat"] = ls_betweenDat;
                            this.roomTypDetailRowsData[ln_changedIndex]["ratesupply_dt.command_option"] = ls_commandOption;
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
                                "ratesupply_dt.command_option": ls_commandOption
                            });
                        }
                    });
                    //使用期間被刪除
                    _.each(this.roomTypDetailRowsData, (lo_dataGridRowsData, idx) => {
                        let ln_delIndex = _.findIndex(this.useTimeData, {supply_nos: lo_dataGridRowsData.supply_nos});
                        if(ln_delIndex == -1){
                            this.roomTypDetailRowsData.splice(idx, 1);
                        }
                    });
                }
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
                        field: 'twoRoomPrice',
                        title: _.findWhere(this.roomTypDetailFieldsData, {ui_field_name: 'rent_amt'}).ui_display_name,
                        width: 120,
                        titleAlign: 'center',
                        columnAlign: 'right',
                        isResize: true,
                        isEdit: true
                    },
                    {
                        field: 'adultPlus',
                        title: _.findWhere(this.roomTypDetailFieldsData, {ui_field_name: 'add_adult'}).ui_display_name,
                        width: 120,
                        titleAlign: 'center',
                        columnAlign: 'right',
                        isResize: true,
                        isEdit: true
                    },
                    {
                        field: 'childPlus',
                        title: _.findWhere(this.roomTypDetailFieldsData, {ui_field_name: 'add_child'}).ui_display_name,
                        width: 120,
                        titleAlign: 'center',
                        columnAlign: 'right',
                        isResize: true,
                        isEdit: true
                    },
                ];
                if (this.roomTypDetailRowsData.length > 0) {
                    _.each(_.where(this.roomTypDetailRowsData, {room_cod: room_cod}), (lo_roomTypDetailRowsData) => {
                        this.roomTypDetailData.push({
                            "useRange": lo_roomTypDetailRowsData["ratesupply_dt.between_dat"],
                            "dateRule": lo_roomTypDetailRowsData["ratesupply_dt.command_option"],
                            "twoRoomPrice": lo_roomTypDetailRowsData["rent_amt"],
                            "adultPlus": lo_roomTypDetailRowsData["add_adult"],
                            "childPlus": lo_roomTypDetailRowsData["add_child"]
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
            roomTypColumnCellClass(rowIndex, columnName, rowData) {
                if (columnName == 'control') {
                    return 'column-cell-class-delete';
                }
            },
            appendRow(title, field) {
                if (field == "control") {
                    this.roomTypRowsData.push({room_cod: ""});
                    this.roomTypData.push({"roomCode": ""});
                }
            },
            customCompFunc(params) {
                this.$delete(this.roomTypData, params.index);
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
            roomTypDetailCellEditDone(newValue, oldValue, rowIndex, rowData, field) {
                this.roomTypDetailData[rowIndex][field] = newValue;
            },
            roomTypRowClick(rowIndex, rowData, column) {
                if (typeof rowData === "object") {
                    rowData = rowData.roomCode;
                }
                this.showRoomTypDetailTable(rowData);
            }
        }
    }


</script>