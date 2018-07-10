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
                                        @click="selectOrderDtRowsData(data.ikey_seq_nos)">
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
                                                role="button">自動指定
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-danger btn-white btn-defaultWidth"
                                                role="button">取消指定
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-danger btn-white btn-defaultWidth"
                                                role="button">全部取消
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
        props: ["rowData"],
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
                guestMnRowsData: [],            //所group 到的所有 guest mn 資料
                oriGuestMnRowsData: [],         //所group 到的所有 guest mn 原始資料
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
            async rowData(val) {
                if (!_.isEmpty(val)) {
                    await this.fetchAllFieldsData();
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

                    // await this.fetchGuestRowsData(la_detailOrderDtData);
                    // console.log('=================');
                    // console.log(this.editingGroupDataIndex);
                    // console.log('=================');
                }
            }
        },
        methods: {
            async fetchFieldsData(param) {
                return await BacUtils.doHttpPromisePostProxy("/api/fetchOnlyDataGridFieldData", param).then((result) => {
                    return result;
                }).catch(err => {
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
            // 初始化一個版
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
                        this.guestMnRowsData = result.dgRowData;
                        this.oriGuestMnRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            selectOrderDtRowsData(ikeySeqNos) {
                this.selectOrderDtRowsDataIkeySeqNos = ikeySeqNos;
            },
            specify() {
                // console.log('============目前===============');
                // console.log(this.guestMnRowDataChecked);
                // console.log('=============目前===========');
                if (this.selectOrderDtRowsDataIkeySeqNos !== '' && this.guestMnRowDataChecked.length > 0) {
                    // orderDtRowsData和selectOrderDtRowsDataIkeySeqNos(當下點擊儲存的ikeySeqNos)進行資料比對
                    // 並進行顧客資料移動
                    _.each(this.orderDtRowsData, (rowsData) => {
                        if (rowsData.ikey_seq_nos === this.selectOrderDtRowsDataIkeySeqNos) {
                            _.each(this.guestMnRowDataChecked, (checkedData) => {
                                rowsData.guest_list += ',' + checkedData.alt_nam;
                            });
                        }
                    });
                    // guestMnRowsData和guestMnRowDataChecked資料比對，條件符合紀錄當下在guestMnRowsData裡index
                    // 並移除顧客資料
                    _.each(this.guestMnRowsData, (rowData, rowDataIndex) => {
                        _.each(this.guestMnRowDataChecked, (checkedData) => {
                            if (rowData.alt_nam === checkedData.alt_nam) {
                                this.guestMnRowsData.splice(rowDataIndex, 1);
                            }
                        });
                    });
                }
            }
        }
    }
</script>

<style scoped>


</style>