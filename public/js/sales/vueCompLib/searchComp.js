/**
 * Created by a16010 on 2017/9/11.
 */
var go_searchComp = Vue.extend({
    template: "#searchTmp",
    props: ["searchFields", "searchCond", "fetchData"],
    data: function () {
        return {
            searchFieldsByRow: []
        };
    },
    watch: {
        searchFields: function (newFields) {
            this.searchFieldsByRow = _.values(_.groupBy(_.sortBy(newFields, "row_seq"), "row_seq"));
        }
    },
    methods: {
        doSearch: function () {
            this.$parent.searchCond = this.searchCond;
            this.fetchData();
        },
        chkClickPopUpGrid: function (field) {
            if (field.ui_type == "popupgrid") {
                var params = {
                    prg_id: "PMS0620050",
                    fields: field
                };

                $.post("/api/popUpGridData", params, function (result) {
                    if (result != null) {
                        console.log(result);
                        // vm.selectPopUpGridData = result.showDataGrid;
                        // vmHub.$emit('showPopUpDataGrid', result);
                        // vm.showPopUpGridDialog();
                    }
                });
            }
        }
    }
});

