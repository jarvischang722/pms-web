<template>
    <div>
         {{name}}
    </div>
</template>

<script>
    export default {
        name: "bac-select-grid",
        mounted:function(){
            var self = this;
            this.name = this.model;
            $(this.$el).combogrid({
                multiple:true,
                valueField:'id',
                textField:'text',
                panelWidth:450,
                value:'006',

                idField:'code',
                textField:'name',
                url:'datagrid_data.json',
                columns:[[
                    {field:'code',title:'Code',width:60},
                    {field:'name',title:'Name',width:100},
                    {field:'addr',title:'Address',width:120},
                    {field:'col4',title:'Col41',width:100}
                ]],
                data:[{
                    "code":1,
                    "name":"text1"
                },{
                    "code":2,
                    "name":"text2"
                },{
                    "code":3,
                    "name":"text3",
                    "selected":true
                },{
                    "code":4,
                    "name":"text4"
                },{
                    "code":5,
                    "name":"text5"
                }],
                onChange:function(newValue,oldValue){
                    // self.$emit('update:model', newValue);

                }

            });


        },
        beforeDestroy:function () {
            $(this.$el).combobox('destroy');
        },
        data: function () {
            return {
                name:'Jun22222!!'
            }
        }
    }
</script>

<style scoped>

</style>