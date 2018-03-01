<template>
    <div id="otherContactDialog" class="hide padding-5" style="top: 0 !important;">
        <div class="businessCompanyData">
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-11 col-sm-11">
                        <div class="main-content-data">
                            <!--電子郵件-->
                            <div class="col-xs-12 col-sm-12 otherContact-box">
                                <div class="row">
                                    <div class="billInfo grid">
                                        <div class="col-xs-12 col-sm-12">
                                            <div class="row billInfo-head">
                                                <p class="billInfo-title">電子郵件</p>
                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-sm-12">
                                            <div class="row no-margin-right">
                                                <div class="content">
                                                    <table class="css_table">
                                                        <tbody class="css_tbody">
                                                        <tr class="css_tr">
                                                            <th class="css_th width-15">電子郵件</th>
                                                            <td class="css_td width-70">s569789465@gmail.com</td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                            <!--聯絡方式-->
                            <div class="col-xs-12 col-sm-12 otherContact-box">
                                <div class="row">
                                    <div class="billInfo grid">
                                        <div class="col-xs-12 col-sm-12">
                                            <div class="row billInfo-head">
                                                <p class="billInfo-title">連絡方式</p>
                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-sm-12">
                                            <div class="row no-margin-right">
                                                <div class="content">
                                                    <table class="css_table">
                                                        <thead class="css_thead">
                                                        <tr class="css_tr">
                                                            <th class="css_th width-15">連絡類別</th>
                                                            <th class="css_th width-70">連絡內容</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody class="css_tbody">
                                                        <tr class="css_tr">
                                                            <td class="css_td">行動電話</td>
                                                            <td class="css_td">0910556677</td>
                                                        </tr>
                                                        <tr class="css_tr">
                                                            <td class="css_td">公司電話</td>
                                                            <td class="css_td">0256789876</td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                            <!--地址-->
                            <div class="col-xs-12 col-sm-12 otherContact-box">
                                <div class="row">
                                    <div class="billInfo grid">
                                        <div class="col-xs-12 col-sm-12">
                                            <div class="row billInfo-head">
                                                <p class="billInfo-title">地址</p>
                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-sm-12">
                                            <div class="row no-margin-right">
                                                <div class="content">
                                                    <table class="css_table">
                                                        <thead class="css_thead">
                                                        <tr class="css_tr">
                                                            <th class="css_th width-15">地址類別</th>
                                                            <th class="css_th width-15">郵遞區號</th>
                                                            <th class="css_th width-70">地址</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody class="css_tbody">
                                                        <tr class="css_tr">
                                                            <td class="css_td">公司地址</td>
                                                            <td class="css_td">104</td>
                                                            <td class="css_td">台北市中山區松江路309號8樓
                                                                <i class="moreClick fa fa-ellipsis-h"></i></td>
                                                        </tr>
                                                        <tr class="css_tr">
                                                            <td class="css_td">戶籍地址</td>
                                                            <td class="css_td">106</td>
                                                            <td class="css_td">台北市大安區仁愛路5號20樓
                                                                <i class="moreClick fa fa-ellipsis-h"></i></td>
                                                        </tr>
                                                        <tr class="css_tr">
                                                            <td class="css_td">住家地址</td>
                                                            <td class="css_td"></td>
                                                            <td class="css_td"><i
                                                                    class="moreClick fa fa-ellipsis-h"></i></td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </div><!--main-content-data-->
                        <div class="clearfix"></div>
                    </div>
                    <div class="col-xs-1 col-sm-1">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth otherContact-insideBtn"
                                                role="button">離開
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="clearfix"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'otherConnection',
        props: ["isOtherConnection"],
        mounted(){},
        data(){
            return{}
        },
        watch: {
            isOtherConnection(val){
                if(val){

                }
            }
        },
        methods: {

        }
    }
</script>