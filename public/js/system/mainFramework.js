var BacchusMainVM = new Vue({
    el: '#BacchusMainApp',
    data: {
        usingSubsysID: '',
        usingPrgID: '',
        locale: gs_locale,
        moduleMenu: [],
        quickMenu: [],
        subsysMenu: [],
        isOpenModule: "" //打開的模組 ex: PMS0001000
    },
    mounted: function () {

        this.getUserSubsys();

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
        //取得此子系統的權限
        getUserSubsys: function () {
            $.post("/api/getUserSubsys").done(function (res) {
                BacchusMainVM.subsysMenu = res.subsysMenu;
                BacchusMainVM.usingSubsysID = getCookie('usingSubsysID');
            });
        },
        //取得網址get 參數
        getQueryString: function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        changeSubsys: function (subsys_id) {
            location.href = '/bacchus4web/' + subsys_id;
        },
        //讀入主程式
        loadMainProcess: function (prg_id) {
            g_socket.emit('handleTableUnlock', { 'prg_id': getCookie("lockingPrgID")});

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
            ls_pro_url = "/reserveBanquet/RS00202010";
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
        doTableLock: function () {


        },
        doTableUnlock: function () {
            var lockingPrgID = !_.isUndefined(getCookie("lockingPrgID")) && !_.isEmpty(getCookie("lockingPrgID"))
                ? getCookie("lockingPrgID") : '';
            g_socket.emit('handleTableUnlock', {
                'prg_id': lockingPrgID
            });
        }

    }

});


$(function () {
    /** 預設一開始模組更能列關閉 **/
    $("#sidebar-toggle-icon").click();

});
