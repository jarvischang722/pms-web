/**
 * Created by a16010 on 2017/8/14.
 * 程式編號: PMS0860030
 * 程式名稱: 區域別設定
 */

var prg_id = $("#prg_id").val();
var vmHub = new Vue;
var ga_treeData = [];

var vm = new Vue({
    el: "#app",
    mounted: function () {
        this.fetchUserInfo();
        this.loadDataGridByPrgID();
    },
    data: {
        userInfo: "",
        treeData: {}
    },
    methods: {
        //取得使用者資料
        fetchUserInfo: function () {
            $.post('/api/getUserInfo', function (result) {
                if (result.success) {
                    vm.userInfo = result.userInfo;
                }
            });
        },
        //抓取顯示資料
        loadDataGridByPrgID: function () {
            $.post("/api/prgDataGridDataQuery", {prg_id: prg_id}, function (result) {
                waitingDialog.hide();
                vm.pageOneDataGridRows = result.dataGridRows;
                vm.pageOneFieldData = result.fieldData;
                vm.initAreaTree();
            });
        },

        // 初始化jstree
        initAreaTree: function () {
            this.convertDataGridRows2TreeData();
            this.createTree();
        },

        // 將資料轉換成jstree格式
        convertDataGridRows2TreeData: function () {
            var self = this;
            var lo_root = _.where(vm.pageOneDataGridRows, {parent_cod: "ROOT"});
            this.treeData = new Tree(lo_root[0]);

            _.each(vm.pageOneDataGridRows, function (eachRow, Idx) {
                if (eachRow.parent_cod != "ROOT") {
                    var lo_parentNode = getKeyValues(self.treeData.root, eachRow.parent_cod);

                    var lo_child = new Node(eachRow);
                    if (_.isNull(lo_parentNode)) {
                        self.treeData.root.children.push(lo_child);
                    }
                    else {
                        lo_parentNode.children.push(lo_child);
                    }
                }
            });

            this.treeData = JSON.stringify(this.treeData);
            this.treeData = JSON.parse(this.treeData);
            // console.log(this.treeData);

        },
        createTree: function(){
            // areaTree demo
            $('#areaTree').jstree({
                "core": {
                    "animation": 0,
                    "themes": {"stripes": true},
                    //不可多選
                    "multiple": false,
                    "check_callback": true,
                    "data": vm.treeData.root
                    // 'data' : {
                    //     "url" : "/jsonData/areaTree.json",
                    //     "dataType" : "json" // needed only if you do not supply JSON headers
                    // }
                },
                "checkbox": {
                    "keep_selected_style": true
                },
                "dnd": {
                    "dnd": true,
                    "drag_selection": true,
                    "check_while_dragging": true
                },
                "types": {
                    "#": {"max_children": 1, "max_depth": 4, "valid_children": ["root"]},
                    "root": {"icon": "/images/icon/taiwan.png", "valid_children": ["default"]},
                    "default": {"icon": "/images/icon/taiwan.png", "valid_children": ["default", "file"]},
                    "file": {"icon": "fa fa-user", "valid_children": []}
                },
                "plugins": ["dnd", "search", "state", "types", "wholerow", "checkbox"]
            });
        }
    }
});

function getKeyValues(lo_node, val) {
    var lo_parentNode = null;
    if (lo_node.children.length != 0) {
        lo_parentNode = _.findWhere(lo_node.children, {id: val});
        if (_.isUndefined(lo_parentNode)) {
            _.each(lo_node.children, function(lo_child_node){
                if(lo_child_node.children.length != 0){
                    lo_parentNode = getKeyValues(lo_child_node, val);
                }
            });
        }
    }

    if(_.isUndefined(lo_parentNode)){
        lo_parentNode = null;
    }

    return lo_parentNode;
}

function Node(rowData) {
    this.id = rowData.area_cod;
    this.text = rowData.area_nam;
    this.children = [];
}

function Tree(rowData) {
    var node = new Node(rowData);
    this.root = node;
}

var jsonData = [
    {
        id: 1,
        text: "Folder 1",
        state: {
            selected: false
        },
        children: [
            {
                id: 2,
                text: "Sub Folder 1",
                state: {
                    selected: false
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
                id: 3,
                text: "Sub Folder 2",
                state: {
                    selected: false
                }
            }
        ]
    },
    {
        id: 4,
        text: "Folder 2",
        state: {
            selected: true
        },
        children: []
    }
];

// var aryTest = getKeyValues(jsonData, "id", 10);
// console.log(aryTest);

function areaTree_create() {
    var ref = $('#areaTree').jstree(true),
        sel = ref.get_selected();
    if (!sel.length) {
        return false;
    }
    sel = sel[0];
    sel = ref.create_node(sel, {"type": "file"});
    if (sel) {
        ref.edit(sel);
    }
}
function areaTree_rename() {
    var ref = $('#areaTree').jstree(true),
        sel = ref.get_selected();
    if (!sel.length) {
        return false;
    }
    sel = sel[0];
    ref.edit(sel);
}
function areaTree_delete() {
    var ref = $('#areaTree').jstree(true),
        sel = ref.get_selected();
    if (!sel.length) {
        return false;
    }
    ref.delete_node(sel);
}


// var form_data = {};
// $(document).on("dnd_stop.vakata", function (e, data) {
//     console.log(data);
// });

//tree change时事件
// $('#areaTree').on("changed.jstree", function (e, data) {
//     console.log("The selected nodes are:");
//     console.log(data.node.id);  //选择的node id
//     console.log(data.node.text);  //选择的node text
//     form_data.ay = data.node.text;
//     form_data.ay_id = data.node.id;
// });


