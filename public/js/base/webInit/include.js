$(function () {

    // search toggle
    $(document).on('click', ".show-search-detail", function (e) {
        let state = $(this).parents(".search-content").find('.rece-search-detail');
        let changeState = state.css('display');
        state.slideToggle();
        $(this).children().toggleClass("active");

        if (changeState == 'none') {
            $(this).parents(".tab-content").css("height", 'auto');
        }
        else {
            $(this).parents(".tab-content").css("height", tabConHt);
        }
    });
    // reservation toggle 依房型訂房
    $(document).on('click', ".show-extendContent", function (e) {
        $('.extendContent').slideToggle();
        $(this).children().toggleClass("active");
    });


    $(document).on('click', ".click-effect td", function (e) {
        $(".click-effect td").removeClass("active").addClass('un-active');
        $(this).parent().find('td').removeClass('un-active').addClass("active");
    });


    //抓取瀏覽器&OS資訊
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName = navigator.appName;
    var fullVersion = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset + 5);
    }
    // In Chrome, the true version is after "Chrome"
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset + 7);
    }
    // In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In Firefox, the true version is after "Firefox"
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
        (verOffset = nAgt.lastIndexOf('/'))) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(";")) != -1)
        fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(" ")) != -1)
        fullVersion = fullVersion.substring(0, ix);

    majorVersion = parseInt('' + fullVersion, 10);
    if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }

    //                        document.write(''
    //                            +'Browser name  = '+browserName+'<br>'
    //                            +'Full version  = '+fullVersion+'<br>'
    //                            +'Major version = '+majorVersion+'<br>'
    //                            +'navigator.appName = '+navigator.appName+'<br>'
    //                            +'navigator.userAgent = '+navigator.userAgent+'<br>'
    //                        )
    // /.end 抓取瀏覽器&OS資訊

    //console.log(navigator.userAgent);

    //判斷如果不是window 不執行(判斷瀏覽器js在include.js)
    //0822 有些mac的scrollBar 會推，有些不會(jun會)
    //if(navigator.userAgent.indexOf("Window") !=-1){
    $(window).on("load resize ", function () {
        var scrollWidth = $('.tbl-content02').width() - $('.tbl-content02 table').width();
        $('.tbl-header02').css({'padding-right': '17px'});
        var fixHeadTableH = $('.el-dialog__body .col-xs-12').height() - 20;
    }).resize();
    // }
    // /.end 判斷如果不是window不執行
    // Run on window load in case images or other scripts affect element widths


    // 修改高度低於540 帳號下拉問題
    function password_down_Ht(){
        let win_Ht = $(window).height();
        if (win_Ht < 540) {
            $('.dropdown-rz').addClass('dropdown-rz-sm');
        }
        else {
            $('.dropdown-rz').removeClass('dropdown-rz-sm');
        }
    }
    password_down_Ht();
    $(window).resize(function() {
        password_down_Ht();
    });


});


