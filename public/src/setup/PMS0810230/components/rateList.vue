<template>
    <div id="rateListDialog" class="hide padding-5" style="top: 0 !important;">
        <!--全頁日曆-->
        <div class="rateList"></div>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        name: 'rateList',
        props: ['rowData'],
        mounted() {
        },
        data() {
            return {
                calendarYear: {},
                dataSource: [],
                rentDatData: []
            }
        },
        watch: {
            rowData(val) {
                if (!_.isEmpty(val)) {
                    this.initCalendar();
                    this.fetchData();
                }
            }
        },
        methods: {
            initCalendar() {
                let self = this;
                $('.rateList').calendarYear({
                    style: 'Border',
                    yearChanged: function (e) {
                        self.calendarYear = e.currentYear;
                        self.fetchData();
                    }
                });
            },
            fetchData() {
                let lo_params = {
                    rate_cod: this.rowData.rate_cod,
                    year: this.calendarYear,
                    rule_func_name: 'query_rate_list'
                }
                BacUtils.doHttpPostAgent("/api/queryDataByRule", lo_params, result => {
                    if (result.success) {
                        this.rentDatData = result.effectValues;
                        this.initDataSource();
                    }
                    else {
                        alert(result.errorMsg);
                    }
                })
            },
            initDataSource() {
                _.each(this.rentDatData, (lo_rentDatData) => {
                    this.dataSource.push({
                        startDate: moment(lo_rentDatData.rent_dat).toDate(),
                        endDate: moment(lo_rentDatData.rent_dat).toDate(),
                        color: "#2c8fc9"
                    });
                });
                $(".rateList").data("calendarYear").setDataSource(this.dataSource);
            }
        }
    }
</script>