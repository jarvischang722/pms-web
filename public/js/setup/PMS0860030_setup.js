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
            var lo_root = _.findWhere(vm.pageOneDataGridRows, {parent_cod: "ROOT"});
            var tree = new Tree(lo_root);
            this.convertDataGridRows2TreeData(tree, lo_root.area_cod);
        },

        // 將資料轉換成jstree格式
        convertDataGridRows2TreeData: function (tree, ls_parent_area_cod) {

            var self = this;
            var la_children = _.where(vm.pageOneDataGridRows, {parent_cod: ls_parent_area_cod});

            if (!_.isEmpty(la_children)) {
                _.each(la_children, function (lo_children) {
                    tree.add(lo_children, ls_parent_area_cod);
                    console.log(tree);
                    self.convertDataGridRows2TreeData(tree, lo_children.area_cod);
                });
            }


        }
    }
});


function Node(rowData) {
    this.id = rowData.area_cod;
    this.text = rowData.area_nam;
    this.parent = null;
    this.children = [];
}

function Tree(rowData) {
    var node = new Node(rowData);
    this.root = node;
}

Tree.prototype.add = function (rowData, ls_parent_area_cod) {
    var lo_child = new Node(rowData);

    var parent = this.findById(this.root, ls_parent_area_cod);

    if (parent) {
        parent.children.push(lo_child);
        lo_child.parent = parent;
    }
    else {
        throw new Error("Cannot add node to a non-existent parent.");
    }
};

Tree.prototype.findById = function (data, id) {

    var arr = _.filter(data, function(obj) {
        if(_.isUndefined(obj.children)){
            return "";
        }
        else{
            return _.some(obj.children, {id: id});
        }
    });
    console.log(arr);
};

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

// areaTree demo
$('#areaTree').jstree({
    "core": {
        "animation": 0,
        "themes": {"stripes": true},
        //不可多選
        "multiple": false,
        "check_callback": true,
        "data": jsonData
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


