// gs_locale

function fieldAttrClass(user_athena_id, user_id, prg_id, page_id, template_id, ui_field_name, ui_type,
                        ui_field_length, ui_field_num_point, row_seq, height, col_seq, label_width, width, visiable,
                        modificable, requirable, keyable, multi_lang_table, format_func_name, rule_func_name) {
    this.user_athena_id = user_athena_id || "";
    this.user_id = user_id || "";
    this.athena_id = athena_id || "";
    this.prg_id = prg_id || "";
    this.page_id = page_id || "";
    this.template_id = template_id || "";
    this.ui_field_name = ui_field_name || "";
    this.ui_type = ui_type || "";
    this.ui_field_length = ui_field_length || 6;
    this.ui_field_num_point = ui_field_num_point || 0;
    this.row_seq = row_seq || 1;
    this.height = height || 25;
    this.col_seq = col_seq || 1;
    this.label_width = label_width || 75;
    this.width = width || 165;
    this.visiable = visiable || "Y";
    this.modificable = modificable || "Y";
    this.requirable = requirable || "Y";
    this.keyable = keyable || "N";
    this.multi_lang_table = multi_lang_table || "";
    this.format_func_name = format_func_name || "";
    this.rule_func_name = rule_func_name || "";
    this.ui_display_name = "";

    this.gen_display_name = function(){
        this.ui_display_name = gs_locale[this.prg_id][this.ui_field_name];
    };
}