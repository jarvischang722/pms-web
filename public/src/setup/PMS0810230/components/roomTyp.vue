<template>
    <div class="row">
        <div>
            <div class="grid">
                <div class="grid-item">
                    <label class="width-auto">使用期間</label>
                    <select class="input-medium medium-c1">
                        <option value="-1">使用期間</option>
                        <option value="1">2018/04/17~2018/12/31</option>
                        <option value="2">2019/01/01~2019/12/31</option>
                        <option value="2">2020/01/01~2020/12/31</option>
                    </select>
                </div>
            </div>
            <div class="clearfix"></div>
            <div class="container_12 divider">
                <div class="grid_12 fixed-table-container cus-resvBlockSetting-table"
                     width="100%">
                    <!--<div class="">-->
                    <table class="fancyTable themeTable treeControl themeTableTwo"
                           id="PMS0810230-table" cellpadding="0" cellspacing="0">
                        <thead>
                        <tr class="grayBg">
                            <th class="ca-headerTitle grayBg">
                                日期規則
                            </th>
                            <th class="">STD</th>
                            <th class="">SUP</th>
                            <th class="">DXK</th>
                            <th class="">DXT</th>
                            <th class="">SUE</th>
                            <th class="">ESD</th>
                            <th class="">ESP</th>
                            <th class="">EXK</th>
                            <th class="">EXT</th>
                            <th class="">ESU</th>
                            <th class="">PDS</th>
                        </tr>
                        </thead>
                        <tbody class="tbodyRight">
                        <tr class="grayBg">
                            <td class="middle td-first grayBg">每一天</td>
                            <td class="numeric">20</td>
                            <td class="numeric">20</td>
                            <td class="numeric">22</td>
                            <td class="numeric darkRedTxt">-1</td>
                            <td class="numeric ">9</td>
                            <td class="numeric ">8</td>
                            <td class="numeric ">15</td>
                            <td class="numeric ">10</td>
                            <td class="numeric ">12</td>
                            <td class="numeric ">6</td>
                            <td class="numeric ">1</td>
                        </tr>
                        <tr class="grayBg">
                            <td class="middle td-first grayBg">感恩節，假日</td>
                            <td class="numeric ">20</td>
                            <td class="numeric ">20</td>
                            <td class="numeric ">22</td>
                            <td class="numeric darkRedTxt">-1</td>
                            <td class="numeric ">9</td>
                            <td class="numeric ">8</td>
                            <td class="numeric ">15</td>
                            <td class="numeric ">10</td>
                            <td class="numeric ">12</td>
                            <td class="numeric ">6</td>
                            <td class="numeric ">1</td>
                        </tr>
                        <tr>
                            <td class="middle td-first ">國慶日</td>
                            <td class="numeric">3800</td>
                            <td class="numeric">4000</td>
                            <td class="numeric ">4200</td>
                            <td class="numeric">4500</td>
                            <td class="numeric">1500</td>
                            <td class="numeric ">3300</td>
                            <td class="numeric">4500</td>
                            <td class="numeric">4700</td>
                            <td class="numeric">5000</td>
                            <td class="numeric">4800</td>
                            <td class="numeric">45000</td>
                        </tr>
                        <tr>
                            <td class="middle td-first">中秋節</td>
                            <td class="numeric">3100</td>
                            <td class="numeric ">3300</td>
                            <td class="numeric">3500</td>
                            <td class="numeric">3800</td>
                            <td class="numeric">4000</td>
                            <td class="numeric">3600</td>
                            <td class="numeric">3800</td>
                            <td class="numeric">4100</td>
                            <td class="numeric">4300</td>
                            <td class="numeric">4300</td>
                            <td class="numeric">40000</td>
                        </tr>
                        <tr>
                            <td class="middle td-first">春節</td>
                            <td class="numeric">3600</td>
                            <td class="numeric">3800</td>
                            <td class="numeric">4000</td>
                            <td class="numeric">4300</td>
                            <td class="numeric">4300</td>
                            <td class="numeric">4100</td>
                            <td class="numeric">4300</td>
                            <td class="numeric">4500</td>
                            <td class="numeric">4800</td>
                            <td class="numeric">4600</td>
                            <td class="numeric">4300</td>
                        </tr>
                        <tr>
                            <td class="middle td-first">清明節</td>
                            <td class="numeric">2800</td>
                            <td class="numeric">3000</td>
                            <td class="numeric">3200</td>
                            <td class="numeric">3500</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                        </tr>
                        <tr>
                            <td class="middle td-first">端午節</td>
                            <td class="numeric">2750</td>
                            <td class="numeric">2950</td>
                            <td class="numeric">3150</td>
                            <td class="numeric">3450</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                        </tr>
                        <tr>
                            <td class="middle td-first">教師節</td>
                            <td class="numeric">4200</td>
                            <td class="numeric">4400</td>
                            <td class="numeric">4600</td>
                            <td class="numeric">4900</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                        </tr>
                        <tr>
                            <td class="middle td-first">228紀念日</td>
                            <td class="numeric">9800</td>
                            <td class="numeric">10000</td>
                            <td class="numeric">10200</td>
                            <td class="numeric">10500</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                        </tr>
                        <tr>
                            <td class="middle td-first">愚人節</td>
                            <td class="numeric">3200</td>
                            <td class="numeric">3400</td>
                            <td class="numeric">3600</td>
                            <td class="numeric">3900</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                            <td class="numeric">*</td>
                        </tr>

                        </tbody>
                    </table>
                    <!--</div>-->
                </div>
                <div class="clear"></div>
                <div class="clear"></div>
                date

            </div>
        </div>
        <div class="clearfix"></div>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        name: 'roomTyp',
        props: ["rowData", "isRoomType"],
        created() {
            this.$eventHub.$on("getUseTimeData", (data) => {
                this.useTimeData = data.useTimeData;
                if (this.roomTypData.length > 0) {
                    _.each(this.roomTypData, (lo_roomTypData, idx) => {
                        this.roomTypRowClick(idx, lo_roomTypData.roomCode, this.roomTypColumns[0]);
                    });
                    this.roomTypRowClick(0, this.roomTypData[0].roomCode, this.roomTypColumns[0]);
                }
            });
            this.$eventHub.$on("getDeleteUseTimeData", (data) => {
                this.deleteRoomTypData("useTime", data.delUseTimeData);
            });
            this.$eventHub.$on("setRoomTypRateCod", (data) => {
                let self = this;
                this.rateCod = data.rateCod;
                //修改原始資料的 rate_cod
                _.each(this.roomTypDetailRowsData, (lo_roomTypDetailRowsData, idx) => {
                    lo_roomTypDetailRowsData.rate_cod = data.rateCod;
                    if (lo_roomTypDetailRowsData.isCreate) {
                        let ln_editIndex = _.findIndex(this.tmpCUD.createData, {room_cod: lo_roomTypDetailRowsData.room_cod});
                        if (ln_editIndex > -1) {
                            this.tmpCUD.createData.splice(ln_editIndex, 1);
                            this.tmpCUD.createData.push(lo_roomTypDetailRowsData);
                        }
                    }
                    else {
                        let ln_editIndex = _.findIndex(this.tmpCUD.updateData, {supply_nos: lo_roomTypDetailRowsData.supply_nos});
                        if (ln_editIndex > -1) {
                            this.tmpCUD.updateData.splice(ln_editIndex, 1);
                            this.tmpCUD.oriData.splice(ln_editIndex, 1);
                        }
                        this.tmpCUD.updateData.push(lo_roomTypDetailRowsData);
                        this.tmpCUD.oriData.push(this.oriRoomTypDetailRowsData[idx]);
                    }
                });

                //修改 tmpCUD 的 rate_cod
                _.each(this.tmpCUD, (tmpCUDVal, tmpCUDKey) => {
                    if (tmpCUDKey != 'oriData') {
                        _.each(tmpCUDVal, (lo_tmpCUDVal, idx) => {
                            self.tmpCUD[tmpCUDKey][idx]['rate_cod'] = data.rateCod
                        });
                    }
                });
            });
            this.$eventHub.$on('setClearData', () => {
                this.tmpCUD = {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                }
            });
        },
        mounted() {
            this.fetchRentCalDat();
            this.fetchRoomTypSelectData();
        },
        data() {
            return {
                i18nLang: go_i18nLang,
                editingIndex: -1, //正在編輯的index
                rentCalDat: '', //滾房租日
                isLoading: true,
                rateCod: '',
                //房型原始資料
                roomTypFieldsData: [],
                roomTypRowsData: [],
                oriRoomTypRowsData: [],
                tmpCUD: {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                },
                //使用期間資料
                useTimeData: [], //使用期間資料
            }
        },
        watch: {
            isRoomType(val) {
                if (val) {
                    this.fetchRoomTypLeftData();//取房型資料
                }
            }
        },
        methods: {
            //取滾房租日
            fetchRentCalDat() {
                BacUtils.doHttpPostAgent('/api/qryRentCalDat', {}, (result) => {
                    this.rentCalDat = result.rent_cal_dat;
                });
            },
            initData() {
                this.roomTypFieldsData = [];
                this.roomTypRowsData = [];
                this.oriRoomTypRowsData = [];
                this.tmpCUD = {};
                this.useTimeData = [];
            },
            fetchRoomTypSelectData() {
                BacUtils.doHttpPostAgent('/api/chkFieldRule', {rule_func_name: 'get_room_typ_select'}, (result) => {
                });
            }
        }
    }

</script>

<style>
    .row-actice-c {
        background-color: #edf7ff;
    }
</style>