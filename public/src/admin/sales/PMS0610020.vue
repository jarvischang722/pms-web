<template></template>

<script>
    export default {
        name: 'pms0610020',
        props: ["rowData", "isCreateStatus", "isEditStatus", "isModifiable"],
        mounted() {
            this.isLoadingDialog = true;
            this.loadingText = "Loading...";
        }
    }
</script>