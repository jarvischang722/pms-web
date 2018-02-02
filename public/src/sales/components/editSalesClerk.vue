<template>
    <div>
        <el-dialog
                :close-on-click-modal="true" :show-close="false" :title="i18nLang.program.PMS0620030.edit_sales_clerk"
                :visible.sync="isEditSalesClerk" style="width: 48%; left: 30%;" :before-close="doCancelEdit">
            <div class="businessCompanyData" v-loading="isLoadingDialog" :element-loading-text="loadingText">
                <div>
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

                                        <bac-select-grid v-if="field.visiable == 'Y' && field.ui_type == 'selectgrid'"
                                                         :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                         :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                         v-model="singleData[field.ui_field_name]"
                                                         :columns="field.selectData.columns"
                                                         :data="field.selectData.selectData"
                                                         :is-qry-src-before="field.selectData.isQrySrcBefore"
                                                         :id-field="field.selectData.value" :text-field="field.selectData.display"
                                                         @update:v-model="val => singleData[field.ui_field_name] = val"
                                                         :default-val="singleData[field.ui_field_name]"
                                                         :disabled="field.modificable == 'N'||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                        </bac-select-grid>
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
        </el-dialog>
    </div>
</template>

<script>
    import selectGridDialogComp from '../../common/selectGridDialogComp.vue';
    import ElDialog from "../../../../node_modules/element-ui/packages/dialog/src/component.vue";

    export default {
        name: 'edit-sales-clerk',
        props: ["editRows", "isEditSalesClerk", "isCreateStatus", "isEditStatus"],
        components: {
            ElDialog
        },
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
            doEditSales() {
                var self = this;
                this.isLoadingDialog = true;
                this.loadingText = 'saving...';
                var la_custCod = [];
                _.each(this.editRows, function (lo_editRow) {
                    la_custCod.push(lo_editRow.cust_mn_cust_cod);
                });
                var lo_params = {
                    prg_id: "PMS0620030",
                    sales_cod: this.singleData.sales_cod,
                    upd_order_mn: this.singleData.upd_order_mn ? 'Y' : 'N',
                    cust_cod: la_custCod
                };

                if (this.isCreateStatus) {
                }
                else if (this.isEditStatus) {
                    $.post("/api/sales/doEditSalesClerk", lo_params, function (result) {
                        self.isLoadingDialog = false;
                        if (result.success) {
                            if (!_.isUndefined(self.editRows[0].isSalesClerk)) {
                                self.$eventHub.$emit('doEditSalesClerk', {
                                    success: true
                                });
                            }
                            self.doCancelEdit();
                            la_custCod = [];
                        }
                        else {
                            alert(result.errorMsg);
                        }
                    });
                }
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

    .el-loading-mask{
        width: 108%;
        left: -4%;
    }
    .grid-item input {
        padding: 0px;
    }
</style>