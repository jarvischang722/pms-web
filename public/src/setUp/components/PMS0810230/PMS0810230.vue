<template>
    <div>
        <div class="col-xs-12">
            <div class="search-content">
                <div class="search-co">
                    <div class="search-co-h">
                        <i class="ace-icon fa fa-search search-icon"></i>
                        <span>Search</span>
                        <div class="row search-right-btn">
                            <div class="right-btn-menu-co">
                                <ul>
                                    <li>
                                        <i class="fa fa-chevron-down show-search-detail"></i>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="search-co-content col-xs-12">
                            <div class="col-sm-4">

                            </div>
                            <div class="col-sm-4">

                            </div>
                            <div class="col-sm-4">

                            </div>
                        </div>
                        <div class="search-co-content col-xs-12 rece-search-detail"
                             style="display: none;">
                            <div class="row search-footer-btn">
                                <div class="footer-btn-menu-co">
                                    <ul>
                                        <li>
                                            <div class="" data-rel="tooltip"
                                                 data-placement="bottom"
                                                 title="查詢">
                                                <div class="icon-reStyle icon-co-14"></div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="" data-rel="tooltip"
                                                 data-placement="bottom"
                                                 title="清除">
                                                <div class="icon-reStyle icon-co-11"></div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>  <!-- /.footer-btn-menu-co -->
                            </div> <!-- /.search-footer-btn -->
                            <div class="width-95">
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>房價名稱</label>
                                        <input type="text" class="input-medium medium-c1"/>
                                    </div>
                                    <div class="grid-item">
                                        <label>設定類別</label>
                                        <select class="input-medium medium-c1">
                                            <option value="DR">DR:Daily</option>
                                            <option value="PKG">PKG:Package</option>
                                            <option value="HU">HU:House use</option>
                                            <option value="ENT">CMP:Complimentary</option>
                                            <!--<option value="HR">HR:Hourly</option>-->
                                            <!--<option value="MR">MR:Monthly</option>-->
                                        </select>
                                    </div>
                                    <div class="grid-item">
                                        <label>房價分類</label>
                                        <input type="text" class="input-medium medium-c1"/>
                                    </div>
                                </div>
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>房價代號</label>
                                        <input type="text" class="input-medium medium-c1"/>
                                    </div>
                                    <div class="grid-item">
                                        <label>市場類別</label>
                                        <select class="input-medium medium-c1">
                                            <option value="lof">LOF:一般散客</option>
                                        </select>
                                    </div>
                                    <div class="grid-item">
                                        <label>訂房來源</label>
                                        <select class="input-medium medium-c1">
                                            <option value="tel">1.電話訂房</option>
                                            <!--<option value="web">2.官網訂房</option>-->
                                            <!--<option value="app">3.app訂房</option>-->
                                        </select>
                                    </div>
                                </div>
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>MENU選單</label>
                                        <input type="text" class="input-medium medium-c1"/>
                                    </div>
                                    <div class="grid-item">
                                        <label>預設顯示</label>
                                        <select class="input-medium medium-c1">
                                            <option value="disYes">是</option>
                                            <option value="disNo">否</option>
                                            <option value="disAll">全部</option>
                                        </select>
                                    </div>
                                    <div class="grid-item">
                                        <label>可使用日期</label>
                                        <input type="date" class="input-medium medium-c1"/>
                                    </div>
                                </div>
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>屬性</label>
                                        <select class="input-medium medium-c1">
                                            <option value="att1">Base Rate</option>
                                            <option value="att2">Dependant Rate</option>
                                            <option value="att3">Independant Rate</option>
                                        </select>
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
            <div class="col-sm-11 col-xs-11">
                <div class="row no-margin-right">
                    <div class="tableHt">
                        <!-- rateCode-查詢結果 dataGrid -->
                        <table id="setRateCode-table" class="gridTableHt" style="width: 100%;max-width: 100%;"></table>
                    </div>
                </div>
            </div>
            <div class="col-xs-1 col-sm-1">
                <div class="row">
                    <div class="right-menu-co">
                        <ul>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth setRateCode-add"
                                        role="button">Add
                                </button>
                            </li>

                            <li>
                                <button class="btn btn-danger btn-white btn-defaultWidth rateCode_timeRule"
                                        role="button">Delete
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth setRateCode-add"
                                        role="button">Edit
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
    export default {
        name: 'pms0810230',
        mounted(){},
        data(){
            return{}
        },
        methods: {}
    }
</script>