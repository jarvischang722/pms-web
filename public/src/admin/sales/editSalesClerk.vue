<template>
    <div id="salesEditClerk" class="hide padding-5">
        <div class="businessCompanyData">
            <div class="col-sm-12 col-xs-12">
                <div class="row">
                    <div class="col-sm-10 col-xs-10">
                        <div class="row billInfo">
                            <div class="content">
                                <div class="space-custom-5"></div>
                                <div class="grid-item tab-block">
                                    <label>指定業務員</label>
                                    <select class="input-medium medium-c1">
                                        <option value="1">陳瑞克</option>
                                        <option value="2">王大園</option>
                                    </select>
                                </div>
                                <div class="clearfix"></div>

                                <div class="checkbox clerkCheckbox">
                                    <!---->
                                    <label class="">
                                        <input name="form-field-checkbox" type="checkbox" class="ace">
                                        <span class="lbl"><span class="txt">更新未來訂房卡</span></span>
                                    </label>
                                    <label></label>
                                </div>

                                <div class="space-6"></div>

                            </div>
                        </div>
                    </div>
                    <div class="col-sm-2 col-xs-2">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
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
        <div class="clearfix"></div>
    </div>
</template>

<script>
    export default {
        name: 'edit-sales-clerk',
        props: ["editRows"],
        data() {
        },
        methods: {}
    }
</script>