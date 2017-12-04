<template>
    <div>
        <!--系統模組-->
        <div class="title">
            <i class="fa fa-pencil"></i>
            選擇系統模組
        </div>
        <el-cascader style="width: 30%" :options="options"
                     @active-item-change="handleItemChange"
                     @change="handleChange"
                     v-model="mdl_id"
                     filterable>
        </el-cascader>
        <div class="space-6"></div>

        <!-- 作業 -->
        <div class="title">
            <i class="fa fa-pencil"></i>
            選擇作業
        </div>
        <div class="borderFrame">
            <template v-for="list in prosList">
                <div class="col-xs-12 col-sm-12">
                    <div class="row">
                        <div class="col-xs-2" v-for="prg in list">
                            <button class="btn btn-primary btn-white btn-defaultWidth moreHide"
                                    role="button"
                                    data-rel="tooltip"
                                    data-placement="bottom"
                                    @click="selectProgram(prg.pro_id)"
                                    :title="prg.pro_id">
                                {{ ` ${prg.pro_name_zh_TW}  (${prg.pro_id})`}}
                            </button>
                        </div>
                    </div>
                </div>
                <div class="clearfix"></div>
                <div class="space-4"></div>
            </template>

        </div>
        <div class="space-6"></div>
    </div>
</template>

<script>

    export default {
        mounted() {
            this.initSysPrgMenu();
        },
        props: ['setActivePrg'],
        data: function () {
            return {
                mdl_id: "",
                prosList: [],
                options: []
            };
        },
        methods: {
            //選擇要編輯的作業編號
            selectProgram(prg_id) {
                this.$emit('set-active-prg', prg_id)
            },
            initSysPrgMenu() {
                let _this = this;
                $.post('/api/userAllowSystem').done(function (response) {
                    _.each(response.sysList, function (sys) {
                        _this.options.push({
                            value: sys.sys_id,
                            label: sys.sys_name_zh_tw,
                            children: []
                        });
                    })
                });
            },
            handleChange(val) {
                this.updProgramList(val[2]);
            },
            async handleItemChange(item) {
                //選了系統
                if (item.length == 1) {
                    let sys_id = item[0];
                    let subsysMenu = await this.getSubsysBySysID(sys_id);
                    let sysIdx = _.findIndex(this.options, {value: sys_id});
                    this.options[sysIdx].children = this.composeSubsysMdl(subsysMenu);
                }
            },
            //
            getSubsysBySysID(sys_id) {
                return new Promise(function (resolve, reject) {
                    $.post('/api/userSubsysPurviewBySysID', {sys_id}).done(function (response) {
                        resolve(response.subsysMenu);
                    })
                });
            },
            //更新程式清單
            updProgramList(mdl_id) {
                let _this = this;
                $.post("/api/getGroupMdlPros", {mdl_id: mdl_id}, function (response) {
                    if (response.success) {
                        _this.prosList = _.values(_.groupBy(response.prosList, function (item, i) {
                            return Math.floor(i / 6);
                        }));
                    }
                });
            },
            //組合子系統與模組階層資料
            composeSubsysMdl(subsysMenu) {
                let options = [];
                _.each(subsysMenu, function (subsys) {
                    let tmpSubsysOpt = {
                        value: subsys.subsys_id,
                        label: subsys.subsys_nam,
                        children: []
                    };
                    _.each(subsys.mdlMenu, function (mdl) {
                        tmpSubsysOpt.children.push({
                            value: mdl.mdl_id,
                            label: mdl.mdl_name_zh_TW,
                        })
                    });
                    options.push(tmpSubsysOpt)
                });
                return options;
            }
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