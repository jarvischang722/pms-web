$(function (){

    // $(".settingBtn-popPage").load("settingBtn.html");
    //
    // $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
    //     _title: function (title) {
    //         var $title = this.options.title || '&nbsp;'
    //         if (("title_html" in this.options) && this.options.title_html == true)
    //             title.html($title);
    //         else title.text($title);
    //     }
    // }));

    // 彈出SettingNewDialog
    $(document).on('click', "#settingNewDialog", function (e) {
        e.preventDefault();
        var dialog = $("#settingNewDialog-message").removeClass('hide').dialog({
            modal: true,
            title: "<div class='widget-header widget-header-small'><h4 class='smaller'>Setting</h4></div>",
            title_html: true,
            width: 1000,
            maxwidth: 1920,
//                autoOpen: true,
            dialogClass: "test",
            responsive: true
        });
    });

    // 新增帳號　彈出setAddAccount //settingAccManage.html
    $(document).on('click', "#setAddAccount", function (e) {
        e.preventDefault();
        var dialog = $("#setAddAccount-message").removeClass('hide').dialog({
            modal: true,
            title: "<div class='widget-header widget-header-small'><h4 class='smaller'>新增帳號</h4></div>",
            title_html: true,
            width: 600,
            maxwidth: 1920,
//                autoOpen: true,
            dialogClass: "test",
            responsive: true
        });
    });

    // 編輯帳號　彈出setStaffInquiry //settingAccManage.html
    $(document).on('click', "#setStaffInquiry", function (e) {
        e.preventDefault();
        var dialog = $("#setStaffInquiry-message").removeClass('hide').dialog({
            modal: true,
            title: "<div class='widget-header widget-header-small'><h4 class='smaller'>人員查詢</h4></div>",
            title_html: true,
            width: 1000,
            maxwidth: 1920,
//                autoOpen: true,
            dialogClass: "test",
            responsive: true
        });
    });

    // 編輯帳號→新增權限　彈出setAddPermissions //settingAccManage.html #setAddPermissions
    $(document).on('click', "#setAddPermissions", function (e) {
        e.preventDefault();
        var dialog = $("#setAddPermissions-message").removeClass('hide').dialog({
            modal: true,
            title: "<div class='widget-header widget-header-small'><h4 class='smaller'>新增權限</h4></div>",
            title_html: true,
            width: 1000,
            maxwidth: 1920,
//                autoOpen: true,
            dialogClass: "test",
            responsive: true
        });
    });

    // 編輯權限　彈出settingAccControlCreate //settingAccControl.html
    $(document).on('click', "#settingAccControlCreate", function (e) {
        e.preventDefault();
        var dialog = $("#settingAccControlCreate-message").removeClass('hide').dialog({
            modal: true,
            title: "<div class='widget-header widget-header-small'><h4 class='smaller'>權限編輯</h4></div>",
            title_html: true,
            width: 1000,
            maxwidth: 1920,
//                autoOpen: true,
            dialogClass: "test",
            responsive: true
        });
    });

    // 查詢　彈出setPermissionsInquiry //settingAccControl.html
    $(document).on('click', "#setPermissionsInquiry", function (e) {
        e.preventDefault();
        var dialog = $("#setPermissionsInquiry-message").removeClass('hide').dialog({
            modal: true,
            title: "<div class='widget-header widget-header-small'><h4 class='smaller'>權限編輯</h4></div>",
            title_html: true,
            width: 1000,
            maxwidth: 1920,
//                autoOpen: true,
            dialogClass: "test",
            responsive: true
            // ,resizable: true
        });
    });

    // 查詢　彈出setAddUser //settingAccControl.html
    $(document).on('click', "#setAddUser", function (e) {
        e.preventDefault();
        var dialog = $("#setAddUser-message").removeClass('hide').dialog({
            modal: true,
            title: "<div class='widget-header widget-header-small'><h4 class='smaller'>新增使用者</h4></div>",
            title_html: true,
            width: 1000,
            maxwidth: 1920,
//                autoOpen: true,
            dialogClass: "test",
            responsive: true
        });
    });

    // 新增權限 //settingAccControl.html
    $(".blockTwo").on('click', '#addNewAccount', function (e) {
        var content = [];
        var txtId = 1;
        content.push('<tr>');
        content.push('<td><input type="text" class=""/></td>');
        content.push('<td><div class="form-inline"><input type="text" class="form-control"/><span class="deleteAddAccount"><span>刪除新增</span></span></div></td>');
        content.push('</tr>');
        $(this).parents('.page-content').find('.enabled').append(content.join(""));
        txtId++;
    });

    //刪除新增多餘欄位 //settingAccControl.html
    $(".blockTwo").on('click', '.deleteAddAccount', function (e) {
        $(this).parents('tr').remove();
    });


    // // 左右拉
    // var demo1 = $('select[name="duallistbox_demo1[]"]').bootstrapDualListbox({infoTextFiltered: '<span class="label label-purple label-lg">Filtered</span>'});
    // // /.左右拉
});