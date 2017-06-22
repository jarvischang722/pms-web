/**
 * Created by a16010 on 2017/6/12.
 * 程式編號: PMS0810070
 * 程式名稱: 假日日期設定檔
 */
"use strict";

var go_holidayKind;
var go_holidayDate;
var ga_dataSource = [];
var gs_calendar_year;


$(function () {
    initCalendar();
    getHolidayKindSet();
    bindEvent();
});

// 取假日種類設定
function getHolidayKindSet() {
    axios.post("/api/getHolidayKindSet")
        .then(function (kindSetResult) {
            go_holidayKind = kindSetResult.data.dateKindSetData;
            createDateKindSelectOption();
        })
        .catch(function (error) {
            console.log(error);
            waitingDialog.hide();
        })
}

// 單獨取日期設定
function getOnlyHolidayDate() {

    var params = {
        year: gs_calendar_year
    };
    var start = new Date().getTime();
    axios.post("/api/getHolidayDateSet", params)
        .then(function (getResult) {
            go_holidayDate = getResult.data.dateSetData;
            genCalendarDataSource();
            setCalendarDataSource();

            waitingDialog.hide();
        })
        .catch(function (err) {
            console.log(err);
            waitingDialog.hide();
        })
}

// 產生日曆顯示資料(dataSource)
function genCalendarDataSource() {
    _.each(go_holidayDate, function (eachDate) {

        var findDate = _.find(ga_dataSource, function (dataSource) {
            if (moment(eachDate.batch_dat).format("YYYY/MM/DD") == moment(dataSource.startDate).format("YYYY/MM/DD")) {
                return dataSource;
            }
        });

        if (_.isUndefined(findDate)) {
            ga_dataSource.push({
                id: eachDate.day_sta,
                startDate: moment(eachDate.batch_dat).toDate(),
                endDate: moment(eachDate.batch_dat).toDate(),
                color: "#" + colorTool.colorCodToHex(eachDate.color_num)
            });
        }
    })

}

// 產生日期別下拉選單
function createDateKindSelectOption() {
    $("#color_scheme").html("");

    _.each(go_holidayKind, function (eachOption, index) {
        var ls_hexColor = colorTool.colorCodToHex(eachOption.color_num);
        $("#color_scheme").append($("<option></option>").attr("value", "#" + ls_hexColor).attr("data-day_sta", eachOption.day_sta).text(eachOption.day_nam));
        if (index == 0) {
            $("#color_scheme option").attr("selected", true);
        }
    });

    var ls_color = $("#color_scheme option:selected").val();
    $('div.datePin01').css("background", ls_color);
}

// 初始化日曆
function initCalendar() {

    // 日期列表
    $('.calendar-list').calendarYear({
        style: 'Border',
        clickDay: clickDay,
        yearChanged: function (e) {
            gs_calendar_year = e.currentYear;
            getOnlyHolidayDate();
        }
    });
    // 選擇日期區間 or change it into a date range picker
    $('.input-daterange').datepicker({
        autoclose: true
    });

    // 日曆日期點擊事件
    function clickDay(e) {
        var lo_clickDate = e.element;
        var ls_select_color = $("#color_scheme option:selected").val();
        var rgb = splitRgb($(lo_clickDate).css('box-shadow').replace(/^.*(rgb?\([^)]+\)).*$/, '$1')).toUpperCase();
        var ls_clickDate_color = "#" + colorTool.rgbToHex(rgb[1], rgb[2], rgb[3]);
        var ls_clickDateStr = e.date.toLocaleDateString();

        // 顏色不一樣直接設定
        if (ls_select_color != ls_clickDate_color) {
            ls_select_color = ls_select_color + " 0px -4px 0px 0px inset";
            $(lo_clickDate).css('box-shadow', ls_select_color);

            var ga_dataSource_index = _.findIndex(ga_dataSource, function (dataSource) {
                return moment(dataSource.startDate).format("YYYY/MM/DD") == moment(ls_clickDateStr).format("YYYY/MM/DD");
            });

            if (ga_dataSource_index != -1) {
                ga_dataSource[ga_dataSource_index].color = $("#color_scheme option:selected").val();
                ga_dataSource[ga_dataSource_index].id = $("#color_scheme option:selected").data("day_sta");
            }
            else {
                ga_dataSource.push({
                    id: $("#color_scheme option:selected").data("day_sta"),
                    startDate: moment(ls_clickDateStr).toDate(),
                    endDate: moment(ls_clickDateStr).toDate(),
                    color: $("#color_scheme option:selected").val()
                });
            }
        }
        // 顏色一樣，重複選取，就取消
        else {
            $(lo_clickDate).css('box-shadow', "");
            var lo_dateSource = _.find(ga_dataSource, function (dataSource) {
                return moment(dataSource.startDate).format("YYYY/MM/DD") == moment(ls_clickDateStr).format("YYYY/MM/DD");
            });
            lo_dateSource.color = "#fff";
            lo_dateSource.id = "N";
        }
    }
}

// 綁定事件
function bindEvent() {
    bindSelectChangeEvent();
    bindDayClickEvent();
    bindBTN_SaveEvent();
}

// 綁定下拉選單change事件
function bindSelectChangeEvent() {
    $('#color_scheme').change(function () {
        $('div.datePin01').css("background", $(this).find("option:selected").val());
    });
}

// 綁定日期(星期幾)事件 並更新
function bindDayClickEvent() {
    $(".choiceDay").click(function () {
        var ls_date = $(this).text().trim();
        var ls_start_date = $("input[name='start']").val();
        var ls_end_date = $("input[name='end']").val();
        var ls_rtnDate = getDaysBetweenDates(ls_start_date, ls_end_date, ls_date);

        _.each(ls_rtnDate, function (date) {

            var isExist = _.findIndex(ga_dataSource, function (dataSource) {
                return moment(dataSource.startDate).format("YYYY/MM/DD") == date.format("YYYY/MM/DD");
            })

            if (isExist == -1) {
                ga_dataSource.push({
                    id: $("#color_scheme option:selected").data("day_sta"),
                    startDate: date.toDate(),
                    endDate: date.toDate(),
                    color: $("#color_scheme option:selected").val()
                });
            }
            else {

                if (ga_dataSource[isExist].color == "#fff") {
                    ga_dataSource[isExist].id = $("#color_scheme option:selected").data("day_sta");
                    ga_dataSource[isExist].color = $("#color_scheme option:selected").val();
                }
                else {
                    ga_dataSource[isExist].id = "N";
                    ga_dataSource[isExist].color = "#fff";
                }

            }

        });
        setCalendarDataSource();
    })
}

// 綁定儲存事件
function bindBTN_SaveEvent() {
    $("#BTN_Save").click(function () {
        setCalendarDataSource();
        saveIntoOracleHolidayRf();
    })
}

// 設定日期顏色
function setCalendarDataSource() {
    var la_dataSource = [];
    var ls_original_dataSource = $(".calendar-list").data("calendarYear").getDataSource();
    if (!_.isUndefined(ls_original_dataSource)) {
        la_dataSource = _.union(ls_original_dataSource, ga_dataSource);
    }
    else {
        la_dataSource = ga_dataSource;
    }
    $(".calendar-list").data("calendarYear").setDataSource(la_dataSource);
    ga_dataSource = la_dataSource;
}

// 儲存進oracle holiday_rf
function saveIntoOracleHolidayRf() {

    var tmpCUD = {
        createData: [],
        updateData: [],
        deleteData: []
    };

    var fieldData = [
        {ui_field_name: 'batch_dat', keyable: 'Y'},
        {ui_field_name: 'athena_id', keyable: 'Y'},
        {ui_field_name: 'hotel_cod', keyable: 'Y'}
    ]

    _.each(ga_dataSource, function (dataSource) {
        var ls_isDateExist = _.find(go_holidayDate, function (eachDate) {
            if (moment(eachDate.batch_dat).format("YYYY/MM/DD") == moment(dataSource.startDate).format("YYYY/MM/DD")) {
                return dataSource;
            }
        });
        // 只存當年度設定資料
        if (moment(dataSource.startDate).format("YYYY") == gs_calendar_year) {
            if (_.isUndefined(ls_isDateExist)) {
                tmpCUD.createData.push({
                    "day_sta": dataSource.id,
                    "batch_dat": moment(dataSource.startDate).format("YYYY/MM/DD")
                });
            }
            else {
                tmpCUD.updateData.push({
                    "day_sta": dataSource.id,
                    "batch_dat": moment(dataSource.startDate).format("YYYY/MM/DD")
                });
            }
        }
    });

    var params = {
        prg_id: gs_prg_id,
        tmpCUD: tmpCUD,
        fieldData: fieldData,
        mainTableName: "holiday_rf"
    };
    waitingDialog.show('Saving...');
    axios.post("/api/execSQLProcess", params)
        .then(function (response) {
            waitingDialog.hide();
            if (response.data.success) {
                alert('save success!');
                getOnlyHolidayDate();
            } else {
                alert(response.data.errorMsg);
            }
        })
        .catch(function (error) {
            waitingDialog.hide();
            console.log(error);
        });
}

// splitRgb
function splitRgb(rgb) {
    try {
        if (rgb.search("rgb") == -1) {
            return rgb;
        } else {
            rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
            // return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
            return rgb;
        }
    }
    catch (err) {

    }
}

// 取日期區間的星期
function getDaysBetweenDates(start, end, dayName) {

    var li_days_counter = 0;
    var days = {sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6};
    var start = moment(start);
    var end = moment(end);
    var day = days[dayName.toLowerCase().substr(0, 3)];

    var result = [];

    var li_diffDay = end.diff(start, "days") + 1;

    while (li_days_counter != li_diffDay) {
        var lo_date = start.clone().add("days", li_days_counter);
        var li_day = lo_date.format("d");
        if (li_day == day)
            result.push(lo_date);
        li_days_counter++;
    }
    return result;

}
