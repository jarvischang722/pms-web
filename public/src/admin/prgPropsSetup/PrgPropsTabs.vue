<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="單筆" name="UIDatagridField">
                <div class="col-xs-12 col-sm-12">
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
            <el-tab-pane label="多筆" name="UIPageField">
                test
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        name: 'prg-prors-tabs',
        mounted() {
            $.post("/admin/getProgramPropsByPrgID", {
                collName: this.activeName,
                prg_id: 'PMS0810010'
            }, function (result) {
                console.log(result);
            })
        },
        data() {
            return {
                activeName: 'UIDatagridField',
                tableData: [],
                columns: [
                    {
                        field: 'ui_field_name',
                        title: 'ui_field_name',
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
                        field: 'page_id',
                        title: 'page_id',
                        width: 10,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'tab_page_id',
                        title: 'tab_page_id',
                        width: 10,
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
                        field: 'ui_type',
                        title: 'ui_type',
                        width: 50,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'ui_field_length',
                        title: 'ui_field_length',
                        width: 30,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'ui_field_num_point',
                        title: 'ui_field_num_point',
                        width: 30,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'row_seq',
                        title: 'row_seq',
                        width: 30,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'height',
                        title: 'height',
                        width: 50,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'col_seq',
                        title: 'col_seq',
                        width: 30,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'label_width',
                        title: 'label_width',
                        width: 50,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'width',
                        title: 'width',
                        width: 50,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'visiable',
                        title: 'visiable',
                        width: 30,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'modificable',
                        title: 'modificable',
                        width: 30,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'requirable',
                        title: 'requirable',
                        width: 30,
                        titleAlign: 'center',
                        columnAlign: 'left',
                        isEdit: true,
                        isResize: true
                    },
                    {
                        field: 'keyable',
                        title: 'keyable',
                        width: 30,
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
                console.log(rowData)
                console.log(`${newValue}  , ${oldValue} ,${rowIndex} , ${field}`);
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