<template>
    <input v-bind='$attrs' v-on='$listeners'/>
</template>

<script>
    export default {
        name: "bac-select",
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
            valueField: {
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
            //下拉選擇
            data: {
                type: Array,
                default: []
            },
            //顯示用的下拉選擇
            dataDisplay: {
                type: Array,
                default: []
            },
            //預設值
            defaultVal: ['String', 'Number'],
            //欄位屬性
            field: {
                type: Object,
                required: true
            },
            editable: {
                default: () => {
                    return "Y";
                }
            }

        },
        mounted: function () {
            this.dataDisplay = this.dataDisplay.length == 0 ? this.data : this.dataDisplay;
            this.initCombobox();
            if (this.field.requirable == "Y") {
                $(this.$el).combogrid("textbox").css("background", "#c6f2d9");
            }
        },
        data: function () {
            return {
                isLoading: false
            }
        },
        watch: {
            //塞入預設值
            defaultVal: function (val) {
                this.$emit('update:v-model', this.defaultVal);
                $(this.$el).combobox('setValue', val);
            }
        },
        methods: {
            initCombobox: function () {
                let self = this;
                $(this.$el).combobox({
                    width: this.$attrs.width,
                    height: this.$attrs.height,
                    multiple: this.multiple,
                    valueField: this.valueField,
                    textField: this.textField,
                    editable: this.editable == "Y" ? true : false,
                    value: this.defaultVal && this.defaultVal != "" ? this.defaultVal : "",
                    data: this.dataDisplay,
                    onShowPanel: function () {
                        $(this).combobox("loadData", self.data);
                    },
                    onHidePanel: function () {
                        $(this).combobox("loadData", self.dataDisplay);
                    },
                    onChange: function (newValue) {
                        self.$emit('update:v-model', newValue);
                        setTimeout(function () {
                            if (self.$listeners.change != undefined) {
                                self.$listeners.change();
                            }
                        }, 200);
                    },
                    onLoadSuccess: function () {
                    }
                });

                //塞入預設值
                if (this.defaultVal && this.defaultVal != "") {
                    this.$emit('update:v-model', this.defaultVal);
                }
                //Remote search
                $(this.$el).combobox('textbox').bind('keyup', function (e) {
                    if (self.isQrySrcBefore) {
                        self.searchRemoteSrc($(this).val());
                    }
                });
            },
            searchRemoteSrc: function (keyword) {
                let ls_keyword = keyword || '';
                let self = this;
                if (ls_keyword == "") {
                    return false;
                }
                $.post('/api/getSelectOptions', {keyword: ls_keyword, field: this.field}, function (items) {
                    $(self.$el).combobox("loadData", items);
                })

            }
        },
        beforeDestroy: function () {
            $(this.$el).combobox('destroy');
            $(this.$el).combobox('textbox').unbind('keyup')
        },
    }
</script>

<style scoped>

</style>