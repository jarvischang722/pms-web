<template>
    <div class="col-xs-12 col-sm-12">
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

    export default {
        name: 'sales-clerk',
        props: ["rowData", "isSalesClerk"],
        components: {editSalesClerk},
        created() {
            var self = this;

        },
        data() {
            return {
                i18nLang: go_i18nLang,
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
                    this.fetchFieldData(this.rowData);
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
            fetchFieldData(rowData) {
                var self = this;

                self.fetchRowData(rowData);
            },
            fetchRowData(rowData) {
                var self = this;

                self.showDataGrid();
            },
            showDataGrid() {
//                this.dgIns = new DatagridBaseClass();
//                this.dgIns.init("PMS0610020", "salesClerk_dg", DatagridFieldAdapter.combineFieldOption(this.fieldsData, 'relatedPerson_dg'), this.fieldsData);
//                this.dgIns.loadDgData(this.dataGridRowsData);

                $('#salesClerk_dg').datagrid({
                    singleSelect: true,
                    collapsible: true,
                    // 從json 撈
                    url: '/jsonData/sales/bsCompany_clerk.json',
                    method: 'get',
                    columns: [[
                        {field: 'clerk', title: '業務員', width: 100},
                        {field: 'startDate', title: '開始日期', width: 100},
                        {field: 'endDate', title: '結束日期', width: 100},
                        {field: 'inputDate', title: '輸入日', width: 200},
                        {field: 'inputPerson', title: '輸入者', width: 100},
                        {field: 'lastEditDate', title: '最後異動日', width: 200},
                        {field: 'lastEditMan', title: '最後異動者', width: 100}
                    ]]
                });
            },
            doEditSalesClerk() {
                var self = this;

                this.$eventHub.$emit('doEditSalesClerk', {
                    isEditSalesClerk: true,
                    editRows: [self.rowData]
                });

//                var dialog = $("#salesEditClerk").removeClass('hide').dialog({
//                    modal: true,
//                    title: go_i18nLang["program"]["PMS0610010"].edit_sales,
//                    title_html: true,
//                    width: 500,
//                    maxwidth: 1920,
//                    // autoOpen: true,
//                    dialogClass: "test",
//                    resizable: true,
//                    onBeforeClose: function () {
//                        self.editRows = [];
//                        self.isEditSalesClerk = false;
//                    }
//                });
//                $('#salesEditClerk').parents('.panel.window').attr("style","display: block; width: 500px; left: 710px; top: 438px; z-index: 9020 !important;");

            }
        }
    }
</script>
