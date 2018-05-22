<template>
    <div class="row">
        <div>
            <div class="grid">
                <div class="grid-item">
                    <label class="width-auto">{{i18nLang.program.PMS0810230.useTime}}</label>
                    <bac-select v-model="selectedUseTimeData"
                                :data-display="useTimeSelectData" :data="useTimeSelectData"
                                is-qry-src-before="Y" value-field="value" text-field="display"
                                @update:v-model="val => selectedUseTimeData = val"
                                :default-val="selectedUseTimeData" :field="{}"
                                @change="fetchRateCodDtData">
                    </bac-select>
                    <select class="input-medium medium-c1">
                        <option value="-1">使用期間</option>
                        <option value="1">2018/04/17~2018/12/31</option>
                        <option value="2">2019/01/01~2019/12/31</option>
                        <option value="2">2020/01/01~2020/12/31</option>
                    </select>
                </div>
                <div class="right-menu-co pull-right" style="width: 80px;">
                    <button role="button" class="btn btn-danger btn-white btn-defaultWidth">停售</button>
                </div>
            </div>
            <div class="clearfix"></div>
            <div class="container_12 divider">
                <div class="grid_12 fixed-table-container cus-resvBlockSetting-table" width="100%">
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
            //取得使用期間資料(改變後未存檔)
            this.$eventHub.$on("setUseTimeSelectData", () => {

            });

            //rate cod 修改
            this.$eventHub.$on("setRoomTypRateCod", (data) => {
                let self = this;
                this.rateCod = data.rateCod;
                //修改原始資料的 rate_cod
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
        },
        data() {
            return {
                i18nLang: go_i18nLang,
                editingIndex: -1, //正在編輯的index
                rentCalDat: '', //滾房租日
                isLoading: true,
                rateCod: '',
                //房型原始資料
                rateCodDtData: [],
                oriRateCodDtData: [],
                tmpCUD: {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                },
                //使用期間資料
                selectedUseTimeData: "",
                //使用期間下拉資料
                useTimeSelectData: [],
            }
        },
        watch: {
            isRoomType(val) {
                if (val) {
                    //取使用期間資料
                    this.fetchUseTime();
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
                this.rateCodDtData = [];
                this.oriRateCodDtData = [];
                this.tmpCUD = {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                };
                this.selectedUseTimeData = [];
                this.useTimeSelectData = [];
            },
            //取使用期間資料
            fetchUseTime() {
                BacUtils.doHttpPostAgent('/api/chkFieldRule', {
                    rule_func_name: 'qry_ratesupplydt_for_select_data',
                    rate_cod: this.$store.gs_rateCod
                }, (result) => {
                    if (result.success) {
                        this.useTimeSelectData = result.selectOptions;
                        this.selectedUseTimeData = "";
                    }
                    else {
                        alert(result.errorMsg.toString());
                    }
                });
            },
            //取得房價資料(改變使用期間)
            fetchRateCodDtData() {
                this.isLoading = true;

                let lo_params = {
                    prg_id: 'PMS0810230',
                    page_id: 2,
                    tab_page_id: 11,
                    searchCond: {
                        rate_cod: this.$store.state.gs_oriRateCod,
                        supply_nos: this.selectedUseTimeData
                    }
                };

                if (lo_params.searchCond.rate_cod != "" && lo_params.searchCond.supply_nos != "") {
                    $.post("/api/fetchDgRowData", lo_params, result => {
                        if (result.success) {
                            this.rateCodDtData = result.dgRowData;
                            this.oriRateCodDtData = JSON.parse(JSON.stringify(result.dgRowData));
                            _.each(this.$store.state.go_allData.ga_utDataGridRowsData, (lo_useTimeData) => {
                                let la_roomCod = lo_useTimeData.room_cods.split(",");
                                let la_commandOption = lo_useTimeData.command_option.split(",");
                                //日期規則、房型是否存在
                                _.each(la_roomCod, (ls_roomCod) => {
                                    _.each(la_commandOption, (ls_commandOption) => {
                                        let lo_examParams = {
                                            supply_nos: lo_useTimeData.supply_nos,
                                            command_option: ls_commandOption,
                                            room_cod: ls_roomCod
                                        };
                                        let lb_isExist = _.findIndex(this.rateCodDtData, lo_examParams) > -1 ? true : false;
                                        if (!lb_isExist) {
                                            let lo_appendData = {
                                                add_adult: 0,
                                                add_child: 0,
                                                athena_id: lo_useTimeData.athena_id,
                                                begin_dat: lo_useTimeData.begin_dat,
                                                command_cod: lo_useTimeData.command_cod,
                                                command_option: ls_commandOption,
                                                day_nam: this.convertCommandOption(ls_commandOption),
                                                del: 'N',
                                                end_dat: lo_useTimeData.end_dat,
                                                hotel_cod: lo_useTimeData.hotel_cod,
                                                ins_upd: 'N',
                                                rate_cod: lo_useTimeData.rate_cod,
                                                rent_amt: 0,
                                                room_cod: ls_roomCod,
                                                supply_nos: lo_useTimeData.supply_nos,
                                                use_sta: 'Y'
                                            };
                                            this.rateCodDtData.push(lo_appendData);
                                        }
                                    })
                                });
                            });
                        }
                        else {
                            alert(result.errorMsg);
                        }
                    });
                }
            },
            //轉換日期規則資料
            convertCommandOption(command_option) {
                let lo_coFieldData = _.findWhere(this.$store.state.ga_utFieldsData, {ui_field_name: 'command_option'});
                let la_selectData = !_.isUndefined(lo_coFieldData) ? lo_coFieldData.selectData : [];
                let ls_commandOption = la_selectData.length > 0 ? _.findWhere(la_selectData, {value: command_option.substring(1, 2)}).display : "";
                return ls_commandOption;
            }
        }
    }

</script>

<style>
    .row-actice-c {
        background-color: #edf7ff;
    }
</style>