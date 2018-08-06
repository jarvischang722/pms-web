<template>
    <input v-bind='$attrs' v-on='$listeners'/>
</template>

<script>
    export default {
        name: "bac-select-grid",
        props: {
            //綁定的model
            vModel: {
                type: String,
                required: true
            },
            //是否多選
            multiple: {
                type: Boolean,
                default: false
            },
            //作為存入資料庫值的欄位
            idField: {
                type: String,
                default: 'value'
            },
            //顯示的欄位
            textField: {
                type: String,
                default: 'display'
            },
            //是否為KEY 欄位時才去後端撈資料
            isQrySrcBefore: {
                type: String,
                default: 'N'
            },
            //combogrid 資料
            data: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            //預設值
            defaultVal: ['String', 'Number'],
            //欄位屬性
            field: {
                type: Object,
                required: true
            },
            //datagrid 欄位
            columns: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            editable: {
                default: () => {
                    return "Y";
                }
            },
            pageSize: {
                type: Number,
                default: () => {
                    return 10;
                }
            },
            //是否唯讀
            disabled: {
                type: Boolean,
                default: false
            }

        },
        data: function () {
            return {}
        },
        mounted: function () {
            this.initComboGrid();
            if (this.field.requirable == "Y") {
                $(this.$el).combogrid("textbox").css("background", "#c6f2d9");
            }
        },
        watch: {
            //塞入預設值
            defaultVal: function (val) {
                this.$emit('update:v-model', this.defaultVal);
                $(this.$el).combogrid('setValue', val);

                if (!_.isNull(val) && val != "") {
                    let lo_param = {};
                    lo_param[this.idField] = val;
                    let ln_PgeNo = _.findIndex(this.data, lo_param) > -1 ? _.findIndex(this.data, lo_param) : 0;
                    this.setPage(Math.floor(ln_PgeNo / this.pageSize + 1), this.pageSize);
                }
            },
            //塞入欄位資料
            columns: function (val) {
                this.initComboGrid();
            },
            //設定是否唯讀
            disabled: function (val) {
                $(this.$el).combogrid({disabled: val});
                this.initComboGrid();
            }
        },
        methods: {
            initComboGrid: function () {
                let self = this;
                let lo_options = {};
                if (this.data.length > 20) {
                    lo_options.pagination = true;
                    lo_options.rownumbers = true;
                    lo_options.pageSize = this.pageSize;
                    lo_options.data = {total: this.data.length, rows: this.data.slice(0, 20)};
                }
                $(this.$el).combogrid(_.extend({
                    panelWidth: self.getPanelWidth(),
                    multiple: this.multiple,
                    value: this.defaultVal && this.defaultVal != "" ? this.defaultVal : "",
                    idField: this.idField,
                    textField: this.textField,
                    columns: [this.columns],
                    editable: this.editable == "Y" ? true : false,
                    disabled: this.disabled,
                    data: {total: this.data.length, rows: this.data},
                    scrollbarSize: 100,
                    hasDownArrow: this.isQrySrcBefore == "Y" ? true : false,
                    onChange: function (newValue) {
                        self.$emit('update:v-model', newValue);
                        setTimeout(function () {
                            if (self.$listeners.change != undefined) {
                                self.$listeners.change();
                            }
                        }, 200);

                    },
                    onBeforeSortColumn: function (sort, order) {
                        $(self.$el).combogrid('grid').datagrid("loadData", self.data);
                    },
                    keyHandler: {
                        enter: function () {
                            if (self.isQrySrcBefore == "N") {
                                return;
                            }
                            let ls_qStr = $(self.$el).combogrid("getText");
                            if (ls_qStr.length == 0) {
                                $(self.$el).combogrid('grid').datagrid('loadData', self.data.slice(0, 20));
                            }
                            let la_filteredDatas = self.data.filter((item) => {
                                return Object.values(item).join(" ").indexOf(ls_qStr.trim()) > -1;
                            });
                            $(self.$el).combogrid('grid').datagrid('loadData', la_filteredDatas.slice(0, 20));
                            $(self.$el).combogrid("setText", ls_qStr)
                        },
                        query: function (ls_qStr) {
                            if (ls_qStr.length == 0 && self.isQrySrcBefore == "N") {
                                $(self.$el).combogrid('grid').datagrid('loadData', self.data.slice(0, 20));
                            }
                        }

                    },
                    onHidePanel: function () {
                        //todo 關掉下拉時，可以做提示
                    }
                }, lo_options));

                let pager = $(self.$el).combogrid("grid").datagrid('getPager');
                pager.pagination({
                    total: self.data.length,
                    onSelectPage: self.setPage,
                    pageNumber: 1,
                    pageList: [10, 20, 50],
                    showPageList: true,
                    beforePageText: go_i18nLang.SystemCommon.dataGridBeforePageText,
                    afterPageText: go_i18nLang.SystemCommon.dataGridAfterPageText,
                    displayMsg: go_i18nLang.SystemCommon.dataGridDisplayMsg
                });

                //塞入預設值
                if (this.defaultVal && this.defaultVal != "") {
                    this.$emit('update:v-model', this.defaultVal);
                }

                //Remote search
                $(this.$el).combogrid('textbox').bind('keyup', function (e) {
                    if (self.isQrySrcBefore == "N") {
                        self.searchRemoteSrc($(this).val());
                    }
                });
            },
            setPage: function (pageNo, pageSize) {
                $(this.$el).combogrid("grid").datagrid('options').pageSize = pageSize;
                let lo_pager = $(this.$el).combogrid("grid").datagrid("getPager");
                let ln_start = (pageNo - 1) * pageSize;
                let ln_end = ln_start + pageSize;
                $(this.$el).combogrid("grid").datagrid("loadData", this.data.slice(ln_start, ln_end));
                lo_pager.pagination('refresh', {
                    total: this.data.length,
                    pageNumber: pageNo
                });
            },
            searchRemoteSrc: function (keyword) {
                let ls_keyword = keyword || '';
                let self = this;
                if (ls_keyword == "") {
                    return false;
                }
                BacUtils.doHttpPostAgent('/api/getSelectOptions', {
                    keyword: ls_keyword,
                    field: this.field
                }, function (items) {
                    $(self.$el).combogrid("grid").datagrid("loadData", items);
                    $(self.$el).combogrid("setText", ls_keyword);
                })

            },
            //取得SelectGrid寬度
            getPanelWidth: function () {
                let ln_panelWidth = 0;
                if (this.columns.length > 0) {
                    ln_panelWidth = _.reduce(this.columns, function (sum, lo_column) {
                        if (lo_column && _.isUndefined(lo_column.hidden) && !_.isUndefined(lo_column.width)) {
                            return sum + Number(lo_column.width);
                        }
                        else {
                            return sum;
                        }
                    }, 0);
                }

                if (!_.isUndefined(this.field.width)) {
                    ln_panelWidth = ln_panelWidth > this.field.width ? ln_panelWidth : this.field.width;
                }
                //遞補scrollerbar跟序號寬度
                ln_panelWidth += 50;

                return ln_panelWidth;
            }
        },
        beforeDestroy: function () {
            $(this.$el).combogrid('destroy');
            $(this.$el).combobox('textbox').unbind('keyup')
        }
    }
</script>
