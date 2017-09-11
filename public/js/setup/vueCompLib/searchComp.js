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
            this.fetchData();
        }
    }
});
