`<template>
    <div>
        <div class="page-header"></div><!-- /.page-header -->
        <!-- 排房作業 Page-->
        <div class="pageMain">
            <!-- search content -->
            <div class="col-xs-12 search-co-content search-S2">
                <div class="row">
                    <search-comp
                            :search-fields="searchFields"
                            :search-cond.sync="searchCond"
                            :fetch-data="fetchOrderDtData"
                    ></search-comp>
                </div> <!-- row-->
            </div> <!-- /.col-sm-12 -->
            <div class="clearfix"></div>

            <!--<div class="row">-->
            <div class="col-xs-12">
                <div class="roomAssign">
                    <!--  接待 roomAssign 內容-->
                    <div id="roomDetail-all-container" class="col-xs-11">
                        <div class="row no-margin-right">
                            <!--訂房多筆&定房明細-->
                            <div class="col-xs-5 no-padding-left">
                                <!--訂房多筆-->

                                <div id="roomDetail-table-first" class="roomDetail-table2 easyui-panel dataGrid-s1">
                                    <table id="groupOrderDt_dg" style="height: 250px;"></table>
                                </div>
                                <div class="clearfix"></div>
                                <br>
                                <div class="space-12"></div>
                                <!--定房明細-->
                                <div class="jqGridEdit-table roomDetail-table2 cardDetail_margin easyui-panel dataGrid-s1">
                                    <!--class="roomAssTableHt" 控制高度隨著螢幕預設變化-->
                                    <table id="roomDetail-table2" style="height: 400px;"></table>
                                </div>
                                <br>

                            </div>
                            <!--排房資料-->
                            <div class="col-xs-7 right-info">
                                <div class="">
                                    <!-- #section:elements.tab.position -->
                                    <div class="col-xs-12">
                                        <div class="row">
                                            <div class="col-xs-10">
                                                <div class="row no-padding">
                                                    <div class="tooltip-sp pull-left">
                                    <span class=" color-desc">
                                        <i class="fa fa-dashboard"></i>顏色說明
                                    </span>
                                                        <span class="tooltip-text">
                                        <ul>
                                            <li>
                                                <div class="roomAsg-status-1 square-color pull-left"></div>
                                                <div class="pull-left">不可排房</div>
                                                <div class="clearfix"></div>
                                            </li>
                                            <li>
                                                <div class="roomAsg-status-2 square-color pull-left"></div>
                                                <div class="pull-left">修理房間</div>
                                                <div class="clearfix"></div>
                                            </li>
                                            <li>
                                                <div class="roomAsg-status-3 square-color pull-left"></div>
                                                <div class="pull-left">可排房間</div>
                                                <div class="clearfix"></div>
                                            </li>
                                            <li>
                                                <div class="roomAsg-status-4 square-color pull-left"></div>
                                                <div class="pull-left">不可移動</div>
                                                <div class="clearfix"></div>
                                            </li>
                                            <li>
                                                <div class="roomAsg-status-5 square-color pull-left"></div>
                                                <div class="pull-left">今日預定C/O</div>
                                                <div class="clearfix"></div>
                                            </li>
                                            <li>
                                                <div class="roomAsg-status-6 square-color pull-left"></div>
                                                <div class="pull-left">參觀</div>
                                                <div class="clearfix"></div>
                                            </li>
                                        </ul>
                                                            <!--<li class="divider"></li>-->

                                </span>
                                                    </div>
                                                    <div class="searchCheckbox pull-left">
                                    <span class="checkbox">
                                          <label class="checkbox-width">
                                              <input name="form-field-checkbox"
                                                     type="checkbox" checked
                                                     class="ace">
                                              <span class="lbl">
                                                  <span class="subtxt">可排房</span>
                                              </span>
                                          </label>
                                    </span>
                                                    </div>
                                                    <div class="clearfix"></div>
                                                </div>
                                            </div>
                                            <!-- lite 版隱藏 -->
                                            <div style="display: none;">
                                                <div class="col-xs-2">
                                                    <div class="row ml--13">
                                                        <div class="select-group chgText-effect">
                                                            <button data-toggle="dropdown"
                                                                    class="btn btn-primary btn-white btn-defaultWidth dropdown-toggle"
                                                                    aria-expanded="false">
                                                                <span class="dpShowValue">特色</span>
                                                                <span class="ace-icon fa fa-angle-down icon-on-right"></span>
                                                            </button>
                                                            <ul class="dropdown-menu dropdown-info dropdown-menu-right dpUIList">
                                                                <li><a href="#">G001:面公道五路</a></li>
                                                                <li><a href="#">G002:面華夏新城</a></li>
                                                                <li><a href="#">N003:不要四號房</a></li>
                                                                <li><a href="#">N004:不要角間</a></li>
                                                                <li><a href="#">ALL</a></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-2">
                                                    <div class="row ml--13">
                                                        <div class="select-group chgText-effect">
                                                            <button data-toggle="dropdown"
                                                                    class="btn btn-primary btn-white btn-defaultWidth dropdown-toggle"
                                                                    aria-expanded="false">
                                                                <span class="dpShowValue">棟別</span>
                                                                <span class="ace-icon fa fa-angle-down icon-on-right"></span>
                                                            </button>
                                                            <ul class="dropdown-menu dropdown-info dropdown-menu-right dpUIList">
                                                                <li><a href="#">A棟</a></li>
                                                                <li><a href="#">B棟</a></li>
                                                                <li><a href="#">C棟</a></li>
                                                                <!--<li class="divider"></li>-->
                                                                <li><a href="#">D棟</a></li>
                                                                <li><a href="#">ALL</a></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-2">
                                                    <div class="row ml--13">
                                                        <div class="select-group chgText-effect">
                                                            <button data-toggle="dropdown"
                                                                    class="btn btn-primary btn-white btn-defaultWidth dropdown-toggle"
                                                                    aria-expanded="false">
                                                                <span class="dpShowValue">拆併床</span>
                                                                <span class="ace-icon fa fa-angle-down icon-on-right"></span>
                                                            </button>
                                                            <ul class="dropdown-menu dropdown-info dropdown-menu-right dpUIList">
                                                                <li><a href="#">拆床</a></li>
                                                                <li><a href="#">併床</a></li>
                                                                <li><a href="#">ALL</a></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-2">
                                                <div class="row ml--13">
                                                    <div class="select-group chgText-effect">
                                                        <button data-toggle="dropdown"
                                                                class="btn btn-primary btn-white btn-defaultWidth dropdown-toggle "
                                                                aria-expanded="false">
                                                            <span class="dpShowValue">樓層</span>

                                                            <span class="ace-icon fa fa-angle-down icon-on-right"></span>
                                                        </button>
                                                        <ul class="dropdown-menu dropdown-info dropdown-menu-right dpUIList">
                                                            <li><a href="#">1F</a></li>

                                                            <li><a href="#">2F</a></li>

                                                            <li><a href="#">3F</a></li>
                                                            <li><a href="#">ALL</a></li>

                                                            <!--<li class="divider"></li>-->

                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="space-2"></div>
                                    <div class="tabbable tabs-left">
                                        <div class="horizTable-outer pull-left chooseCount"
                                             style="min-width: 49px; max-width:5%;">
                                            <table class="css_table horizTable center table-lg width-100 rm-table-s ">
                                                <tbody class="css_tbody">
                                                <tr class="css_tr" v-for="(room,idx) in roomType">
                                                    <td class="css_td" :class="{active:idx ==0}"
                                                        @click="chooseRoomType(idx)"> {{room}}



                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="tab-content roomAssign-p" style="overflow: hidden;">
                                            <div id="All" class="tab-pane in active"
                                                 style="position: relative; ">
                                                <div class="town-table">
                                                    <div class="townRow easyui-panel">
                                                        <!--高度: townPage 的高度-->
                                                        <table id="townList-table"
                                                               style="height: 500px; display: none;"></table>
                                                    </div>
                                                </div>
                                                <div class="town-grap scrollable">
                                                    <div class="townPage">
                                                        <div class="townBlock roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <!--<div class="content-sub">-->
                                                            <!--<span class="left">拆床</span>-->
                                                            <!--</div>-->
                                                            <!--<div class="clearfix"></div>-->
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock no-show roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-ob roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oc-od roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-vc-vd roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-all roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oc-od roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-sexyBlue roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oosroomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oc-od roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-sexyBlue roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-vc-vd roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oos roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-ooo roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-vc-vd roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oc-od roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-vc-vd roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-sexyBlue roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oc-od roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-sexyBlueroomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oc-od roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-vc-vd roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oos roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oc-od roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-sexyBlue roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oc-od roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-sexyBlue roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oc-od roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oos roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-sexyBlue roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oc-od roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oc-od roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-ooo roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oos roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oc-od roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-sexyBlue roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock no-show roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-vc-vd roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oc-od roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-vc-vd roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock no-show roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-ooo roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oc-od roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-ooo roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oos roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock no-show roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oc-od roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-sexyBlue roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-vc-vd roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-sexyBlue roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-vc-vd roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oc-od roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-ooo roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-vc-vd roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oc-od roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-ooo roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oc-od roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-ob roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-ob roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="townBlock cb-oos roomAss_detail">
                                                            <div class="head">
                                                                <span class="left txt-lg">0301</span>
                                                                <span class="right">DDT</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>陳先生</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>04/29-04/30</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>拆床</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="clearfix"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div id="SPR" class="tab-pane">
                                                <p>Etsy mixtape wayfarers, ethical wes anderson tofu before they
                                sold out mcsweeney's organic lomo retro fanny pack lo-fi
                                farm-to-table readymade.</p>
                                                <p>Raw denim you probably haven't heard of them jean shorts
                                Austin.</p>
                                            </div>

                                            <div id="DXK" class="tab-pane">
                                                <p>Etsy mixtape wayfarers, ethical wes anderson tofu before they
                                sold out mcsweeney's organic lomo retro fanny pack lo-fi
                                farm-to-table readymade.</p>
                                                <p>Raw denim you probably haven't heard of them jean shorts
                                Austin.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--  /.End 接待 roomAssign 內容 -->
                    <div class="col-xs-1 col-sm-1">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">排房






                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth foCnt_autoAssignSGL"
                                                role="button">批次排房






                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-danger btn-white btn-defaultWidth"
                                                role="button">取消排房






                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-danger btn-white btn-defaultWidth foCnt_batch_cal"
                                                role="button">批次取消






                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-gray btn-defaultWidth foCnt_autoAssign"
                                                role="button">自動排房






                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn  btn-primary btn-white btn-defaultWidth focnt_lockRoom"
                                                role="button">鎖定排房






                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth reservationDialog-1"
                                                role="button">訂房卡






                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth town-list-btn">
                                            清單模式






                                        </button>
                                        <button class="btn btn-primary btn-white btn-defaultWidth town-graphics-btn">
                                            圖形模式






                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div><!-- /.roomAssign -->
            </div>
        </div>
    </div>
</template>
<script>

    const gs_prgId = "PMS0210030";
    import _ from "underscore";

    /** DatagridRmSingleGridClass **/
    function DatagridSingleGridClass() {
    }

    DatagridSingleGridClass.prototype = new DatagridBaseClass();
    DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
    };
    DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {
    };
    /*** Class End  ***/

    export default {
        created() {
        },
        mounted() {
            this.fetchSearchFields();
            this.fetchRentCalDat();
        },
        watch: {
            selectDtIndex() {
            }
        },
        data() {
            return {
                searchFields: [],
                searchCond: {},
                fetchDgRowData: [],
                groupOrderDtField: [],

                //滾房租日
                rentCalDat: '',
                allOrderDts: [],
                allOrderDtsCul: [],
                selectDtIndex: 0,
                orderDtList: [],
                selectListIndex: 0,
                RoomList: [],
                condition: {
                    floor: [],
                    roomStatus: '',
                    roomType: []
                },
                roomType: ['WWW', "JW", "OSk"],
                lockStatus: false,
                dgIns: {},
            };
        },
        watch: {},
        methods: {
            async fetchRentCalDat() {
                try {
                    let lo_result = await BacUtils.doHttpPromisePostProxy('/api/qryRentCalDat', {});
                    this.rentCalDat = lo_result.rent_cal_dat;
                } catch (err) {
                    throw Error(err);
                }
            },
            async fetchSearchFields() {
                try {
                    let lo_result = await BacUtils.doHttpPromisePostProxy('/api/fetchOnlySearchFieldsData', {prg_id: gs_prgId});
                    this.searchFields = lo_result.searchFieldsData;
                    //this.searchCond.ci_dat = 滾房租日
                } catch (err) {
                    throw Error(err);
                }
            },
            loadDataGridByPrgID() {

                var self = this;
                var lo_searchCond = _.clone(searchCondsearchCond);

                var lo_params = {
                    prg_id: gs_prgId,
                    page_id: 1,
                    searchCond: lo_searchCond
                };
                BacUtils.doHttpPostAgent("/api/fetchDataGridFieldData", lo_params, (result) => {
                    this.pageOneFieldData = result.dgFieldsData;

                    if (this.searchFields.length <= 0) {
                        this.searchFields = result.searchFields;
                    }
                    this.isLoading = false;
                    this.showDataGrid();
                });
            },
            fetchDgRowData() {
                var lo_searchCond = _.clone(this.searchCond);

                var lo_params = {
                    prg_id: gs_prgId,
                    page_id: 1,
                    searchCond: lo_searchCond
                };

                BacUtils.doHttpPromisePostProxy("/api/fetchDgRowData", lo_params).then(result => {
                    this.pageOneDataGridRows = result.dgRowData;
                    this.showDataGrid();
                }, err => {
                    throw Error(err);
                })
            },
            fetchOrderDtData() {
                const lo_searchCond = _.clone(this.searchCond);
                lo_searchCond.ci_dat = '2013/10/13';
                lo_searchCond.co_dat = '2013/10/14';
                lo_searchCond.days = 1;
                const lo_params = {
                    prg_id: gs_prgId,
                    page_id: 1,
                    tab_page_id: 11,
                    searchCond: lo_searchCond
                };
                console.log(lo_params);
                BacUtils.doHttpPromisePostProxy("/api/fetchDataGridFieldData", lo_params).then(result => {
                    console.log(result);
                    if (result.success) {
                        this.groupOrderDtField = result.dgFieldsData;
                        this.groupOrderDtRowData = result.dgRowData;
                        if (this.searchFields.length <= 0) {
                            this.searchFields = result.searchFields;
                        }
//                    this.isLoading = false;
                        this.showDataGrid();
                    }
                    else {
                        alert(result.errorMsg);
                    }

                }, err => {
                    throw Error(err);
                })
            },
            showDataGrid() {
//                var colOption = [{field: 'ck', checkbox: true}];
//                colOption = _.union(colOption, DatagridFieldAdapter.combineFieldOption(this.pageOneFieldData, 'groupOrderDt_dg'));

                this.dgIns = new DatagridSingleGridClass();
                this.dgIns.init(gs_prgId, "groupOrderDt_dg", [], this.groupOrderDtField, {
                    singleSelect: false,
                    pagination: true,
                    rownumbers: true,
                    pageSize: 20 //一開始只載入20筆資料
                });

                this.dgIns.loadPageDgData(this.groupOrderDtRowData);

//                this.isLoading = false;
            },
            showAllOrderDts() {
                this.dgIns = new DatagridSingleGridClass();
                this.dgIns.init("PMS0110042", "roomDetail-table", DatagridFieldAdapter.combineFieldOption(this.allOrderDtsCul, "roomDetail-table"), this.allOrderDtsCul);
                this.dgIns.loadDgData(this.allOrderDts);
            },
            showOrderDtList(){

            },
            chooseRoomType(idx){
                alert(this.roomType[idx])
            }
        }
    }


</script>

<!--<style scoped>-->
<!--.ps__rail-y {-->
<!--right: 0;-->
<!--}-->
<!--</style>-->