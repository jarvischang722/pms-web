//common JS
jQuery(function () {
    // Resize Table Height // Date:170920

    // 藍色系統列
    var menuHeight1 = $(".navbar-container").height();

    // quickMenus + 搜尋欄位
    var menuHeight2 = $(".top-sec-ul").height()+ 30+ $(".page-header").height()+ $(".search-content").height();//padding-top: 5px

    var menuHt3 = 70;  // 高度 margin或padding 的差距
    var searchHt = 47; // 一行的height + padding 間距

    // 前檯 selectgroup
    var selectgroup = $(".select-group").height();

    var dtTableSetupHt = $(".tab-content").height()-100; // tabs裡面的 - 搜尋:52px + 標題: 24px + 原本:25px // bug: 抓不到搜尋&標題高度

    function allHt() {
        gridTableHt     = $(window).height()-menuHeight1-menuHeight2;
        dtTableSetupHt  = dtTableSetupHt; // 設定檔table 高度
        frontTableHt    = $(window).height()-menuHeight1-menuHeight2-selectgroup-8;
        roomAssTableHt  = $(window).height()-menuHeight1-menuHeight2-selectgroup-120; // 上面備註高度

        prg_dgHt        = $(window).height() - menuHeight1 - menuHeight2 - menuHt3;
        prg_dgHt_search = $(window).height() - menuHeight1 - menuHeight2 - menuHt3 - searchHt;  // PMS0810020
        tabConHt        = $(window).height() - menuHeight1 - menuHeight2;
    }
    allHt();
    $(".gridTableHt").css("height", gridTableHt);
    $(".dtTableSetupHt").css("height", dtTableSetupHt);
    $(".frontTableHt").css("height", frontTableHt);
    $(".roomAssTableHt").css("height", roomAssTableHt); //roomAssign
    $(".prg_dgHt").css("height", prg_dgHt);
    $(".prg_dgHt_search").css("height", prg_dgHt_search); // PMS0810020
    let setTabCon = $("#settingUl").find(".tab-content");
    setTabCon.css("height", tabConHt);


    // 螢幕縮放時重新抓值
    $(window).resize(function() {
        allHt();

        $('.gridTableHt').datagrid('resize',{
            height:gridTableHt
        });

        $('.dtTableSetupHt').datagrid('resize',{
            height:dtTableSetupHt
        });

        $(".frontTableHt").css("height", frontTableHt);

        $('.roomAssTableHt').datagrid('resize',{
            height:roomAssTableHt
        });

        $(".prg_dgHt").datagrid('resize',{
            height:prg_dgHt
        });

        // PMS0810020
        $('.prg_dgHt_search').datagrid('resize',{
            height:prg_dgHt_search
        });

        setTabCon.css("height", tabConHt);
    });

    //.END Resize Table Height // Date:170920


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
    $('.dpUIList li > a').on('click', function(){
        $(this).parents('.select-group').find('.dpShowValue').text(this.innerHTML);
    });
    // 下拉選單 文字更換(樓層、棟別)
    $('.dpUIList li > a').on('click', function(){
        $(this).parents('.btn-group').find('.dpShowValue').text(this.innerHTML);
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


//        $(document).on('click', ".btn-primary", function (e) {
//            $(this).removeClass("btn-white").css('border-width','1px');
//        });



});