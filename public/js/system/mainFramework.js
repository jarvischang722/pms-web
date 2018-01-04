var g_socket = io.connect('/system');
var gf_chkSessionInterval;
var vmHub = new Vue();

g_socket.on('checkOnlineUserResult', function (result) {
    if (!result.success) {
        alert(result.errorMsg);
        location.href = '/systemOption';
    }
});

var BacchusMainVM = new Vue({
    el: '#BacchusMainApp',
    components: {Treeselect: VueTreeselect.Treeselect},
    data: {
        usingSubsysID: '',
        usingPrgID: '',
        locale: gs_locale,
        moduleMenu: [],
        quickMenu: [],
        subsysMenu: [],
        activeSystem: {},
        isOpenModule: "", //打開的模組 ex: PMS0001000
        displayLogoutDialog: false, //決定閒置登出的視窗是否要跳出
        gs_cookieExpires: '', //cookie 剩餘時間
        prgVueIns: {}, //目前作業的 vue 實例
        leaveAfterExecFuncsNam: [], //頁面前離開後要幫作業觸發的功能
        sysPrgPath: ''
    },
    mounted: function () {
        //離開時
        window.onbeforeunload = function () {
            BacchusMainVM.doLeavePageBeforePrgFuncs();
        };
        this.getUserSubsys();
        this.updateCurrentDateTime();
        this.updateExpiresTime();
        setInterval(this.updateCurrentDateTime, 1000);
        setInterval(this.updateExpiresTime, 5000);
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
            this.updSysPrgPath();
        }
    },
    methods: {
        updSysPrgPath: function () {
            let subsysPurview = _.findWhere(this.subsysMenu, {subsys_id: getCookie("usingSubsysID")});
            if (subsysPurview) {

                let usingSubsysName = subsysPurview ? subsysPurview["subsys_nam_" + gs_locale] : "";
                let usingPrgName = '';
                subsysPurview.mdlMenu.every(function (mdl) {

                    if (mdl.group_sta == 'G') {
                        if (mdl.mdl_id == getCookie("usingPrgID")) {
                            usingPrgName = mdl["mdl_name_" + gs_locale];
                        }
                    } else {
                        let lo_pro = _.findWhere(mdl.processMenu, {pro_id: getCookie("usingPrgID")});
                        if (!_.isUndefined(lo_pro)) {
                            usingPrgName = lo_pro["pro_name_" + gs_locale];
                        }
                    }
                    return _.isEmpty(usingPrgName)
                })
                document.title = `${usingPrgName} > ${usingSubsysName} > ${this.activeSystem.abbrName}`;
                this.sysPrgPath = `${this.activeSystem.abbrName} > ${usingSubsysName} > ${usingPrgName}`
            }
        },
        /**
         * 塞入作業Vue實體
         * @param _prgVueIns{Object}  :  vue 實體
         */
        setPrgVueIns: function (_prgVueIns) {
            this.prgVueIns = _prgVueIns;
        },
        /**
         * 塞入作業離開頁面後要執行的functions
         * @param _funcsNam{Array[String]} : 功能名稱清單
         */
        setLeaveAfterExecFuncsNam: function (_funcsNam) {
            this.leaveAfterExecFuncsNam = _funcsNam;
        },
        /**
         * 執行作業離開前需要做的事
         */
        doLeavePageBeforePrgFuncs: function () {
            _.each(this.leaveAfterExecFuncsNam, function (funcNam) {
                BacchusMainVM.prgVueIns[funcNam]();
            });
        },
        /**
         * 取得此子系統的權限
         */
        getUserSubsys: function () {
            $.post("/api/getUserSubsys").done(function (res) {
                BacchusMainVM.subsysMenu = res.subsysMenu;
                BacchusMainVM.activeSystem = res.activeSystem;
                BacchusMainVM.usingSubsysID = getCookie('usingSubsysID');
                BacchusMainVM.doCheckOnlineUser();
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
            BacchusMainVM.updSysPrgPath();
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
            let lastTimes = moment(this.gs_cookieExpires).diff(moment(), "seconds");
            if (_.isEmpty(this.gs_cookieExpires) || lastTimes > 0) {
                $.post('/api/getSessionExpireTime', function (result) {
                    if (result.session.cookie.expires !== BacchusMainVM.gs_cookieExpires) {
                        BacchusMainVM.gs_cookieExpires = result.session.cookie.expires;
                        clearInterval(gf_chkSessionInterval);
                        BacchusMainVM.doDownCount();
                    }
                });
            }

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
            let secs = moment(BacchusMainVM.gs_cookieExpires).diff(moment(), "seconds");
            gf_chkSessionInterval = setInterval(function () {

                let hr = Math.floor(secs / 3600);
                let min = Math.floor((secs - (hr * 3600)) / 60);
                let sec = parseInt(secs - (hr * 3600) - (min * 60));

                if (min.length < 2) {
                    min = '0' + min;
                }
                if (sec.length < 2) {
                    sec = '0' + min;
                }
                if (hr) {
                    hr += ':'
                }
                $('#timeLeft').text(`${hr}  ${min} : ${sec}`);
                if (secs > 0) {
                    secs--;
                } else {
                    BacchusMainVM.displayLogoutDialog = true;
                    clearInterval(gf_chkSessionInterval);
                }

            }, 1000);
        },
        /**
         * 登出
         */
        doLogout: function () {
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
        },

        /**
         * 授權控管 人數(確認館別、集團是否超過人數)
         */
        doCheckOnlineUser: function(){
            g_socket.emit('checkOnlineUser');
        }

    }

});


$(function () {
    /** 預設一開始模組更能列關閉 **/
    $("#sidebar-toggle-icon").click();

});


