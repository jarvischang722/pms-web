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
var ga_tmpCUD = [];


$(function () {
    initTmpCUD();
    initCalendar();
    initDatePicker();
    getHolidayKindSet();
    bindEvent();
});

// 初始化日曆
function initCalendar() {

    // 日期列表
    $('.calendar-list').calendarYear({
        style: 'Border',
        clickDay: clickDay,
        yearChanged: function (e) {
            gs_calendar_year = e.currentYear;
            getHolidayDateSet();
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
        var rgb = splitRgb($(lo_clickDate).css('box-shadow').replace(/^.*(rgb?\([^)]+\)).*$/, '$1'));
        var ls_clickDate_color = "#" + colorTool.rgbToHex(parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3])).toUpperCase();
        var ls_clickDateStr = e.date.toLocaleDateString();
        var la_dateDT = [];

        // 顏色不一樣直接設定
        if (ls_select_color != ls_clickDate_color) {
            ls_select_color = ls_select_color + " 0px -4px 0px 0px inset";
            $(lo_clickDate).css('box-shadow', ls_select_color);

            chkDataSourceAndEdit(ls_clickDateStr);

            la_dateDT.push({
                date: ls_clickDateStr,
                day_sta: $("#color_scheme option:selected").data("day_sta")
            });
        }
        // 顏色一樣，重複選取，就取消
        else {
            $(lo_clickDate).css('box-shadow', "");
            var lo_dateSource = _.find(ga_dataSource, function (dataSource) {
                return moment(dataSource.startDate).format("YYYY/MM/DD") == moment(ls_clickDateStr).format("YYYY/MM/DD");
            });
            lo_dateSource.color = "#fff";
            lo_dateSource.id = "N";

            la_dateDT.push({
                date: ls_clickDateStr,
                day_sta: "N"
            });

        }
        insertTmpCUD(la_dateDT);

    }
}

// 日期區間選擇 預設為當天日期
function initDatePicker() {
    $("input[name='start']").val(moment().format("YYYY/MM/DD"));
    $("input[name='end']").val(moment().format("YYYY/MM/DD"));
}

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

// 取假日日期設定
function getHolidayDateSet() {

    var params = {
        year: gs_calendar_year
    };
    axios.post("/api/getHolidayDateSet", params)
        .then(function (getResult) {
            go_holidayDate = getResult.data.dateSetData;
            initDataSource();
            setCalendarDataSource();
            waitingDialog.hide();
        })
        .catch(function (err) {
            console.log(err);
            waitingDialog.hide();
        });
}

// 初始化dataSource
function initDataSource() {
    ga_dataSource = [];
    _.each(go_holidayDate, function (eachDate) {
        ga_dataSource.push({
            id: eachDate.day_sta,
            startDate: moment(eachDate.batch_dat).toDate(),
            endDate: moment(eachDate.batch_dat).toDate(),
            color: "#" + colorTool.colorCodToHex(eachDate.color_num)
        });
    });
}

// 初始化 tmpCUD
function initTmpCUD() {
    ga_tmpCUD = {
        createData: [],
        updateData: [],
        deleteData: []
    };
}

// 新增資料進tmpCUD
function insertTmpCUD(la_dateDT) {
    _.each(la_dateDT, function (tmpDate) {
        var dateIsExist = _.find(go_holidayDate, function (Date) {
            return moment(Date.batch_dat).format("YYYY/MM/DD") == moment(tmpDate.date).format("YYYY/MM/DD");
        });


        if (_.isUndefined(dateIsExist)) {

            var createIndex = _.findIndex(ga_tmpCUD.createData, function (createDT) {
                return moment(createDT.batch_dat).format("YYYY/MM/DD") == moment(tmpDate.date).format("YYYY/MM/DD");
            });

            if (createIndex != -1)
                ga_tmpCUD.createData[createIndex].day_sta = tmpDate.day_sta;
            else {
                ga_tmpCUD.createData.push({
                    "day_sta": $("#color_scheme option:selected").data("day_sta"),
                    "batch_dat": moment(tmpDate.date).format("YYYY/MM/DD")
                })
            }
        }
        else {

            var updateIndex = _.findIndex(ga_tmpCUD.updateData, function (updateDT) {
                return moment(updateDT.batch_dat).format("YYYY/MM/DD") == moment(tmpDate.date).format("YYYY/MM/DD");
            });

            if (updateIndex != -1) {
                ga_tmpCUD.updateData[updateIndex].day_sta = tmpDate.day_sta;
            }
            else {
                ga_tmpCUD.updateData.push({
                    "day_sta": tmpDate.day_sta,
                    "batch_dat": moment(tmpDate.date).format("YYYY/MM/DD")
                })
            }
        }
    });

}

// 設定日期顏色
function setCalendarDataSource() {
    $(".calendar-list").data("calendarYear").setDataSource(ga_dataSource);
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

        _.each(ls_rtnDate, function (eachDate) {
            chkDataSourceAndEdit(eachDate.date);
        });

        insertTmpCUD(ls_rtnDate);
        setCalendarDataSource();
    });
}

// 檢查dataSource
function chkDataSourceAndEdit(ls_date) {
    var isExist = _.findIndex(ga_dataSource, function (dataSource) {
        return moment(dataSource.startDate).format("YYYY/MM/DD") == moment(ls_date).format("YYYY/MM/DD");
    })

    if (isExist == -1) {
        ga_dataSource.push({
            id: $("#color_scheme option:selected").data("day_sta"),
            startDate: new Date(ls_date),
            endDate: new Date(ls_date),
            color: $("#color_scheme option:selected").val()
        });
    }
    else {
        // 設定顏色不一樣，直接更新
        if (ga_dataSource[isExist].id != $("#color_scheme option:selected").data("day_sta")) {
            ga_dataSource[isExist].id = $("#color_scheme option:selected").data("day_sta");
            ga_dataSource[isExist].color = $("#color_scheme option:selected").val();
        }
        // 設定顏色相同，等於取消
        else {
            ga_dataSource[isExist].id = "N";
            ga_dataSource[isExist].color = "#fff";
        }

    }
}

// 綁定儲存事件
function bindBTN_SaveEvent() {
    $("#BTN_Save").click(function () {
        saveIntoOracleHolidayRf();
    });
}

// 儲存進oracle holiday_rf
function saveIntoOracleHolidayRf() {

    var fieldData = [
        {ui_field_name: 'batch_dat', keyable: 'Y'},
        {ui_field_name: 'athena_id', keyable: 'Y'},
        {ui_field_name: 'hotel_cod', keyable: 'Y'}
    ];

    var params = {
        prg_id: gs_prg_id,
        tmpCUD: ga_tmpCUD,
        fieldData: fieldData,
        mainTableName: "holiday_rf"
    };

    console.log(ga_tmpCUD);
    waitingDialog.show('Saving...');
    axios.post("/api/execSQLProcess", params)
        .then(function (response) {
            waitingDialog.hide();
            if (response.data.success) {
                alert('save success!');
                initTmpCUD();
            } else {
                alert(response.data.errorMsg);
            }
        })
        .catch(function (error) {
            waitingDialog.hide();
            console.log(error);
        });
}

// 切割RGB顏色
function splitRgb(rgb) {
    try {
        if (rgb.search("rgb") == -1) {
            return rgb;
        } else {
            rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
            return rgb;
        }
    }
    catch (err) {
        return "";
    }
}

// 取日期區間的星期
function getDaysBetweenDates(ls_start, ls_end, dayName) {

    var li_days_counter = 0;
    var days = {sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6};
    var start = moment(ls_start);
    var end = moment(ls_end);
    var day = days[dayName.toLowerCase().substr(0, 3)];

    var result = [];

    var li_diffDay = end.diff(start, "days") + 1;

    while (li_days_counter != li_diffDay) {
        var lo_date = start.clone().add("days", li_days_counter);
        var li_day = lo_date.format("d");
        if (li_day == day) {
            result.push({
                date: lo_date.format("YYYY/MM/DD"),
                day_sta: $("#color_scheme option:selected").data("day_sta"),
                color: $("#color_scheme option:selected").val()
            });
        }
        li_days_counter++;
    }
    return result;

}