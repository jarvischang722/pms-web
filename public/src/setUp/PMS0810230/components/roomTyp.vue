<template>
    <div class="row">
        <div class="roomCodeTable pull-left width-15">
            <div>
                <v-table
                        style="width: 100%;"
                        :height="150"
                        :columns="roomTypColumns"
                        :table-data="roomTypData"
                        :column-cell-class-name="roomTypColumnCellClass"
                        row-hover-color="#eee"
                        row-click-color="#edf7ff">
                </v-table>
            </div>
        </div>
        <div class="roomCodeDetail  pull-left width-85">
            <div>
                <v-table
                        :height="150"
                        :columns="roomTypDetailColumns"
                        :table-data="roomTypDetailData"
                        :column-cell-class-name="columnCellClass"
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

    export default {
        name: 'roomTyp',
        props: ["rowData","isRoomTyp"],
        components: {VTable},
        mounted() {},
        data() {
            return {
                roomTypColumns: [],
                roomTypData: [],
                roomTypDetailColumns: [],
                roomTypDetailData: []
            }
        },
        watch: {
            isRoomTyp(val){
                if(val){
                    this.fetchData();
                }
            }
        },
        methods: {
            fetchData() {
                this.roomTypColumns = [
                    {
                        field: 'control',
                        title: '<i class="fa fa-plus green pointer">',
                        width: 40,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isResize: true
                    },
                    {
                        field: 'roomCode',
                        title: '房型代號',
                        width: 90,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isResize: true
                    },
                ];
                this.roomTypData = [
                    {
                        "control": "▬",
                        "roomCode": "DW"
                    },
                    {
                        "control": "▬",
                        "roomCode": "LD"
                    },
                    {
                        "control": "▬",
                        "roomCode": "FM"
                    },
                    {
                        "control": "▬",
                        "roomCode": "SD"
                    },
                    {
                        "control": "▬",
                        "roomCode": "DW"
                    },
                    {
                        "control": "▬",
                        "roomCode": "LD"
                    },
                    {
                        "control": "▬",
                        "roomCode": "LD"
                    },
                    {
                        "control": "▬",
                        "roomCode": "LD"
                    },
                    {
                        "control": "▬",
                        "roomCode": "LD"
                    },
                    {
                        "control": "▬",
                        "roomCode": "LD"
                    },
                    {
                        "control": "▬",
                        "roomCode": "FM"
                    }
                ];
                this.roomTypDetailColumns = [
                    {
                        field: 'useRange',
                        title: '使用期間',
                        width: 220,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isResize: true
                    },
                    {
                        field: 'dateRule',
                        title: '日期規則',
                        width: 140,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isResize: true
                    },
                    {
                        field: 'twoRoomPrice',
                        title: '房價',
                        width: 120,
                        titleAlign: 'center',
                        columnAlign: 'right',
                        isResize: true
                    },
                    {
                        field: 'adultPlus',
                        title: '加大人',
                        width: 120,
                        titleAlign: 'center',
                        columnAlign: 'right',
                        isResize: true
                    },
                    {
                        field: 'childPlus',
                        title: '加小孩',
                        width: 120,
                        titleAlign: 'center',
                        columnAlign: 'right',
                        isResize: true
                    },
                ];
                this.roomTypDetailData = [
                    {
                        "useRange": "2017/01/01~2017/12/31",
                        "dateRule": "平日",
                        "twoRoomPrice": "4,000",
                        "adultPlus": "*",
                        "childPlus": "",
                        "serviceFee": "180",
                    },
                    {
                        "useRange": "2017/01/01~2017/12/31",
                        "dateRule": "假日",
                        "twoRoomPrice": "4,000",
                        "adultPlus": "*",
                        "childPlus": "",
                        "serviceFee": "180",
                    },
                    {
                        "useRange": "2017/01/01~2017/12/31",
                        "dateRule": "旺日",
                        "twoRoomPrice": "4,000",
                        "adultPlus": "*",
                        "childPlus": "",
                        "serviceFee": "180",
                    }
                ]
            },
            roomTypColumnCellClass(rowIndex, columnName, rowData) {
                if (columnName == 'control') {
                    return 'column-cell-class-delete';
                }
            }
        }
    }
</script>