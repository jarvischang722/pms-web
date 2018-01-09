//common JS
jQuery(function () {
    // Resize Table Height // Date:170920

    // 藍色系統列
    var menuHeight1 = $(".navbar-container").height();

    // quickMenus + 搜尋欄位
    var menuHeight2 = $(".top-sec-ul").height()+ 30+ $(".page-header").height()+ $(".search-content").height();//padding-top: 5px

    var menuHt3 = 70;  // 高度 margin或padding 的差距

    // todo 抓不到search 那一行跟上面文字高度
    var searchGridHt = 30;
    var searchPaddHt = 17;

    // alert($('.tab-content').find('.searc-S2').height());
    // alert($('.search-S2').height());

    // 前檯 selectgroup
    var selectgroup = $(".select-group").height();

    function allHt() {
        gridTableHt         = $(window).height()-menuHeight1-menuHeight2;
        frontTableHt        = $(window).height()-menuHeight1-menuHeight2-selectgroup-8;
        roomAssTableHt      = $(window).height()-menuHeight1-menuHeight2-selectgroup-120; // 上面備註高度

        prg_dgHt            = $(window).height() - menuHeight1 - menuHeight2 - menuHt3;
        prg_dgHt_search     = $(window).height() - menuHeight1 - menuHeight2 - menuHt3 - searchGridHt - searchPaddHt;  // PMS0810020
        prg_dgHt_searchRow2 = $(window).height() - menuHeight1 - menuHeight2 - menuHt3 - (searchGridHt*2) - searchPaddHt;  // PMS0820020
        tabConHt            = $(window).height() - menuHeight1 - menuHeight2;
        dtTableSetupHt      = tabConHt - 70; // 設定檔table 高度 // prg_dgHt 等於
    }
    allHt();
    $(".gridTableHt").css("height", gridTableHt);
    $(".dtTableSetupHt").css("height", dtTableSetupHt);
    $(".frontTableHt").css("height", frontTableHt);
    $(".roomAssTableHt").css("height", roomAssTableHt); //roomAssign
    $(".prg_dgHt").css("height", prg_dgHt);
    $(".prg_dgHt_search").css("height", prg_dgHt_search); // PMS0810020
    $(".prg_dgHt_searchRow2").css("height", prg_dgHt_searchRow2); // PMS0820020
    $(".tabConHt").css("height", tabConHt);


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

//   todo 與(dataGridTmp.ejs)的resize 衝突，之後換table寫法更改，再將“dtTableSetupHt” 拿掉
//         $(".prg_dgHt").datagrid('resize',{
//             height:prg_dgHt
//         });

        // PMS0810020
        $('.prg_dgHt_search').datagrid('resize',{
            height:prg_dgHt_search
        });
        // PMS0820020
        $('.prg_dgHt_searchRow2').datagrid('resize',{
            height:prg_dgHt_searchRow2
        });

        $(".tabConHt").css("height", tabConHt);
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