var vmHub = new Vue;

var singlePage = Vue.extend({
    template: "#RS00202010Tmp",
    data: function () {
        return {
            startTime: "",
            endTime: ""
        };
    },
    created: function () {
        var self = this;
        vmHub.$on("showReserve", function (bquet_nos) {
            self.showReserve(bquet_nos);
        });
    },
    mounted: function () {

    },
    methods: {
        showReserve: function (bquet_nos) {
            var dialog = $("#gs-order-page").removeClass('hide').dialog({
                modal: true,
                title: "查詢訂席",
                title_html: true,
                width: 1000,
                height: 700,
                maxwidth: 1920,
                dialogClass: "test",
                resizable: true
            });
        }
    }
});

var RS00202010VM = new Vue({
    el: "#RS00202010Main",
    components: {
        singlePage
    },
    data: {
        searchDate: new Date(),
        pageOneData: {}
    },
    mounted: function () {
        //啟用fixTable
        $("#gs-fixTable").tableHeadFixer({"left": 1});
        $("table.treeControl").agikiTreeTable({persist: true, persistStoreName: "files"});
        this.qryPageOneData();
    },
    methods: {
        doSearch: function () {
            this.qryPageOneData();
        },
        qryPageOneData: function () {
            var self = this;
            var lo_params = {use_dat: this.searchDate};
            $.post("/reserveBanquet/qryPageOneData", lo_params, function (result) {
                if (result.success) {
                    self.pageOneData = result.pageOneData;
                }
            });
        },
        addReserve: function () {
            vmHub.$emit("showReserve", {bquet_nos: ""});
        },

        showReserve: function (bquet_nos) {
            vmHub.$emit("showReserve", {bquet_nos: bquet_nos});
        },

        initToday: function () {
            this.searchDate = new Date();
        }
    }
});