<template>
    <div class="row">
        <div>
            <div class="grid" @click="leaveCell">
                <div class="grid-item">
                    <label class="width-auto">{{i18nLang.program.PMS0810230.useTime}}</label>
                    <bac-select v-model="selectedUseTimeData"
                                :data-display="useTimeSelectData" :data="useTimeSelectData"
                                is-qry-src-before="Y" value-field="value" text-field="display"
                                @update:v-model="val => selectedUseTimeData = val"
                                :default-val="selectedUseTimeData" :field="{}"
                                @change="fetchRateCodDtData">
                    </bac-select>
                </div>
                <div class="right-menu-co pull-right" style="width: 80px;">
                    <button role="button" class="btn btn-danger btn-white btn-defaultWidth" @click="setStopSell">
                        {{stopSellText}}
                    </button>
                </div>
            </div>
            <div class="clearfix"></div>
            <div class="container_12 divider">
                <div class="grid_12 fixed-table-container cus-resvBlockSetting-table" width="100%">
                    <!--<div class="">-->
                    <table class="fancyTable themeTable treeControl themeTableTwo" id="PMS0810230-table" cellpadding="0" cellspacing="0">
                        <thead>
                        <tr class="grayBg">
                            <th class="ca-headerTitle grayBg defHt" style="width: 15%">
                                {{i18nLang.program.PMS0810230.dateRule}}
                            </th>
                            <th class="defHt" v-for="(value, key, index) in roomCodData4Display">{{key}}</th>
                        </tr>
                        </thead>
                        <tbody class="tbodyRight">
                        <tr class="grayBg" v-for="(value, key, index) in dayNamData4Display">
                            <td class="middle td-first defHt">{{key}}</td>
                            <template v-for="ratecodData in value">
                                <td class="numeric defHt" :style="{width: tableCellWidth + '%'}" style="background-color: white;"
                                    @click="getData(ratecodData)" :id="ratecodData.uniKey" @blur="leaveCell(ratecodData)">
                                    <template v-if="ratecodData.isEdit && ratecodData.use_sta == 'Y'">
                                        <input type="text" class="defHt width-100"
                                               @keyup="formatAmt(ratecodData.rent_amt, rentAmtFieldData)"
                                               v-model="ratecodData.rent_amt">
                                    </template>
                                    <template v-else-if="ratecodData.use_sta == 'N'" style="width: 100%">
                                        *
                                    </template>
                                    <template v-else style="width: 100%">
                                        {{ratecodData.rent_amt}}
                                    </template>
                                </td>
                            </template>
                        </tr>
                        </tbody>
                    </table>
                    <!--</div>-->
                </div>
                <div class="clear"></div>
                <div class="clear"></div>
            </div>
        </div>
        <div class="clearfix"></div>
    </div>
</template>

<script>
    import moment from 'moment';
    import crypto from 'crypto';

    export default {
        name: 'roomTyp',
        props: ["rowData", "isRoomType"],
        created() {
            //取得使用期間資料(改變後未存檔)
            this.$eventHub.$on("setUseTimeSelectData", () => {
                let la_useTimeSelectData = [];
                let la_oriUseTimeSelectData = JSON.parse(JSON.stringify(this.useTimeSelectData));
                _.each(this.$store.state.go_allData.ga_utDataGridRowsData, (lo_useTimeSelectData, idx) => {
                    let lo_addData = {
                        begin_dat: moment(lo_useTimeSelectData["begin_dat"]).format(),
                        command_option: lo_useTimeSelectData["command_option"],
                        display: lo_useTimeSelectData["begin_dat"] + "~" + lo_useTimeSelectData["end_dat"],
                        end_dat: moment(lo_useTimeSelectData["begin_dat"]).format(),
                        room_cods: lo_useTimeSelectData["room_cods"],
                        value: lo_useTimeSelectData["supply_nos"]
                    };
                    la_useTimeSelectData.push(lo_addData);
                });
                this.useTimeSelectData = la_useTimeSelectData;
                this.selectedUseTimeData = _.first(la_useTimeSelectData).value;
                _.each(la_oriUseTimeSelectData, (lo_useTimeSelectData, idx) => {
                    //使用期間被刪除
                    if (_.findIndex(la_useTimeSelectData, {value: lo_useTimeSelectData.value}) == -1) {
                        //刪除的使用期間supply_nos在新增的暫存衝
                        let la_createData = _.where(this.tmpCUD.createData, {supply_nos: lo_useTimeSelectData.value});
                        _.each(this.tmpCUD.createData, (lo_createData, idx) => {
                            console.log(lo_createData);
                            let ln_createIndex = _.findIndex(la_createData, {supply_nos: lo_createData.supply_nos});
                            this.tmpCUD.createData.splice(ln_createIndex, 1);
                        });
                        //刪除的使用期supply_nos在新增的暫存衝
                        let la_updateData = _.where(this.tmpCUD.updateData, {supply_nos: lo_useTimeSelectData.value});
                        _.each(this.tmpCUD.updateData, (lo_updateData, idx) => {
                            let ln_editIndex = _.findIndex(la_updateData, {supply_nos: lo_updateData.supply_nos});
                            this.tmpCUD.updateData.splice(ln_editIndex, 1);
                            this.tmpCUD.oriData.splice(ln_editIndex, 1);
                        });
                        _.each(la_updateData, (lo_updateData) => {
                            this.tmpCUD.deleteData.push(lo_updateData);
                        });
                    }
                });
                console.log(this.tmpCUD);
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
            this.stopSellText = go_i18nLang.program.PMS0810230.stopSell;
            this.fetchRentCalDat();
        },
        data() {
            return {
                i18nLang: go_i18nLang,
                rentCalDat: '',             //滾房租日
                isLoading: true,
                stopSellText: "",
                rateCod: '',
                rentAmtFieldData: {},       //房租欄位資料
                rateCodDtData: [],          //房型資料
                oriRateCodDtData: [],       //房型原始資料
                roomCodData4Display: [],    //頁面上顯示房型資料
                dayNamData4Display: [],     //頁面上顯示日期規則資料
                tmpCUD: {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                },
                selectedUseTimeData: "",    //使用期間資料
                useTimeSelectData: [],      //使用期間下拉資料
                editingCellData: {},        //正在編輯的資料
                tableCellWidth: ""          //表格格子寬度
            }
        },
        watch: {
            isRoomType(val) {
                if (val) {
                    this.initData();
                    //取使用期間資料
                    this.fetchUseTime();
                }
            },
            rateCodDtData: {
                handler(val) {
                    _.each(val, (lo_val, ln_idx) => {
                        if (!_.isMatch(lo_val, this.oriRateCodDtData[ln_idx])) {
                            let ln_editIndex = _.findIndex(this.tmpCUD.updateData, {uniKey: lo_val.uniKey});
                            if (ln_editIndex > -1) {
                                this.tmpCUD.updateData.splice(ln_editIndex, 1);
                                this.tmpCUD.oriData.splice(ln_editIndex, 1);
                            }
                            this.tmpCUD.updateData.push(lo_val);
                            this.tmpCUD.oriData.push(this.oriRateCodDtData[ln_idx]);
                        }
                        else if (_.isUndefined(this.oriRateCodDtData[ln_idx])) {
                            let ln_createIndex = _.findIndex(this.tmpCUD.createData, {uniKey: lo_val.uniKey});
                            if (ln_createIndex > -1) {
                                this.tmpCUD.createData.splice(ln_createIndex, 1);
                            }
                            this.tmpCUD.createData.push(lo_val);
                        }
                    });
                    console.log(this.tmpCUD);
                },
                deep: true
            },
            dayNamData4Display: {
                handler(val) {
                    let lo_cloneData = JSON.parse(JSON.stringify(val))
                    let la_allData = Object.values(lo_cloneData)[0];
                    _.each(this.rateCodDtData, (lo_ratecodData, idx) => {
                        let ln_existIndex = _.findIndex(la_allData, {uniKey: lo_ratecodData.uniKey});

                        if (ln_existIndex > -1) {
                            this.rateCodDtData[idx] = la_allData[ln_existIndex];
                            this.rateCodDtData[idx]["isEdit"] = false;
                        }

                        if (!_.isMatch(lo_ratecodData, this.oriRateCodDtData[idx])) {
                            let ln_editIndex = _.findIndex(this.tmpCUD.updateData, {uniKey: lo_ratecodData.uniKey});
                            if (ln_editIndex > -1) {
                                this.tmpCUD.updateData.splice(ln_editIndex, 1);
                                this.tmpCUD.oriData.splice(ln_editIndex, 1);
                            }
                            this.tmpCUD.updateData.push(lo_ratecodData);
                            this.tmpCUD.oriData.push(this.oriRateCodDtData[idx]);
                        }
                        else if (_.isUndefined(this.oriRateCodDtData[idx])) {
                            let ln_createIndex = _.findIndex(this.tmpCUD.createData, {uniKey: lo_ratecodData.uniKey});
                            if (ln_createIndex > -1) {
                                this.tmpCUD.createData.splice(ln_createIndex, 1);
                            }
                            this.tmpCUD.createData.push(lo_ratecodData);
                        }
                    });
                    console.log(this.tmpCUD);
                },
                deep: true
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

                let lb_isFirstFetch = _.findIndex(this.rateCodDtData, {supply_nos: this.selectedUseTimeData}) > -1 ? false : true;

                if (lo_params.searchCond.rate_cod != "" && lo_params.searchCond.supply_nos != "" && lb_isFirstFetch) {
                    $.post("/api/fetchDataGridFieldData", lo_params, result => {
                        if (result.success) {
                            //取得房租欄位資料
                            this.rentAmtFieldData = _.findWhere(result.dgFieldsData, {ui_field_name: "rent_amt"});
                            //添加唯一值屬姓
                            _.each(result.dgRowData, (lo_dgRowData, idx) => {
                                lo_dgRowData["uniKey"] =
                                    crypto.randomBytes(32).toString('base64').replace(/([\(\)\[\]\{\}\^\$\+\=\-\*\?\.\"\'\|\/\\])/g, "");
                                lo_dgRowData["isEdit"] = false;
                                this.rateCodDtData.push(lo_dgRowData);
                                this.oriRateCodDtData.push(JSON.parse(JSON.stringify(lo_dgRowData)));
                            });

                            //剛新增的使用期間(未入到資料庫)
                            let lo_useTimeData = _.findWhere(this.$store.state.go_allData.ga_utDataGridRowsData, {
                                supply_nos: this.selectedUseTimeData
                            });
                            if (!_.isUndefined(lo_useTimeData)) {
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
                                                use_sta: 'Y',
                                                isEdit: false,
                                                uniKey: crypto.randomBytes(32).toString('base64').replace(/([\(\)\[\]\{\}\^\$\+\=\-\*\?\.\"\'\|\/\\])/g, "")
                                            };
                                            this.rateCodDtData.push(lo_appendData);
                                        }
                                    })
                                });
                            }
                            //依照room_cod、command_option轉換成頁面上呈現
                            let la_rateCodDtData4RoomCod = JSON.parse(JSON.stringify(this.rateCodDtData));
                            let la_rateCodDtData4DayNam = JSON.parse(JSON.stringify(this.rateCodDtData));
                            this.roomCodData4Display =
                                _.groupBy(_.where(la_rateCodDtData4RoomCod, {supply_nos: this.selectedUseTimeData}), "room_cod");
                            this.dayNamData4Display =
                                _.groupBy(_.where(la_rateCodDtData4DayNam, {supply_nos: this.selectedUseTimeData}), "day_nam");
                            this.tableCellWidth = 85 / _.keys(this.roomCodData4Display).length;
                        }
                        else {
                            alert(result.errorMsg);
                        }
                    });
                }
                else {
                    //依照room_cod、command_option轉換成頁面上呈現
                    let la_rateCodDtData4RoomCod = JSON.parse(JSON.stringify(this.rateCodDtData));
                    let la_rateCodDtData4DayNam = JSON.parse(JSON.stringify(this.rateCodDtData));
                    this.roomCodData4Display =
                        _.groupBy(_.where(la_rateCodDtData4RoomCod, {supply_nos: this.selectedUseTimeData}), "room_cod");
                    this.dayNamData4Display =
                        _.groupBy(_.where(la_rateCodDtData4DayNam, {supply_nos: this.selectedUseTimeData}), "day_nam");
                    this.tableCellWidth = 85 / _.keys(this.roomCodData4Display).length;
                }
            },
            //轉換日期規則資料
            convertCommandOption(command_option) {
                let lo_coFieldData = _.findWhere(this.$store.state.ga_utFieldsData, {ui_field_name: 'command_option'});
                let la_selectData = !_.isUndefined(lo_coFieldData) ? lo_coFieldData.selectData : [];
                let ls_commandOption = la_selectData.length > 0 ? _.findWhere(la_selectData, {value: command_option.substring(1, 2)}).display : "";
                return ls_commandOption;
            },
            setStopSell() {
                this.editingCellData.use_sta = this.editingCellData.use_sta == 'N' ? 'Y' : 'N';
                let ln_editIndex = _.findIndex(this.dayNamData4Display[this.editingCellData.day_nam], {uniKey: this.editingCellData.uniKey});

                if (ln_editIndex > -1) {
                    this.dayNamData4Display[this.editingCellData.day_nam][ln_editIndex]["use_sta"] = this.editingCellData.use_sta;
                }
            },
            getData(ratecod_data) {
                this.stopSellText = ratecod_data.use_sta == 'N' ?
                    go_i18nLang.program.PMS0810230.revert : go_i18nLang.program.PMS0810230.stopSell;
                _.each(this.dayNamData4Display, (la_val, ls_key) => {
                    _.each(la_val, (lo_val, idx) => {
                        this.dayNamData4Display[ls_key][idx]["isEdit"] = false;
                    })
                });
                let ln_editIndex = _.findIndex(this.dayNamData4Display[ratecod_data.day_nam], {uniKey: ratecod_data.uniKey});
                if (ln_editIndex > -1) {
                    this.dayNamData4Display[ratecod_data.day_nam][ln_editIndex]["isEdit"] = true;
                }
                this.editingCellData = ratecod_data;
            },
            leaveCell() {
                this.stopSellText = this.editingCellData.use_sta == 'N' ?
                    go_i18nLang.program.PMS0810230.revert : go_i18nLang.program.PMS0810230.stopSell;
                _.each(this.dayNamData4Display, (la_val, ls_key) => {
                    _.each(la_val, (lo_val, idx) => {
                        this.dayNamData4Display[ls_key][idx]["isEdit"] = false;
                    })
                });
                let ln_editIndex = _.findIndex(this.dayNamData4Display[this.editingCellData.day_nam], {uniKey: this.editingCellData.uniKey});
                if (ln_editIndex > -1) {
                    this.dayNamData4Display[this.editingCellData.day_nam][ln_editIndex]["use_sta"] = this.editingCellData.use_sta;
                }
                this.editingCellData = {};
            },
            formatAmt(amount, field) {
                let ls_amtValue = go_formatDisplayClass.removeAmtFormat(JSON.parse(JSON.stringify(amount)).toString());
                let ls_ruleVal = field.format_func_name.rule_val;
                let lb_isModify = true;
                let la_amtValue = ls_amtValue.split("");

                if (la_amtValue.length == 0) {
                    return;
                }
                for (let i = 0; i < la_amtValue.length; i++) {
                    if (ls_amtValue.charCodeAt(i) < 48 || ls_amtValue.charCodeAt(i) > 57) {
                        lb_isModify = false;
                        break;
                    }
                }

                let ln_editIndex = _.findIndex(this.dayNamData4Display[this.editingCellData.day_nam], {uniKey: this.editingCellData.uniKey});
                if (ln_editIndex > -1) {
                    if (lb_isModify) {
                        if (ls_ruleVal != "") {
                            this.dayNamData4Display[this.editingCellData.day_nam][ln_editIndex]["rent_amt"] =
                                go_formatDisplayClass.amtFormat(ls_amtValue, ls_ruleVal);
                        }
                        else {
                            this.dayNamData4Display[this.editingCellData.day_nam][ln_editIndex]["rent_amt"] = 0;
                        }
                    }
                    else {
                        this.dayNamData4Display[this.editingCellData.day_nam][ln_editIndex]["rent_amt"] = 0;
                    }

                }

            }
        }
    }

</script>

<style>
    .row-actice-c {
        background-color: #edf7ff;
    }
</style>