<template>
    <div id="resv_assignHouse_dialog" class="hide padding-5">
        <div class="businessCompanyData">
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <!-- 指定房組 dataGrid -->
                    <table id="resv_assignHouseTable"></table>
                </div>

                <div class="clearfix"></div>
                <div class="space-6"></div>

                <div class="row">
                    <div class="col-xs-11 col-sm-11">
                        <div class="row">
                            <div class="horizTable-outer pull-left">
                                <table class="css_table horizTable click-effect">
                                    <thead class="css_thead">
                                    <tr class="css_tr">
                                        <th class="css_th" v-for="field in orderDtFieldData"
                                            v-if="field.visiable === 'Y'"
                                            :style="{'min-width': field.width + 'px'}">
                                            {{ field.ui_display_name }}
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody class="css_tbody">
                                    <tr class="css_tr" v-for="data in orderDtRowsData"
                                        @click="selectOrderDtRowsData(data)">
                                        <td class="css_td">{{ data.ikey_seq_nos }}</td>
                                        <td class="css_td">{{ data.room_nos }}</td>
                                        <td class="css_td">{{ data.guest_list }}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="horizTable-outer pull-left ml-5">
                                <table class="css_table horizTable">
                                    <thead class="css_thead">
                                    <tr class="css_tr">
                                        <th class="css_th" style="min-width:40px;">選擇</th>
                                        <th class="css_th" v-for="field in guestMnFieldData"
                                            v-if="field.visiable === 'Y'"
                                            :style="{'min-width': field.width + 'px'}">
                                            {{ field.ui_display_name }}
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody class="css_tbody">
                                    <tr class="css_tr" v-for="data in guestMnRowsData">
                                        <td class="css_td">
                                            <div class="popCheckbox rmAssignCk">
                                                            <span class="checkbox">
                                                                  <label class="checkbox-width">
                                                                      <input name="form-field-checkbox"
                                                                             type="checkbox" :value="data"
                                                                             class="ace"
                                                                             v-model="guestMnRowDataChecked">
                                                                      <span class="lbl"></span>
                                                                  </label>
                                                            </span>
                                            </div>
                                        </td>
                                        <td class="css_td">{{ data.alt_nam }}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-1 col-sm-1">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">存檔
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="specify">指定
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="automaticSpecify">自動指定
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-danger btn-white btn-defaultWidth"
                                                role="button" @click="cancelSpecify">取消指定
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-danger btn-white btn-defaultWidth"
                                                role="button" @click="allCancelSpecify">全部取消
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">列印報表
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">Quit
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>
</template>

<script>
    import alasql from 'alasql';

    var vmHub = new Vue();

    /** DatagridRmSingleGridClass **/
    function DatagridSingleGridClass() {
    }

    DatagridSingleGridClass.prototype = new DatagridBaseClass();
    DatagridSingleGridClass.prototype.onClickCell = function (index, row) {
        vmHub.$emit("selectDataGridRow", {row: row, index: index});
        // console.log('我是row'+' '+row);
        // console.log('我是index'+' '+index);
    };
    DatagridSingleGridClass.prototype.onClickRow = function (index, row) {

    };

    export default {
        name: "specifyHouses",
        props: ["isSpecifyHouse", "rowData", "isEditStatus"],
        data() {
            return {
                orderDtGroupFieldData: [],      //order dt 欄位
                orderDtFieldData: [],           //所group 到的所有 order dt 欄位
                guestMnFieldData: [],           //所group 到的所有 guest mn 欄位
                allOrderDtRowsData: [],         //order dt 資料
                oriAllOrderDtRowsData: [],      //order dt 原始資料
                orderDtGroupRowsData: [],       //order dt group 後資料
                orderDtRowsData: [],            //所group 到的所有 order dt 資料
                oriOrderDtRowsData: [],         //所group 到的所有 order dt 原始資料
                guestMnRowsData: [],            //所group 到的所有 guest mn ikey_seq_nos = 0 資料
                oriGuestMnRowsData: [],         //所group 到的所有 guest mn ikey_seq_nos = 0 原始資料
                allGuestMnRowsData: [],         //所group 到的所有 guest mn 全部資料
                oriAllGuestMnRowsData: [],       //所group 到的所有 guest mn 全部原始資料
                editingGroupDataIndex: undefined,
                editingGroupData: {},
                dgIns: {},
                selectOrderDtRowsDataIkeySeqNos: '',
                guestMnRowDataChecked: [],
                tmpCUD: {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                }
            }
        },
        created() {
            vmHub.$on("selectDataGridRow", (data) => {
                this.editingGroupDataIndex = data.index;
            })
        },
        watch: {
            async isSpecifyHouse(val) {
                if (val && !_.isUndefined(this.rowData.ikey)) {
                    //是否第一次開起
                    if (this.orderDtGroupFieldData.length == 0) {
                        this.initData();
                        await this.fetchAllFieldsData();
                    }
                }
                else {
                    this.initData();
                    this.initTmpCUD();
                }
            },
            async editingGroupDataIndex(newVal, oldVal) {
                if (!_.isUndefined(newVal)) {
                    $("#resv_assignHouseTable").datagrid('selectRow', newVal);
                    this.editingGroupData = $("#resv_assignHouseTable").datagrid('getSelected');
                    let lo_groupParam = {
                        rate_cod: this.editingGroupData.rate_cod,
                        order_sta: this.editingGroupData.order_sta,
                        days: this.editingGroupData.days,
                        ci_dat: this.editingGroupData.ci_dat,
                        co_dat: this.editingGroupData.co_dat,
                        use_cod: this.editingGroupData.use_cod,
                        room_cod: this.editingGroupData.room_cod,
                        rent_amt: this.editingGroupData.rent_amt,
                        serv_amt: this.editingGroupData.serv_amt,
                        block_cod: this.editingGroupData.block_cod
                    };
                    //把group後order_dt資料和一開始order_dt資料進行資料比對，使用where抓出所有符合資料
                    let la_detailOrderDtData = _.where(this.allOrderDtRowsData, lo_groupParam);
                    await this.fetchDetailRowsData(la_detailOrderDtData);
                }
            }
        },
        methods: {
            initData() {
                this.orderDtGroupFieldData = [];
                this.orderDtFieldData = [];
                this.guestMnFieldData = [];
                this.allOrderDtRowsData = [];
                this.oriAllOrderDtRowsData = [];
                this.orderDtGroupRowsData = [];
                this.orderDtRowsData = [];
                this.oriOrderDtRowsData = [];
                this.guestMnRowsData = [];
                this.oriGuestMnRowsData = [];
                this.allGuestMnRowsData = [];
                this.oriAllGuestMnRowsData = [];
                this.editingGroupDataIndex = undefined;
                this.editingGroupData = {};
                this.dgIns = {};
                this.selectOrderDtRowsDataIkeySeqNos = "";
                this.guestMnRowDataChecked = [];
            },
            initTmpCUD() {
                this.tmpCUD = {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                }
            },
            async fetchFieldsData(param) {
                return await BacUtils.doHttpPromisePostProxy("/api/fetchOnlyDataGridFieldData", param)
                    .then((result) => {
                        return result;
                    })
                    .catch(err => {
                        return {success: false, errMsg: err};
                    })
            },
            // 撈回所有欄位名稱
            async fetchAllFieldsData() {
                try {
                    let [lo_fetchGroupOrderDtFieldsData, lo_fetchOrderDtFieldsData, lo_fetchGuestMnFieldsData] = await Promise.all([
                        this.fetchFieldsData({prg_id: 'PMS0110042', page_id: 1010, tab_page_id: 1}),
                        this.fetchFieldsData({prg_id: 'PMS0110042', page_id: 1010, tab_page_id: 2}),
                        this.fetchFieldsData({prg_id: 'PMS0110042', page_id: 1010, tab_page_id: 3})
                    ]);

                    this.orderDtGroupFieldData = lo_fetchGroupOrderDtFieldsData.dgFieldsData;
                    this.orderDtFieldData = _.sortBy(lo_fetchOrderDtFieldsData.dgFieldsData, "col_seq");
                    this.guestMnFieldData = _.sortBy(lo_fetchGuestMnFieldsData.dgFieldsData, "col_seq");

                    await this.fetchOrderDtRowData();
                    await this.fetchGuestRowsData();
                }
                catch (err) {
                    console.log(err);
                }
            },
            // 撈回OrderDt資料
            fetchOrderDtRowData() {
                BacUtils.doHttpPromisePostProxy("/api/fetchDgRowData", {
                    prg_id: 'PMS0110042',
                    page_id: 1010,
                    tab_page_id: 1,
                    // 附加判斷條件
                    searchCond: {ikey: this.rowData.ikey}
                }).then((result) => {
                    if (result.success) {
                        this.allOrderDtRowsData = result.dgRowData;
                        this.oriAllOrderDtRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                        let ls_groupStatement = "select * from ? where order_sta <> 'X' group by rate_cod,order_sta,days,ci_dat,co_dat,use_cod,room_cod,rent_amt,serv_amt,block_cod";
                        this.orderDtGroupRowsData = alasql(ls_groupStatement, [this.allOrderDtRowsData]);
                        this.showDataGrid();
                    }
                }).catch(err => {
                    console.log(err);
                })
            },

            showDataGrid() {
                this.dgIns = new DatagridSingleGridClass();
                this.dgIns.init("PMS0110042", "resv_assignHouseTable", DatagridFieldAdapter.combineFieldOption(this.orderDtGroupFieldData, "resv_assignHouseTable"), this.orderDtGroupFieldData);
                this.dgIns.loadDgData(this.orderDtGroupRowsData);
                this.editingGroupDataIndex = 0;
            },
            async fetchDetailRowsData(detailRowsData) {
                // 找出每一筆資料的ikey_seq_nos
                let la_ikeySeqNos = [];
                _.each(detailRowsData, (lo_detailData) => {
                    la_ikeySeqNos.push(lo_detailData.ikey_seq_nos);
                });
                await BacUtils.doHttpPromisePostProxy("/api/fetchDgRowData", {
                    prg_id: 'PMS0110042',
                    page_id: 1010,
                    tab_page_id: 2,
                    // 附加判斷條件
                    searchCond: {ikey_seq_nos: la_ikeySeqNos, ikey: detailRowsData[0].ikey}
                }).then((result) => {
                    if (result.success) {
                        this.orderDtRowsData = result.dgRowData;
                        this.oriOrderDtRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            fetchGuestRowsData() {
                BacUtils.doHttpPromisePostProxy("/api/fetchDgRowData", {
                    prg_id: 'PMS0110042',
                    page_id: 1010,
                    tab_page_id: 3,
                    // 附加判斷條件
                    searchCond: {ikey: this.rowData.ikey}
                }).then((result) => {
                    if (result.success) {
                        this.allGuestMnRowsData = result.dgRowData;
                        this.oriAllGuestMnRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                        // 篩選只要ikey_seq_nos = 0 資料
                        let la_filterIkeySeqNos = _.filter(this.allGuestMnRowsData, (lo_rowsData) => {
                            return lo_rowsData.ikey_seq_nos === 0;
                        });

                        this.guestMnRowsData = la_filterIkeySeqNos;
                        this.oriGuestMnRowsData = JSON.parse(JSON.stringify(la_filterIkeySeqNos));
                    }
                }).catch(err => {
                    console.log(err);
                })
            },

            selectOrderDtRowsData(rowsData) {
                this.selectOrderDtRowsDataIkeySeqNos = rowsData.ikey_seq_nos;
            },
            specify() {
                if (this.selectOrderDtRowsDataIkeySeqNos !== '' && this.guestMnRowDataChecked.length > 0) {
                    // orderDtRowsData和selectOrderDtRowsDataIkeySeqNos(當下點擊儲存的ikeySeqNos)進行資料比對
                    // 並進行顧客資料移動和異動guest_mns ikey_seq_nos狀態
                    let la_oriData = [];
                    let la_changeData = [];
                    _.each(this.orderDtRowsData, (lo_rowsData) => {
                        if (lo_rowsData.ikey_seq_nos === this.selectOrderDtRowsDataIkeySeqNos) {
                            _.each(this.guestMnRowDataChecked, (lo_checkedData) => {
                                let lo_oriCheckedData = this.findOriData(this.oriAllGuestMnRowsData, lo_checkedData);
                                lo_checkedData.ikey_seq_nos = lo_rowsData.ikey_seq_nos;
                                lo_rowsData.guest_list += ',' + lo_checkedData.alt_nam;
                                la_oriData.push(lo_oriCheckedData);
                                la_changeData.push(lo_checkedData);
                            });
                        }
                    });

                    // 更新資料
                    this.changeTmpCUD(la_oriData, la_changeData);

                    // guestMnRowsData和guestMnRowDataChecked資料比對，抓出要移除資料index
                    let la_removeIndex = [];
                    _.each(this.guestMnRowsData, (lo_rowData, ln_rowDataIndex) => {
                        _.each(this.guestMnRowDataChecked, (lo_checkedData) => {
                            if (lo_rowData.athena_id === lo_checkedData.athena_id && lo_rowData.ci_ser === lo_checkedData.ci_ser && lo_rowData.hotel_cod === lo_checkedData.hotel_cod) {
                                la_removeIndex.push(ln_rowDataIndex);
                            }
                        });
                    });
                    // 移除guest_mn資料
                    this.guestMnRowsData = _.filter(this.guestMnRowsData, (lo_rowsData, ln_rowsDataIndex) => {
                        // 回傳沒有在la_removeIndex移除清單內最後結果資料
                        return la_removeIndex.indexOf(ln_rowsDataIndex) === -1;
                    });
                } else {

                    alert(go_i18nLang["program"]["PMS0110042"]["isSelected"]);
                }
            },
            automaticSpecify() {
                if (this.guestMnRowsData.length > 0) {
                    let ln_index = 0;
                    let la_removeIndex = [];
                    let la_oriData = [];
                    let la_changeData = [];
                    _.each(this.orderDtRowsData, (lo_rowsData) => {
                        if (ln_index < this.guestMnRowsData.length) {
                            let lo_oriCheckedData = this.findOriData(this.oriAllGuestMnRowsData, this.guestMnRowsData[ln_index]);
                            this.guestMnRowsData[ln_index].ikey_seq_nos = lo_rowsData.ikey_seq_nos;
                            lo_rowsData.guest_list += this.guestMnRowsData[ln_index].alt_nam;
                            la_removeIndex.push(ln_index);
                            la_oriData.push(lo_oriCheckedData);
                            la_changeData.push(this.guestMnRowsData[ln_index]);
                            ln_index++;
                        }
                    });

                    // 更新資料
                    this.changeTmpCUD(la_oriData, la_changeData);

                    // 移除guest_mn資料
                    this.guestMnRowsData = _.filter(this.guestMnRowsData, (rowsData, ln_rowsDataIndex) => {
                        // 回傳沒有在la_removeIndex移除清單內最後結果資料
                        return la_removeIndex.indexOf(ln_rowsDataIndex) === -1;
                    });
                } else {
                    alert(go_i18nLang["program"]["PMS0110042"]["noData"]);
                }
            },
            cancelSpecify() {
                if (this.selectOrderDtRowsDataIkeySeqNos !== '') {
                    let lo_currentClick = _.findWhere(this.orderDtRowsData, {ikey_seq_nos: this.selectOrderDtRowsDataIkeySeqNos});
                    if (lo_currentClick !== undefined) {
                        let lo_guestMnData = _.where(this.allGuestMnRowsData, {
                            ikey: lo_currentClick.ikey,
                            ikey_seq_nos: lo_currentClick.ikey_seq_nos,
                        });
                        if (lo_guestMnData.length > 0) {
                            let la_oriData = [];
                            let la_changeData = [];
                            // 這邊要和oriAllGuestMnRowsData資料比對，撈出原始資料
                            let la_oriGuestInfo = this.findOriDataMul(this.oriAllGuestMnRowsData, lo_guestMnData);
                            //變更資料狀態，並更新資料
                            _.each(lo_guestMnData, (lo_data) => {
                                lo_data.ikey_seq_nos = 0;
                                this.guestMnRowsData.push(lo_data);
                                la_changeData.push(lo_data);
                            });
                            //更新原始資料，lo_oriGuestInfo是一個陣列可能有多筆的情況
                            _.each(la_oriGuestInfo, (lo_data) => {
                                la_oriData.push(lo_data);
                            });

                            // 更新資料
                            this.changeTmpCUD(la_oriData, la_changeData);

                            // 移除order_dt顧客資料
                            _.each(this.orderDtRowsData, (lo_data) => {
                                if (lo_data.ikey_seq_nos === this.selectOrderDtRowsDataIkeySeqNos) {
                                    lo_data.guest_list = '';
                                }
                            });
                        } else {
                            alert(go_i18nLang["program"]["PMS0110042"]["noData"]);
                        }
                    } else {
                        alert(go_i18nLang["program"]["PMS0110042"]["noResultsFound"]);
                    }
                } else {
                    alert(go_i18nLang["program"]["PMS0110042"]["isSelected"]);
                }
            },
            allCancelSpecify() {
                // orderDtRowsData和allGuestMnRowsData資料比對，撈符合資料
                let la_guestInfo = [];
                _.each(this.orderDtRowsData, (lo_orderDtRowsData) => {
                    _.each(this.allGuestMnRowsData, (lo_guestMnRowsData) => {
                        if (lo_orderDtRowsData.ikey === lo_guestMnRowsData.ikey && lo_orderDtRowsData.ikey_seq_nos === lo_guestMnRowsData.ikey_seq_nos) {
                            la_guestInfo.push(lo_guestMnRowsData);
                        }
                    });
                });
                // la_guestInfo 有資料才做，更新狀態、資料
                if (la_guestInfo.length > 0) {
                    let la_oriData = [];
                    let la_changeData = [];
                    let la_oriGuestMnData = this.findOriDataMul(this.oriAllGuestMnRowsData, la_guestInfo);
                    _.each(la_guestInfo, (lo_guestInfo) => {
                        lo_guestInfo.ikey_seq_nos = 0;
                        this.guestMnRowsData.push(lo_guestInfo);
                        la_changeData.push(lo_guestInfo);
                    });
                    // 更新原始資料
                    _.each(la_oriGuestMnData, (lo_oriGuestMnData) => {
                        la_oriData.push(lo_oriGuestMnData);
                    });
                    // 更新資料
                    this.changeTmpCUD(la_oriData, la_changeData);

                    // 移除order_dt顧客資料
                    _.each(this.orderDtRowsData, (lo_orderDtRowsData) => {
                        lo_orderDtRowsData.guest_list = '';
                    });
                } else {
                    alert(go_i18nLang["program"]["PMS0110042"]["noNeedToCancel"]);
                }
            },
            changeTmpCUD(oriData, changeData) {
                // console.log(oriData);
                // console.log(changeData);

                let ln_changeIndex = 0;
                _.each(oriData, (lo_item) => {
                    let lo_oriData = _.findWhere(this.tmpCUD.oriData, {
                        ikey: lo_item.ikey, alt_nam: lo_item.alt_nam, ci_ser: lo_item.ci_ser
                    });
                    if (lo_oriData !== undefined) {
                        let ln_oriDataIndex = _.findIndex(this.tmpCUD.oriData, {
                            ikey: lo_oriData.ikey, alt_nam: lo_oriData.alt_nam, ci_ser: lo_oriData.ci_ser
                        });
                        if (lo_item.ikey_seq_nos !== changeData[ln_changeIndex].ikey_seq_nos) {
                            this.tmpCUD.oriData.splice(ln_oriDataIndex, 1);
                            this.tmpCUD.oriData.push(lo_item);
                        } else if (lo_item.ikey_seq_nos === changeData[ln_changeIndex].ikey_seq_nos){
                            this.tmpCUD.oriData.splice(ln_oriDataIndex, 1);
                        }
                    } else {
                        this.tmpCUD.oriData.push(lo_item);
                    }
                    ln_changeIndex++
                });


                let ln_oriIndex = 0;
                _.each(changeData, (lo_item) => {
                    let lo_changeData = _.findWhere(this.tmpCUD.updateData, {
                        ikey: lo_item.ikey, alt_nam: lo_item.alt_nam, ci_ser: lo_item.ci_ser
                    });

                    // console.log(lo_changeData);
                    if (lo_changeData !== undefined) {
                        let ln_oriDataIndex = _.findIndex(this.tmpCUD.updateData, {
                            ikey: lo_changeData.ikey, alt_nam: lo_changeData.alt_nam, ci_ser: lo_changeData.ci_ser
                        });
                        if (lo_item.ikey_seq_nos !== oriData[ln_oriIndex].ikey_seq_nos) {
                            this.tmpCUD.updateData.splice(ln_oriDataIndex, 1);
                            this.tmpCUD.updateData.push(lo_item);
                        } else if(lo_item.ikey_seq_nos === oriData[ln_oriIndex].ikey_seq_nos){
                            this.tmpCUD.updateData.splice(ln_oriDataIndex, 1);
                        }
                    } else {
                        this.tmpCUD.updateData.push(lo_item);
                    }
                    ln_oriIndex++;
                });


                console.log(this.tmpCUD.oriData);
                console.log(this.tmpCUD.updateData);
            },
            // 比對原始資料，並找出原始資料的那一筆(找尋單筆)
            findOriData(oriData, searchData) {
                let lo_result;
                _.each(oriData, (lo_item) => {
                    if (lo_item.ikey === searchData.ikey && lo_item.alt_nam === searchData.alt_nam && lo_item.ci_ser === searchData.ci_ser) {
                        lo_result = lo_item;
                    }
                });

                return lo_result;
            },
            //比對原始資料，並找出原始資料的那一筆(找尋多筆)
            findOriDataMul(oriData, searchData) {
                let la_result;
                la_result = _.where(oriData, {
                    ikey: searchData[0].ikey,
                    alt_nam: searchData[0].alt_nam,
                    ci_ser: searchData[0].ci_ser
                });
                return la_result;
            }
        }
    }
</script>

<style scoped>


</style>