<template>
    <div id="PMS0810230SingleGrid" class="hide padding-5" style="top: 0 !important;">
        <div class="businessCompanyData">
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-11 col-sm-11">
                        <div class="row no-margin-right">
                            <!-------- 單筆 -------->
                            <div class="main-content-data borderFrame">
                                <!--1-->
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>房價代號</label>
                                        <input type="text" class="input-medium rateCode-s1"
                                               placeholder="2016PKG001"/>
                                    </div>

                                    <div class="grid-item">
                                        <label>房價分類</label>
                                        <select class="input-medium rateCode-s1">
                                            <option value="01">01:散客房價</option>
                                        </select>
                                    </div>
                                    <div class="grid-item">
                                        <label>合約價</label>
                                        <select class="input-medium rateCode-s2">
                                            <option value="no">否</option>
                                            <option value="yes">是</option>
                                        </select>
                                    </div>
                                    <!--<div class="grid-item">-->
                                    <!--<label class="label_w80">含稅計價</label>-->
                                    <!--<select class="input-medium rateCode-s2">-->
                                    <!--<option value="yes">是</option>-->
                                    <!--<option value="no">否</option>-->
                                    <!--</select>-->
                                    <!--</div>-->
                                    <div class="grid-item popCheckbox" style="display: none;">
                                        <span class="checkbox">
                                          <label class="checkbox-width">
                                              <input name="form-field-checkbox" type="checkbox"
                                                     class="ace">
                                              <span class="lbl">Base Rate</span>
                                          </label>
                                      </span>
                                    </div>
                                </div>
                                <!--2-->
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>房價名稱</label>
                                        <input type="text" class="input-medium rateCode-s1"
                                               placeholder="2016歡樂一夏逍遙遊"/>
                                    </div>
                                    <div class="grid-item">
                                        <label>訂房來源</label>
                                        <select class="input-medium rateCode-s1">
                                            <option value="01">01:電話訂房</option>
                                        </select>
                                    </div>
                                    <div class="grid-item">
                                        <label>設定類別</label>
                                        <select class="input-medium rateCode-s1">
                                            <option value="DR">DR:Daily</option>
                                            <option value="PKG">PKG:Package</option>
                                            <option value="HU">HU:House use</option>
                                            <option value="ENT">CMP:Complimentary</option>
                                            <!--<option value="HR">HR:Hourly</option>-->
                                            <!--<option value="MR">MR:Monthly</option>-->
                                        </select>
                                    </div>
                                </div>
                                <!--3-->
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>Menu選單</label>
                                        <input type="text" class="input-medium rateCode-s1"
                                               placeholder="Package"/>
                                    </div>
                                    <div class="grid-item">
                                        <label>市場類別</label>
                                        <select class="input-medium rateCode-s1">
                                            <option value="LOF">LOF:一般散客</option>
                                        </select>
                                    </div>
                                    <div class="grid-item">
                                        <label>屬性</label>
                                        <select class="input-medium rateCode-s1">
                                            <option>Base Rate</option>
                                            <option value="">Dependant Rate</option>
                                            <option>Independant Rate</option>
                                        </select>
                                    </div>
                                </div>
                                <!--4-->
                                <div class="grid">
                                    <div class="grid-item">
                                        <label class="pull-left">預設顯示</label>
                                        <select class="input-medium rateCode-s2 pull-left">
                                            <option>是</option>
                                            <option>否</option>
                                        </select>
                                        <label class="pull-left">顯示順序</label>
                                        <input type="text" class="input-medium rateCode-s2 pull-left" placeholder="1"/>
                                    </div>
                                    <div class="grid-item">
                                        <label class="pull-left">佣金異動</label>
                                        <select class="input-medium rateCode-s2 pull-left">
                                            <option>是</option>
                                            <option>否</option>
                                        </select>
                                        <label class="pull-left">佣金</label>
                                        <input type="text"
                                               class="input-medium rateCode-xs pull-left"
                                               placeholder="1"/>
                                        <span class="pull-left spanTxt">%</span>
                                    </div>
                                    <div class="grid-item">
                                        <label class="pull-left">房價異動</label>
                                        <select class="input-medium rateCode-s2 pull-left">
                                            <option>是</option>
                                            <option>否</option>
                                        </select>
                                        <span class="pull-left mt-3 ml-4">服務費規則</span>
                                        <input type="text" class="input-medium resvCard-2xs pull-left" placeholder="1"/>
                                        <select class="input-medium resvCard-2xs pull-left">
                                            <option>%</option>
                                            <option>$</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>使用說明</label>
                                        <input type="text" class="input-medium rateCode-s1-col3Rm"
                                               placeholder=""/>
                                        <i class="moreClick fa fa-ellipsis-h"></i>
                                    </div>
                                    <!--<div class="grid-item">-->
                                    <!--<label>訂房類別</label>-->
                                    <!--<select class="input-medium rateCode-s1">-->
                                    <!--<option value="roomTep0">無</option>-->
                                    <!--<option value="roomTep1">團體房</option>-->
                                    <!--<option value="roomTep2">旅展</option>-->
                                    <!--<option value="roomTep3">促銷券</option>-->
                                    <!--</select>-->
                                    <!--</div>-->
                                </div>
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>確認書說明</label>
                                        <input type="text" class="input-medium rateCode-s1-col3Rm"
                                               placeholder=""/>
                                        <i class="moreClick fa fa-ellipsis-h"></i>
                                    </div>
                                </div>
                            </div><!--main-content-data-->
                            <!--------/.單筆 -------->
                            <div class="space-6"></div>
                            <div class="tabsCon">
                                <!-------- tabPage -------->
                                <el-tabs v-model="tabName" type="card">
                                    <el-tab-pane :label="i18nLang.program.PMS0610020.related_set" name="roomTyp">
                                    </el-tab-pane>
                                    <el-tab-pane :label="i18nLang.program.PMS0610020.related_personnel" name="limitSet">
                                    </el-tab-pane>
                                    <el-tab-pane :label="i18nLang.program.PMS0610020.sales" name="promoteSet">
                                    </el-tab-pane>
                                </el-tabs>
                                <div class="easyui-tabs easyUi-custom1" style="height: 230px; overflow-y: auto;">
                                    <div title="房型" class="padding-tabs">
                                        <div class="col-xs-12 col-sm-12">
                                            <div class="row">
                                                <div id="roomCodeTable-add" class="roomCodeTable pull-left width-15">
                                                    <template>
                                                        <div>
                                                            <v-table
                                                                    is-horizontal-resize
                                                                    style="width: 100%;"
                                                                    :height="150"
                                                                    :columns="columns"
                                                                    :table-data="tableData"
                                                                    :column-cell-class-name="columnCellClass"
                                                                    row-hover-color="#eee"
                                                                    row-click-color="#edf7ff">
                                                            </v-table>
                                                        </div>
                                                    </template>
                                                </div>

                                                <div id="roomCodeDetail-add" class="roomCodeDetail pull-left width-85">
                                                    <template>
                                                        <div>
                                                            <v-table
                                                                    is-horizontal-resize
                                                                    style="width: 100%;"
                                                                    :height="150"
                                                                    :columns="columns"
                                                                    :table-data="tableData"
                                                                    :column-cell-class-name="columnCellClass"
                                                                    row-hover-color="#eee"
                                                                    row-click-color="#edf7ff">
                                                            </v-table>
                                                        </div>
                                                    </template>
                                                </div>
                                                <div class="clearfix"></div>
                                            </div>
                                            <div class="clearfix"></div>
                                            <div class="space-12"></div>

                                            <div class="row" style="display: none;">
                                                <div class="col-xs-11 col-sm-11">
                                                    <div class="row no-margin-right">
                                                        <div class="horizTable-outer">
                                                            <table class="css_table horizTable width-100">
                                                                <thead class="css_thead">
                                                                <tr class="css_tr">
                                                                    <th class="css_th width-5">
                                                                        <i class="fa fa-plus green pointer"></i>
                                                                    </th>
                                                                    <th class="css_th width-20">服務項目</th>
                                                                    <th class="css_th width-10">單價</th>
                                                                    <th class="css_th width-15">計算規則</th>
                                                                    <th class="css_th width-15">服務方式</th>
                                                                    <th class="css_th width-10">服務規則</th>
                                                                    <th class="css_th width-10">收費方式</th>
                                                                    <th class="css_th width-20">併入方式</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody class="css_tbody">
                                                                <tr class="css_tr">
                                                                    <td class="css_td">
                                                                        <i class="fa fa-minus red pointer"></i>
                                                                    </td>
                                                                    <td class="css_td">201A-早餐</td>
                                                                    <td class="css_td text-right">200</td>
                                                                    <td class="css_td">
                                                                        <select class="selectHt">
                                                                            <option value="1">依大人數</option>
                                                                            <option value="2">依小孩數</option>
                                                                            <option value="3">依房間</option>
                                                                        </select>
                                                                    </td>
                                                                    <td class="css_td">
                                                                        <select class="selectHt">
                                                                            <option value="1">D:每天</option>
                                                                            <option value="2">F:第一天</option>
                                                                            <option value="3">C:自訂規則</option>
                                                                            <option value="4">L:最後一天</option>
                                                                        </select>
                                                                    </td>
                                                                    <td class="css_td">旺日</td>
                                                                    <td class="css_td">
                                                                        <select class="selectHt">
                                                                            <option value="inside">I:內拆</option>
                                                                            <option value="outside">Q:外加</option>
                                                                        </select>
                                                                    </td>
                                                                    <td class="css_td">
                                                                        <select class="selectHt">
                                                                            <option value="addRent">1:加入至房租</option>
                                                                            <option value="addTip">2:加入至服務費</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                                <tr class="css_tr">
                                                                    <td class="css_td">
                                                                        <i class="fa fa-minus red pointer"></i>
                                                                    </td>
                                                                    <td class="css_td">218A-迎賓飲料</td>
                                                                    <td class="css_td text-right">100</td>
                                                                    <td class="css_td">
                                                                        <select class="selectHt">
                                                                            <option value="1">依大人數</option>
                                                                            <option value="2">依小孩數</option>
                                                                            <option value="3">依房間</option>
                                                                        </select>
                                                                    </td>
                                                                    <td class="css_td">
                                                                        <select class="selectHt">
                                                                            <option value="1">D:每天</option>
                                                                            <option value="2">F:第一天</option>
                                                                            <option value="3">C:自訂規則</option>
                                                                            <option value="4">L:最後一天</option>
                                                                        </select>
                                                                    </td>
                                                                    <td class="css_td">平日</td>
                                                                    <td class="css_td">
                                                                        <select class="selectHt">
                                                                            <option value="outside">Q:外加</option>
                                                                            <option value="inside">I:內拆</option>
                                                                        </select>
                                                                    </td>
                                                                    <td class="css_td">
                                                                        <select class="selectHt">
                                                                            <option value="addRent">1:加入至房租</option>
                                                                            <option value="addTip">2:加入至服務費</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                                <tr class="css_tr">
                                                                    <td class="css_td">
                                                                        <i class="fa fa-minus red pointer"></i>
                                                                    </td>
                                                                    <td class="css_td">219A-水果</td>
                                                                    <td class="css_td text-right">100</td>
                                                                    <td class="css_td">
                                                                        <select class="selectHt">
                                                                            <option value="1">依大人數</option>
                                                                            <option value="2">依小孩數</option>
                                                                            <option value="3">依房間</option>
                                                                        </select>
                                                                    </td>
                                                                    <td class="css_td">
                                                                        <select class="selectHt">
                                                                            <option value="1">D:每天</option>
                                                                            <option value="2">F:第一天</option>
                                                                            <option value="3">C:自訂規則</option>
                                                                            <option value="4">L:最後一天</option>
                                                                        </select>
                                                                    </td>
                                                                    <td class="css_td">平日</td>
                                                                    <td class="css_td">
                                                                        <select class="selectHt">
                                                                            <option value="outside">Q:外加</option>
                                                                            <option value="inside">I:內拆</option>
                                                                        </select>
                                                                    </td>
                                                                    <td class="css_td">
                                                                        <select class="selectHt">
                                                                            <option value="addRent">1:加入至房租</option>
                                                                            <option value="addTip">2:加入至服務費</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                                <tr class="css_tr">
                                                                    <td class="css_td">
                                                                        <i class="fa fa-minus red pointer"></i>
                                                                    </td>
                                                                    <td class="css_td">510C-門票</td>
                                                                    <td class="css_td text-right">200</td>
                                                                    <td class="css_td">
                                                                        <select class="selectHt">
                                                                            <option value="1">依大人數</option>
                                                                            <option value="2">依小孩數</option>
                                                                            <option value="3">依房間</option>
                                                                        </select>
                                                                    </td>
                                                                    <td class="css_td">
                                                                        <select class="selectHt">
                                                                            <option value="1">D:每天</option>
                                                                            <option value="2">F:第一天</option>
                                                                            <option value="3">C:自訂規則</option>
                                                                            <option value="4">L:最後一天</option>
                                                                        </select>
                                                                    </td>
                                                                    <td class="css_td">平日</td>
                                                                    <td class="css_td">
                                                                        <select class="selectHt">
                                                                            <option value="outside">Q:外加</option>
                                                                            <option value="inside">I:內拆</option>
                                                                        </select>
                                                                    </td>
                                                                    <td class="css_td">
                                                                        <select class="selectHt">
                                                                            <option value="addRent">1:加入至房租</option>
                                                                            <option value="addTip">2:加入至服務費</option>
                                                                        </select>
                                                                    </td>
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
                                                                    <button class="btn btn-primary btn-white btn-defaultWidth rateCode_duplicate"
                                                                            role="button">複製
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div><!--RM Type-->
                                    <div title="限制設定" class="padding-tabs">
                                        <div class="col-xs-12 col-sm-12">
                                            <div class="row">

                                                <table class="css_table">
                                                    <tbody class="css_tbody">
                                                    <!--1-->
                                                    <tr class="css_tr">
                                                        <td class="css_td padding-top width-50">
                                                            <div class="grid">
                                                                <div class="grid-item">
                                                                    <label>最少住宿天數</label>
                                                                    <input type="text"
                                                                           class="input-medium rateCode-s2"
                                                                           placeholder="1"/>
                                                                    <span>天</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="css_td padding-top width-50">
                                                            <div class="grid">
                                                                <div class="grid-item no-margin-right">
                                                                    <div class="popCheckbox">
                                                                        <span class="checkbox">
                                                                              <label class="checkbox-width">
                                                                                  <input name="form-field-checkbox"
                                                                                         type="checkbox"
                                                                                         class="ace">
                                                                                  <span class="lbl">
                                                                                      <span class="subtxt">早鳥規則</span>
                                                                                  </span>
                                                                              </label>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div class="grid-item">
                                                                    <input type="text"
                                                                           class="input-medium rateCode-s2"
                                                                           placeholder="90"/>
                                                                    <span class="ml-4 subtxt">天前至</span>
                                                                    <input type="text"
                                                                           class="input-medium rateCode-s2 ml-4"
                                                                           placeholder="60"/>
                                                                    <span class="ml-4 subtxt">天前</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <!--2-->
                                                    <tr class="css_tr">
                                                        <td class="css_td padding-top width-50">
                                                            <div class="grid">
                                                                <div class="grid-item popCheckbox">

                                                                <span class="checkbox">
                                                                  <label class="checkbox-width">
                                                                      <input name="form-field-checkbox"
                                                                             type="checkbox"
                                                                             class="ace">
                                                                      <span class="lbl">
                                                                        <span class="txt">會員優惠</span>
                                                                      </span>
                                                                  </label>
                                                                </span>
                                                                </div>
                                                                <div class="grid-item">
                                                                    <span class="moreClick moreHtAuto">會員類別</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="css_td padding-top width-50">
                                                            <div class="grid">

                                                                <div class="grid-item popCheckbox">
                                                                <span class="checkbox">
                                                                  <label class="checkbox-width">
                                                                      <input name="form-field-checkbox"
                                                                             type="checkbox"
                                                                             class="ace">
                                                                      <span class="lbl">
                                                                        <span class="subtxt">依住房率</span>
                                                                        <input type="text"
                                                                               class="input-medium rateCode-s2"
                                                                               placeholder="30"/>
                                                                        <span class="subtxt ml-4">%至</span>
                                                                        <input type="text"
                                                                               class="input-medium rateCode-s2"
                                                                               placeholder="45"/>
                                                                        <span class="subtxt ml-4">%</span>
                                                                      </span>
                                                                  </label>
                                                                </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <!--3-->
                                                    <tr class="css_tr">
                                                        <td class="css_td padding-top width-50">
                                                            <div class="grid">
                                                                <div class="grid-item popCheckbox">
                                                                <span class="checkbox">
                                                                  <label class="checkbox-width width-auto">
                                                                      <input name="form-field-checkbox"
                                                                             type="checkbox"
                                                                             class="ace">
                                                                      <span class="lbl">
                                                                        <span>上架期間功能</span>
                                                                      </span>
                                                                  </label>
                                                                </span>
                                                                </div>
                                                                <div class="grid-item">
                                                                    <div style="display: block;">


                                                                        <label>上架日期</label>
                                                                        <input type="date"
                                                                               class="input-medium rateCode-s3"
                                                                               placeholder="2016/01/01"/>
                                                                    </div>
                                                                    <div style="display: block;">

                                                                        <label>下架日期</label>
                                                                        <input type="date"
                                                                               class="input-medium rateCode-s3"
                                                                               placeholder="2016/01/01"/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="css_td padding-top width-50">

                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                    <div title="促銷設定" class="padding-tabs">
                                        <div class="col-xs-12 col-sm-12">
                                            <div class="row">
                                                <table class="css_table">
                                                    <tbody class="css_tbody">
                                                    <!--1-->
                                                    <tr class="css_tr">
                                                        <td class="css_td padding-top width-100">
                                                            <div class="grid">
                                                                <div class="grid-item popCheckbox">
                                                                <span class="checkbox">
                                                                  <label class="checkbox-width">
                                                                      <input name="form-field-checkbox"
                                                                             type="checkbox"
                                                                             class="ace">
                                                                      <span class="lbl">
                                                                            <span class="subtxt">多</span>
                                                                            <input type="text"
                                                                                   class="input-medium rateCode-s2 ml-4"
                                                                                   placeholder="30"/>
                                                                            <span class="subtxt ml-4">$ / 送</span>
                                                                            <input type="text"
                                                                                   class="input-medium rateCode-s2 ml-4"
                                                                                   placeholder="45"/>
                                                                            <span class="subtxt ml-4">晚</span>
                                                                      </span>
                                                                  </label>
                                                                </span>
                                                                </div>

                                                                <div class="grid-item">
                                                                    <span class="moreClick moreHtAuto  moreAbso-t10">贈送規則</span>
                                                                </div>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="grid">

                                                                <div class="grid-item popCheckbox">
                                                                <span class="checkbox">
                                                                  <label class="checkbox-width">
                                                                      <input name="form-field-checkbox"
                                                                             type="checkbox"
                                                                             class="ace">
                                                                      <span class="lbl">
                                                                        <span class="subtxt">住</span>
                                                                        <input type="text"
                                                                               class="input-medium rateCode-s2 ml-4"
                                                                               placeholder="30"/>
                                                                        <span class="subtxt ml-4">晚 / 送</span>
                                                                        <input type="text"
                                                                               class="input-medium rateCode-s2 ml-4"
                                                                               placeholder="45"/>
                                                                        <span class="subtxt ml-4">晚</span>
                                                                      </span>
                                                                  </label>
                                                                </span>
                                                                </div>


                                                                <div class="grid-item">

                                                                    <span class="moreClick moreHtAuto">贈送規則</span>
                                                                </div>

                                                                <div class="clearfix"></div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                </div>
                                <!-------- /.tabPage -------->
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-1 col-sm-1">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">儲存
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth rateCode_useTime"
                                                role="button">使用期間
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth resv_priceTrial"
                                                role="button">房價試算
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth resv_rateList"
                                                role="button">期間一覽表
                                        </button>
                                    </li>
                                    <li class="depDateLi">
                                        <button class="btn btn-primary btn-white btn-defaultWidth rateCode_dependantRate"
                                                role="button">Dep. Rate
                                        </button>
                                    </li>
                                    <li class="baseDateLi">
                                        <button class="btn btn-primary btn-white btn-defaultWidth rateCode_baseDate"
                                                role="button">Base Rate
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth rateCode_addPpl"
                                                role="button">加人加價
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">離開
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-6"></div>
                <!--複製部分-->
                <div class="row hide">
                    <div class="col-xs-11 col-sm-11">
                        <div class="row no-margin-right">
                            <div class="horizTable-outer">
                                <table class="css_table horizTable width-100">
                                    <thead class="css_thead">
                                    <tr class="css_tr">
                                        <th class="css_th width-5">
                                            <i class="fa fa-plus green pointer"></i>
                                        </th>
                                        <th class="css_th width-20">服務項目</th>
                                        <th class="css_th width-10">單價</th>
                                        <th class="css_th width-15">計算規則</th>
                                        <th class="css_th width-15">服務方式</th>
                                        <th class="css_th width-10">服務規則</th>
                                        <th class="css_th width-10">收費方式</th>
                                        <th class="css_th width-15">併入方式</th>
                                    </tr>
                                    </thead>
                                    <tbody class="css_tbody">
                                    <tr class="css_tr">
                                        <td class="css_td">
                                            <i class="fa fa-minus red pointer"></i>
                                        </td>
                                        <td class="css_td">201A-早餐</td>
                                        <td class="css_td text-right">200</td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="1">依大人數</option>
                                                <option value="2">依小孩數</option>
                                                <option value="3">依房間</option>
                                            </select>
                                        </td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="1">D:每天</option>
                                                <option value="2">F:第一天</option>
                                                <option value="3">C:自訂規則</option>
                                                <option value="4">L:最後一天</option>
                                            </select>
                                        </td>
                                        <td class="css_td">旺日</td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="inside">I:內拆</option>
                                                <option value="outside">Q:外加</option>
                                            </select>
                                        </td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="addRent">1:加入至房租</option>
                                                <option value="addTip">2:加入至服務費</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr class="css_tr">
                                        <td class="css_td">
                                            <i class="fa fa-minus red pointer"></i>
                                        </td>
                                        <td class="css_td">218A-迎賓飲料</td>
                                        <td class="css_td text-right">100</td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="1">依大人數</option>
                                                <option value="2">依小孩數</option>
                                                <option value="3">依房間</option>
                                            </select>
                                        </td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="1">D:每天</option>
                                                <option value="2">F:第一天</option>
                                                <option value="3">C:自訂規則</option>
                                                <option value="4">L:最後一天</option>
                                            </select>
                                        </td>
                                        <td class="css_td">平日</td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="outside">Q:外加</option>
                                                <option value="inside">I:內拆</option>
                                            </select>
                                        </td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="addRent">1:加入至房租</option>
                                                <option value="addTip">2:加入至服務費</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr class="css_tr">
                                        <td class="css_td">
                                            <i class="fa fa-minus red pointer"></i>
                                        </td>
                                        <td class="css_td">219A-水果</td>
                                        <td class="css_td text-right">100</td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="1">依大人數</option>
                                                <option value="2">依小孩數</option>
                                                <option value="3">依房間</option>
                                            </select>
                                        </td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="1">D:每天</option>
                                                <option value="2">F:第一天</option>
                                                <option value="3">C:自訂規則</option>
                                                <option value="4">L:最後一天</option>
                                            </select>
                                        </td>
                                        <td class="css_td">平日</td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="outside">Q:外加</option>
                                                <option value="inside">I:內拆</option>
                                            </select>
                                        </td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="addRent">1:加入至房租</option>
                                                <option value="addTip">2:加入至服務費</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr class="css_tr">
                                        <td class="css_td">
                                            <i class="fa fa-minus red pointer"></i>
                                        </td>
                                        <td class="css_td">510C-門票</td>
                                        <td class="css_td text-right">200</td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="1">依大人數</option>
                                                <option value="2">依小孩數</option>
                                                <option value="3">依房間</option>
                                            </select>
                                        </td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="1">D:每天</option>
                                                <option value="2">F:第一天</option>
                                                <option value="3">C:自訂規則</option>
                                                <option value="4">L:最後一天</option>
                                            </select>
                                        </td>
                                        <td class="css_td">平日</td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="outside">Q:外加</option>
                                                <option value="inside">I:內拆</option>
                                            </select>
                                        </td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="addRent">1:加入至房租</option>
                                                <option value="addTip">2:加入至服務費</option>
                                            </select>
                                        </td>
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
                                        <button class="btn btn-primary btn-white btn-defaultWidth rateCode_duplicate"
                                                role="button">複製
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <!--/. 複製部分-->
            </div>
            <div class="clearfix"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'pms0810230SingleGrid',
        created() {},
        mounted(){},
        components: {},
        data(){
            return{}
        },
        methods: {

        }
    }
</script>