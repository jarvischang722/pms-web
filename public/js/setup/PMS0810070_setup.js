/**
 * Created by a16010 on 2017/6/12.
 * 程式編號: PMS0810070
 * 程式名稱: 假日日期設定檔
 */

waitingDialog.hide();
var gs_prg_id = gs_prg_id;
var go_holidayKind;

$(function () {
    getHolidayDateSet();
    initCalendar();
    bindEvent();
});

function getHolidayDateSet() {
    axios.post("/api/getHolidayDateSet")
        .then(function (getResult) {
            go_holidayKind = getResult.data.dateSetData;
            create_dateKind_select_option();
        })
        .catch(function (err) {
            console.log(err);
            waitingDialog.hide();
        })
}

// 產生日期別下拉選單
function create_dateKind_select_option() {
    $("#color_scheme").html("");

    _.each(go_holidayKind, function (eachOption, index) {
        var ls_hexColor = colorTool.colorCodToHex(eachOption.color_num);
        $("#color_scheme").append($("<option></option>").attr("value", "#" + ls_hexColor).text(eachOption.day_nam));
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
        clickDay: calendarClickDay
    });
    // 選擇日期區間 or change it into a date range picker
    $('.input-daterange').datepicker({autoclose: true});

    // console.log($('.calendar-list').data("calendarYear").getLanguage());
    $('.calendar-list').data("calendarYear").setLanguage('ja');
}

// 日曆日期點擊事件
function calendarClickDay(e) {
    var lo_clickDay = e.element;
    var ls_select_color = $("#color_scheme option:selected").val();
    var ls_clickDate_color = rgb2hex($(lo_clickDay).css("background-color")).toUpperCase();
    var ls_clickDate = e.date.toLocaleDateString();

    // console.log(moment(e.date.toLocaleDateString()).format('e'));
    // 顏色不一樣直接設定
    if (ls_select_color != ls_clickDate_color) {
        ls_select_color = ls_select_color + " 0px -4px 0px 0px inset";
        $(lo_clickDay).css('box-shadow', ls_select_color);
    }
    // 顏色一樣，重複選取，就取消
    else {
        $(lo_clickDay).css("background-color", "#fff");
    }
}


// 綁定事件
function bindEvent() {
    bindSelectChangeEvent();
    bindDateClickEvent();
}

// 綁定下拉選單change事件
function bindSelectChangeEvent() {
    $('#color_scheme').change(function () {
        $('div.datePin01').css("background", $(this).find("option:selected").val());
    });
}

function bindDateClickEvent() {
    $(".choiceDay").click(function () {
        var ls_date = $(this).text().trim();
        var ls_start_date = $("input[name='start']").val();
        var ls_end_date = $("input[name='end']").val();
        var ls_rtnDate = getDaysBetweenDates(ls_start_date, ls_end_date, ls_date);
        var la_dataSource = [];

        _.each(ls_rtnDate, function (date) {
            la_dataSource.push({
                startDate: new Date(date.year(), date.month(), date.date()),
                endDate: new Date(date.year(), date.month(), date.date()),
                color: $("#color_scheme option:selected").val()
            });
        })

        $(".calendar-list").data("calendarYear").setDataSource(la_dataSource);
    })
}

//Function to convert rgb color to hex format
function rgb2hex(rgb) {
    if (rgb.search("rgb") == -1) {
        return rgb;
    } else {
        rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }

        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }
}

function getDaysBetweenDates(start, end, dayName) {

    var days = {sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6};
    var start = moment(start);
    var end = moment(end);
    var day = days[dayName.toLowerCase().substr(0, 3)];

    var result = [];
    var current = start.clone();

    while (current.day(7 + day).isBefore(end)) {
        result.push(current.clone());
    }

    return result;

}
