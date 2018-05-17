new Vue({
    el: "#report-app",
    data: {
        searchFields: [],
        searchCond: {},
        searchsCondOperator: {},
        pdfUrl: "",
        loading: false,
        usingPrgID: getCookie("usingPrgID")
    },
    mounted() {
        this.doSearchFields();
    },
    methods: {
        doSearchFields() {
            $.post("/api/fetchOnlySearchFieldsData", {prg_id: this.usingPrgID}, (result) => {
                if (result.success) {
                    this.searchFields = result.searchFieldsData;
                }
            });
        },
        convertFieldCond: function () {
            let lao_fields = [];
            let self = this;
            try {
                _.each(this.searchCond, function (val, fieldName) {
                    let lo_field = _.findWhere(self.searchFields, {ui_field_name: fieldName}) || {};
                    if (val != "" && val != undefined) {
                        if (lo_field.ui_type == "daterange") {
                            val = _.map(val, (d) => {
                                return moment(d).format("YYYY/MM/DD");
                            });
                        }
                        lao_fields.push({
                            "field": fieldName,
                            "operator": self.searchsCondOperator[fieldName] || "",
                            "values": lo_field.ui_type == "mutilselect" || lo_field.ui_type == "daterange" ? val : [val]
                        });
                    }
                });
                return lao_fields;
            } catch (e) {
                console.log(e);
            }

        },
        doGenReport: function () {
            let self = this;
            self.loading = true;
            $.post("/api/doGenReport", {prg_id: this.usingPrgID, conditions: this.convertFieldCond()}, (res) => {
                self.loading = false;
                if (res.success) {
                    self.pdfUrl = res.reportPdfUrl;
                } else {
                    alert(res.errorMsg);
                }
            });
        }
    }
});