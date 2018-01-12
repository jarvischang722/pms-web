<template>
    <div>
        <div class="col-xs-12 col-sm-12">
            <div class="row">
                <div class="col-xs-11 col-sm-11">
                    <div class="row no-margin-right">
                        <div class="billInfo content borderFrame">
                            <div class="grid">
                                <!--style="width: 263px;"-->
                                <div class="grid-item">
                                    <label>信用額度</label>
                                    <input type="number" class="input-medium bill-input-s1"
                                           disabled="disabled" placeholder="50000"/>
                                </div>
                                <div class="grid-item">
                                    <label>目前簽帳金額</label>
                                    <input type="number" class="input-medium bill-input-s1"
                                           disabled="disabled" placeholder="23456"/>
                                </div>
                                <div class="grid-item">
                                    <label>信用額度餘額</label>
                                    <input type="number" class="input-medium bill-input-s1"
                                           disabled="disabled" placeholder="476544"/>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                            <div class="grid">
                                <div class="grid-item">
                                    <label>公司關係別</label>
                                    <input type="text" class="input-medium bill-input-s1"
                                           disabled="disabled" placeholder="1-關係"/>
                                </div>
                                <div class="tab-block grid-item billCheckbox relatedCheck"
                                     style="margin-right: 87px;">
                            <span class="checkbox">
                              <label class="checkbox-width width-auto">
                                  <input name="form-field-checkbox" type="checkbox"
                                         class="ace" disabled="disabled" checked>
                                  <span class="lbl">可簽帳</span>
                              </label>
                            </span>
                                </div>
                                <div class="grid-item">
                                    <label>簽帳公司</label>
                                    <input type="text" class="input-medium bill-input-s1"
                                           disabled="disabled" placeholder="23598231:德安資訊國際股份有限公司"/>
                                </div>
                            </div>
                            <div class="grid">
                                <div class="grid-item">
                                    <label>公司類別</label>
                                    <input type="text" class="input-medium bill-input-s1"
                                           placeholder="簽約公司"/>
                                </div>
                                <div class="grid-item">
                                    <label>區域別</label>
                                    <input type="text" class="input-medium bill-input-s1"
                                           placeholder="北區"/>
                                </div>
                                <div class="grid-item">
                                    <label>行業別</label>
                                    <input type="text" class="input-medium bill-input-s1"
                                           placeholder="資訊業"/>
                                </div>
                            </div>
                            <div class="grid">
                                <div class="grid-item">
                                    <label>收取DM</label>
                                    <select class="input-medium bill-input-s1">
                                        <option value="yes">Y:是</option>
                                        <option value="no">Ｎ:否</option>
                                    </select>
                                </div>
                            </div>
                            <div class="grid">
                                <div class="grid-item">
                                    <label>訂房備註</label>
                                    <textarea class="input-medium bill-input-full height-auto rzNone" rows="4"
                                              placeholder="1.每天免費洗衣一套工作服 2.免費市區電費"></textarea>
                                </div>
                            </div>
                            <div class="space-6"></div>
                            <div class="grid">
                                <div class="grid-item">
                                    <label>Add Date</label>
                                    <input type="text" class="input-medium bill-input-s1"
                                           disabled="disabled" placeholder="2015/01/01 12:30:00"/>
                                </div>
                                <div class="grid-item">
                                    <label>Add By</label>
                                    <input type="text" class="input-medium bill-input-s1"
                                           disabled="disabled" placeholder="2015 0101 12:30"/>
                                </div>
                            </div>
                            <div class="grid">
                                <div class="grid-item">
                                    <label>Upd Date</label>
                                    <!--addedDate-->
                                    <input type="text" class="input-medium bill-input-s1"
                                           disabled="disabled"/>
                                </div>
                                <div class="grid-item">
                                    <label>Upd by</label>
                                    <!--addedBy-->
                                    <input type="text" class="input-medium bill-input-s1"
                                           disabled="disabled"/>
                                </div>
                            </div>
                            <!--信用額度變更-->
                            <div id="changeCreditLimit" class="hide padding-5">
                                <div class="businessCompanyData">
                                    <div class="col-sm-12 col-xs-12">
                                        <div class="row">
                                            <div class="col-sm-10 col-xs-10">
                                                <div class="row billInfo main-content-data">
                                                    <div class="grid">
                                                        <div class="tab-block grid-item billCheckbox">
                                                    <span class="checkbox">
                                                        <label class="ckBox_label">可簽帳</label>
                                                        <label class="checkbox-width width-auto">
                                                            <input name="form-field-checkbox" type="checkbox" class="ace">
                                                            <span class="lbl"></span>
                                                        </label>
                                                    </span>
                                                            <!--<input name="form-field-checkbox" type="checkbox" class="ace">-->
                                                            <!--<input type="checkbox" disabled="disabled"/>-->
                                                        </div>
                                                    </div>
                                                    <div class="grid">
                                                        <div class="grid-item">
                                                            <label>簽帳公司</label>
                                                            <select class="input-medium bill-input-s2">
                                                                <option value="1">23598231-德安資訊國際股份公司</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="grid">
                                                        <div class="grid-item">
                                                            <label>信用額度</label>
                                                            <input type="number" class="input-medium bill-input-s2 input_sta_required text-right"/>
                                                        </div>
                                                    </div>
                                                    <div class="grid">
                                                        <div class="grid-item">
                                                            <label>目前簽帳金額</label>
                                                            <input type="number" class="input-medium bill-input-s2 text-right" disabled="disabled"
                                                                   placeholder="0"/>
                                                        </div>
                                                    </div>
                                                    <div class="grid">
                                                        <div class="grid-item">
                                                            <label>信用額度餘額</label>
                                                            <input type="number" class="input-medium bill-input-s2 text-right" disabled="disabled"
                                                                   placeholder="123"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-sm-2 col-xs-2">
                                                <div class="row">
                                                    <div class="right-menu-co">
                                                        <ul>
                                                            <li>
                                                                <button class="btn btn-primary btn-white btn-defaultWidth"
                                                                        @click="doCloseChangeCreditLimitDialog" role="button">
                                                                    {{i18nLang.SystemCommon.Leave}}
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                            <!--/.信用額度變更-->
                        </div>
                    </div>
                </div>
                <div class="col-xs-1 col-sm-1">
                    <div class="row">
                        <div class="right-menu-co">
                            <ul>
                                <li>
                                    <button class="btn btn-primary btn-white btn-white btn-defaultWidth  sales_changeCreditLimit"
                                            role="button" @click="doChangeCreditLimit">
                                        {{i18nLang.program.PMS0610020.change_credit_limit}}
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
</template>

<script>
    export default {
        name: 'related-setting',
        props: ["rowData", "isRelatedSetting"],
        data() {
            return {
                i18nLang: go_i18nLang,
                singleData: {},
                oriSingleData: {},
                fieldsData: [],
                oriFieldsData: []
            };
        },
        watch: {
            isRelatedSetting(val) {
                if (val) {
                    this.initData();
                    this.fetchFieldData(this.rowData);
                }
            }
        },
        methods: {
            initData() {
                this.singleData = {};
                this.oriSingleData = {};
                this.fieldsData = [];
                this.oriFieldsData = [];
            },
            fetchFieldData(rowData) {
            },
            fetchRowData(rowData) {
            },
            chkFieldRule(ui_field_name, rule_func_name) {
                if (rule_func_name === "") {
                    return;
                }
                var self = this;
                var la_originData = [this.oriSingleData];
                var la_singleData = [this.singleData];
                var la_diff = _.difference(la_originData, la_singleData);

                // 判斷資料是否有異動
                if (la_diff.length != 0) {
                    this.isUpdate = true;
                }

                if (!_.isEmpty(rule_func_name.trim())) {
                    var postData = {
                        prg_id: "PMS0610020",
                        rule_func_name: rule_func_name,
                        validateField: ui_field_name,
                        singleRowData: JSON.parse(JSON.stringify(this.singleData)),
                        oriSingleData: this.oriSingleData
                    };
                    $.post('/api/chkFieldRule', postData, function (result) {

                        if (result.success) {
                            //是否要show出訊息
                            if (result.showAlert) {
                                alert(result.alertMsg);
                            }

                            //是否要show出詢問視窗
                            if (result.showConfirm) {
                                if (confirm(result.confirmMsg)) {

                                } else {
                                    //有沒有要再打一次ajax到後端
                                    if (result.isGoPostAjax && !_.isEmpty(result.ajaxURL)) {
                                        $.post(result.ajaxURL, postData, function (result) {

                                            if (!result.success) {
                                                alert(result.errorMsg);
                                            } else {

                                                if (!_.isUndefined(result.effectValues) && _.size(result.effectValues) > 0) {
                                                    self.singleData = _.extend(self.singleData, result.effectValues);
                                                }

                                            }
                                        });
                                    }
                                }
                            }

                        } else {
                            alert(result.errorMsg);
                        }

                        //連動帶回的值
                        if (!_.isUndefined(result.effectValues) && _.size(result.effectValues) > 0) {
                            self.singleData = _.extend(self.singleData, result.effectValues);
                        }

                    });
                }
            },
            //信用額度變更
            doChangeCreditLimit() {
                var dialog = $("#changeCreditLimit").removeClass('hide').dialog({
                    modal: true,
                    title: go_i18nLang["program"]["PMS0610020"].change_credit_limit,
                    title_html: true,
                    width: 500,
                    maxwidth: 1920,
                    dialogClass: "test",
                    resizable: true
                });
            },
            doCloseChangeCreditLimitDialog() {
                $("#changeCreditLimit").dialog('close');
            }
        }
    }
</script>