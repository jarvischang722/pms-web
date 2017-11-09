var RS00202010VM = new Vue({
    el: "#RS00202010Main",
    data: {
        defaultDate: new Date(),
        searchDate: ""
    },
    mounted: function () {
        //啟用fixTable
        $("#gs-fixTable").tableHeadFixer({"left" : 1});
        $("table.treeControl").agikiTreeTable({persist: true, persistStoreName: "files"});
    }
});

// 啟用tree
