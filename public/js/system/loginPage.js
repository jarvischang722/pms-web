var loginVM = new Vue({
    el: "#loginAPP",
    data: {
        isLoading: false,
        sysConfig: "",
        companyData: [],
        rememberMeCheck: false,
        username: "",
        passwd: "",
        dbname: "0",
        comp_id: "0",
        currentLocale: gs_locale,
        locales: JSON.parse(decodeURIComponent(getCookie("sys_locales")).replace("j:", ""))
    },
    mounted: function () {
        this.getSysConfig();
        this.getDefaultAccount();
        this.getCompaonyData();
        setTimeout(function () {
            loginVM.showUserCookie();
        }, 500);
        // this.showUserCookie();
        $(document).on('click', '.toolbar a[data-target]', function (e) {
            e.preventDefault();
            var target = $(this).data('target');
            $('.widget-box.visible').removeClass('visible');//hide others
            $(target).addClass('visible');//show target
        });

        //偵測使用者按下Enter 按鈕,登入
        $(document).keypress(function (e) {
            if (e.which == 13) {
                loginVM.doLogin();
            }
        });
    },
    methods: {
        //取系統參數
        getSysConfig: function () {
            var self = this;
            $.ajax({
                url: '/api/getsysConfig',
                async: false,
                type: 'json',
                method: 'post'
            }).done(function (result) {
                self.sysConfig = result.sysConf;
            });
        },
        //參數控制取預設帳號
        getDefaultAccount: function () {
            var self = this;
            if (!_.isUndefined(self.sysConfig.isDefaultUserID) && self.sysConfig.isDefaultUserID === "Y") {
                $.get(self.sysConfig.api_url + "/?getip=''", function (ip) {
                    $.post("/api/getDefaultAccount", {ip: ip}, function (result) {
                        self.username = result.account;
                    });
                });
            }
        },
        getCompaonyData: function () {
            $.post("/api/getSelectCompany", function (result) {
                if (result.success) {
                    loginVM.companyData = result.selectCompany;
                    loginVM.comp_id = result.selectCompany.length > 0 ? result.selectCompany[0].cmp_id.trim() : "";
                }
            });
        },
        //帶入cookie記住我資料
        showUserCookie: function () {
            if (!_.isUndefined(getCookie("login_isRememberMe")) && getCookie("login_isRememberMe") == "Y") {
                this.rememberMeCheck = true;
                this.username = getCookie("login_username");
                this.dbname = getCookie("login_dbname");
                this.comp_id = getCookie("login_comp_id");
            }

        },
        doLogin: function () {
            var self = this;
            self.isLoading = true;
            setupCookie("login_isRememberMe", this.rememberMeCheck ? "Y" : "N", "/", 2592000000);
            var params = {
                username: this.username,
                passwd: this.passwd,
                dbname: this.dbname,
                comp_id: this.comp_id
            };
            $.post("/api/authLogin", params, function (result) {

                if (result.success) {

                    if (loginVM.rememberMeCheck) {
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

                    location.href = "/systemOption";
                }
                else {
                    self.isLoading = false;
                    alert(result.errorMsg);
                }
            });

        },
        //更換語系
        changeLang: function () {
            location.href = '?locale=' + this.currentLocale;
        }
    }
});