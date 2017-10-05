// gs_locale

function fieldAttrClass(prg_id, ui_field_name, ui_type, row_seq, col_seq) {
    var self = this;
    var lo_i18nLang = go_i18nLang.program[prg_id] || {};

    this.user_athena_id = "";
    this.user_id = "";
    this.athena_id = "";
    this.prg_id = prg_id || "";
    this.page_id = "";
    this.template_id = "gridsingle";
    this.ui_field_name = ui_field_name || "";
    this.ui_type = ui_type || "";
    this.selectData = [];
    this.ui_field_length = 10;
    this.ui_field_num_point = 0;
    this.row_seq = row_seq || 1;
    this.height = 25;
    this.col_seq = col_seq || 1;
    this.label_width = 75;
    this.width = 165;
    this.visiable = "Y";
    this.modificable = "Y";
    this.requirable = "Y";
    this.keyable = "N";
    this.multi_lang_table = "";
    this.format_func_name = "";
    this.rule_func_name = "";
    this.ui_display_name = "";

    var debug_mod = false;
    var chkFieldI18nIsExist = function(ls_field_name){
        var display_name = lo_i18nLang[ls_field_name] || ls_field_name;
        if(debug_mod && _.isUndefined(lo_i18nLang[ls_field_name])){
            console.error(ls_field_name + " i18n not set");
        }
        return display_name;
    };

    this.qry_display_name = function () {
        this.ui_display_name = chkFieldI18nIsExist(this.ui_field_name);
    };
    this.qry_display_name();

    /**
     * @param la_selectData {array}
     */
    this.set_selectData = function(la_selectData){
        _.each(la_selectData, function(lo_selectData){
            self.selectData.push({
                display: lo_selectData.value + " : " + chkFieldI18nIsExist(lo_selectData.display),
                value: lo_selectData.value
            });
        });
    };
}