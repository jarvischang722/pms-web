var vm = new Vue({
    el: "#APP",
    data: {
        selectedCompany: {},
        companyData: []
    },
    mounted: function(){
        this.getCompaonyData();
    },
    methods: {
        getCompaonyData: function(){
            var self = this;
            $.post("/api/getSelectCompany", {}, function(result){
                if(result.success){
                    self.selectedCompany = result.selectCompany[0].value;
                    self.companyData = result.selectCompany;
                    console.log(self.selectedCompany);
                }
            });
        }
    }
});


$(function () {

    showLocales();
    showUserCookie();
    $(document).on('click', '.toolbar a[data-target]', function (e) {
        e.preventDefault();
        var target = $(this).data('target');
        $('.widget-box.visible').removeClass('visible');//hide others
        $(target).addClass('visible');//show target
    });

    //偵測使用者按下Enter 按鈕,登入
    $(document).keypress(function (e) {
        if (e.which == 13) {
            doLogin();
        }
    });
});

//帶入cookie記住我資料
function showUserCookie() {
    if (!_.isUndefined(getCookie("login_isRememberMe")) && getCookie("login_isRememberMe") == "Y") {
        $("#rememberMeCheck").prop("checked", true);
        $("#username").val(getCookie("login_username"));
        $("#dbname").val(getCookie("login_dbname"));
        $("#comp_id").val(getCookie("login_comp_id"));
    }
}

//顯示語系
function showLocales(){
    var sessionLocale = '<%= session.locale %>';
    var locales = JSON.parse(decodeURIComponent(getCookie("sys_locales")).replace("j:", ""));
    var content = "";
    _.each(locales, function (data) {
        var isSelect = _.isEqual(sessionLocale, data.lang) ? 'selected' : '';
        content += "<option " + isSelect + " value='"+data.lang+"' >" + data.name + "</option>"
    })
    $("#localeSelect").html(content);
}

function doLogin() {
    $("#login_btn").attr("disabled", true);
    var isRememberMe = $("#rememberMeCheck").prop("checked");
    setupCookie("login_isRememberMe", isRememberMe ? "Y" : "N", "/", 2592000000);
    var params = {
        username: $("#username").val(),
        passwd: $("#passwd").val(),
        dbname: $("#dbname").val(),
        comp_id: $("#comp_id").val()
    };


    $.post("/api/authLogin", params, function (result) {
        $("#login_btn").attr("disabled", false);
        if (result.success) {

            if (isRememberMe) {
                setupCookie("login_isRememberMe", "Y", "/", 2592000000);
                setupCookie("login_username", params.username, "/", 2592000000);
                setupCookie("login_dbname", params.dbname, "/", 2592000000);
                setupCookie("login_comp_id", params.comp_id, "/", 2592000000);
            } else {
                setupCookie("login_isRememberMe", "N", "/", 2592000000);
                delCookie("login_username", params.username);
                delCookie("login_dbname", params.dbname);
                delCookie("login_comp_id", params.comp_id);
            }

            alert('Login success!');
            location.href = "/systemOption"
        } else {
            alert('Login fail!');
        }
    })

}

//更換語系
function changeLang(lang) {
    location.href = '?locale=' + lang.value;
}