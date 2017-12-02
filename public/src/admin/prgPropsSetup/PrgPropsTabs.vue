<template>
    <div>
        <el-tabs v-model="activeCollName" type="card" @tab-click="handleClick">
            <el-tab-pane label="單筆" name="UIDatagridField"></el-tab-pane>
            <el-tab-pane label="多筆" name="UIPageField"></el-tab-pane>
        </el-tabs>
        <div class="col-xs-12 col-sm-12">
            <div class="row">
                <div class="col-xs-11 col-sm-11">
                    <div class="row no-margin-right">
                        <v-table is-horizontal-resize=""
                                 column-width-drag
                                 style="width:100%"
                                 :columns="columns"
                                 :table-data="propsData"
                                 row-hover-color="#eee"
                                 row-click-color="#edf7ff"
                                 :cell-edit-done="editFieldDone"
                                 :height="200">
                        </v-table>
                    </div>
                </div>

                <div class="col-xs-1 col-sm-1">
                    <div class="row">
                        <div class="right-menu-co">
                            <ul>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth" role="button"
                                            @click="doSave">
                                        Save
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
                collIndex: [],
                propsData: [],
                columns: [],
                tmpUpdateData: []
            }
        },
        methods: {
            /**
             * 切換tab 時必須要抓此collection 的資料更新再TABLE上
             * **/
            async updatePrgCollPropsTable() {
                try {
                    let lo_prgProps = await this.fetchProgramProsByPrgID();
                    this.columns = this.convertToColumns(lo_prgProps.collSchema);
                    this.propsData = lo_prgProps.propsData;
                    this.collIndex = lo_prgProps.collIndexs;
                } catch (err) {
                    console.error(err);
                }
                console.log(this.collIndex);
            },
            fetchProgramProsByPrgID() {
                let _this = this;
                return new Promise(function (resolve, reject) {
                    $.post("/api/admin/getProgramPropsByPrgID", {
                        collName: _this.activeCollName,
                        prg_id: _this.prg_id,
                    }, function (response) {
                        console.log(response);
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
                        type: field.type
                    };

                    // if(field.name= '"prg_id"'){
                    //     console.log("===== field ====");
                    //     console.log(field);
                    // }
                    if (field.name != 'prg_id' && field.name != 'athena_id' && field.name != 'user_athena_id' && field.name != 'user_id') {
                        _columns.push(lo_column);
                    }

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
            /**
             *
             * @param newValue
             * @param oldValue
             * @param rowIndex
             * @param rowData
             * @param field
             */
            editFieldDone(newValue, oldValue, rowIndex, rowData, field) {
                let _this = this;
                if (newValue.trim() == oldValue.trim()) {
                    return;
                }
                let lo_updConds = {};
                rowData[field] = newValue;
                //組合修改條件
                _.each(this.collIndex, function (fieldName) {
                    if (!_.isUndefined(rowData[fieldName])) {
                        lo_updConds[fieldName] = _.isEqual(fieldName, field)
                            ? oldValue
                            : rowData[fieldName];
                    }
                });


                console.log(JSON.parse(JSON.stringify(lo_updConds)));
                let ln_existIdx = _.findIndex(_.pluck(this.tmpUpdateData, 'rowData'), lo_updConds);
                if (ln_existIdx > -1) {
                    this.tmpUpdateData.splice(ln_existIdx, 1)
                }
                this.tmpUpdateData.push({rowData: rowData, updConds: lo_updConds});
                this.propsData[rowIndex][field] = newValue;
            },
            /**
             * 切換Tabs 事件
             * @param tab
             * @param event
             */
            handleClick(tab, event) {
                this.updatePrgCollPropsTable();
                this.tmpUpdateData = [];
                console.log(tab, event);
            },
            doSave() {
                let _this = this;
                console.log(this.tmpUpdateData);
                $.post("/api/admin/handleCollSave", {
                    collName: _this.activeCollName,
                    updateData: _this.tmpUpdateData,
                }, function (response) {
                    if (response.success) {
                        _this.tmpUpdateData = [];
                        alert('儲存成功');
                    }
                    else {
                        alert('儲存失敗');
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>