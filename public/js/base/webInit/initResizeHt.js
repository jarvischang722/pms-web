//common JS
jQuery(function () {
    // Resize Table Height // Date:170920

    // 藍色系統列
    var navHt = $(".navbar-container").height();

    // quickMenus + 搜尋欄位
    var menuHt = $(".top-sec-ul").height() + 30 + $(".page-header").height();//padding-top: 5px

    var menuHt3 = 70;  // 高度 margin或padding 的差距

    // 移到gridSingle.js && datagrid.js 裡面
    var searchGridHt = 30;
    var searchPaddHt = 17;

    // 前檯 selectgroup
    var selectgroup = $(".select-group").height();

    function allHt() {
        gridTableHt = $(window).height() - navHt - menuHt;
        gridTableHt2 = $(window).height() - navHt - menuHt - 55; // For 底下可以選擇頁數的
        frontTableHt = $(window).height() - navHt - menuHt - selectgroup - 8;
        roomAssTableHt = $(window).height() - navHt - menuHt - selectgroup - 120; // 上面備註高度

        prg_dgHt = $(window).height() - navHt - menuHt - menuHt3;
        prg_dgHt_search = $(window).height() - navHt - menuHt - menuHt3 - searchGridHt - searchPaddHt;  // PMS0810020
        prg_dgHt_searchRow2 = $(window).height() - navHt - menuHt - menuHt3 - (searchGridHt * 2) - searchPaddHt;  // PMS0820020
        tabConHt = $(window).height() - navHt - menuHt;
        iframeHt = $(window).height() - navHt - menuHt - 70;
        dtTableSetupHt = tabConHt - 70; // 設定檔table 高度 // prg_dgHt 等於
    }

    allHt();
    $(".gridTableHt").css("height", gridTableHt);
    $(".gridTableHt2").css("height", gridTableHt2);
    $(".dtTableSetupHt").css("height", dtTableSetupHt);
    $(".frontTableHt").css("height", frontTableHt);
    $(".roomAssTableHt").css("height", roomAssTableHt); //roomAssign
    $(".prg_dgHt").css("height", prg_dgHt);
    $(".prg_dgHt_search").css("height", prg_dgHt_search); // PMS0810020
    $(".prg_dgHt_searchRow2").css("height", prg_dgHt_searchRow2); // PMS0820020
    $(".tabConHt").css("height", tabConHt);
    $(".iframeHt").css("height", iframeHt);

    // 螢幕縮放時重新抓值
    $(window).resize(function () {
        allHt();

        $('.gridTableHt').datagrid('resize', {
            height: gridTableHt
        });
        $('.gridTableHt2').datagrid('resize', {
            height: gridTableHt2
        });

        $('.dtTableSetupHt').datagrid('resize', {
            height: dtTableSetupHt
        });

        $(".frontTableHt").css("height", frontTableHt);

        $('.roomAssTableHt').datagrid('resize', {
            height: roomAssTableHt
        });

        // PMS0810020
        $('.prg_dgHt_search').datagrid('resize', {
            height: prg_dgHt_search
        });
        // // PMS0820020
        $('.prg_dgHt_searchRow2').datagrid('resize', {
            height: prg_dgHt_searchRow2
        });

        $(".tabConHt").css("height", tabConHt);
        $(".iframeHt").css("height", iframeHt);
    });

    //.END Resize Table Height // Date:170920

    // scrollables
    /* datagrid 無法建立 scrollables */
    var frontTableHt = $('.frontTableHt').height();
    var townPage = $('.townPage').height();
    $('.scrollable').each(function () {
        var $this = $(this);
        $(this).ace_scroll({
            size: frontTableHt || townPage || $this.attr('data-size') || 300
            //size: $this.attr('data-size') || 100,  // 原本使用
            //styleClass: 'scroll-left scroll-margin scroll-thin scroll-dark scroll-light no-track scroll-visible'
        });
    });

    // tabs setting
    $('.easyUi-custom1').tabs({
        // 可以resize 左右，但height 會變大
//            fit: true,
//            height: auto
    });
    //.END tabs setting


    // 提示訊息
    $('[data-rel=tooltip]').tooltip();
    //.END 提示訊息


    // 下拉選單 文字更換(樓層、棟別)
    $(document).on('click', '.dpUIList li > a', function () {
        $(this).parent().toggleClass('click-act');
//            $(this).parents('.chgText-effect').find('.dpShowValue').text(this.innerHTML);
        $(this).parents('.chgText-effect').find('.dropdown-toggle').addClass('sel-border');
    });
    //.END 下拉選單

    $('.townPage').on('click', ".townBlock", function (e) {
        $('.townBlock').removeClass("active");
        $(this).addClass("active");
    });
    //排房選中active
    $('.counterPage').on('click', ".counterBlock", function (e) {
        $('.counterBlock').removeClass("active");
        $(this).addClass("active");
    });
    //.END 排房選中active



});