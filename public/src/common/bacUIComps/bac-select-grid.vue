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
                default: function () {
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
                default: function () {
                    return [];
                }
            }

        },
        data: function () {
            return {}
        },
        mounted: function () {
            this.initComboGrid();
            if(this.field.requirable == "Y"){
                $(this.$el).combogrid("textbox").css("background","#c6f2d9");
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
                    data: this.data,
                    onChange: function (newValue) {
                        self.$emit('update:v-model', newValue)
                        setTimeout(function () {
                            if (self.$listeners.change != undefined) {
                                self.$listeners.change();
                            }
                        }, 200);

                    }
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

<style scoped>

</style>