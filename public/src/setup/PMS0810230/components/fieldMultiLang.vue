<template>
    <el-dialog title="Multi Language" :visible.sync="showMultiLangDialog" size="tiny">
        <table class="langTable" style="margin-top: 20px" align="center">
            <tbody>
            <tr v-for="locale in sys_locales">
                <td> {{locale.name}}</td>
                <td>
                    <input :data-locale="locale.lang"
                           :id="editingLangField"
                           :value="filterLocaleContent(multiLangContentList,  locale.lang ,editingLangField) "
                           class="multi_lang_input">
                </td>
            </tr>
            </tbody>
        </table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeFieldMultiLangDialog">{{i18nLang.SystemCommon.Cancel }}</el-button>
            <el-button type="primary" @click="saveFieldMultiLang">{{i18nLang.SystemCommon.OK }}  </el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        name: 'fieldMultiLang',
        props: ['sys_locales', 'fieldInfo', 'singleData', 'openMultiLangDialog'],
        created: function () {
//            this.$eventHub.$on('editFieldMultiLang', (data)=> {
//                this.singleData = data.singleData;
//                this.getFieldMultiLangContent(data.fieldInfo);
//            });
        },
        data: function () {
            return {
                i18nLang: go_i18nLang,
                editingLangField: "",
                multiLangContentList: [],
                fieldMultiLang: {},
                showMultiLangDialog: false
            };
        },
        watch: {
            openMultiLangDialog(val){
                if(val){
                    this.getFieldMultiLangContent(this.fieldInfo);
                }
            }
        },
        methods: {
            getFieldMultiLangContent: function (fieldInfo) {
                this.editingLangField = fieldInfo.ui_field_name;
                if(_.findIndex(this.singleData["multilang"], {field: this.editingLangField}) <= -1){
                    var self = this;
                    var params = {
                        dataType: 'gridsingle',
                        rowData: this.singleData,
                        prg_id: fieldInfo.prg_id,
                        page_id: fieldInfo.page_id,
                        ui_field_name: fieldInfo.ui_field_name
                    };
                    $.post("/api/fieldAllLocaleContent", params, function (result) {
                        self.multiLangContentList = result.multiLangContentList;
                        self.editingMultiLangFieldName = fieldInfo.ui_display_name;
                        self.openFieldMultiLangDialog();
                    });
                }
                else{
                    let la_multiLangContentList = [];
                    _.each(this.singleData["multilang"], (lo_multiLang, idx)=>{
                        let lo_editField = {
                            display_locale: lo_multiLang.locale=='en'? "English": "繁體中文",
                            locale: lo_multiLang.locale
                        };
                        lo_editField[lo_multiLang.field] = lo_multiLang.val;
                        la_multiLangContentList.push(lo_editField);
                    });
                    this.multiLangContentList = la_multiLangContentList;
                    this.editingMultiLangFieldName = fieldInfo.ui_display_name;
                    this.openFieldMultiLangDialog();
                }
            },
            openFieldMultiLangDialog: function () {
                this.showMultiLangDialog = true;
            },
            closeFieldMultiLangDialog: function () {
                this.showMultiLangDialog = false;
                this.$parent.openMultiLangDialog = false;
            },
            saveFieldMultiLang: function () {
                this.singleData["multilang"] = this.singleData["multilang"] || [];
                let la_multiLang = [];
                let la_saveData = [];
                //TODO 暫時用jquery 取資料
                $(".multi_lang_input").each(function () {
                    var lo_tmpObj = {};
                    lo_tmpObj['locale'] = $(this).data("locale");
                    lo_tmpObj[$(this).attr("id")] = $(this).val();
                    if (!_.isEmpty($(this).val())) {
                        la_multiLang.push(lo_tmpObj);
                    }
                });

                _.each(la_multiLang, (lo_multiLang)=>{
                    let ls_field = _.keys(lo_multiLang)[1];
                    la_saveData.push({
                        locale: lo_multiLang.locale,
                        field: ls_field,
                        val: lo_multiLang[ls_field]
                    });
                });

                _.each(la_saveData, (lo_saveData) => {
                    let lo_edit = _.findWhere(this.singleData["multilang"], {field: lo_saveData.field, locale: lo_saveData.locale});
                    if(_.isUndefined(lo_edit)){
                        this.singleData["multilang"].push(lo_saveData);
                    }
                    else{
                        _.extend(lo_edit, lo_saveData);
                    }
                });
                this.$eventHub.$emit("setMultiLangSingleData", this.singleData);
                this.closeFieldMultiLangDialog();
            },
            filterLocaleContent: function (langContent, locale, field_name) {
                let m_lang_val = "";
                let fIdx = _.findIndex(langContent, {locale: locale});
                if (fIdx > -1) {
                    m_lang_val = langContent[fIdx][field_name] || "";
                }
                return m_lang_val;
            }
        }
    }
</script>

<style>
    .langTable {
        max-width: 960px;
        margin: 0 auto;
        border-collapse: collapse;
    }

    .langTable thead {
        background: #f5f5f5;
    }

    .langTable tr:nth-child(even) {
        background: #f8f8f8;
    }

    .langTable caption {
        font-size: 24px;
        padding: 10px;
    }

    .langTable td, th {
        text-align: left;
        padding: 8px;
        /*border: 1px solid #ccc;*/
        border: 1px solid #95B8E7;
    }
</style>