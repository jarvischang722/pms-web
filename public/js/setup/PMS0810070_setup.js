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

// 初始化
function initCalendar() {

    // 日期列表
    $('.calendar-list').calendarYear({
        style: 'Border',
        clickDay: clickDay,
        yearChanged: function (e) {
            gs_calendar_year = e.currentYear;

            //預設為當天日期
            if(gs_calendar_year == moment().year()){    //如果是今年, 日期區間預設今日到12/31
                $("input[name='start']").datepicker("setDate", moment().format("YYYY/MM/DD"));
                $("input[name='end']").datepicker("setDate", gs_calendar_year + "/12/31");
            }
            else{

                $("input[name='start']").datepicker("setDate", gs_calendar_year + "/01/01");
                $("input[name='end']").datepicker("setDate", gs_calendar_year + "/12/31");
            }

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
        var ls_clickDateStr = moment(e.date.toLocaleDateString('en-US'), "MM/DD/YYYY").toDate();
        var la_dateDT = [];

        // 顏色不一樣直接設定
        if (ls_select_color != ls_clickDate_color) {
            ls_select_color = ls_select_color + " 0px -4px 0px 0px inset";
            $(lo_clickDate).css('box-shadow', ls_select_color);

            // chkDataSourceAndEdit(ls_clickDateStr);

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
            lo_dateSource.color = "#FFFFFF";
            lo_dateSource.id = "N";

            la_dateDT.push({
                date: ls_clickDateStr,
                day_sta: "N"
            });

        }
        insertTmpCUD(la_dateDT);

    }
}

// 日期區間選擇
function initDatePicker() {
    getHolidayDateSet();
}

// 取假日種類設定
function getHolidayKindSet() {
    $.post("/api/getHolidayKindSet")
        .then(function (kindSetResult) {
            go_holidayKind = kindSetResult.dateKindSetData;
            createDateKindSelectOption();
        })
        .fail(function (error) {
            console.log(error);
            waitingDialog.hide();
        });
}

// 取假日日期設定
function getHolidayDateSet() {

    var params = {
        year: gs_calendar_year
    };
    $.post("/api/getHolidayDateSet", params)
        .done(function (getResult) {
            go_holidayDate = getResult.dateSetData;
            initDataSource();
            setCalendarDataSource();
            changeYearSetColor();

            waitingDialog.hide();
        })
        .fail(function (err) {
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
        var dateIsExist = _.find(go_holidayDate, function (holidayDate) {
            return moment(holidayDate.batch_dat).format("YYYY/MM/DD") == moment(tmpDate.date).format("YYYY/MM/DD");
        });

        var dataType = _.isUndefined(dateIsExist) ? "createData" : "updateData";

        var chkIndex = _.findIndex(ga_tmpCUD[dataType], function (cudDate) {
            return moment(cudDate.batch_dat).format("YYYY/MM/DD") == moment(tmpDate.date).format("YYYY/MM/DD");
        });

        if (chkIndex != -1)
            {ga_tmpCUD[dataType][chkIndex].day_sta = tmpDate.day_sta;}
        else {
            ga_tmpCUD[dataType].push({
                "day_sta": tmpDate.day_sta,
                "batch_dat": moment(tmpDate.date).format("YYYY/MM/DD")
            });
        }
    });

}

// 設定日期顏色
function setCalendarDataSource() {
    $(".calendar-list").data("calendarYear").setDataSource(ga_dataSource);
}

function changeYearSetColor(){
    _.each(ga_tmpCUD, function(obj, key){
        if(key == "createData" || key == "updateData"){
            _.each(obj, function(value){
                chkDataSourceAndEdit(value.batch_dat);
            });
        }
    });
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
        var ls_date = $(this).attr("id");
        var ls_start_date;
        var ls_end_date;
        var ls_rtnDate = [];
        var day_counter = 0;

        if (ls_date == "All") {
            ls_start_date = $("input[name='start']").val();
            ls_end_date = $("input[name='end']").val();

            var li_diffDay = moment(ls_end_date).diff(moment(ls_start_date), "days") + 1;
            waitingDialog.show("Loading...");

            setTimeout(function(){
                while (day_counter != li_diffDay) {
                    var nowDay = moment(ls_start_date).add("days", day_counter);
                    chkDataSourceAndEdit(nowDay);
                    ls_rtnDate.push({
                        date: nowDay.format("YYYY/MM/DD"),
                        day_sta: $("#color_scheme option:selected").data("day_sta").toString(),
                        color: $("#color_scheme option:selected").val()
                    });
                    day_counter++;
                }
                waitingDialog.hide();
                insertTmpCUD(ls_rtnDate);
            }, 1000);
        }
        else {
            ls_start_date = $("input[name='start']").val();
            ls_end_date = $("input[name='end']").val();
            ls_rtnDate = getDaysBetweenDates(ls_start_date, ls_end_date, ls_date);
            _.each(ls_rtnDate, function (eachDate) {
                chkDataSourceAndEdit(eachDate.date);
            });
            insertTmpCUD(ls_rtnDate);
        }
    });
}

// 檢查dataSource
function chkDataSourceAndEdit(ls_date) {
    var yearStr = moment(ls_date).format("YYYY");

    if(yearStr == gs_calendar_year) {
        var monStr = moment(ls_date).format("MMMM");
        var dayStr = moment(ls_date).format("D");
        var ls_select_color = $("#color_scheme option:selected").val();
        var selCSS = ls_select_color + " 0px -4px 0px 0px inset";
        var monthTable = $("table.month th:contains('" + monStr + "')").closest("table");
        var selDayTd = $("div.day-content", monthTable).filter(function () {
            return $(this).text() === dayStr;
        }).closest("td");

        //設定顏色
        selDayTd.css('box-shadow', selCSS);
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

    insertDefalutValueTmpCUD();

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

    waitingDialog.show('Saving...');
    $.post("/api/execSQLProcess", params)
        .done(function (response) {
            waitingDialog.hide();
            if (response.success) {
                alert('save success!');
                initTmpCUD();
                getHolidayDateSet();
            } else {
                alert(response.errorMsg);
            }
        })
        .fail(function (error) {
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
                day_sta: $("#color_scheme option:selected").data("day_sta").toString(),
                color: $("#color_scheme option:selected").val()
            });
        }
        li_days_counter++;
    }
    return result;

}

// 第一次新增一整年的資料到holiday_rf
function insertDefalutValueTmpCUD() {

    if(go_holidayDate.length >= 365) {return;}

    var lo_start_date = moment([gs_calendar_year, 0, 1]);
    var lo_end_date = moment([gs_calendar_year, 11, 31]);
    var lo_days = lo_end_date.diff(lo_start_date, 'days');
    lo_days = lo_days + 1;

    for(var i = 0; i < lo_days; i++){

        var lo_day = moment(gs_calendar_year +"/01/01").add(i, 'day').format("YYYY/MM/DD");

        var dateIsExist = false;

        for(var j = 0; j < ga_tmpCUD["createData"].length; j++){
            if(lo_day == ga_tmpCUD["createData"][j].batch_dat){
                dateIsExist = true;
                break;
            }
        }

        if(!dateIsExist){
            for(var j = 0; j < go_holidayDate.length; j++){
                if(lo_day == moment(go_holidayDate[j].batch_dat).format("YYYY/MM/DD")){
                    dateIsExist = true;
                    break;
                }
            }
        }

        if(!dateIsExist) {
            var la_dateDT ={
                "day_sta": "N",
                "batch_dat": lo_day
            };
            ga_tmpCUD["createData"].push(la_dateDT);
        }
    }
}
