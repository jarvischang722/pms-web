<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="單筆" name="single">
            <div v-show="activeName == 'single'" class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-11 col-sm-11">
                        <div class="row no-margin-right">
                            <template>
                                <!--column-width-drag  **拖拉table內寬度-->
                                <!--:height="200" **header 固定-->
                                <v-table is-horizontal-resize=""
                                         column-width-drag
                                         style="width:100%"
                                         :columns="columns"
                                         :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff"
                                         :cell-edit-done="cellEditDone"
                                         :height="200">

                                </v-table>

                            </template>
                        </div>
                    </div>

                    <div class="col-xs-1 col-sm-1">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">
                                            Save
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-tab-pane>
        <el-tab-pane label="多筆" name="mult">
            <div v-show="activeName == 'mult'">
                test
            </div>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    export default {
        data: function () {
            return {
                activeName: 'single',
                tableData: [{
                    "user_athena_id": "赵伟",
                    "user_id": "156*****1987",
                    "athena_id": "钢琴、书法、唱歌",
                    "prg_id": "11",
                    "page_id": "11",
                    "tab_page_id": "11",
                    "template_id": "11",
                    "ui_field_name": "11",
                    "ui_type": "11",
                    "ui_field_length": "11",
                    "ui_field_num_point": "11",
                    "row_seq": "11",
                    "height": "11",
                    "col_seq": "11",
                    "label_width": "11",
                    "width": "11",
                    "visiable": "11",
                    "modificable": "11",
                    "requirable": "11",
                    "keyable": "11",
                    "multi_lang_table": "11",
                    "format_func_name": "11",
                    "rule_func_name": "11",
                    "attr_func_name": "11"
                }, {
                    "user_athena_id": "赵伟",
                    "user_id": "156*****1987",
                    "athena_id": "钢琴、书法、唱歌",
                    "prg_id": "11",
                    "page_id": "11",
                    "tab_page_id": "11",
                    "template_id": "11",
                    "ui_field_name": "11",
                    "ui_type": "11",
                    "ui_field_length": "11",
                    "ui_field_num_point": "11",
                    "row_seq": "11",
                    "height": "11",
                    "col_seq": "11",
                    "label_width": "11",
                    "width": "11",
                    "visiable": "11",
                    "modificable": "11",
                    "requirable": "11",
                    "keyable": "11",
                    "multi_lang_table": "11",
                    "format_func_name": "11",
                    "rule_func_name": "11",
                    "attr_func_name": "11"
                },
                    {
                        "user_athena_id": "赵伟",
                        "user_id": "156*****1987",
                        "athena_id": "钢琴、书法、唱歌",
                        "prg_id": "11",
                        "page_id": "11",
                        "tab_page_id": "11",
                        "template_id": "11",
                        "ui_field_name": "11",
                        "ui_type": "11",
                        "ui_field_length": "11",
                        "ui_field_num_point": "11",
                        "row_seq": "11",
                        "height": "11",
                        "col_seq": "11",
                        "label_width": "11",
                        "width": "11",
                        "visiable": "11",
                        "modificable": "11",
                        "requirable": "11",
                        "keyable": "11",
                        "multi_lang_table": "11",
                        "format_func_name": "11",
                        "rule_func_name": "11",
                        "attr_func_name": "11"
                    },
                    {
                        "user_athena_id": "赵伟",
                        "user_id": "156*****1987",
                        "athena_id": "钢琴、书法、唱歌",
                        "prg_id": "11",
                        "page_id": "11",
                        "tab_page_id": "11",
                        "template_id": "11",
                        "ui_field_name": "11",
                        "ui_type": "11",
                        "ui_field_length": "11",
                        "ui_field_num_point": "11",
                        "row_seq": "11",
                        "height": "11",
                        "col_seq": "11",
                        "label_width": "11",
                        "width": "11",
                        "visiable": "11",
                        "modificable": "11",
                        "requirable": "11",
                        "keyable": "11",
                        "multi_lang_table": "11",
                        "format_func_name": "11",
                        "rule_func_name": "11",
                        "attr_func_name": "11"
                    },
                    {
                        "user_athena_id": "赵伟",
                        "user_id": "156*****1987",
                        "athena_id": "钢琴、书法、唱歌",
                        "prg_id": "11",
                        "page_id": "11",
                        "tab_page_id": "11",
                        "template_id": "11",
                        "ui_field_name": "11",
                        "ui_type": "11",
                        "ui_field_length": "11",
                        "ui_field_num_point": "11",
                        "row_seq": "11",
                        "height": "11",
                        "col_seq": "11",
                        "label_width": "11",
                        "width": "11",
                        "visiable": "11",
                        "modificable": "11",
                        "requirable": "11",
                        "keyable": "11",
                        "multi_lang_table": "11",
                        "format_func_name": "11",
                        "rule_func_name": "11",
                        "attr_func_name": "11"
                    }],
                columns: [
                    {
                        field: 'user_athena_id',
                        title: 'user_athena_id',
                        width: 80,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isEdit: true,
                        formatter: function formatter(rowData, rowIndex, pagingIndex, field) {
                            return "<span class='cell-edit-color'>" + rowData[field] + "</span>";
                        },
                        isResize: true,
                        isFrozen: true
                    },
                    {
                        field: 'user_id',
                        title: 'user_id',
                        width: 80,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'athena_id',
                        title: 'athena_id',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'prg_id',
                        title: 'prg_id',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'page_id',
                        title: 'page_id',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'tab_page_id',
                        title: 'tab_page_id',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'template_id',
                        title: 'template_id',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'ui_field_name',
                        title: 'ui_field_name',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'ui_type',
                        title: 'ui_type',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'ui_field_length',
                        title: 'ui_field_length',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'ui_field_num_point',
                        title: 'ui_field_num_point',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'row_seq',
                        title: 'row_seq',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'height',
                        title: 'height',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'col_seq',
                        title: 'col_seq',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'label_width',
                        title: 'label_width',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'width',
                        title: 'width',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'visiable',
                        title: 'visiable',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'modificable',
                        title: 'modificable',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'requirable',
                        title: 'requirable',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'keyable',
                        title: 'keyable',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'multi_lang_table',
                        title: 'multi_lang_table',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'format_func_name',
                        title: 'format_func_name',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'rule_func_name',
                        title: 'rule_func_name',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'attr_func_name',
                        title: 'attr_func_name',
                        width: 100,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    }]
            }
        },
        methods: {
            cellEditDone: function cellEditDone(newValue, oldValue, rowIndex, rowData, field) {
                this.tableData[rowIndex][field] = newValue;
            },
            handleClick(tab, event) {
                console.log(tab, event);
            }
        }
    }
</script>

<style scoped>

</style>