/**
 * Created by a16010 on 2017/6/12.
 */

waitingDialog.hide();
var gs_prg_id = gs_prg_id;
var go_holidayKind;

$(function () {

    getHolidayDateSet();

    var currentYear = moment().year();

    var ls_color = $("#color_scheme option:selected").val();
    $('div.datePin01').css("background", ls_color);

    // 日期列表
    $('.calendar-list').calendarYear({
        style: 'background',
        dataSource: [
            {
                startDate: new Date(currentYear, 1, 4),
                endDate: new Date(currentYear, 1, 15)
            },
            {
                startDate: new Date(currentYear, 3, 5),
                endDate: new Date(currentYear, 5, 15)
            }
        ],
        clickDay: function (e) {
            // console.log(e);
            // console.log(e.date.toLocaleDateString());
            $(e.element).css('background-color', 'red');
        }
    });
    // 選擇日期區間 or change it into a date range picker
    $('.input-daterange').datepicker({autoclose: true});
    // 選擇顏色
    // $("#preferredHex3").spectrum({
    //     preferredFormat: "hex3",
    //     showInput: true,
    //     showPalette: true,
    //     palette: [["red", "rgba(0, 255, 0, .5)", "rgb(0, 0, 255)"]]
    // });
    // 平日假日旺日選擇
    // var selectedScheme = 'datePin01';

    $('#color_scheme').change(function () {
        $('div.datePin01').css("background", $(this).find("option:selected").val());
        selectedScheme = $(this).val();
    });

    var la_dataSource = [
        {
            startDate: new Date(2017, 1, 7),
            endDate: new Date(2017, 1, 11),
            color: 'pink'
        },
        {
            startDate: new Date(2017, 9, 4),
            endDate: new Date(2017, 9, 15),
            color: 'yellow'
        },
        {
            startDate: new Date(2017, 10, 5),
            endDate: new Date(2017, 10, 15),
            color: '#48A38C'
        }
    ];
    $(".calendar-list").data("calendarYear").setDataSource(la_dataSource);
    console.log($(".calendar-list").data("calendarYear").getDataSource());


});

function getHolidayDateSet() {
    axios.post("/api/getHolidayDateSet")
        .then(function (getResult) {
            go_holidayKind = getResult.data.dateSetData;
            init_dateKind_select();
        })
        .catch(function (err) {
            console.log(err);
            waitingDialog.hide();
        })
}

function init_dateKind_select(){
    $("#color_scheme").html("");

    _.each(go_holidayKind, function(eachOption){
        var ls_hexColor = colorTool.colorCodToHex(eachOption.color_num);
        $("#color_scheme").append($("<option></option>").attr("value", "#"+ls_hexColor).text(eachOption.day_nam));
    });

}
