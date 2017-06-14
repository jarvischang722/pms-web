/**
 * Created by a16010 on 2017/6/12.
 * 程式編號: PMS0810070
 * 程式名稱: 假日日期設定檔
 */

waitingDialog.hide();
var gs_prg_id = gs_prg_id;
var go_holidayKind;
var go_holidayDate;

$(function () {
    getHolidaySet();
    getHolidayDateSet();
    getHolidayKindSet();
    initCalendar();
    bindEvent();
});

function getHolidaySet() {
    axios.all([getHolidayKindSet(), getHolidayDateSet()])
        .then(axios.spread(function (kindSetResult, dateSetResult) {
            go_holidayKind = kindSetResult.data.dateKindSetData;
            go_holidayDate = dateSetResult.data.dateSetData;
            create_dateKind_select_option();
        }))
        .catch(function (error) {
            console.log(error);
        })

}

function getHolidayKindSet() {
    axios.post("/api/getHolidayKindSet");
}

function getHolidayDateSet() {
    axios.post("/api/getHolidayDateSet");
}

// 產生日期別下拉選單
function create_dateKind_select_option() {
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
        clickDay: calendarClickDay
    });
    // 選擇日期區間 or change it into a date range picker
    $('.input-daterange').datepicker({autoclose: true});

}

// 日曆日期點擊事件
var gs_dataSource = [];
function calendarClickDay(e) {
    var lo_clickDate = e.element;
    var ls_select_color = $("#color_scheme option:selected").val();
    var ls_clickDate_color = rgb2hex($(lo_clickDate).css('box-shadow').replace(/^.*(rgb?\([^)]+\)).*$/, '$1')).toUpperCase();
    var ls_clickDateStr = e.date.toLocaleDateString();

    // 顏色不一樣直接設定
    if (ls_select_color != ls_clickDate_color) {
        ls_select_color = ls_select_color + " 0px -4px 0px 0px inset";
        $(lo_clickDate).css('box-shadow', ls_select_color);

        var gs_dataSource_index = _.findIndex(gs_dataSource, function (dataSource) {
            return dataSource.startDate.format("YYYY-MM-DD") == moment(ls_clickDateStr).format("YYYY-MM-DD");
        });

        if (gs_dataSource_index != -1) {
            gs_dataSource[gs_dataSource_index].color = $("#color_scheme option:selected").val();
        }
        else {
            gs_dataSource.push({
                id: $("#color_scheme option:selected").data("day_sta"),
                startDate: moment(ls_clickDateStr),
                endDate: moment(ls_clickDateStr),
                color: $("#color_scheme option:selected").val()
            });
        }
    }
    // 顏色一樣，重複選取，就取消
    else {
        $(lo_clickDate).css('box-shadow', "");
        var lo_dateSource = _.find(gs_dataSource, function (dataSource) {
            return dataSource.startDate.format("YYYY-MM-DD") == moment(ls_clickDateStr).format("YYYY-MM-DD");
        });
        lo_dateSource.color = "#fff";
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
            gs_dataSource.push({
                id: $("#color_scheme option:selected").data("day_sta"),
                startDate: new Date(date.year(), date.month(), date.date()),
                endDate: new Date(date.year(), date.month(), date.date()),
                color: $("#color_scheme option:selected").val()
            });
        });
        setCalendarDataSource();
    })
}

// 綁定儲存事件
function bindBTN_SaveEvent() {
    $("#BTN_Save").click(function () {
        setCalendarDataSource();
        save_into_oracle();
    })
}

// 設定日期顏色
function setCalendarDataSource() {
    var la_dataSource = [];
    var ls_original_dataSource = $(".calendar-list").data("calendarYear").getDataSource();
    if (!_.isUndefined(ls_original_dataSource)) {
        la_dataSource = _.union(ls_original_dataSource, gs_dataSource);
    }
    else {
        la_dataSource = gs_dataSource;
    }

    $(".calendar-list").data("calendarYear").setDataSource(la_dataSource);
    gs_dataSource = la_dataSource;
}

function save_into_oracle_holiday_rf() {

    var fieldData = [
        {ui_field_name: 'batch_dat', keyable: 'Y'},
        {ui_field_name: 'athena_id', keyable: 'Y'},
        {ui_field_name: 'hotel_cod', keyable: 'Y'}
    ]

    var tmpCUD = {
        createData: [],
        updateData: [],
        deleteData: []
    };

    _.each(gs_dataSource, function (dataSource) {
        tmpCUD.updateData.push({
            "DAY_STA": dataSource.id
        })
    })

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
            } else {
                alert(response.data.errorMsg);
            }
        })
        .catch(function (error) {
            waitingDialog.hide();
            console.log(error);
        });
}

//Function to convert rgb color to hex format
function rgb2hex(rgb) {
    try {
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
    catch (err) {

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
