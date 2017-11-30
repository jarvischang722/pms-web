<template>
    <div>
        <!--子系統-->
        <div class="title">
            <i class="fa fa-pencil"></i>
            選擇子系統
        </div>
        <el-cascader placeholder="選擇業務" :options="options" filterable></el-cascader>
        <div class="space-6"></div>

        <!--子系統業務-->
        <div class="title">
            <i class="fa fa-pencil"></i>
            選擇子系統業務
        </div>
        <div class="borderFrame">
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="房型類別設定">
                            房型類別設定
                        </button>
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="房型設定">
                            房型設定
                        </button>
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="國籍設定">
                            國籍設定
                        </button>
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="洲別設定">
                            洲別設定
                        </button>
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="交通接駁設定">
                            交通接駁設定
                        </button>
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="居住地設定">
                            居住地設定
                        </button>
                    </div>
                </div>
            </div>
            <div class="clearfix"></div>
            <div class="space-4"></div>

            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="假日日期設定">
                            假日日期設定
                        </button>
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="市場類別群組設定">
                            市場類別群組設定
                        </button>
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="市場類別設定">
                            市場類別設定
                        </button>
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="訂房卡來源群組設定">
                            訂房卡來源群組設定
                        </button>
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="訂房卡來源設定">
                            訂房卡來源設定
                        </button>
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="訂房折扣及房種升等授權者設定">
                            訂房折扣及房種升等授權者設定
                        </button>
                    </div>
                </div>
            </div>
            <div class="clearfix"></div>
            <div class="space-4"></div>

            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="前檯訂房分析設定">
                            前檯訂房分析設定
                        </button>
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="FOC設定">
                            FOC設定
                        </button>
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="訂房類別設定">
                            訂房類別設定
                        </button>
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="訂房取消原因設定">
                            訂房取消原因設定
                        </button>
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="假日類別設定">
                            假日類別設定
                        </button>
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="GATWAY轉入訂單設定">
                            GATWAY轉入訂單設定
                        </button>
                    </div>
                </div>
            </div>
            <div class="clearfix"></div>
            <div class="space-4"></div>

            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="訂房確認書E-MAIL內容格式設定">
                            訂房確認書E-MAIL內容格式設定
                        </button>
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="交辦事項設定">
                            交辦事項設定
                        </button>
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="活動/展期名稱設定">
                            活動/展期名稱設定
                        </button>
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="交通類別設定">
                            交通類別設定
                        </button>
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                role="button"
                                data-rel="tooltip" data-placement="bottom" title="房價設定">
                            房價設定
                        </button>
                    </div>
                    <div class="col-xs-2">
                    </div>
                </div>
            </div>
            <div class="clearfix"></div>

        </div>
        <div class="space-6"></div>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                options: [{
                    value: 'PMS',
                    label: '飯店前檯系統',
                    children: [
                        {
                            value: 'reservations',
                            label: '訂房',
                            children: [
                                {
                                    value: 'PMS0110000',
                                    label: '訂房作業'
                                }, {
                                    value: 'PMS0120000',
                                    label: '訂房其他作業'
                                }]
                        },
                        {
                            value: 'frontDesk',
                            label: '接待',
                            children: [
                                {
                                    value: 'PMS0210000',
                                    label: '接待作業'
                                }, {
                                    value: 'PMS0220000',
                                    label: '排房其他作業 '
                                }
                            ]
                        },
                        {
                            value: 'setUp',
                            label: '設定',
                            children: [
                                {
                                    value: 'setUp_reservations',
                                    label: '訂房'
                                }, {
                                    value: 'setUp_frontDesk',
                                    label: '接待 '
                                }, {
                                    value: 'setUp_cashier',
                                    label: '出納'
                                }, {
                                    value: 'setUp_houseKeeping',
                                    label: '房務'
                                }, {
                                    value: 'setUp_nightAudit',
                                    label: '夜核'
                                }, {
                                    value: 'setUp_sales',
                                    label: '業務'
                                }
                            ]
                        }
                    ]
                }]
            };
        }
    }
</script>

<style scoped>
    #setPageProSize .el-input .el-input__inner {
        width: 500px;
        max-width: 100%;
    }

    #setPageProSize .title,
    #setPageProSize_tabs .title {
        font-size: 1.2em;
        color: #555;
        margin: auto auto 5px auto;
    }
</style>