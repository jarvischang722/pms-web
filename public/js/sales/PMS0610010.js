var vm = new Vue({
    el: "#PMS0610010App",
    mounted: function(){},
    data: {
        userInfo: {},
        tmpCUD: {
            createData: [],
            updateData: [],
            deleteData: [],
            oriData: [],
            dt_createData: [],
            dt_updateData: [],
            dt_deleteData: [],
            dt_oriData: []
        },
        pageOneDataGridRows:[],
        pageOneFieldData: [],
        searchFields: [],
        searchCond: {},
        dgIns: {},
        isLoading: true,
        editingRow: {},
        isModifiable: true,
        isCreateStatus: false,
        isEditStatus: false
    },
    methods: {}
});