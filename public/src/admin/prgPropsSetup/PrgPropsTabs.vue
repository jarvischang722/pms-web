<template>
    <el-collapse-transition>
        <div v-show="activePrg != ''">
            <el-tabs v-model="activeCollName" type="card" @tab-click="handleClick">
                <el-tab-pane label="單筆欄位" name="UIPageField"></el-tab-pane>
                <el-tab-pane label="多筆欄位" name="UIDatagridField"></el-tab-pane>
                <el-tab-pane label="欄位語系" name="LangUIField"></el-tab-pane>
            </el-tabs>
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-11 col-sm-11">
                        <div class="row no-margin-right">
                            <v-table is-horizontal-resize=""
                                     column-width-drag
                                     multiple-sort
                                     sort-always
                                     style="width:100%;"
                                     :columns="columns"
                                     :table-data="propsData"
                                     row-hover-color="#eee"
                                     row-click-color="#edf7ff"
                                     :cell-edit-done="editFieldDone"
                                     :height="table_ht"
                                     error-content="無資料"
                                     :column-cell-class-name="columnCellClass">
                            </v-table>
                        </div>
                    </div>

                    <div class="col-xs-1 col-sm-1">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button :disabled="activePrg == ''"
                                                class="btn btn-primary btn-white btn-defaultWidth" role="button"
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
    </el-collapse-transition>
</template>

<script>
    export default {
        name: 'prg-prors-tabs',
        mounted() {
            this.updatePrgCollPropsTable();
            this.table_ht = $(window).height() - $('.borderFrame').height() - 250;
        },
        props: ["activePrg"],
        data() {
            return {
                activeCollName: 'UIPageField',
                collIndex: [],
                propsData: [],
                columns: [],
                tmpUpdateData: [],
                table_ht: 400
            }
        },
        watch: {
            activePrg() {
                this.updatePrgCollPropsTable();
            }
        },
        methods: {
            /**
             * 切換tab 時必須要抓此collection 的資料更新再TABLE上
             * **/
            async updatePrgCollPropsTable() {
                if (this.activePrg == '') {
                    return;
                }
                try {
                    let lo_prgProps = await this.fetchProgramProsByPrgID();
                    this.columns = this.convertToColumns(lo_prgProps.collSchema);
                    this.propsData = lo_prgProps.propsData;
                    this.collIndex = lo_prgProps.collIndexs;
                } catch (err) {
                    console.error(err);
                }
            },
            fetchProgramProsByPrgID() {
                let _this = this;
                return new Promise(function (resolve, reject) {
                    BacUtils.doHttpPostAgent("/api/admin/getProgramPropsByPrgID", {
                        collName: _this.activeCollName,
                        prg_id: _this.activePrg,
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
                let self = this;
                columns.forEach(function (field) {
                    let ln_width = field.type == 'Number' ? 50 : 100;
                    let lo_column = {
                        overflowTitle: 'hellop',
                        field: field.name,
                        title: self.convertFieldDisplayNam(field.name),
                        width: ln_width,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isEdit: true,
                        isResize: true,
                        type: field.type,
                        titleCellClassName: 'title-cellBg'
                    };


                    if (field.name != 'prg_id' && field.name != 'athena_id' && field.name != 'user_athena_id' && field.name != 'user_id') {
                        _columns.push(lo_column);
                    }

                });
                if (this.activeCollName == 'UIDatagridField' || this.activeCollName == 'UIPageField') {
                    _columns = this.handleFrozenFieldColumns(_columns, 'ui_field_name');
                } else if (this.activeCollName == 'LangUIField') {
                    _columns = this.handleFrozenFieldColumns(_columns, 'ui_field_name');
                }
                return _columns;
            },
            convertFieldDisplayNam(field_name) {
                let lo_fieldRf = {
                    prg_id: {
                        display: "程式編號",
                        hint: "prg_id"
                    },
                    page_id: {
                        display: "Page ID",
                        hint: "page_id"
                    },
                    tab_page_id: {
                        display: "Tab Page ID",
                        hint: "tab_page_id"
                    },
                    template_id: {
                        display: "版型代碼",
                        hint: "template_id"
                    },
                    user_athena_id: {
                        display: "Athena ID",
                        hint: "athena_id"
                    },
                    athena_id: {
                        display: "Athena ID",
                        hint: "athena_id"
                    },
                    user_id: {
                        display: "使用者",
                        hint: "user_id"
                    },
                    ui_field_name: {
                        display: "欄位名",
                        hint: "ui_field_name"
                    },
                    ui_type: {
                        display: "欄位型別",
                        hint: "ui_type"
                    },
                    row_seq: {
                        display: "列順序",
                        hint: "row_seq"
                    },
                    col_seq: {
                        display: "欄位順序",
                        hint: "col_seq"
                    },
                    height: {
                        display: "欄位高度",
                        hint: "height"
                    },
                    width: {
                        display: "欄位寬度",
                        hint: "width"
                    },
                    label_width: {
                        display: "標題欄位寬度",
                        hint: "label_width"
                    },
                    ui_field_length: {
                        display: "欄位長度",
                        hint: "ui_field_length"
                    },
                    ui_field_num_point: {
                        display: "欄位小數點長度",
                        hint: "ui_field_num_point"
                    },
                    multi_lang_table: {
                        display: "多語Table",
                        hint: "multi_lang_table"
                    },
                    format_func_name: {
                        display: "欄位格式規則名",
                        hint: "format_func_name"
                    },
                    rule_func_name: {
                        display: "規則名稱",
                        hint: "format_func_name"
                    },
                    visiable: {
                        display: "是否顯示",
                        hint: "visiable"
                    },
                    modificable: {
                        display: "是否可修改",
                        hint: "modificable"
                    },
                    requirable: {
                        display: "必填",
                        hint: "requirable"
                    },
                    keyable: {
                        display: "是否為pk",
                        hint: "keyable"
                    },
                    grid_field_name: {
                        display: "grid_field_name",
                        hint: "grid_field_name"
                    },
                    attr_func_name: {
                        display: "欄位屬性規則名",
                        hint: "attr_func_name"
                    }
                };

                return lo_fieldRf[field_name] ? lo_fieldRf[field_name].display : field_name;
            },
            /**
             * 要凍結的欄位
             */
            handleFrozenFieldColumns(_columns, frozenField) {
                let idx = _.findIndex(_columns, {field: frozenField});
                _columns[idx].isFrozen = true;
                _columns[idx].formatter = function formatter(rowData, rowIndex, pagingIndex, field) {
                    return `<span class='cell-edit-color'> ${ rowData[field] }</span>`;
                };
                return _columns;
            },
            /**
             * 編輯後離開欄位觸發的method
             * @param newValue
             * @param oldValue
             * @param rowIndex
             * @param rowData
             * @param field
             */
            editFieldDone(newValue, oldValue, rowIndex, rowData, field) {
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
            },
            doSave() {
                let _this = this;
                if (!this.tmpUpdateData.length) {
                    alert('無修改的屬性資料需儲存！');
                    return;
                }
                BacUtils.doHttpPostAgent("/api/admin/handleCollSave", {
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