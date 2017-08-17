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
        $(this).parents(".search-content").find('.rece-search-detail').slideToggle();
    });
    // resevation toggle 依房型訂房
    $(document).on('click',".show-extendContent",function (e) {
        $('.extendContent').slideToggle();
        $(this).children().toggleClass("active");
    });



    //抓取瀏覽器&OS資訊
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName  = navigator.appName;
    var fullVersion  = ''+parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion,10);
    var nameOffset,verOffset,ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset+6);
        if ((verOffset=nAgt.indexOf("Version"))!=-1)
            fullVersion = nAgt.substring(verOffset+8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset+5);
    }
    // In Chrome, the true version is after "Chrome"
    else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset+7);
    }
    // In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset+7);
        if ((verOffset=nAgt.indexOf("Version"))!=-1)
            fullVersion = nAgt.substring(verOffset+8);
    }
    // In Firefox, the true version is after "Firefox"
    else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset+8);
    }
    // In most other browsers, "name/version" is at the end of userAgent
    else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
        (verOffset=nAgt.lastIndexOf('/')) )
    {
        browserName = nAgt.substring(nameOffset,verOffset);
        fullVersion = nAgt.substring(verOffset+1);
        if (browserName.toLowerCase()==browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix=fullVersion.indexOf(";"))!=-1)
        fullVersion=fullVersion.substring(0,ix);
    if ((ix=fullVersion.indexOf(" "))!=-1)
        fullVersion=fullVersion.substring(0,ix);

    majorVersion = parseInt(''+fullVersion,10);
    if (isNaN(majorVersion)) {
        fullVersion  = ''+parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion,10);
    }

    //                        document.write(''
    //                            +'Browser name  = '+browserName+'<br>'
    //                            +'Full version  = '+fullVersion+'<br>'
    //                            +'Major version = '+majorVersion+'<br>'
    //                            +'navigator.appName = '+navigator.appName+'<br>'
    //                            +'navigator.userAgent = '+navigator.userAgent+'<br>'
    //                        )
    // /.end 抓取瀏覽器&OS資訊

});



// Run on window load in case images or other scripts affect element widths

