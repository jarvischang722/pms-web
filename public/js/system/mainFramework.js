let g_socket = io.connect("/system");
let gf_chkSessionInterval;
let BacchusMainVM = new Vue({
    el: "#BacchusMainApp",
    components: {Treeselect: VueTreeselect.Treeselect},
    data: {
        usingSubsysID: "",
        usingPrgName: "",
        oldSubsysID: "",
        usingPrgID: "",
        locale: gs_locale,
        moduleMenu: [],
        quickMenu: [],
        reportMenu: [],
        subsysMenu: [],
        activeSystem: {},
        isOpenModule: "", //打開的模組 ex: PMS0001000
        displayLogoutDialog: false, //決定閒置登出的視窗是否要跳出
        gs_cookieExpires: "", //cookie 剩餘時間
        serverTime: "", //server 時間
        prgVueIns: {}, //目前作業的 vue 實例
        leaveAfterExecFuncsNam: [], //頁面前離開後要幫作業觸發的功能
        sysPrgPath: "",
        //修改密碼
        isLoading: false,
        openEditPasswordDialog: false,
        pwdData: {
            oriPassword: "",
            newPassword: "",
            confirmPassword: ""
        },
        fieldData: [
            {ui_field_name: "oriPassword", ui_display_name: "Original Password"},
            {ui_field_name: "newPassword", ui_display_name: "New Password"},
            {ui_field_name: "confirmPassword", ui_display_name: "Check new password"}
        ],
        prgEditionOptions: {} //版本資料
    },
    mounted: function () {
        let self = this;

        //Trigger this method before leave page
        window.onbeforeunload = function () {
            BacchusMainVM.doLeavePageBeforePrgFuncs();
        };

        //Orverride the window alert  function
        window.alert = function () {
            self.$alert(arguments[0], arguments[1] || go_i18nLang.SystemCommon.notice, {
                confirmButtonText: go_i18nLang.SystemCommon.OK
            });
        };

        //When click the #MainContentDiv's area , usingSubsysID changed back to current process's subsystem id
        $("#MainContentDiv").click(function () {
            if (!_.isEmpty(self.getSubsysIDOfPrgID(self.usingPrgID))) {
                self.usingSubsysID = self.getSubsysIDOfPrgID(self.usingPrgID);
            }
        });

        this.doCheckOnlineUser();
        this.getUserSubsys();
        this.updateCurrentDateTime();
        this.updateExpiresTime();
        setInterval(this.updateCurrentDateTime, 1000);
        setInterval(this.updateExpiresTime, 5000);
    },
    watch: {
        usingSubsysID: function (newSubsysID, oldSubsysID) {
            this.oldSubsysID = oldSubsysID;
            let lo_subsysMenu = _.findWhere(this.subsysMenu, {subsys_id: newSubsysID});
            if (lo_subsysMenu) {
                this.quickMenu = lo_subsysMenu.quickMenu;
                this.moduleMenu = lo_subsysMenu.mdlMenu;
                this.reportMenu = lo_subsysMenu.reportMenu;
            } else {
                this.quickMenu = [];
                this.moduleMenu = [];
                this.reportMenu = [];
            }

            if (this.oldSubsysID == "") {
                this.usingPrgID = this.getQueryString("prg_id") || getCookie("usingPrgID");
                this.loadMainProcess(this.usingPrgID);
            }

            this.updSysPrgPath();
        }
    },
    methods: {
        /**
         * 選擇系統(mainFrameWork和systemOption共用同一支js)
         * @param sys_id{string}: 系統別
         */
        selectSys: function (sys_id) {
            $.post("/api/selectSystem", {sys_id: sys_id}, function (result) {
                if (result.success) {
                    location.href = result.subsysPage;
                }
            });
        },
        updSysPrgPath: function () {
            if (this.oldSubsysID != "") {
                return;
            }
            let self = this;
            let lo_subsysPurview = _.findWhere(this.subsysMenu, {subsys_id: self.usingSubsysID});
            if (lo_subsysPurview) {

                let usingSubsysName = lo_subsysPurview["subsys_nam_" + gs_locale] || "";
                lo_subsysPurview.mdlMenu.every(function (mdl) {

                    if (mdl.group_sta == "G") {
                        if (mdl.mdl_id == self.usingPrgID) {
                            self.usingPrgName = mdl["mdl_name_" + gs_locale];
                        }
                    } else {
                        let lo_pro = _.findWhere(mdl.processMenu, {pro_id: self.usingPrgID});
                        if (!_.isUndefined(lo_pro)) {
                            self.usingPrgName = lo_pro["pro_name_" + gs_locale];
                        }
                    }
                    return _.isEmpty(self.usingPrgName);
                });
                document.title = [self.usingPrgName, usingSubsysName, this.activeSystem.abbrName].join(">");
                this.sysPrgPath = [this.activeSystem.abbrName, usingSubsysName, self.usingPrgName].join(">");
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
                BacchusMainVM.usingSubsysID = getCookie("usingSubsysID");
            });
        },
        /**
         * 取得網址get 參數
         * @param name
         */
        getQueryString: function (name) {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            let r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        /**
         * 按下不同子系統的事件
         * @param subsys_id
         */
        changeSubsys: function (subsys_id) {
            this.usingSubsysID = subsys_id;
            this.quickMenu = _.findWhere(this.subsysMenu, {subsys_id: subsys_id}).quickMenu;
        },
        /**
         * 讀入主程式
         * @param prg_id
         */
        loadMainProcess: function (prg_id) {

            g_socket.emit("handleTableUnlock", {"prg_id": getCookie("lockingPrgID")});

            let ls_pro_url = "";
            this.doTableUnlock();
            setupCookie("usingPrgID", prg_id);
            setupCookie("lockingPrgID", prg_id);
            BacchusMainVM.updSysPrgPath();

            if (!_.isEmpty(prg_id)) {
                $("#MainContentDiv").html("");
            }
            if (_.findIndex(this.reportMenu, {pro_id: prg_id}) > -1) {
                ls_pro_url = _.findWhere(this.reportMenu, {pro_id: prg_id}).pro_url;
            } else {
                _.each(this.moduleMenu, function (mdl) {
                    if (mdl.group_sta == "N") {
                        let lo_pro = _.findWhere(mdl.processMenu, {pro_id: prg_id}) || {};
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
            }
            if (_.isEmpty(ls_pro_url)) {
                let tmpQuick = _.findWhere(this.quickMenu, {pro_id: prg_id});
                if (tmpQuick) {
                    ls_pro_url = tmpQuick.pro_url;
                }
            }

            if (!_.isEmpty(ls_pro_url)) {
                this.usingPrgID = prg_id;
                $("#MainContentDiv").load(ls_pro_url + "?" + new Date().getTime());
            }

        },
        /**
         * 按下其中一個quick menu 的 program
         * @param prg_id
         */
        loadQuickMenuProcess: function (prg_id) {
            setupCookie("usingSubsysID", this.usingSubsysID, 2592000000);
            location.href = "/bacchus4web/" + this.usingSubsysID + "?prg_id=" + prg_id;
        },
        /**
         * 打開quick menu的program另跳窗
         * @param prg_id
         */
        openNewPageLoadProgram: function (prg_id) {
            let ls_newSubsysID = this.getSubsysIDOfPrgID(prg_id);
            window.open("/bacchus4web/" + ls_newSubsysID + "?prg_id=" + prg_id, "_blank");
            setupCookie("usingSubsysID", this.usingSubsysID, 2592000000);
            this.usingSubsysID = this.oldSubsysID;
        },
        /**
         * 取得prg_id 所屬的子系統編號
         * @param prg_id
         * @return {string}
         */
        getSubsysIDOfPrgID: function (prg_id) {
            let lao_allPrgs = [].concat(..._.pluck(this.subsysMenu, "quickMenu"));
            let ls_newSubsysID = _.findIndex(lao_allPrgs, {pro_id: prg_id}) > -1
                ? _.findWhere(lao_allPrgs, {pro_id: prg_id}).subsys_id : "";
            return ls_newSubsysID;
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
                $.post("/api/getSessionExpireTime", function (result) {
                    if (result.session.cookie.expires !== BacchusMainVM.gs_cookieExpires) {
                        BacchusMainVM.gs_cookieExpires = result.session.cookie.expires;
                        BacchusMainVM.serverTime = result.serverTime;
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
            let datetime = moment(new Date()).format("YYYY/MM/DD A HH:mm:ss");
            $("#datetimeSpan").html(datetime);
        },

        /**
         * 倒數登出時間
         */
        doDownCount: function () {
            let secs = moment(BacchusMainVM.gs_cookieExpires).diff(BacchusMainVM.serverTime, "seconds");
            gf_chkSessionInterval = setInterval(function () {

                let hr = Math.floor(secs / 3600) < 0 ? "00" : Math.floor(secs / 3600);
                let min = Math.floor((secs - hr * 3600) / 60);
                let sec = parseInt(secs - hr * 3600 - min * 60);

                if (min.length < 2) {
                    min = "0" + min;
                }
                if (sec.length < 2) {
                    sec = "0" + min;
                }

                $("#timeLeft").text([hr, min, sec].join(" : "));
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
            this.handleLogout(function () {
                location.reload();
            });
        },
        handleLogout: function (callback) {
            $.post("/cas/logout", function (data) {
                callback();
            });
        },
        /**
         * 修改密碼
         */
        doEditPassword: function () {
            $("#editPasswordDialog").removeClass("hide");
            this.openEditPasswordDialog = true;
        },

        //確認是否空白
        dataValidate: function () {
            let lo_checkResult;

            for (let i = 0; i < this.fieldData.length; i++) {
                let lo_field = this.fieldData[i];
                lo_checkResult = go_validateClass.required(this.pwdData[lo_field.ui_field_name], lo_field.ui_display_name);
                if (lo_checkResult.success == false) {
                    break;
                }
            }

            return lo_checkResult;
        },

        //確定修改密碼
        confirmEditPassword: function () {
            this.isLoading = true;
            let self = this;
            let lo_chkResult = this.dataValidate();

            if (lo_chkResult.success == false) {
                alert(lo_chkResult.msg);
            }
            else {
                $.post("/api/doEditPassword", this.pwdData, function (result) {
                    if (result.success) {
                        alert("Edit success!");
                        self.openEditPasswordDialog = false;
                        self.doLogout();
                    }
                    else {
                        alert(result.errorMsg);
                    }
                    _.each(self.pwdData, function (val, key) {
                        self.pwdData[key] = "";
                    });
                    self.isLoading = false;
                });
            }
        },

        /**
         * 取消修改密碼
         */
        doCancelEditPassword: function () {
            let self = this;
            this.openEditPasswordDialog = false;
            _.each(this.pwdData, function (val, key) {
                self.pwdData[key] = "";
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
        doCheckOnlineUser: function () {
            g_socket.emit("checkOnlineUser");
        },

        /**
         * 取得版本資料(option id、function id)
         * @param prg_id{string}: 各程式編號
         */
        doGetVersionData: function (prg_id) {
            let self = this;
            $.ajax({
                type: "POST",
                url: "/api/getPrgEditionOptionList",
                data: {prg_id: prg_id},
                success: function (result) {
                    if (result.success) {
                        self.prgEditionOptions = result.prgEditionOptions;
                    }
                    else {
                        alert(result.errorMsg);
                    }
                },
                async: false
            });
        }

    }
});


$(function () {
    /** 預設一開始模組更能列關閉 **/
    $("#sidebar-toggle-icon").click();
});


g_socket.on("checkOnlineUserResult", function (result) {
    if (!result.success) {
        alert(result.errorMsg);
        location.href = "/systemOption";
    }
});

$(document).on("click", ".purview_btn", function (event) {
    let purview_func_id = $(this).data("purview_func_id").toString();
    let lo_params = {
        prg_id: purview_func_id.split("-")[0],
        func_id: purview_func_id.split("-")[1]
    };
    g_socket.emit("recordUserAction", lo_params);
});

