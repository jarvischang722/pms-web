$(function () {

//訂房第一層帶入
//     $("#manageReservation-load").load("roomTypePlan.html");
//     $(".secondMenuClick li:first-child").addClass("activeThis");

    //第一層架構
    $(document).on('click',".secondMenuClick li",function (e) {
         $(".secondMenuClick li").removeClass("activeThis");

         $(this).addClass("activeThis");
         var select=$(this).attr("value");
         $("#manageReservation-load").load(select+".html");
    });

//接待第一層帶入
    $("#manageReception-load").load("roomTypePlan.html");
    $(document).on('click',".secondMenuClick li",function (e) {
        $(".secondMenuClick li").removeClass("activeThis");

        $(this).addClass("activeThis");
        var select=$(this).attr("value");
        $("#manageReception-load").load(select+".html");
    });

//出納第一層帶入
    $("#manageCasher-load").load("floorPlan.html");
    $(document).on('click',".secondMenuClick li",function (e) {
        $(".secondMenuClick li").removeClass("activeThis");

        $(this).addClass("activeThis");
        var select=$(this).attr("value");
        $("#manageCasher-load").load(select+".html");
    });

//房務第一層帶入
    $("#manageHouseKeeping-load").load("inHouseQuery.html");
    $(document).on('click',".secondMenuClick li",function (e) {
        $(".secondMenuClick li").removeClass("activeThis");

        $(this).addClass("activeThis");
        var select=$(this).attr("value");
        $("#manageHouseKeeping-load").load(select+".html");
    });

//夜核第一層帶入
    $("#manageNight-load").load("checkInList.html");
    $(document).on('click',".secondMenuClick li",function (e) {
        $(".secondMenuClick li").removeClass("activeThis");

        $(this).addClass("activeThis");
        var select=$(this).attr("value");
        $("#manageNight-load").load(select+".html");
    });

//業務第一層帶入
    $("#manageBusiness-load").load("roomTypePlan.html");
    $(document).on('click',".secondMenuClick li",function (e) {
        $(".secondMenuClick li").removeClass("activeThis");

        $(this).addClass("activeThis");
        var select=$(this).attr("value");
        $("#manageBusiness-load").load(select+".html");
    });

//報表第一層帶入
//    $("#manageReport-load").load("#");
    $(document).on('click',".secondMenuClick li",function (e) {
        $(".secondMenuClick li").removeClass("activeThis");

        $(this).addClass("activeThis");
        var select=$(this).attr("value");
        $("#manageReport-load").load(select+".html");
    });

//設定第一層帶入
    $("#manageSetting-load").load("controlReservation.html");
    $(document).on('click',".secondMenuClick li",function (e) {
        $(".secondMenuClick li").removeClass("activeThis");

        $(this).addClass("activeThis");
        var select=$(this).attr("value");
        $("#manageSetting-load").load(select+".html");
    });
//設定第一層帶入

//自訂第一層帶入
//    $("#manageCustomMenus-load").load("#");
    $(document).on('click',".secondMenuClick li",function (e) {
        $(".secondMenuClick li").removeClass("activeThis");

        $(this).addClass("activeThis");
        var select=$(this).attr("value");
        $("#manageCustomMenus-load").load(select+".html");
    });


    //第二層架構
//    $("#indexMain-sec").addClass("active-sec");
//    $('.border-sec').click(function () {
//        $(".border-sec").removeClass("active-sec");
//        //$(".sub-ul").hide();
//        $(this).addClass("active-sec");
//        var select = $(this).attr("value");
//        $("#page-content").load(select + ".html");
//        //$(this).find('.sub-ul').show();
////            $(this).find('.sub-ul li:first-child').addClass("sub-active");
//    });

    // search toggle
    $(document).on('click',".show-search-detail",function (e) {
        $('.rece-search-detail').slideToggle();
    });
    // resevation toggle 依房型訂房
    $(document).on('click',".show-extendContent",function (e) {
        $('.extendContent').slideToggle();
        $(this).children().toggleClass("active");
    });
});



// Run on window load in case images or other scripts affect element widths

