/**
 * Created by a16010 on 2017/9/11.
 */
var go_searchComp = Vue.extend({
    template: "#searchTmp",
    props: ["searchFields", "searchCond", "fetchData"],
    data: function () {
        return {
            searchFieldsByRow: [],
            isShowMoreSearchFields: true
        };
    },
    watch: {
        searchFields: function (newFields) {
            this.searchFieldsByRow = _.values(_.groupBy(_.sortBy(newFields, "row_seq"), "row_seq"));
            if (this.searchFieldsByRow.length == 1) {
                this.isShowMoreSearchFields = false;
            }
        }
    },
    methods: {
        doSearch: function () {
            this.$parent.searchCond = this.searchCond;
            this.fetchData();
        },
        doClear: function () {
            var self = this;
            _.each(this.searchCond, function (val, key) {

                if (_.isArray(val)) {
                    self.searchCond[key] = [];
                }
                else if(_.isObject(val)){
                    self.searchCond[key] = {};
                }
                else{
                    self.searchCond[key] = "";
                }
            });
            this.$parent.searchCond = this.searchCond;
        }
    }
});
