<template>
    <div>
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
</template>

<script>
    export default {
        name: 'business-remark',
        props: ["rowData", "isBusinessRemark"],
        data(){
            return{};
        },
        watch: {
            isBusinessRemark(val){
                if(val){

                }
            }
        },
        methods: {}

    }
</script>