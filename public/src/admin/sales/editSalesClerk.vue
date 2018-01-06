<template>
    <div>
        <el-dialog
                :close-on-click-modal="true" :show-close="false" :title="i18nLang.program.PMS0620030.edit_sales_clerk"
                :visible.sync="isEditSalesClerk" style="width: 48%; left: 30%;" :before-close="doCancelEdit">
            <div class="businessCompanyData" v-loading="isLoadingDialog" :element-loading-text="loadingText">
                <div class="col-sm-12 col-xs-12">
                    <div class="row">
                        <!--欄位-->
                        <div class="col-sm-10 col-xs-10">
                            <div class="row billInfo" v-for="fields in fieldsData">
                                <div class="content">
                                    <div class="space-custom-5"></div>
                                    <div class="grid-item" v-for="field in fields">
                                        <input v-if="field.visiable == 'Y' && field.ui_type == 'checkbox'"
                                               v-model="singleData[field.ui_field_name]" type="checkbox"
                                               :required="field.requirable == 'Y'" :maxlength="field.ui_field_length"
                                               :disabled="field.modificable == 'N'|| (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)"
                                        >

                                        <label style="width:auto" class="clerkCheckbox"
                                               v-if="field.visiable == 'Y' && field.ui_type == 'checkbox'">
                                            <span v-if=" field.requirable == 'Y' " style="color: red;">*</span>
                                            <span>{{ field.ui_display_name }}</span>
                                        </label>

                                        <label v-if="field.visiable == 'Y' && field.ui_type != 'checkbox'">
                                            <span v-if=" field.requirable == 'Y' " style="color: red;">*</span>
                                            <span>{{ field.ui_display_name }}</span>
                                        </label>

                                        <input v-if="field.ui_type == 'text' || field.ui_type == 'popupgrid' || field.ui_type == 'multipopupgrid' "
                                               type="text"
                                               v-model="singleData[field.ui_field_name]"
                                               :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                               :required="field.requirable == 'Y'"
                                               @click="chkClickPopUpGrid(field)"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--/.欄位-->
                        <!--按鈕-->
                        <div class="col-sm-2 col-xs-2">
                            <div class="row">
                                <div class="right-menu-co">
                                    <ul>
                                        <li>
                                            <button class="btn btn-primary btn-white btn-defaultWidth purview_btn"
                                                    role="button" @click="doEditSales" :disabled="isSaveEnable"
                                                    data-purview_func_id="PMS0620030-0500">
                                                {{i18nLang.SystemCommon.OK}}
                                            </button>
                                        </li>
                                        <li>
                                            <button class="btn btn-primary btn-white btn-defaultWidth"
                                                    role="button" @click="doCancelEdit">{{i18nLang.SystemCommon.Cancel}}
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <!--/.按鈕-->
                    </div>
                </div>
            </div>
            <div class="clearfix"></div>
        </el-dialog>
        <select-grid-dialog-comp></select-grid-dialog-comp>
    </div>
</template>

<script>
    import selectGridDialogComp from '../../common/selectGridDialogComp.vue';

    export default {
        name: 'edit-sales-clerk',
        props: ["editRows", "isEditSalesClerk", "isCreateStatus", "isEditStatus"],
        components: {selectGridDialogComp},
        created() {
            var self = this;
            this.$eventHub.$on('updateBackSelectData', function (chooseData) {
                self.singleData = _.extend(self.singleData, chooseData);
            });
        },
        mounted() {
            this.isLoadingDialog = true;
            this.loadingText = "Loading...";
        },
        data() {
            return {
                i18nLang: go_i18nLang,
                isLoadingDialog: false,
                loadingText: "",
                dialogVisible: false,
                isSaveEnable: false,
                tmpCUD: {
                    createData: [],
                    updateData: [],
                    oriData: []
                },
                singleData: {},
                oriSingleData: {},
                fieldsData: [],
                oriFieldsData: [],
                go_funcPurview: []
            };
        },
        watch: {
            isEditSalesClerk(val) {
                if (val) {
                    this.initAllAuthBtn();
                    this.initData();
                    this.fetchSingleGridFieldData();
                    this.go_funcPurview = (new FuncPurview("PMS0620030")).getFuncPurvs();
                    this.initPurview();
                }
            }
        },
        methods: {
            initAllAuthBtn() {
                $(".purview_btn").each(function () {
                    var purview_func_id = $(this).data("purview_func_id");
                    $("[data-purview_func_id='" + purview_func_id + "']").attr("disabled", false);
                });
            },
            initPurview() {
                var purview = _.findIndex(this.go_funcPurview, function (value) {
                    return value.func_id == "0500";
                });

                if (purview == -1) {
                    this.isSaveEnable = true;
                }
            },
            initData() {
                this.singleData = {};
                this.fieldData = [];
            },
            fetchSingleGridFieldData() {
                var self = this;
                var lo_params = {
                    prg_id: "PMS0620030",
                    page_id: 1
                };

                $.post("/api/fetchOnlySinglePageFieldData", lo_params, function (result) {
                    self.oriFieldsData = result.gsFieldsData;
                    self.fieldsData = _.values(_.groupBy(_.sortBy(self.oriFieldsData, "col_seq"), "row_seq"));
                    self.fetchRowData();
                });
            },
            fetchRowData() {
                this.singleData = {
                    sales_cod: "",//業務員編號
                    upd_order_mn: false //是否更新未來訂房卡
                };
                this.oriSingleData = JSON.parse(JSON.stringify(this.singleData));
                this.isLoadingDialog = false;
            },
            chkClickPopUpGrid(field) {
                var self = this;
                this.titleName = field.prg_id;
                if (field.ui_type == "popupgrid" || field.ui_type == "multipopupgrid") {
                    var params = {
                        prg_id: field.prg_id,
                        fields: field
                    };

                    $.post("/api/popUpGridData", params, function (result) {
                        if (result != null) {
                            self.selectPopUpGridData = result.showDataGrid;
                            result.fieldData = field;
                            self.$eventHub.$emit('showPopUpDataGrid', result);
                            self.showPopUpGridDialog();
                        }
                    });
                }
            },
            showPopUpGridDialog() {
                var self = this;
                this.dialogVisible = true;
                var height = document.documentElement.clientHeight - 60; //browser 高度 - 60功能列
                var width = document.documentElement.clientWidth / 2;    //browser 寬度 - 200功能列

                var dialog = $("#dataPopUpGridDialog").dialog({
                    autoOpen: false,
                    modal: true,
                    height: height,
                    width: width,
                    title: self.titleName,
                    resizable: true
                });
                dialog.dialog("open");

                $('#dataPopUpGridDialog').parents('.panel.window').attr("style", "display: block; width: 960px; top: 32px; left: 480px; z-index: 9999 !important;");
            },
            doEditSales() {
                var self = this;

                if (this.isCreateStatus) {
                }
                else if (this.isEditStatus) {
                    this.saveData = {
                        sales_cod: this.singleData.sales,
                    }
                    this.tmpCUD.oriData = this.editRows;

                }

                self.doRowUnLock();
                self.isEditSalesClerk = false;
                if (_.isUndefined(this.editRows[0].isSalesClerk)) {
                    this.isCreateStatus = false;
                    this.isEditStatus = false;
                }
                self.$eventHub.$emit('doCloseEditSalesClerk', {
                    isEditSalesClerk: self.isEditSalesClerk,
                    isEditStatus: self.isEditStatus,
                    isCreateStatus: self.isCreateStatus
                });

//                this.doSaveGrid(function (result) {
//                    if (result.success) {
//                        self.doRowUnLock();
//                        self.isEditSalesClerk = false;
//                        if (_.isUndefined(this.editRows[0].isSalesClerk)) {
//                            this.isCreateStatus = false;
//                            this.isEditStatus = false;
//                        }
//                        self.$eventHub.$emit('doCloseEditSalesClerk', {
//                            isEditSalesClerk: self.isEditSalesClerk,
//                            isEditStatus: self.isEditStatus,
//                            isCreateStatus: self.isCreateStatus
//                        });
//                    }
//                });
            },
            doCancelEdit() {
                var self = this;
                this.doRowUnLock();
                this.isEditSalesClerk = false;
                if (_.isUndefined(this.editRows[0].isSalesClerk)) {
                    this.isCreateStatus = false;
                    this.isEditStatus = false;
                }
                this.$eventHub.$emit('doCloseEditSalesClerk', {
                    isEditSalesClerk: self.isEditSalesClerk,
                    isEditStatus: self.isEditStatus,
                    isCreateStatus: self.isCreateStatus
                });

            },
            doRowUnLock() {
                var lo_param = {
                    prg_id: ""
                };
                g_socket.emit('handleTableUnlock', lo_param);
            }
        }
    }
</script>

<style>
    .grid-item input {
        padding: 0px;
    }
</style>