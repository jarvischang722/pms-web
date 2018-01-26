var loginVM = new Vue({
    el: "#loginAPP",
    data: {
        location: "",
        locations: [
            {"name": "Location A"},
            {"name": "Location B"}
        ],
        companyData: [],
        rememberMeCheck: false,
        username: "",
        passwd: "",
        dbname: "0",
        comp_id: "0",
        currentLocale: gs_locale,
        locales: JSON.parse(decodeURIComponent(getCookie("sys_locales")).replace("j:", ""))
        ,person: {
            name: 'jun',
            name2: 'maggie'

        },
        fieldName: 'name',
        selectData: [{
            "id": 1,
            "text": "text1"
        }, {
            "id": 2,
            "text": "text2"
        }, {
            "id": 3,
            "text": "text3",
            "selected": false
        }, {
            "id": 4,
            "text": "text4"
        }, {
            "id": 5,
            "text": "text5"
        }]

    },
    mounted: function () {
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
        getDefaultAccount: function () {
            getUserIP(function(ip){
                console.log(ip);
                $.post("/api/getDefaultAccount", {clientIP: ip}, function (result) {
                    loginVM.username = result.account;
                });
            });
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

                    alert('Login success!');
                    location.href = "/systemOption";
                }
                else {
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

/**
 * 取Client IP
 * @param onNewIP callback function
 */
function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
            iceServers: []
        }),
        noop = function() {},
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

    //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer().then(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });

        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function(reason) {
        // An error occurred, so handle the failure to connect
    });

    //listen for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}
