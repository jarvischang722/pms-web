var g_socket = io.connect('/system');
var gf_chkSessionInterval;
var BacchusMainVM = new Vue({
    el: '#BacchusMainApp',
    data: {
        usingSubsysID: '',
        usingPrgID: '',
        locale: gs_locale,
        moduleMenu: [],
        quickMenu: [],
        subsysMenu: [],
        isOpenModule: "", //打開的模組 ex: PMS0001000
        displayLogoutDialog: false,
        gs_cookieExpires: ''
    },
    mounted: function () {

        this.getUserSubsys();
        this.updateCurrentDateTime();
        this.updateExpiresTime();
        setInterval(this.updateCurrentDateTime, 1000);
        setInterval(this.updateExpiresTime, 10000);
    },
    watch: {
        usingSubsysID: function (subsys_id) {
            var lo_subsysMenu = _.findWhere(this.subsysMenu, {subsys_id: this.usingSubsysID});
            if (lo_subsysMenu) {
                this.quickMenu = _.findWhere(this.subsysMenu, {subsys_id: this.usingSubsysID}).quickMenu;
                this.moduleMenu = _.findWhere(this.subsysMenu, {subsys_id: this.usingSubsysID}).mdlMenu;
            } else {
                this.quickMenu = [];
                this.moduleMenu = [];
            }

            if (_.isEmpty(this.usingPrgID)) {
                if (this.getQueryString("prg_id") != null) {
                    this.usingPrgID = this.getQueryString("prg_id");
                } else if (!_.isUndefined(getCookie('usingPrgID')) && !_.isNull(getCookie('usingPrgID'))) {
                    this.usingPrgID = getCookie('usingPrgID');
                } else {
                    this.usingPrgID = this.quickMenu.length > 0 ? this.quickMenu[0].pro_id : "";
                }
            } else {
                this.usingPrgID = this.quickMenu.length > 0 ? this.quickMenu[0].pro_id : "";
            }
            this.loadMainProcess(this.usingPrgID);

        }
    },
    methods: {
        /**
         * 取得此子系統的權限
         */
        getUserSubsys: function () {
            $.post("/api/getUserSubsys").done(function (res) {
                BacchusMainVM.subsysMenu = res.subsysMenu;
                BacchusMainVM.usingSubsysID = getCookie('usingSubsysID');
            });
        },
        /**
         * 取得網址get 參數
         * @param name
         */
        getQueryString: function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        /**
         *
         * @param subsys_id
         */
        changeSubsys: function (subsys_id) {
            location.href = '/bacchus4web/' + subsys_id;
        },
        /**
         * 讀入主程式
         * @param prg_id
         */
        loadMainProcess: function (prg_id) {
            g_socket.emit('handleTableUnlock', {'prg_id': getCookie("lockingPrgID")});

            var ls_pro_url = "";
            this.isOpenModule = "";
            this.doTableUnlock();
            setupCookie("usingPrgID", prg_id);
            setupCookie("lockingPrgID", prg_id);
            $("#MainContentDiv").html("");

            _.each(this.moduleMenu, function (mdl) {
                if (mdl.group_sta == 'N') {
                    var lo_pro = _.findWhere(mdl.processMenu, {pro_id: prg_id}) || {};
                    if (_.size(lo_pro) > 0) {
                        BacchusMainVM.isOpenModule = mdl.mdl_id;
                        ls_pro_url = lo_pro.pro_url;
                    }
                } else {
                    if (mdl.mdl_id == prg_id) {
                        ls_pro_url = mdl.mdl_url;
                    }
                }
            });
            if (_.isEmpty(ls_pro_url)) {
                var tmpQuick = _.findWhere(this.quickMenu, {pro_id: prg_id});
                if (tmpQuick) {
                    ls_pro_url = tmpQuick.pro_url;
                }
            }
            if (!_.isEmpty(ls_pro_url)) {
                $("#MainContentDiv").load(ls_pro_url + "?" + new Date().getTime());
            }

        },
        /**
         * 做Table unlock
         */
        doTableUnlock: function () {
            //TODO
        },
        /**
         * 更新Session 時間
         */
        updateExpiresTime: function () {
            $.post('/api/getSessionExpireTime', function (result) {
                if (result.session.cookie.expires !== BacchusMainVM.gs_cookieExpires) {
                    BacchusMainVM.gs_cookieExpires = result.session.cookie.expires;
                    clearInterval(gf_chkSessionInterval);
                    BacchusMainVM.doDownCount();
                }
            });
        },
        /**
         * 更新目前時間
         */
        updateCurrentDateTime: function () {
            var datetime = moment(new Date()).format("YYYY/MM/DD A HH:mm:ss");
            $("#datetimeSpan").html(datetime);
        },

        /**
         * 倒數登出時間
         */
        doDownCount: function () {
            let lastTimes = moment(BacchusMainVM.gs_cookieExpires).diff(moment(), "seconds");
            gf_chkSessionInterval = setInterval(function () {

                var mm = String(Math.floor(lastTimes / 60));
                var ss = lastTimes % 60 >= 10 ? String(lastTimes % 60) : "0" + String(lastTimes % 60);
                $("#timeLeft").text(mm + ":" + ss);
                if (lastTimes > 0) {
                    lastTimes--;
                } else {
                    $('[data-remodal-id=sessionModal]').remodal().open();
                    clearInterval(gf_chkSessionInterval);
                }

            }, 1000);
        },
        /**
         * 登出
         */
        doLogout: function () {
            alert(1233);
            $.post("/cas/logout", function (data) {
                location.reload();
            });
        },
        /**
         * 換館別
         */
        changeHotelCod: function (hotel_cod) {
            $.post("/changeHotelCod", {hotel_cod: hotel_cod}, function (data) {
                if (data.success) {
                    location.reload();
                }
            });
        }

    }

});


$(function () {
    /** 預設一開始模組更能列關閉 **/
    $("#sidebar-toggle-icon").click();

});


