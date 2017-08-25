/**
 * Created by a16010 on 2017/8/25.
 * 程式編號: PMS0860060
 * 程式名稱: 業務員組別設定
 */

var gs_prg_id = $("#prg_id").val();
var vmHub = new Vue;
var ga_treeData = [];
var gs_action = null;

var vm = new Vue({
    el: "#PMS0860060_body",
    mounted: function () {
        this.fetchUserInfo();
        this.loadDataGridByPrgID();
    },
    data: {
        userInfo: {},
        dataGridRows: {},
        fieldData: {},
        tree: null
    },
    methods: {
        //取得使用者資料
        fetchUserInfo: function () {
            var self = this;
            $.post('/api/getUserInfo', function (result) {
                if (result.success) {
                    self.userInfo = result.userInfo;
                }
            });
        },
        //抓取顯示資料
        loadDataGridByPrgID: function () {
            var self = this;
            waitingDialog.show("Loading...");
            $.post("/api/prgDataGridDataQuery", {prg_id: gs_prg_id}, function (result) {
                self.dataGridRows = result.dataGridRows;
                self.fieldData = result.fieldData;
                self.convertDataGridRows2TreeData();
                self.initAreaTree();
                waitingDialog.hide();
            });
        },
        initAreaTree: function(){
            this.convertDataGridRows2TreeData();
            this.createTree();
            this.tree = $("#areaTree").jstree(true);
        },
        convertDataGridRows2TreeData: function(){
            var self = this;
            var lo_rootDataRow = {};

            var lo_rootNode = _.findWhere(vm.dataGridRows, {area_cod: "ROOT"});
            if (_.isUndefined(lo_rootNode)) {
                lo_rootDataRow.class_cod = "ROOT";
                lo_rootDataRow.sort_cod = 0;
                lo_rootDataRow.class_nam = "ROOT";
                lo_rootDataRow.parent_cod = "#";
                this.treeData = new Tree(lo_rootDataRow);
            }
            else {
                this.treeData = new Tree(lo_rootNode);
            }

            searchChildAndInsert(this.treeData.root);
        },
        createTree: function(){
            $('#areaTree').jstree({
                "core" : {
                    "animation" : 0,
                    "themes" : { "stripes" : true },
                    "multiple" : false,                 //不可多選
                    "check_callback" : true,
                    'data' : vm.treeData.root
                },
                "checkbox" : {
                    "keep_selected_style" : true,
                    "whole_node" : false,
                    "tie_selection":false               // 選取時，false只會選到父節點，不會選到子結點
                },
                "dnd" : {
                    "dnd" : true,
                    "drag_selection" : true,
                    "check_while_dragging" : true
                },
                "types" : {
                    "#" : { "max_children" : 1, "max_depth" : 4, "valid_children" : ["root"] },
                    "root" : { "icon" : "/images/icon/taiwan.png", "valid_children" : ["default"] },
                    "default" : {"icon" : "/images/icon/taiwan.png",  "valid_children" : ["default","file"] },
                    "file" : { "icon" : "fa fa-user", "valid_children" : [] }
                },
                "plugins" : [  "dnd", "search", "state", "types", "wholerow","checkbox" ]
            });
        },

        getSelectedNode: function () {
            var sel = this.tree.get_selected()[0];
            return sel;
        },

        addNode: function () {
            var sel = this.getSelectedNode();
            sel = this.tree.create_node(sel, {"type": "default"});
            gs_action = "create";
            if (sel) {
                this.tree.edit(sel);
            }
        },

        renameNode: function () {
            var sel = this.getSelectedNode();
            this.tree.edit(sel);
            gs_action = "rename";
        },

        delNode: function(){

        },

        doSave: function(){

        }
    }
});

function rowData(node) {
    this.area_cod = node.id;
    this.area_nam = node.text;
    this.sort_cod = node.position;
    this.parent_cod = node.parent;
}

function Node(rowData) {
    this.id = rowData.class_cod;
    this.text = rowData.class_nam;
    this.sort_cod = rowData.sort_cod;
    this.parent_cod = rowData.parent_cod;
    this.children = [];
}

function Tree(rowData) {
    var node = new Node(rowData);
    this.root = node;
}

function searchChildAndInsert(lo_node) {
    var la_childRows = _.where(vm.dataGridRows, {parent_cod: lo_node.id});

    if (la_childRows.length == 0) {
        return [];
    }
    la_childRows.sort(function (a, b) {
        return a.sort_cod - b.sort_cod;
    });
    _.each(la_childRows, function (lo_childRow) {
        var lo_childNode = new Node(lo_childRow);
        lo_node.children.push(lo_childNode);
        searchChildAndInsert(lo_childNode);
    });
}

$("#areaTree").on("select_node.jstree", function(e, data){
});
// PMS0860060 業務員設定(多筆) dataGrid
// $('#PMS0860060-table').datagrid({
//     singleSelect: true,
//     collapsible: true,
//     // 從json 撈
//     url: '/jsonData/PMS0860060.json',
//     method: 'get',
//     columns: [[
//         {field: 'clerkID', title: '業務員代號', width: 100},
//         {field: 'clerkName', title: '業務員姓名', width: 150},
//         {field: 'hotelSales', title: '飯店業務', width: 100},
//         {field: 'restSales', title: '餐飲業務', width: 100},
//         {field: 'memberSales', title: '會員業務', width: 100}
//     ]]
//
// });