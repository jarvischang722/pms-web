<template>
    <div>
        <div class="col-xs-12">
            <div class="search-content">
                <div class="search-co">
                    <div class="row">
                        <div class="search-co-content col-xs-12 search-S2">
                            <div class="width-95 searchMain-S2">
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>訂房卡號</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="">
                                    </div>
                                    <div class="grid-item">
                                        <label>入住狀態</label>
                                        <select class="input-medium medium-c1">
                                            <option value="1">已入住</option>
                                            <option value="2">未入住</option>
                                            <option value="3">全部</option>
                                        </select>
                                    </div>
                                    <div class="grid-item">
                                        <label>訂房公司</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="">
                                    </div>
                                </div>
                            </div>
                            <div class="row search-footer-btn">
                                <div class="footer-btn-menu-co">
                                    <ul>
                                        <li>
                                            <div class="" data-rel="tooltip" data-placement="bottom"
                                                 title="查詢">
                                                <div class="icon-reStyle icon-co-14"></div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="" data-rel="tooltip" data-placement="bottom"
                                                 title="清除">
                                                <div class="icon-reStyle icon-co-11"></div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="icon-moreSearch show-search-detail">
                                                <i class="fa fa-chevron-down"></i>
                                            </div>
                                        </li>
                                    </ul>
                                </div>  <!-- /.footer-btn-menu-co -->
                            </div> <!-- /.search-footer-btn -->
                        </div>

                        <div class="search-co-content col-xs-12 search-S2-con rece-search-detail"
                             style="display: none;">
                            <div class="width-95">
                                <!--1-->
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>網訂編號</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="">
                                    </div>
                                    <div class="grid-item">
                                        <label>入住日期</label>
                                        <template>
                                            <el-date-picker v-model="ciDate1" type="date"
                                                            placeholder=""
                                                            class="date-wt input-medium medium-c1">
                                            </el-date-picker>
                                        </template>
                                    </div>
                                    <div class="grid-item">
                                        <label>公司名稱</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="">
                                    </div>
                                </div>
                                <!--2-->
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>聯絡電話</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="">
                                    </div>
                                    <div class="grid-item">
                                        <label>退房日期</label>
                                        <template>
                                            <el-date-picker v-model="coDate1" type="date"
                                                            placeholder=""
                                                            class="date-wt input-medium medium-c1">
                                            </el-date-picker>
                                        </template>
                                    </div>
                                    <div class="grid-item">
                                        <label>住客姓名</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="">
                                    </div>
                                </div>
                                <!--3-->
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>訂房來源</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="">
                                    </div>
                                    <div class="grid-item">
                                        <label>市場類別</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="">
                                    </div>
                                    <div class="grid-item">
                                        <label>團號</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="">
                                    </div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                    </div> <!-- row-->
                </div> <!-- /.search-co -->
            </div> <!-- /.row  search-content-->
        </div> <!-- /.col-sm-12 -->
        <div class="clearfix"></div>
        <div class="col-xs-12">
            <!--<div class="blockSetting-heading">查詢結果</div>-->
            <div class="col-sm-11 col-xs-11">
                <div class="row no-margin-right">

                    <div class="pull-left width-75">
                        <!-- PMS0210060 dataGrid -->
                        <table id="PMS0210060-table" class="gridTableHt"></table>
                    </div>
                    <div class="pull-left width-24 ml-1-percent">
                        <!-- PMS0210060 dataGrid -->
                        <table id="PMS0210060-table-sec"></table>
                    </div>
                </div>
            </div>
            <div class="col-xs-1 col-sm-1">
                <div class="row">
                    <div class="right-menu-co">
                        <ul>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth fdCheckIn"
                                        role="button">入住
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth clFdCheckIn"
                                        role="button">取消入住
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div> <!-- /.col-sm-12 -->
        <div class="clearfix"></div>
    </div>
</template>

<script>
    const gs_prgId = "PMS0210060";
    export default {
        name: "PMS0210060",
        mounted() {
            this.fetchOrderDtFieldData();
            this.fetchOrderDtValueData();
        },
        data() {
            return {
                i18nLang: go_i18nLang,
                searchFields: [],       //搜尋欄位資料
                searchCond: {},         //搜尋資料
                dgIns: {},              //dataGrid 實體
                isLoading: false,       //是否載入成功
                orderDtFieldData: [],
                orderDtValueData: [],
                guestMnFieldData: [],
                guestMnValueData: [],

            }
        },
        watch: {},
        methods: {
            async fetchOrderDtFieldData() {
                let lo_orderDtFieldData = await BacUtils.doHttpPromisePostProxy("/api/fetchOnlyDataGridFieldData", {
                    prg_id: gs_prgId,
                    page_id: 1,
                    tab_page_id: 11,
                }).then((result) => {
                    console.log(result);
                    return result;
                }).catch(err => {
                    return {success: false, errorMsg: err};
                });
                if(lo_orderDtFieldData.success) {
                    this.orderDtFieldData = lo_orderDtFieldData.dgFieldsData;
                    console.log(this.orderDtFieldData);
                } else {
                    alert(lo_orderDtFieldData.errorMsg);
                }
            },
            async fetchOrderDtValueData() {
                let lo_orderDtValueData = await BacUtils.doHttpPromisePostProxy("/api/fetchDgRowData", {
                    prg_id: gs_prgId,
                    page_id: 1,
                    tab_page_id: 11,
                }).then((result) => {
                    return result;
                }).catch(err => {
                    return {success: false, errMsg: err};
                });
                if(lo_orderDtValueData.success) {
                    console.log(this.orderDtFieldData);
                } else {

                }
            },

        }
    }
</script>

<style scoped>

</style>