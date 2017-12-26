<template>
    <input />
</template>

<script>
    export default {
        name: "bac-select",
        props:['model'],
        mounted:function(){
            var self = this;
            this.name = this.model;
            $(this.$el).combobox({
                multiple:true,
                valueField:'id',
                textField:'text',
                data:[{
                    "id":1,
                    "text":"text1"
                },{
                    "id":2,
                    "text":"text2"
                },{
                    "id":3,
                    "text":"text3",
                    "selected":true
                },{
                    "id":4,
                    "text":"text4"
                },{
                    "id":5,
                    "text":"text5"
                }],
                onChange:function(newValue,oldValue){
                    self.$emit('update:model', newValue);

                }

            });


        },
        beforeDestroy:function () {
            $(this.$el).combobox('destroy');
        },
        watch:{
            name:function(newVal){
                this.$emit('update:model', newVal);
                this.model = newVal;
            }
        },
        data: function () {
            return {
                name:'mark'
            }
        }
    }
</script>

<style scoped>

</style>