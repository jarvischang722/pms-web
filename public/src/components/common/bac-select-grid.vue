<template>
    <div>
         {{name}}
    </div>
</template>

<script>
    export default {
        name: "bac-select-grid",
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