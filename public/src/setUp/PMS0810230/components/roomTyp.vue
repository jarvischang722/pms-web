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
        name: 'roomTyp',
        props: ["rowData", "isRoomType"],
        components: {VTable},
        mounted() {
        },
        data() {
            return {
                //房型遠史資料
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
                errorContent: ""
            }
        },
        watch: {
            isRoomType(val) {
                if (val) {
                    this.fetchRoomTypLeftData();
                }
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
                        this.roomTypDetailFieldsData = result.dgFieldsData;
                        this.roomTypDetailRowsData = result.dgRowData;
                        this.oriRoomTypDetailRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                        this.showTable();
                    }
                    else {
                        alert(result.errorMsg);
                    }
                });
            },
            showTable() {
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
                        isEdit:true
                    }
                ];
                if (this.roomTypRowsData.length > 0) {
                    _.each(this.roomTypRowsData, (lo_roomTypRowsData) => {
                        this.roomTypData.push({"roomCode": lo_roomTypRowsData.room_cod});
                    });
                }
                else {
                    this.roomTypData = [{}];
                    setTimeout(() => {
                        this.customCompFunc({type: "delete", index: 0});
                    }, 0.1);
                }

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
                        isResize: true
                    },
                    {
                        field: 'adultPlus',
                        title: _.findWhere(this.roomTypDetailFieldsData, {ui_field_name: 'add_adult'}).ui_display_name,
                        width: 120,
                        titleAlign: 'center',
                        columnAlign: 'right',
                        isResize: true
                    },
                    {
                        field: 'childPlus',
                        title: _.findWhere(this.roomTypDetailFieldsData, {ui_field_name: 'add_child'}).ui_display_name,
                        width: 120,
                        titleAlign: 'center',
                        columnAlign: 'right',
                        isResize: true
                    },
                ];
                if (this.roomTypDetailRowsData.length > 0) {
                    _.each(this.roomTypDetailRowsData, (lo_roomTypDetailRowsData) => {
                        this.roomTypDetailData.push(
                            {"useRange": lo_roomTypDetailRowsData["ratesupply_dt.between_dat"],
                            "dateRule": lo_roomTypDetailRowsData["ratesupply_dt.command_option"],
                            "twoRoomPrice" : lo_roomTypDetailRowsData["rent_amt"],
                            "adultPlus": lo_roomTypDetailRowsData["add_adult"],
                            "childPlus": lo_roomTypDetailRowsData["add_child"]});
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
            roomTypCellEditDone(newValue,oldValue,rowIndex,rowData,field){
                this.roomTypData[rowIndex][field] = newValue;
            },
            roomTypDetailCellEditDone(newValue,oldValue,rowIndex,rowData,field){
                this.roomTypDetailData[rowIndex][field] = newValue;
            }
        }
    }


</script>