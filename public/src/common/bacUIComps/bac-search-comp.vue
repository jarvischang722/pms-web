<template>
    <div class="col-xs-12" v-if="searchFields.length > 0 ">
        <div class="search-content">
            <div class="">
                <div class="search-co row">
                    <div class="col-xs-12 search-co-content search-S2">
                        <div class="width-95 searchMain-S2 row" style="padding-top: 10px;">
                            <div class="grid">
                                <div class="grid-item" v-for="field in searchFieldsByRow[0]" :key="field.ui_field_name">
                                    <label class="pull-left" :title="field.ui_hint">{{field.ui_display_name}}</label>
                                    <div class="pull-left">
                                        <template
                                                v-if="fieldMode == 'operator' && (field.ui_type == 'number' || field.ui_type.indexOf('date') > -1)">
                                            <bac-select v-model="searchsCondOperator[field.ui_field_name]"
                                                        :data="optionOfOperator[field.ui_type]"
                                                        editable="N"
                                                        :default-val="searchsCondOperator[field.ui_field_name]"
                                                        @update:v-model="val => searchsCondOperator[field.ui_field_name] = val"
                                                        :field="field"
                                                        width="60px">
                                            </bac-select>
                                        </template>
                                    </div>
                                    <template v-if="field.ui_type == 'text' || field.ui_type == 'number'">
                                        <input v-model="searchCond[field.ui_field_name]" :type="field.ui_type"
                                               class="numStyle-none defHt"
                                               :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                               min="0"
                                               :required="field.requirable == 'Y'"/>
                                    </template>

                                    <template v-if="field.ui_type == 'multiselect' || field.ui_type == 'select'">
                                        <bac-select :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                    v-model="searchCond[field.ui_field_name]" :data="field.selectData"
                                                    :field="field"
                                                    is-qry-src-before="Y" value-field="value" text-field="display"
                                                    @update:v-model="val => searchCond[field.ui_field_name] = val"
                                                    :default-val="searchCond[field.ui_field_name]"
                                                    :multiple="field.ui_type == 'multiselect'"
                                                    :disabled="field.modificable == 'N'||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                        </bac-select>
                                    </template>

                                    <template
                                            v-if="field.ui_type == 'selectgrid' || field.ui_type == 'multiselectgrid'">
                                        <bac-select-grid
                                                :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                v-model="searchCond[field.ui_field_name]"
                                                :columns="field.selectData.columns"
                                                :multiple="field.ui_type == 'multiselectgrid'"
                                                :data="field.selectData.selectData"
                                                :field="field"
                                                :is-qry-src-before="field.selectData.isQrySrcBefore"
                                                :id-field="field.selectData.value"
                                                :text-field="field.selectData.display"
                                                @update:v-model="val => searchCond[field.ui_field_name] = val"
                                                :default-val="searchCond[field.ui_field_name]"
                                                :disabled="field.modificable == 'N'||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                        </bac-select-grid>
                                    </template>

                                    <template v-if="field.ui_type.indexOf('date')>-1">

                                        <el-date-picker v-model="searchCond[field.ui_field_name]" size="small"
                                                        :format="field.ui_type == 'date' ? 'yyyy/MM/dd': 'yyyy/MM/dd HH:mm:ss'"
                                                        :type="field.ui_type"
                                                        :style="{width:field.width + 'px' , height:field.height + 'px'}">
                                        </el-date-picker>
                                    </template>

                                    <template v-if="field.ui_type == 'radio'">
                                        <el-radio class="radio width-auto mt-3"
                                                  v-model="searchCond[field.ui_field_name]"
                                                  v-for="item in field.selectData" :key="item.value"
                                                  :label="item.value">
                                            {{item.display}}{{item.value}}
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
                            </div>

                        </div>
                        <div class="row search-footer-btn" style="top: -10px;">
                            <div class="footer-btn-menu-co">
                                <ul>
                                    <li>
                                        <div class="" data-rel="tooltip" data-placement="bottom"
                                             :title="i18nLng.SystemCommon.Search" @click="doSearch">
                                            <div class="icon-reStyle icon-co-14"></div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="" data-rel="tooltip" data-placement="bottom"
                                             :title="i18nLng.SystemCommon.Clear" @click="doClear">
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
                    <div class="search-co-content col-xs-12 search-S2-con rece-search-detail" style="display: none;">
                        <div class="row width-95">

                            <div class="grid" v-for="(searchFieldList, index) in searchFieldsByRow">
                                <template>
                                    <div class="grid-item" v-for="field in searchFieldList" v-if="index != 0">
                                        <label class="pull-left"
                                               :title="field.ui_hint">{{field.ui_display_name}}</label>

                                        <div class="pull-left">
                                            <template
                                                    v-if="fieldMode == 'operator' && (field.ui_type == 'number' || field.ui_type.indexOf('date') > -1)">
                                                <bac-select v-model="searchsCondOperator[field.ui_field_name]"
                                                            :data="optionOfOperator[field.ui_type]"
                                                            editable="N"
                                                            :default-val="searchsCondOperator[field.ui_field_name]"
                                                            @update:v-model="val => searchsCondOperator[field.ui_field_name] = val"
                                                            :field="field"
                                                            width="60px">
                                                </bac-select>
                                            </template>
                                        </div>

                                        <template v-if="field.ui_type == 'text' || field.ui_type == 'number'">
                                            <input v-model="searchCond[field.ui_field_name]" :type="field.ui_type"
                                                   class="numStyle-none defHt"
                                                   :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                   min="0"
                                                   :required="field.requirable == 'Y'"/>
                                        </template>


                                        <template v-if="field.ui_type == 'multiselect' || field.ui_type == 'select'">
                                            <bac-select :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                        v-model="searchCond[field.ui_field_name]"
                                                        :data="field.selectData"
                                                        is-qry-src-before="Y" value-field="value" text-field="display"
                                                        :field="field"
                                                        @update:v-model="val => searchCond[field.ui_field_name] = val"
                                                        :default-val="searchCond[field.ui_field_name]"
                                                        :multiple="field.ui_type == 'multiselect'"
                                                        :disabled="field.modificable == 'N'||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                            </bac-select>
                                        </template>

                                        <template
                                                v-if="field.ui_type == 'selectgrid' || field.ui_type == 'multiselectgrid'">
                                            <bac-select-grid
                                                    :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                    v-model="searchCond[field.ui_field_name]"
                                                    :columns="field.selectData.columns"
                                                    :multiple="field.ui_type == 'multiselectgrid'"
                                                    :data="field.selectData.selectData" :field="field"
                                                    :is-qry-src-before="field.selectData.isQrySrcBefore"
                                                    :id-field="field.selectData.value"
                                                    :text-field="field.selectData.display"
                                                    @update:v-model="val => searchCond[field.ui_field_name] = val"
                                                    :default-val="searchCond[field.ui_field_name]"
                                                    :disabled="field.modificable == 'N'||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                            </bac-select-grid>
                                        </template>

                                        <template v-if="field.ui_type.indexOf('date')>-1">
                                            <el-date-picker v-model="searchCond[field.ui_field_name]" size="small"
                                                            :format="field.ui_type == 'date' ? 'yyyy/MM/dd': 'yyyy/MM/dd HH:mm:ss'"
                                                            :type="field.ui_type"
                                                            :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                            placeholder="">
                                            </el-date-picker>
                                        </template>

                                        <template v-if="field.ui_type == 'radio'">
                                            <el-radio class="radio width-auto mt-3"
                                                      v-model="searchCond[field.ui_field_name]"
                                                      v-for="item in field.selectData" :key="item.value"
                                                      :label="item.value">
                                                {{item.display}}{{item.value}}
                                            </el-radio>
                                        </template>

                                        <template v-if="field.ui_type == 'tree'">
                                            <el-cascader
                                                    :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                    v-model="searchCond[field.ui_field_name]"
                                                    expand-trigger="hover"
                                                    :options="field.selectData"
                                                    class="numStyle-none"
                                                    size="small">
                                            </el-cascader>
                                        </template>

                                        <template v-if="field.ui_type == 'multitree'">
                                            <treeselect
                                                    :style="{width:field.width + 'px', height:field.height + 'px'}"
                                                    v-model="searchCond[field.ui_field_name]"
                                                    :multiple="true"
                                                    :options="field.selectData"/>
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
    </div>
</template>

<script>
    import treeselect from '@riophae/vue-treeselect';
    import moment from 'moment';

    export default {
        name: "search-comp",
        mounted() {
            if (this.fieldMode == "operator") {
                this.setDefaultOperator();
            }
        },
        props: {
            searchFields: {
                type: Array,
                default: []
            },
            searchsCondOperator: {
                type: Object,
                default: {}
            },
            searchCond: {
                type: Object,
                default: {}
            },
            fetchData: {
                type: Function
            },
            fieldMode: {
                type: String,
                validator: function (value) {
                    return ['normal', 'operator'].indexOf(value) !== -1
                },
                default: "normal"
            }
        },
        components: {treeselect},
        data: function () {
            return {
                i18nLng: go_i18nLang,
                searchFieldsByRow: [],
                fieldOfOperator: {
                    text: ["like"],
                    number: [">", ">=", "<", "<=", "="],
                    date: [">", ">=", "<", "<=", "="],
                    daterange: "between",
                    select: ["="],
                    mutilselect: ["in"]
                },
                optionOfOperator: {
                    number: [{value: "gt", display: ">"},
                        {value: "gte", display: ">="},
                        {value: "lt", display: "<"},
                        {value: "lte", display: "<="},
                        {value: "equal", display: "="}],
                    date: [{value: "gt", display: ">"},
                        {value: "gte", display: ">="},
                        {value: "lt", display: "<"},
                        {value: "lte", display: "<="},
                        {value: "equal", display: "="},
                        {value: "between", display: "between"}]
                }
            };
        },
        watch: {
            searchFields: function (newFields) {
                let lo_searchCond = {};
                _.each(newFields, (lo_newField) => {
                    let la_condfield = ["multiselect", "multiselectgrid", "multitree"];
                    lo_searchCond[lo_newField.ui_field_name] = la_condfield.indexOf(lo_newField.ui_type) > -1 ? [] : "";
                });
                this.$parent.searchCond = lo_searchCond;
                this.searchFieldsByRow = _.values(_.groupBy(_.sortBy(newFields, "row_seq"), "row_seq"));
                this.setDefaultOperator();
            }
        },
        methods: {
            setDefaultOperator() {
                let self = this;
                _.each(this.searchFields, (field) => {
                    let defaultOprt = "equal";
                    if (field.ui_type == "text") {
                        defaultOprt = "like";
                    } else if (field.ui_type == "mutilselect") {
                        defaultOprt = "in";
                    } else {
                        //  "number" || "date" || "select"
                        defaultOprt = "equal";
                    }
                    self.searchsCondOperator[field.ui_field_name] = defaultOprt;
                });
            },
            doSearch: function () {
                let la_searchFields = JSON.parse(JSON.stringify(this.searchFields));
                let lo_searchCond = JSON.parse(JSON.stringify(this.searchCond));
                _.each(la_searchFields, function (lo_searchField) {
                    if (lo_searchField.ui_type == "multitree") {
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
                        let ln_dataLen = lo_searchCond[lo_searchField.ui_field_name].length;
                        lo_searchCond[lo_searchField.ui_field_name] = lo_searchCond[lo_searchField.ui_field_name][ln_dataLen] - 1;
                    }
                    else if (lo_searchField.ui_type == "date") {
                        let ls_searchDate = lo_searchCond[lo_searchField.ui_field_name] || "";
                        if (ls_searchDate != "") {
                            lo_searchCond[lo_searchField.ui_field_name] =
                                moment(new Date(ls_searchDate)).format("YYYY/MM/DD");
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
                this.$parent.searchsCondOperator = this.searchsCondOperator;

                this.fetchData();
            },
            doClear() {
                let self = this;
                let lo_searchCond = JSON.parse(JSON.stringify(this.searchCond));
                this.searchsCondOperator = {};
                _.each(lo_searchCond, function (val, key) {
                    if (typeof val === "string") {
                        self.searchCond[key] = "";
                    }
                    else if (Array.isArray(val)) {
                        self.searchCond[key] = [];
                    }
                });
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
            let lo_childrenOptions = _.findWhere(lo_option.children, {id: ls_value});
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
