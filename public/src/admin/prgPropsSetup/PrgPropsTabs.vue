<template>
    <div>
        <el-tabs v-model="activeCollName" @tab-click="handleClick">
            <el-tab-pane label="單筆" name="UIDatagridField">   </el-tab-pane>
            <el-tab-pane label="多筆" name="UIPageField">     </el-tab-pane>
        </el-tabs>
        <div class="col-xs-12 col-sm-12">
            <div class="row">
                <div class="col-xs-11 col-sm-11">
                    <div class="row no-margin-right">
                        <v-table is-horizontal-resize=""
                                 column-width-drag
                                 style="width:100%"
                                 :columns="columns"
                                 :table-data="tableData"
                                 row-hover-color="#eee"
                                 row-click-color="#edf7ff"
                                 :cell-edit-done="cellEditDone"
                                 :height="200">

                        </v-table>
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
        <!--column-width-drag  **拖拉table內寬度-->
        <!--:height="200" **header 固定-->

    </div>
</template>

<script>
    export default {
        name: 'prg-prors-tabs',
        mounted() {
            this.updatePrgCollPropsTable();
        },
        data() {
            return {
                prg_id: 'PMS0810010',
                activeCollName: 'UIDatagridField',
                tableData: [],
                columns: []
            }
        },
        methods: {
            /**
             * 切換tab 時必須要抓此collection 的資料更新再TABLE上
             * **/
            async updatePrgCollPropsTable() {
                let lo_prgProps = await this.fetchProgramProsByPrgID();
                this.columns = this.convertToColumns(lo_prgProps.collSchema);
                this.tableData = lo_prgProps.props;
            },
            fetchProgramProsByPrgID() {
                let _this = this;
                return new Promise(function (resolve, reject) {
                    $.post("/admin/getProgramPropsByPrgID", {
                        collName: _this.activeCollName,
                        prg_id: _this.prg_id,
                    }, function (response) {
                        resolve(response);
                    })
                })
            },
            /**
             * 轉換schema 為table Columns
             */
            convertToColumns(columns) {
                let _columns = [];
                columns.forEach(function (field) {
                    let ln_width = field.type == 'Number' ? 50 : 100;
                    let lo_column = {
                        field: field.name,
                        title: field.name,
                        width: ln_width,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isEdit: true,
                        isResize: true,
                        orderBy: 'asc'
                    };
                    _columns.push(lo_column);
                });
                if (this.activeCollName == 'UIDatagridField' || this.activeCollName == 'UIPageField') {
                    _columns = this.handleCollFieldColumns(_columns);
                } else {

                }
                return _columns;
            },
            /**
             * 對於Ui field collection 欄位做處理
             */
            handleCollFieldColumns(_columns) {
                let idx = _.findIndex(_columns, {field: 'ui_field_name'});
                _columns[idx].isFrozen = true;
                _columns[idx].formatter = function formatter(rowData, rowIndex, pagingIndex, field) {
                    return `<span class='cell-edit-color'> ${ rowData[field] }</span>`;
                };
                return _columns;
            },
            cellEditDone: function cellEditDone(newValue, oldValue, rowIndex, rowData, field) {
                console.log(rowData)
                console.log(`${newValue}  , ${oldValue} ,${rowIndex} , ${field}`);
                this.tableData[rowIndex][field] = newValue;
            },
            handleClick(tab, event) {
                this.updatePrgCollPropsTable();
                console.log(tab, event);
            }
        }
    }
</script>

<style scoped>

</style>