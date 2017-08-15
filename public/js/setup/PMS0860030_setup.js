/**
 * Created by a16010 on 2017/8/14.
 * 程式編號: PMS0860030
 * 程式名稱: 區域別設定
 */

var prg_id = $("#prg_id").val();
var vmHub = new Vue;

var vm = new Vue({
    el: "#app",
    mounted: function(){
        this.fetchUserInfo();
        this.loadDataGridByPrgID(function (success) {
        });
    },
    data: {
        userInfo: ""
    },
    methods: {
        //取得使用者資料
        fetchUserInfo: function () {
            $.post('/api/getUserInfo', function (result) {
                if (result.success) {
                    vm.userInfo = result.userInfo;
                }
            });
        }
    }
});

var jsonData = [
    {
        id  : 1,
        text : "Folder 1",
        state : {
            selected  : false
        },
        children    : [
            {
                id  : 2,
                text : "Sub Folder 1",
                state : {
                    selected  : false
                },
                children: [
                    {
                        id: 5,
                        text: "sub folder child 1",
                        state: {
                            selected: false
                        }
                    }
                ]
            },
            {
                id  : 3,
                text : "Sub Folder 2",
                state : {
                    selected  : false
                }
            }
        ]
    },
    {
        id: 4,
        text : "Folder 2",
        state : {
            selected : true
        },
        children : []
    }
];

// areaTree demo
$('#areaTree').jstree({
    "core" : {
        "animation" : 0,
        "check_callback" : true,
        "themes" : { "stripes" : true },
        'data' : jsonData
    },
    "plugins" : [ "dnd", "search", "state", "types", "wholerow" ]
});

function areaTree_create() {
    var ref = $('#areaTree').jstree(true),
        sel = ref.get_selected();
    if(!sel.length) { return false; }
    sel = sel[0];
    sel = ref.create_node(sel, {"type":"file"});
    if(sel) {
        ref.edit(sel);
    }
}
function areaTree_rename() {
    var ref = $('#areaTree').jstree(true),
        sel = ref.get_selected();
    if(!sel.length) { return false; }
    sel = sel[0];
    ref.edit(sel);
}
function areaTree_delete() {
    var ref = $('#areaTree').jstree(true),
        sel = ref.get_selected();
    if(!sel.length) { return false; }
    ref.delete_node(sel);
}


