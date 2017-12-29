<template>
    <input/>
</template>

<script>
    export default {
        name: "bac-select",
        props: {
            //綁定的model
            vModel: ['String'],
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
                default: function () {
                    if (!this.isQrySrcBefore) {
                        this.isQrySrcBefore = "N"
                    }
                    return this.isQrySrcBefore == 'N' ? false : true
                }
            },
            //下拉選擇
            data: {
                type: Array,
                default: []
            },
            //預設值
            defaultVal: ['String', 'Number'],
            //欄位屬性
            field: {
                type: Object,
                default: {}
            }

        },
        mounted: function () {
            this.initCombobox();
        },
        data: function () {
            return {
                name: 'mark'
            }
        },
        methods: {
            initCombobox: function () {
                let self = this;
                console.log(this.multiple);
                $(this.$el).combobox({
                    multiple: this.multiple,
                    valueField: this.valueField,
                    textField: this.textField,
                    value: this.defaultVal && this.defaultVal != "" ? this.defaultVal : "",
                    data: this.data,
                    onChange: function (newValue, oldValue) {
                        self.$emit('update:v-model', newValue);
                    }
                });

                //塞入預設值
                if (this.defaultVal && this.defaultVal != "") {
                    this.$emit('update:v-model', this.defaultVal);
                }
                //Remote search
                $(this.$el).combobox('textbox').bind('keydown', function () {
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
                $.post('/api/getSelectOptions', {keyword: ls_keyword, field: this.field})
                    .done(function (items) {
                        console.log(items);
                        $(self.$el).combobox("loadData", items);
                    })
                    .error(function () {
                        console.error('errr@@@');
                    });
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