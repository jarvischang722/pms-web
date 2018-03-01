<template>
    <div id="lostFoundDialog" class="hide padding-5" style="top: 0 !important;">

        <div class="businessCompanyData">
            <!--標題-->
            <div class="titleInfo">
                <div class="titleInfo-head">
                    <p class="titleInfo-title">多筆</p>
                </div>
            </div>
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-11 col-sm-11">
                        <div class="row no-margin-right main-content-data">
                            <table id="resvProfile_lostFound-table" style="height: 300px;"></table>
                        </div><!--main-content-data-->
                        <div class="clearfix"></div>
                    </div>
                    <div class="col-xs-1 col-sm-1">
                        <div class="row">
                            <div class="right-menu-co">

                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">Add
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">Edit
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-danger btn-white btn-defaultWidth"
                                                role="button">Delete
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" disabled>遺失者領回
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" disabled>拾獲者領回
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">以下全選
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">以下不選
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">列印明細
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">Save
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">Quit
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="clearfix"></div>
            </div>
            <div class="clearfix"></div>

            <!--標題-->
            <div class="titleInfo">
                <div class="titleInfo-head">
                    <p class="titleInfo-title">單筆</p>
                </div>
            </div>
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-11 col-sm-11">
                        <div class="row no-margin-right">
                            <div class="main-content-data borderFrame">
                                <!--** lost **-->
                                <!--1-->
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>編號</label>
                                        <input type="text" class="input-medium resvCard-dateCol2" placeholder="" disabled/>
                                    </div>
                                </div>
                                <!--2-->
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>遺失日期</label>
                                        <input type="date" class="input-medium resvCard-date" placeholder="" disabled/>
                                    </div>
                                    <div class="grid-item">
                                        <label>遺失時間</label>
                                        <input type="time" class="input-medium resvCard-date" placeholder="" disabled/>
                                    </div>
                                    <div class="grid-item">
                                        <label>狀態</label>
                                        <input type="text" class="input-medium resvCard-date" placeholder="" disabled/>
                                    </div>
                                </div>
                                <!--3-->
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>遺失者</label>
                                        <input type="text" class="input-medium resvCard-dateCol2" placeholder="Simon Cowll"
                                               disabled/>
                                    </div>
                                    <div class="grid-item">
                                        <label></label>
                                        <input type="text" class="input-medium resvCard-dateSpec1" placeholder="" disabled/>
                                        <button class="btn btn-sm btn-primary btn-white btn-sm-font2 btn-afterInput">查詢住客
                                        </button>
                                    </div>
                                </div>
                                <!--4-->
                                <div class="grid">
                                    <div class="pull-left">
                                        <div class="gird">
                                            <div class="grid-item">
                                                <label>遺失物品</label>
                                                <input type="text" class="input-medium resvCard-dateCol2"
                                                       placeholder="(可記載顏色、大小...等特徵)" disabled/>
                                            </div>
                                        </div>
                                        <div class="gird">
                                            <div class="grid-item">
                                                <label>遺失處</label>
                                                <input type="text" class="input-medium resvCard-dateCol2" placeholder=""
                                                       disabled/>
                                            </div>
                                        </div>
                                        <div class="gird">
                                            <div class="grid-item">
                                                <label>遺失備註</label>
                                                <input type="text" class="input-medium resvCard-dateCol2"
                                                       placeholder="請記載聯絡方式" disabled/>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="pull-left">
                                        <div class="horizTable-outer" style="margin-left: 94px;">
                                            <table class="css_table horizTable">
                                                <thead class="css_thead">
                                                <tr class="css_tr">
                                                    <th class="css_th" style="width:50%;">C/O日期</th>
                                                    <th class="css_th" style="width:50%;">房號</th>
                                                </tr>
                                                </thead>
                                                <tbody class="css_tbody">
                                                <tr class="css_tr">
                                                    <td class="css_td">2015/11/13</td>
                                                    <td class="css_td">0223</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                </div>
                                <div class="border-double1"></div>

                                <!--** found **-->
                                <!--5-->
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>拾獲日期</label>
                                        <input type="date" class="input-medium resvCard-date" placeholder="" disabled/>
                                    </div>
                                    <div class="grid-item">
                                        <label>拾獲時間</label>
                                        <input type="time" class="input-medium resvCard-date" placeholder="" disabled/>
                                    </div>
                                </div>
                                <!--6-->
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>拾獲者</label>
                                        <input type="text" class="input-medium resvCard-dateCol2" placeholder="Simon Cowll"
                                               disabled/>
                                    </div>
                                    <div class="grid-item">
                                        <label></label>
                                        <input type="text" class="input-medium resvCard-dateSpec1" placeholder="" disabled/>
                                        <button class="btn btn-sm btn-primary btn-white btn-sm-font2 btn-afterInput">查詢住客
                                        </button>
                                    </div>
                                </div>
                                <!--7-->
                                <div class="grid">
                                    <div class="pull-left">
                                        <div class="gird">
                                            <div class="grid-item">
                                                <label>拾獲物品</label>
                                                <input type="text" class="input-medium resvCard-dateCol2"
                                                       placeholder="(可記載顏色、大小...等特徵)" disabled/>
                                            </div>
                                        </div>
                                        <div class="gird">
                                            <div class="grid-item">
                                                <label>拾獲處</label>
                                                <input type="text" class="input-medium resvCard-dateCol2" placeholder=""
                                                       disabled/>
                                            </div>
                                        </div>
                                        <div class="gird">
                                            <div class="grid-item">
                                                <label>拾獲備註</label>
                                                <input type="text" class="input-medium resvCard-dateCol2"
                                                       placeholder="請記載聯絡方式" disabled/>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="pull-left">
                                        <div class="horizTable-outer" style="margin-left: 94px;">
                                            <table class="css_table horizTable">
                                                <thead class="css_thead">
                                                <tr class="css_tr">
                                                    <th class="css_th" style="width:50%;">C/O日期</th>
                                                    <th class="css_th" style="width:50%;">房號</th>
                                                </tr>
                                                </thead>
                                                <tbody class="css_tbody">
                                                <tr class="css_tr">
                                                    <td class="css_td">2015/11/13</td>
                                                    <td class="css_td">0223</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                </div>
                                <div class="border-double1"></div>

                                <!--** get Back **-->
                                <!--8-->
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>領回日期</label>
                                        <input type="date" class="input-medium resvCard-date" placeholder="" disabled/>
                                    </div>
                                    <div class="grid-item">
                                        <label>領回時間</label>
                                        <input type="time" class="input-medium resvCard-date" placeholder="" disabled/>
                                    </div>
                                </div>
                                <!--9-->
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>領回者</label>
                                        <input type="text" class="input-medium resvCard-dateCol2" placeholder="Simon Cowll"
                                               disabled/>
                                    </div>
                                    <div class="grid-item">
                                        <label></label>
                                        <input type="text" class="input-medium resvCard-dateSpec1" placeholder="" disabled/>
                                        <button class="btn btn-sm btn-primary btn-white btn-sm-font2 btn-afterInput">查詢住客
                                        </button>
                                    </div>
                                </div>
                                <!--10-->
                                <div class="grid">
                                    <div class="pull-left">
                                        <div class="gird">
                                            <div class="grid-item">
                                                <label>身分證字號</label>
                                                <input type="text" class="input-medium resvCard-dateCol2"
                                                       placeholder="(可記載顏色、大小...等特徵)" disabled/>
                                            </div>
                                        </div>
                                        <div class="gird">
                                            <div class="grid-item">
                                                <label>領回備註</label>
                                                <input type="text" class="input-medium resvCard-dateCol2"
                                                       placeholder="請記載聯絡方式" disabled/>
                                            </div>
                                        </div>
                                        <div class="gird">
                                            <div class="grid-item">
                                                <label>輸入者</label>
                                                <input type="text" class="input-medium resvCard-date" placeholder=""
                                                       disabled/>
                                            </div>
                                            <div class="grid-item">
                                                <label>輸入日期</label>
                                                <input type="text" class="input-medium resvCard-date" placeholder=""
                                                       disabled/>
                                            </div>
                                        </div>
                                        <div class="gird">
                                            <div class="grid-item">
                                                <label>最後異動者</label>
                                                <input type="text" class="input-medium resvCard-date"
                                                       placeholder="0000/00/00" disabled/>
                                            </div>
                                            <div class="grid-item">
                                                <label>最後異動日</label>
                                                <input type="text" class="input-medium resvCard-date"
                                                       placeholder="0000/00/00" disabled/>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="pull-left">
                                        <div class="horizTable-outer" style="margin-left: 94px;">
                                            <table class="css_table horizTable">
                                                <thead class="css_thead">
                                                <tr class="css_tr">
                                                    <th class="css_th" style="width:50%;">C/O日期</th>
                                                    <th class="css_th" style="width:50%;">房號</th>
                                                </tr>
                                                </thead>
                                                <tbody class="css_tbody">
                                                <tr class="css_tr">
                                                    <td class="css_td">2015/11/13</td>
                                                    <td class="css_td">0223</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                </div>
                            </div><!--main-content-data-->
                        </div>
                    </div>
                    <div class="col-xs-1 col-sm-1">
                        <div class="row">

                        </div>
                    </div>
                </div>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'lostAndFound',
        props: ["isLostAndFound"],
        mounted(){},
        data(){
            return{}
        },
        methods: {

        }
    }
</script>