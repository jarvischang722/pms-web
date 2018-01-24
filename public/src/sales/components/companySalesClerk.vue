<template>
    <div class="col-xs-12 col-sm-12" v-loading="isLoading" element-loading-text="Loading...">
        <div class="row">
            <!--多筆 業務員 dataGrid-->
            <div class="col-xs-11 col-sm-11">
                <div class="row no-margin-right">
                    <!-- 業務員 dataGrid -->
                    <table id="salesClerk_dg" style="height: 310px;"></table>
                </div>
            </div>
            <!--/.多筆 業務員 dataGrid-->
            <!--按鈕-->
            <div class="col-xs-1 col-sm-1">
                <div class="row">
                    <div class="right-menu-co">
                        <ul>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth"
                                        role="button" @click="doEditSalesClerk">{{i18nLang.program.PMS0610010.edit_sales}}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!--/.按鈕-->
        </div>
    </div>
</template>

<script>
    import editSalesClerk from './editSalesClerk.vue';

    /** DatagridRmSingleGridClass **/
    function DataGridSingleGridClass() {
    }

    DataGridSingleGridClass.prototype = new DatagridBaseClass();
    DataGridSingleGridClass.prototype.onClickCell = function (idx, row) {
    };
    DataGridSingleGridClass.prototype.doSaveColumnFields = function () {
    };
    /*** Class End  ***/

    export default {
        name: 'sales-clerk',
        props: ["rowData", "isSalesClerk", "isCreateStatus", "isEditStatus"],
        created() {
            var self = this;
            this.$eventHub.$on('doEditSalesClerk', function (result) {
                if(result.success){
                    self.fetchFieldData();
                }
            });
        },
        data() {
            return {
                i18nLang: go_i18nLang,
                isLoading: false,
                BTN_action: false,
                isEditSalesClerk: false,
                dataGridRowsData: [],
                oriDataGridRowsData: [],
                fieldsData: [],
                oriFieldsData: [],
                dgIns: {},
                editRows: []
            };
        },
        watch: {
            isSalesClerk(val) {
                if (val) {
                    this.initData();
                    this.fetchFieldData();
                }
            }
        },
        methods: {
            initData() {
                this.dataGridRowsData = [];
                this.oriDataGridRowsData = [];
                this.fieldsData = [];
                this.oriFieldsData = [];
                this.dgIns = {};
                this.editRows = [];
            },
            fetchFieldData() {
                this.isLoading = true;
                $.post("/api/fetchDataGridFieldData", {
                    prg_id: "PMS0610020",
                    tab_page_id: 3,
                    searchCond: {cust_cod: this.$store.state.gs_custCod}
                }).then(result => {
                    this.searchFields = result.searchFields;
                    this.fieldsData = result.dgFieldsData;
                    this.dataGridRowsData = result.dgRowData;
                    this.oriDataGridRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                    this.showDataGrid();
                });
            },
            showDataGrid() {
                this.dgIns = new DataGridSingleGridClass();
                this.dgIns.init("PMS0610020", "salesClerk_dg", DatagridFieldAdapter.combineFieldOption(this.fieldsData, 'relatedPerson_dg'), this.fieldsData);
                this.dgIns.loadDgData(this.dataGridRowsData);
                this.dgIns.getOriDtRowData(this.oriDataGridRowsData);
                this.isLoading = false;
            },
            doEditSalesClerk() {
                var self = this;
                var lo_singleData = this.$store.state.go_mnSingleData;
                var lo_oriSingleData = this.$store.state.go_mnOriSingleData;
                var lb_isEditStatus = this.$store.state.gb_isEditStatus;
                this.rowData = _.extend(this.rowData, {isSalesClerk: self.isSalesClerk});

                if (lb_isEditStatus) {
                    if (_.isMatch(lo_singleData, lo_oriSingleData)) {
                        this.$eventHub.$emit('doEditSalesClerk', {
                            isEditSalesClerk: true,
                            editRows: [self.rowData],
                            isEditStatus: self.isEditStatus,
                            isCreateStatus: self.isCreateStatus
                        });
                    }
                    else {
                        alert("請先儲存主檔資料");
                    }
                }
                else {
                    this.$eventHub.$emit('doEditSalesClerk', {
                        isEditSalesClerk: true,
                        editRows: [self.rowData],
                        isEditStatus: self.isEditStatus,
                        isCreateStatus: self.isCreateStatus
                    });
                }

            }
        }
    }
</script>
