<template>
    <input @keyup="test()">
</template>

<script>
    export default {
        name: "bac-select-grid",
        mounted:function(){
            var self = this;
            this.name = this.model;
            $(this.$el).combogrid({
                multiple:true,
                panelWidth:450,
                value:'006',
                idField:'code',
                textField:'name',
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
                }]

            });


        },
        methods:{
            test(){
                alert(123);
            }
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