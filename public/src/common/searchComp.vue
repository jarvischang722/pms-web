<template>
    <div id="search">
        <div class="col-xs-12" v-if="searchFields.length > 0 ">
            <div class="search-content" style="margin: 0 15px">
                <div class=""></div>
                <div class="search-co row">
                    <div class="col-xs-12 search-co-content search-S2 ">
                        <div class="width-95 searchMain-S2" style="padding-top: 10px;">
                            <div class="grid">

                                <div class="grid-item" v-for="field in searchFieldsByRow[0]">
                                    <label>{{field.ui_display_name}}</label>

                                    <input v-if="field.ui_type == 'text' || field.ui_type == 'number' || field.ui_type == 'popupgrid' || field.ui_type == 'multipopupgrid' "
                                           v-model="searchCond[field.ui_field_name]"
                                           class="numStyle-none defHt"
                                           :style="{width:field.width + 'px' , height:field.height + 'px'}" min="0"
                                           :required="field.requirable == 'Y'"
                                           @click="chkClickPopUpGrid(field)"/>


                                    <el-select v-if="field.ui_type == 'select' ||field.ui_type == 'multiselect' "
                                               v-model="searchCond[field.ui_field_name]"
                                               multiple="field.ui_type == 'multiselect'" size="small"
                                               :style="{width:field.width + 'px'}">
                                        <el-option v-for="item in field.selectData" :key="item.value"
                                                   :label="item.display" :value="item.value">
                                        </el-option>
                                    </el-select>


                                    <el-date-picker v-if="field.ui_type == 'date' ||field.ui_type == 'datetime' "
                                                    v-model="searchCond[field.ui_field_name]" size="small"
                                                    :format="field.ui_type == 'date' ? 'yyyy/MM/dd': 'yyyy/MM/dd HH:mm:ss'"
                                                    :type="field.ui_type == 'date' ? 'date': 'datetime'"
                                                    :style="{width:field.width + 'px'}"
                                                    placeholder="">
                                    </el-date-picker>


                                    <el-date-picker v-if="field.ui_type == 'daterange'"
                                                    v-model="searchCond[field.ui_field_name]" size="small"
                                                    format="yyyy/MM/dd" type="daterange"
                                                    placeholder="Select date range">
                                    </el-date-picker>

                                    <template v-if="field.ui_type == 'radio'">
                                        <el-radio class="radio width-auto"
                                                  v-model="searchCond[field.ui_field_name]"
                                                  v-for="item in field.selectData" :key="item.value" :label="item.value">
                                            {{item.display}}
                                        </el-radio>
                                    </template>
                                </div>
                            </div>

                        </div>
                        <div class="row search-footer-btn" style="top: -10px;">
                            <div class="footer-btn-menu-co">
                                <ul>
                                    <li>
                                        <div class="" data-rel="tooltip" data-placement="bottom"
                                             title="查詢" @click="doSearch">
                                            <div class="icon-reStyle icon-co-14"></div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="" data-rel="tooltip" data-placement="bottom"
                                             title="清除" @click="doClear">
                                            <div class="icon-reStyle icon-co-11"></div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="icon-moreSearch show-search-detail">
                                            <i class="fa fa-chevron-down"
                                               style="color: #438EB9;"></i>
                                        </div>
                                    </li>
                                </ul>
                            </div>  <!-- /.footer-btn-menu-co -->
                        </div> <!-- /.search-footer-btn -->
                    </div>
                    <div class="clearfix"></div>

                    <div class="search-co-content col-xs-12 search-S2-con rece-search-detail" style="display: none;">
                        <div class="width-95">

                            <div class="grid" v-for="(searchFieldList, index) in searchFieldsByRow">
                                <template>
                                    <div class="grid-item" v-for="field in searchFieldList" v-if="index != 0">
                                        <label>{{field.ui_display_name}}</label>
                                        <template
                                                v-if="field.ui_type == 'text' || field.ui_type == 'popupgrid' || field.ui_type == 'multipopupgrid' ">
                                            <input v-model="searchCond[field.ui_field_name]"
                                                   class="numStyle-none defHt"
                                                   :style="{width:field.width + 'px' , height:field.height + 'px'}" min="0"
                                                   :required="field.requirable == 'Y'"
                                                   @click="chkClickPopUpGrid(field)"/>
                                        </template>

                                        <template v-if="field.visiable == 'Y' && field.ui_type == 'number'">
                                            <input type="text" v-model="searchCond[field.ui_field_name]"
                                                   :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                   :class="{'input_sta_required' : field.requirable == 'Y', 'text-right' : field.ui_type == 'number'}"
                                                   @keyup="formatAmt(searchCond[field.ui_field_name], field)"
                                            >
                                        </template>

                                        <template v-if="field.ui_type == 'select' ||field.ui_type == 'multiselect' ">
                                            <el-select v-model="searchCond[field.ui_field_name]"
                                                       :multiple="field.ui_type == 'multiselect'" size="small"
                                                       :style="{width:field.width + 'px'}">
                                                <el-option v-for="item in field.selectData" :key="item.value"
                                                           :label="item.display" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </template>

                                        <template v-if="field.ui_type == 'date' ||field.ui_type == 'datetime' ">
                                            <el-date-picker v-model="searchCond[field.ui_field_name]" size="small"
                                                            :format="field.ui_type == 'date' ? 'yyyy/MM/dd': 'yyyy/MM/dd HH:mm:ss'"
                                                            :type="field.ui_type == 'date' ? 'date': 'datetime'"
                                                            :style="{width:field.width + 'px'}"
                                                            :editable="false"
                                                            placeholder="">
                                            </el-date-picker>
                                        </template>

                                        <template v-if="field.ui_type == 'daterange'">
                                            <el-date-picker v-model="searchCond[field.ui_field_name]" size="small"
                                                            format="yyyy/MM/dd" type="daterange" :editable="false"
                                                            placeholder="Select date range">
                                            </el-date-picker>
                                        </template>

                                        <template v-if="field.ui_type == 'radio'">
                                            <el-radio class="radio"
                                                      v-model="searchCond[field.ui_field_name]"
                                                      v-for="item in field.selectData" :key="item.value" :label="item.value">
                                                {{item.display}}
                                            </el-radio>
                                        </template>

                                        <template v-if="field.ui_type == 'tree'">
                                            <el-cascader
                                                    :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                    v-model="searchCond[field.ui_field_name]"
                                                    expand-trigger="hover"
                                                    :options="field.selectData"
                                                    class="numStyle-none"
                                                    size="small"></el-cascader>
                                        </template>

                                        <template v-if="field.ui_type == 'multitree'">
                                            <treeselect
                                                    :style="{width:field.width + 'px'}"
                                                    v-model="searchCond[field.ui_field_name]"
                                                    :multiple="true"
                                                    :options="field.selectData"
                                            />
                                        </template>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div> <!-- row-->
            </div> <!-- /.search-co -->
        </div> <!-- /.row  search-content-->
        <div class="clearfix"></div>
        <select-grid-dialog-comp></select-grid-dialog-comp>
    </div>
</template>

<script>
    import selectGridDialogComp from './selectGridDialogComp.vue';
    import Treeselect from '@riophae/vue-treeselect';

    export default {
        name: 'search-comp',
        props: ["searchFields", "searchCond", "fetchData"],
        components: {selectGridDialogComp, Treeselect},
        data() {
            return {
                searchFieldsByRow: [],
                selectPopUpGridData: [],
                titleName: "",
                i18lang: {}
            };
        },
        created() {
            var self = this;
            this.$eventHub.$on('updateBackSelectData', function (chooseData) {
                self.searchCond = _.extend(self.searchCond, chooseData);
            });
        },
        watch: {
            searchFields(newFields) {
                this.searchFieldsByRow = _.values(_.groupBy(_.sortBy(newFields, "row_seq"), "row_seq"));
            }
        },
        methods: {
            doSearch() {
                var la_searchFields = JSON.parse(JSON.stringify(this.searchFields));
                var lo_searchCond = JSON.parse(JSON.stringify(this.searchCond));

                _.each(la_searchFields, function (lo_searchField) {
                    if (lo_searchField.ui_type == "number") {
                        if (lo_searchField.format_func_name.rule_val != "") {
                            lo_searchCond[lo_searchField.ui_field_name] =
                                go_formatDisplayClass.removeAmtFormat(lo_searchCond[lo_searchField.ui_field_name]);
                        }
                    }
                    else if (lo_searchField.ui_type == "multitree") {
                        if (lo_searchCond[lo_searchField.ui_field_name].length != 0) {
                            let la_options = lo_searchField.selectData;
                            let la_fieldMultitreeVal = JSON.parse(JSON.stringify(lo_searchCond[lo_searchField.ui_field_name]));
                            lo_searchCond[lo_searchField.ui_field_name] = [];

                            _.each(la_fieldMultitreeVal, function (ls_value) {
                                let lo_selectData = _.findWhere(la_options, {id: ls_value});
                                if (_.isUndefined(lo_selectData)) {
                                    searchOptions(la_options, ls_value, lo_searchCond[lo_searchField.ui_field_name]);
                                }
                                else if (_.isUndefined(lo_selectData.value)) {
                                    searchValue(lo_selectData.children, lo_searchCond[lo_searchField.ui_field_name]);
                                }
                                else {
                                    lo_searchCond[lo_searchField.ui_field_name].push(lo_selectData.value);
                                }
                            });
                        }
                    }
                    else if (lo_searchField.ui_type == "tree") {
                        var ln_dataLen = lo_searchCond[lo_searchField.ui_field_name].length;
                        lo_searchCond[lo_searchField.ui_field_name] = lo_searchCond[lo_searchField.ui_field_name][ln_dataLen] - 1;
                    }
                    else if (lo_searchField.ui_type == "date") {
                        if (lo_searchCond[lo_searchField.ui_field_name] != "") {
                            lo_searchCond[lo_searchField.ui_field_name] =
                                moment(new Date(lo_searchCond[lo_searchField.ui_field_name])).format("YYYY/MM/DD");
                        }
                    }
                    else if (lo_searchField.ui_type == "datetime") {
                        if (lo_searchCond[lo_searchField.ui_field_name] != "") {
                            lo_searchCond[lo_searchField.ui_field_name] =
                                moment(new Date(lo_searchCond[lo_searchField.ui_field_name])).format("YYYY/MM/DD HH:mm:ss");
                        }
                    }
                });

                this.$parent.searchCond = lo_searchCond;
                this.fetchData();
            },
            doClear() {
                var self = this;
                var lo_searchCond = JSON.parse(JSON.stringify(this.searchCond));

                _.each(lo_searchCond, function (val, key) {
                    if (typeof val === "string") {
                        self.searchCond[key] = "";
                    }
                    else if (Array.isArray(val)) {
                        self.searchCond[key] = [];
                    }
                });
            },
            chkClickPopUpGrid(field) {
                var self = this;
                this.titleName = field.prg_id;

                if (field.ui_type == "popupgrid" || field.ui_type == "multipopupgrid") {
                    var params = {
                        prg_id: field.prg_id,
                        fields: field
                    };

                    $.post("/api/popUpGridData", params, function (result) {
                        if (result != null) {
                            self.selectPopUpGridData = result.showDataGrid;
                            result.fieldData = field;
                            self.$eventHub.$emit('showPopUpDataGrid', result);
                            self.showPopUpGridDialog();
                        }
                    });
                }
            },
            showPopUpGridDialog() {
                var self = this;
                this.dialogVisible = true;
                var height = document.documentElement.clientHeight - 60; //browser 高度 - 60功能列
                var width = document.documentElement.clientWidth / 2;    //browser 寬度 - 200功能列

                var dialog = $("#dataPopUpGridDialog").dialog({
                    autoOpen: false,
                    modal: true,
                    height: height,
                    width: width,
                    title: self.titleName,
                    resizable: true
                });
                dialog.dialog("open");
            },
            formatAmt(val, field) {
                var ls_amtValue = val;
                var ls_ruleVal = field.format_func_name.rule_val;

                if (ls_ruleVal != "") {
                    this.searchCond[field.ui_field_name] = go_formatDisplayClass.amtFormat(ls_amtValue, ls_ruleVal);
                }
                else {
                    this.searchCond[field.ui_field_name] = ls_amtValue;
                }
            }
        }
    }

    function searchValue(la_children, ls_selectData) {
        _.each(la_children, function (lo_children) {
            if (_.isUndefined(lo_children.value)) {
                searchValue(lo_children.children, ls_selectData);
            }
            else {
                ls_selectData.push(lo_children.value);
                return;
            }
        });
    }

    function searchOptions(la_options, ls_value, la_selectData) {
        _.each(la_options, function (lo_option) {
            var lo_childrenOptions = _.findWhere(lo_option.children, {id: ls_value});
            if (_.isUndefined(lo_childrenOptions)) {
                searchOptions(lo_option.children, ls_value, la_selectData);
            }
            else if (_.isUndefined(lo_childrenOptions.value)) {
                searchValue(lo_childrenOptions.children, la_selectData);
            }
            else {
                la_selectData.push(lo_childrenOptions.value);
                return;
            }
        });
    }
</script>