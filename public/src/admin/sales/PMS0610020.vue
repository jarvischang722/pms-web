<template>
    <div id="PMS0610020" class="hide padding-5" style="top: 0 !important;">
        <div class="businessCompanyData">
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-11 col-sm-11">
                        <div class="row no-margin-right">
                            <!-------- 單筆 -------->
                            <div class="main-content-data borderFrame">
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>公司編號</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="23598233"/>
                                    </div>

                                    <div class="grid-item">
                                        <label>合約狀態</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="已簽約" disabled/>
                                    </div>
                                    <div class="grid-item">
                                        <label>狀態</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="正常" disabled/>
                                    </div>
                                </div>
                                <!--<div class="space-custom-5"></div>-->

                                <div class="grid">
                                    <div class="grid-item">
                                        <label>負責人</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="黃先生"/>
                                    </div>
                                    <div class="grid-item">
                                        <label>公司名稱</label>
                                        <input type="text" class="input-medium medium-c1-col2v2"
                                               placeholder="德安資訊國際股份有限公司台北分公司"/>
                                    </div>
                                </div>

                                <div class="grid">
                                    <div class="grid-item">
                                        <label>統一編號</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="2358233"/>
                                    </div>
                                    <div class="grid-item">
                                        <label>發票抬頭</label>
                                        <input type="text" class="input-medium medium-c1-col2v2"
                                               placeholder="德安資訊國際股份有限公司台北分公司"/>
                                    </div>
                                </div>

                                <div class="grid">
                                    <div class="grid-item">
                                        <label>業務員</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="陳瑞克" disabled/>
                                    </div>
                                    <div class="grid-item">
                                        <label>總公司</label>
                                        <input type="text" class="input-medium medium-c1-col2v2"
                                               placeholder="23598231 德安資訊國際股份有限公司"/>
                                        <!--<span class="mainData-tip">(顯示公司編號:公司名稱)</span>-->
                                    </div>
                                </div>

                                <div class="grid">
                                    <div class="grid-item">
                                        <label>公司電話</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="02-21766066"/>
                                    </div>
                                    <div class="grid-item">
                                        <label>分帳規則</label>
                                        <select class="input-medium medium-c1">
                                            <option value="1">01:團體</option>
                                            <option value="2">02:個人</option>
                                        </select>
                                    </div>
                                    <div class="grid-item">
                                        <label>等級</label>
                                        <select class="input-medium medium-c1">
                                            <option value="0">0</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="grid">
                                    <div class="grid-item">
                                        <label>傳真電話</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="02-25170886"/>
                                    </div>
                                    <div class="grid-item">
                                        <label>地址</label>
                                        <input type="text" class="input-medium postalCode"
                                               placeholder="10411"/>
                                        <input type="text" class="input-medium postaladdress ml-2"
                                               placeholder="台北市松江路309號8樓"/>
                                        <i class="moreClick fa fa-ellipsis-h sales_addressMore btn-skin"></i>
                                    </div>
                                </div>
                            </div><!--main-content-data-->
                            <div class="clearfix"></div>
                            <div class="space-6"></div>
                            <!--------/.單筆 -------->
                            <!-------- tabPage -------->
                            <el-tabs v-model="tabName" type="card" @tab_click="doChangeTab">
                                <el-tab-pane :label="i18nLang.program.PMS0610010.related_set " name="set">
                                </el-tab-pane>
                                <el-tab-pane :label="i18nLang.program.PMS0610010.related_personnel" name="personnel">
                                </el-tab-pane>
                                <el-tab-pane :label="i18nLang.program.PMS0610010.sales" name="sales">
                                </el-tab-pane>
                                <el-tab-pane :label="i18nLang.program.PMS0610010.contract_content" name="contract">
                                </el-tab-pane>
                                <el-tab-pane :label="i18nLang.program.PMS0610010.visit_record" name="visit">
                                </el-tab-pane>
                                <el-tab-pane :label="i18nLang.program.PMS0610010.business_notes" name="business">
                                </el-tab-pane>
                                <el-tab-pane :label="i18nLang.program.PMS0610010.historical_consumption" name="historical">
                                </el-tab-pane>
                                <el-tab-pane :label="i18nLang.program.PMS0610010.contribution" name="contribution" disabled>
                                </el-tab-pane>
                            </el-tabs>
                            <div class="easyui-tabs easyUi-custom1"
                                 style="min-height: 0; height: 380px !important; overflow-y: auto;">
                                <div id="setPanel" v-show="tabName=='set'" class="padding-tabs">
                                    <div class="col-xs-12 col-sm-12">
                                        <div class="row">
                                            <div class="billInfo content">
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
                                                    <div class="pull-right grid-item">
                                                        <button class="btn btn-primary btn-white pull-right btn-sm sales_changeCreditLimit"
                                                                role="button">信用額度變更
                                                        </button>
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
                                                        <input type="text" class="input-medium bill-input-s2"
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
                                            </div>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                </div>
                                <div id="personnelPanel" v-show="tabName=='personnel'" class="padding-tabs">
                                    <div class="col-xs-12 col-sm-12">
                                        <div class="row">
                                            <div class="col-xs-11 col-sm-11">
                                                <div class="row no-margin-right">
                                                    <!-- 相關人員 table -->
                                                    <table id="relatedPerson-table" style="height: 310px;"></table>
                                                </div>
                                            </div>
                                            <div class="col-xs-1 col-sm-1">
                                                <div class="row">
                                                    <div class="right-menu-co">
                                                        <ul>
                                                            <li>
                                                                <button class="btn btn-primary btn-white btn-defaultWidth"
                                                                        role="button">新增聯絡人
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button class="btn btn-danger btn-white btn-defaultWidth"
                                                                        role="button">刪除聯絡人
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button class="btn btn-gray btn-defaultWidth"
                                                                        role="button">加入秘書積點
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <span class="checkbox">
                                                                  <label class="checkbox-width">
                                                                      <input name="form-field-checkbox" type="checkbox"
                                                                             class="ace">
                                                                      <span class="lbl font-btn">離職不顯示</span>
                                                                  </label>
                                                                </span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="salesPanel" v-show="tabName=='sales'" class="padding-tabs">
                                    <div class="col-xs-12 col-sm-12">
                                        <div class="row">
                                            <div class="col-xs-11 col-sm-11">
                                                <div class="row no-margin-right">
                                                    <!-- 業務員 dataGrid -->
                                                    <table id="clerk-table" style="height: 310px;"></table>
                                                </div>
                                            </div>
                                            <div class="col-xs-1 col-sm-1">
                                                <div class="row">
                                                    <div class="right-menu-co">
                                                        <ul>
                                                            <li>
                                                                <button class="btn btn-primary btn-white btn-defaultWidth sales_editClerk"
                                                                        role="button">修改業務員
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="contractPanel" v-show="tabName=='contract'" class="padding-tabs">
                                    <div class="col-xs-12 col-sm-12">
                                        <div class="row">
                                            <div class="col-xs-11 col-sm-11">
                                                <div class="row no-margin-right">
                                                    <div class="dealContent-select">
                                                        <div class="float-left">
                                                            <select class="input-medium">
                                                                <option value="-1">房價代號</option>
                                                                <option value="1">101</option>
                                                                <option value="2">102</option>
                                                                <option value="3">103</option>
                                                                <option value="4">104</option>
                                                                <option value="5">105</option>
                                                            </select>
                                                        </div>
                                                        <div class="float-left">
                                                            <span class="checkbox">
                                                              <label class="checkbox-width">
                                                                  <input name="form-field-checkbox" type="checkbox"
                                                                         class="ace">
                                                                  <span class="lbl"><span
                                                                          class="txt">過期不顯示</span></span>
                                                              </label>
                                                            </span>
                                                            <!--<input type="checkbox" disabled="disabled"/>-->
                                                        </div>
                                                        <div class="clearfix"></div>
                                                    </div>
                                                    <!-- 合約內容 dataGrid -->
                                                    <table id="dealContent-table" style="height: 280px;"></table>
                                                </div>
                                            </div>
                                            <div class="col-xs-1 col-sm-1">
                                                <div class="row">
                                                    <div class="right-menu-co">
                                                        <ul>
                                                            <li>
                                                                <button class="btn btn-primary btn-white btn-defaultWidth"
                                                                        role="button">新增合約
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button class="btn btn-danger btn-white btn-defaultWidth"
                                                                        role="button">刪除合約
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button class="btn btn-gray btn-defaultWidth"
                                                                        role="button">特殊合約
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="visitPanel" v-show="tabName=='visit'" class="padding-tabs">
                                    <div class="col-xs-12 col-sm-12">
                                        <div class="row">
                                            <div class="col-xs-11 col-sm-11">
                                                <div class="row no-margin-right">
                                                    <!-- 拜訪紀錄 dataGrid -->
                                                    <table id="visitRecord-table" style="height: 310px;"></table>

                                                    <div class="clearfix"></div>
                                                </div>
                                            </div>
                                            <div class="col-xs-1 col-sm-1">
                                                <div class="row">
                                                    <div class="right-menu-co">
                                                        <ul>
                                                            <li>
                                                                <button class="btn btn-primary btn-white btn-defaultWidth sales-visitRecord"
                                                                        role="button">新增拜訪紀錄
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button class="btn btn-primary btn-white btn-defaultWidth sales-editVisitRecord"
                                                                        role="button">修改拜訪紀錄
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button class="btn btn-danger btn-white btn-defaultWidth"
                                                                        role="button">刪除拜訪紀錄
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
                                <div id="businessPanel" v-show="tabName=='business'" class="padding-tabs">
                                    <div class="col-xs-12 col-sm-12">
                                        <div class="row">
                                            <div class="col-xs-11 col-sm-11">
                                                <div class="row no-margin-right">

                                                    <!-- 其他備註 dataGrid -->
                                                    <table id="otherRemarks-table" style="height: 310px;"></table>
                                                    <div class="clearfix"></div>
                                                </div>
                                            </div>
                                            <div class="col-xs-1 col-sm-1">
                                                <div class="row">
                                                    <div class="right-menu-co">
                                                        <ul>
                                                            <li>
                                                                <button class="btn btn-primary btn-white btn-defaultWidth sales_editOtherRemark"
                                                                        role="button">新增備註
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button class="btn btn-primary btn-white btn-defaultWidth sales_editOtherRemark"
                                                                        role="button">修改備註
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button class="btn btn-danger btn-white btn-defaultWidth"
                                                                        role="button">刪除備註
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
                                <div id="historicalPanel" v-show="tabName=='historical'" class="padding-tabs">
                                    <div class="col-xs-12 col-sm-12">
                                        <div class="row">
                                            <div class="col-xs-11 col-sm-11">
                                                <div class="row no-margin-right">
                                                    <!-- 歷史消費 dataGrid -->
                                                    <table id="historyConsumption-table" style="height: 310px;"></table>
                                                </div>
                                            </div>
                                            <div class="col-xs-1 col-sm-1">
                                                <div class="row">
                                                    <div class="right-menu-co">
                                                        <ul>
                                                            <li>
                                                                <button class="btn btn-gray btn-defaultWidth"
                                                                        role="button">顯示消費明細
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="contributionPanel" v-show="tabName=='contribution'" class="padding-tabs">
                                    <div class="col-xs-12 col-sm-12">
                                        <div class="row">
                                            <div class="col-xs-11 col-sm-11">
                                                <div class="row no-margin-right">
                                                    <div class="col-xs-6 col-sm-6">
                                                        <div class="bs-contribution-content">
                                                            <div class="billInfo grid">
                                                                <div class="col-xs-12 col-sm-12">
                                                                    <div class="row billInfo-head">
                                                                        <p class="billInfo-title">交易資訊</p>
                                                                    </div>
                                                                </div>
                                                                <div class="content">
                                                                    <div class="grid">
                                                                        <div class="tab-block">
                                                                            <label>首次交易日</label>
                                                                            <span>：</span>
                                                                            <span class="tab-block-content">2016/3/4</span>
                                                                        </div>
                                                                        <div class="tab-block">
                                                                            <label>最近交易日</label>
                                                                            <span>：</span>
                                                                            <span class="tab-block-content">2016/4/15</span>
                                                                        </div>
                                                                        <div class="tab-block">
                                                                            <label>本月用房數</label>
                                                                            <span>：</span>
                                                                            <span class="tab-block-content">5</span>
                                                                        </div>
                                                                        <div class="tab-block">
                                                                            <label>本月房租消費</label>
                                                                            <span>：</span>
                                                                            <span class="tab-block-content">2350</span>
                                                                        </div>
                                                                        <div class="tab-block">
                                                                            <label>本月餐飲消費</label>
                                                                            <span>：</span>
                                                                            <span class="tab-block-content">750</span>
                                                                        </div>
                                                                        <div class="tab-block">
                                                                            <label>本月其他消費</label>
                                                                            <span>：</span>
                                                                            <span class="tab-block-content">0</span>
                                                                        </div>
                                                                        <div class="tab-block">
                                                                            <label>本月消費合計</label>
                                                                            <span>：</span>
                                                                            <span class="tab-block-content">3100</span>
                                                                        </div>
                                                                        <div class="tab-block">
                                                                            <label>本月平均房價</label>
                                                                            <span>：</span>
                                                                            <span class="tab-block-content">2350</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-6 col-sm-6">
                                                        <div class="row">
                                                            <!-- 貢獻度 dataGrid -->
                                                            <table id="contribution-table"
                                                                   style="height: 310px;"></table>
                                                        </div>
                                                    </div>

                                                    <div class="clearfix"></div>
                                                </div>
                                            </div>
                                            <div class="col-xs-1 col-sm-1">
                                                <div class="row">
                                                    <div class="right-menu-co">
                                                        <ul>
                                                            <li>
                                                                <button class="btn btn-primary btn-white btn-defaultWidth sales_displayMonth"
                                                                        role="button">顯示月份明細
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
                        </div>
                    </div>
                    <!--按鈕-->
                    <div class="col-xs-1 col-sm-1">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="doSaveGrid">{{i18nLang.SystemCommon.Save}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="doCloseDialog">{{i18nLang.SystemCommon.Leave}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-gray btn-defaultWidth"
                                                role="button">{{i18nLang.program.PMS0610010.company_related_diagram}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth sales_statusChg"
                                                role="button" @click="doSetCompanyStatus">
                                            {{i18nLang.program.PMS0610010.company_status}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth sales_stateChange"
                                                role="button" @click="doSetContractStatus">
                                            {{i18nLang.program.PMS0610010.contract_status}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth sales_changeRecord"
                                                role="button" @click="loadChangeLog">{{i18nLang.SystemCommon.ChangeLog}}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--Ststus chg-->
                    <div id="companyStatusChg" class="hide padding-5">
                        <div class="businessCompanyData">
                            <div class="col-sm-12 col-xs-12">
                                <div class="row">
                                    <div class="col-sm-10 col-xs-10">
                                        <div class="row billInfo no-margin-right">
                                            <div class="content">
                                                <div class="space-6"></div>
                                                <div class="grid-item">
                                                    <label>Status</label>
                                                    <select class="input-medium medium-c1">
                                                        <option value="1">Delete</option>
                                                        <option value="2">Normal</option>
                                                        <option value="3">Black</option>
                                                        <option value="4">Potential</option>
                                                    </select>
                                                </div>
                                                <div class="clearfix"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-2 col-xs-2">
                                        <div class="row">
                                            <div class="right-menu-co">
                                                <ul>
                                                    <li>
                                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                                role="button" @click="doSaveCompanyStatus">{{i18nLang.SystemCommon.Save}}
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button class="btn btn-danger btn-white btn-defaultWidth"
                                                                role="button" @click="doCloseCompanyStatusDialog">{{i18nLang.SystemCommon.Leave}}
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
                    <!--/.Ststus chg -->
                    <!--合約狀態變更-->
                    <div id="contractStatusChange" class="hide padding-5">
                        <div class="businessCompanyData">
                            <div class="col-sm-12 col-xs-12">
                                <div class="row">
                                    <div class="col-sm-10 col-xs-10">
                                        <div class="row billInfo no-margin-right">
                                            <div class="grid-item">
                                                <label>狀態</label>
                                                <select class="input-medium medium-c1">
                                                    <option value="-1">代碼-狀態說明</option>
                                                    <option value="1">01-確認中</option>
                                                    <option value="2">02-已下單</option>
                                                    <option value="3">03-待簽回</option>
                                                    <option value="4">04-已收訂金</option>
                                                    <option value="5">05-取消</option>
                                                </select>
                                            </div>
                                            <div class="clearfix"></div>
                                            <div class="space-6"></div>
                                            <div class="main-content-data borderFrame">
                                                <div class="horizTable-outer">
                                                    <table class="css_table horizTable">
                                                        <thead class="css_thead">
                                                        <tr class="css_tr">
                                                            <th class="css_th" style="min-width:100px;">狀態</th>
                                                            <th class="css_th" style="min-width:150px;">異動時間</th>
                                                            <th class="css_th" style="min-width:115px;">異動者</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody class="css_tbody">
                                                        <tr class="css_tr">
                                                            <td class="css_td">待簽回</td>
                                                            <td class="css_td">2017/11/15 13:42:14</td>
                                                            <td class="css_td">cio</td>
                                                        </tr>
                                                        <tr class="css_tr">
                                                            <td class="css_td">確認中</td>
                                                            <td class="css_td">2017/11/15 13:42:14</td>
                                                            <td class="css_td">cio</td>
                                                        </tr>
                                                        <tr class="css_tr">
                                                            <td class="css_td">已簽約</td>
                                                            <td class="css_td">2017/11/15 13:42:14</td>
                                                            <td class="css_td">cio</td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
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
                                                                role="button">Save
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button class="btn btn-danger btn-white btn-defaultWidth"
                                                                role="button">Quit
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
                    <!--/.合約狀態變更-->
                </div>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'pms0610020',
        props: ["rowData", "isCreateStatus", "isEditStatus", "isModifiable"],
        mounted() {
            this.tabName = "set";
            this.panelName = ["setPanel", "personnelPanel", "salesPanel", "contractPanel",
                "visitPanel", "businessPanel", "historicalPanel", "contributionPanel"];
            this.isLoadingDialog = true;
            this.loadingText = "Loading...";
        },
        data() {
            return {
                i18nLang: go_i18nLang,
                BTN_action: false,
                isLoadingDialog: false,
                loadingText: "",
                singleData: {},
                oriSingleData: {},
                fieldsData: [],
                oriFieldsData: [],
                tabPageId: 1,
                tabName: "",
                panelName: []
            };
        },
        watch: {
            tabName(val) {
                this.showTabContent(val);
            },
            rowData(val) {
                this.initData();
                // this.fetchFieldData(val);
            }
        },
        methods: {
            initData() {
                this.singleData = {};
                this.oriSingleData = {};
                this.fieldsData = [];
                this.oriFieldsData = [];
            },
            showTabContent: function (tabName) {
                var la_panelName = this.panelName;
                var ls_showPanelName = tabName + "Panel";
                _.each(la_panelName, function (ls_panelName) {
                    $("#" + ls_panelName).hide();
                });

                $("#" + ls_showPanelName).show();

                // this.showDtDataGrid();
            },
            fetchFieldData(val) {
            },
            fetchRowData() {
            },
            doSaveGrid() {
            },
            doCloseDialog() {
                this.initData();
                this.rowData = {};
                $("#PMS0610020").dialog('close');
            },
            //ststus chg.(公司狀態)
            doSetCompanyStatus() {
                var dialog = $('#statusChg').removeClass('hide').dialog({
                    autoOpen: false,
                    modal: true,
                    title: go_i18nLang["program"]["PMS0610020"].company_status,
                    width: 500,
                    maxHeight: 1920,
                    resizable: true
                }).dialog('open');
            },
            doSaveCompanyStatus(){},
            doCloseCompanyStatusDialog(){
                $("#companyStatusChg").dialog('close');
            },
            //合約狀態變更
            doSetContractStatus() {
                var dialog = $("#contractStatusChange").removeClass('hide').dialog({
                    modal: true,
                    title: "合約狀態變更",
                    title_html: true,
                    width: 500,
                    maxwidth: 1920,
                    dialogClass: "test",
                    resizable: true
                });
            },
            loadChangeLog: function () {
                var self = this;
                $.post("/api/getSetupPrgChangeLog", {prg_id: "PMS0610020"}, function (result) {
                    if (result.success) {
                        self.$eventHub.$emit('getChangeLogData', {
                            openChangeLogDialog: true,
                            allChangeLogList: result.allChangeLogList
                        });
                    }
                });
            }
        }
    }
</script>