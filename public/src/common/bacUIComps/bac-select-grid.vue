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
            },
            //塞入欄位資料
            columns: function (val) {
                this.initComboGrid();
            }
        },
        methods: {
            initComboGrid: function () {
                let self = this;
                $(this.$el).combogrid({
                    panelWidth: self.getPanelWidth(),
                    multiple: this.multiple,
                    value: this.defaultVal && this.defaultVal != "" ? this.defaultVal : "",
                    idField: this.idField,
                    textField: this.textField,
                    columns: [this.columns],
                    editable: this.editable == "Y" ? true : false,
                    data: {total: this.data.length, rows: this.data},
                    pagination: true,
                    scrollbarSize: 50,
                    onChange: function (newValue) {
                        self.$emit('update:v-model', newValue)
                        setTimeout(function () {
                            if (self.$listeners.change != undefined) {
                                self.$listeners.change();
                            }
                        }, 200);

                    },
                    onBeforeSortColumn: function (sort, order) {
                        $(self.$el).datagrid("loadData", self.data);
                    },
                    rownumbers: true,
                    keyHandler: {
                        query: function (q, e) {
                            var loadDepts = [];
                            var value = q.toString().toUpperCase();
                            if(value.length == 0){
                                $(self.$el).combogrid('grid').datagrid('loadData', self.data);
                            }
                            if (value.length < 2) {
                                return;
                            }
                            // var reg = /[\u4e00-\u9fa5]+/g;
                            // if (reg.test(value)) {
                            //     return;
                            // }
                            for (var i = 0; i < self.textField.length; i++) {
                                if (self.data[i][self.textField].indexOf(value) > -1 || self.data[i][self.textField].indexOf(value) > -1) {
                                    loadDepts.push(self.data[i]);
                                }
                            }
                            $(self.$el).combogrid('grid').datagrid('loadData', loadDepts);
                            $(self.$el).combogrid("setText", q);
                        }
                    }
                });
                $(this.$el).combogrid("grid").datagrid('enableFilter');
                let lo_tempDatas = [];
                let pageSize = 20;
                let ln_count = this.data.length < pageSize ? this.data.length : pageSize;
                for (let i = 0; i < ln_count; i++) {
                    lo_tempDatas.push(self.data[i]);
                }

                $(this.$el).combogrid("grid").datagrid("loadData", lo_tempDatas);
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
                    if (self.isQrySrcBefore) {
                        self.searchRemoteSrc($(this).val());
                    }
                });
            },
            setPage: function (pageNo, pageSize) {
                console.log(pageNo);
                console.log(pageSize);
                $(this.$el).combogrid("grid").datagrid('options').pageSize = pageSize;
                let pager = $(this.$el).combogrid("grid").datagrid("getPager");
                let start = (pageNo - 1) * pageSize;
                let end = start + pageSize;
                $(this.$el).combogrid("grid").datagrid("loadData", this.data.slice(start, end));
                pager.pagination('refresh', {
                    total: this.data.length,
                    pageNumber: pageNo
                });
            },

            searchRemoteSrc: function (keyword) {
                var ls_keyword = keyword || '';
                var self = this;
                if (ls_keyword == "") {
                    return false;
                }
                $.post('/api/getSelectOptions', {keyword: ls_keyword, field: this.field}, function (items) {
                    $(self.$el).combogrid("loadData", items);
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
                    }, 0)
                }

                if (!_.isUndefined(this.field.width)) {
                    ln_panelWidth = ln_panelWidth > this.field.width ? ln_panelWidth : this.field.width;
                }

                return ln_panelWidth;
            }
        },
        beforeDestroy: function () {
            $(this.$el).combogrid('destroy');
            $(this.$el).combobox('textbox').unbind('keyup')
        }
    }
</script>
