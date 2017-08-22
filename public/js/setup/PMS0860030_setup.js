/**
 * Created by a16010 on 2017/8/14.
 * 程式編號: PMS0860030
 * 程式名稱: 區域別設定
 */

var gs_prg_id = $("#prg_id").val();
var vmHub = new Vue;
var ga_treeData = [];

var vm = new Vue({
    el: "#app",
    mounted: function () {
        this.fetchUserInfo();
        this.loadDataGridByPrgID();
    },
    data: {
        dataGridRows: [],
        fieldData: [],
        userInfo: "",
        treeData: {},
        tree: null,
        tmpCud: {               //新刪修暫存
            createData: [],
            updateData: [],
            deleteData: []
        }
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
            var self = this;
            $.post("/api/prgDataGridDataQuery", {prg_id: gs_prg_id}, function (result) {
                waitingDialog.hide();
                // vm.dataGridRows = _.sortBy(result.dataGridRows, "sort_cod");
                vm.dataGridRows = result.dataGridRows;
                vm.fieldData = result.fieldData;
                vm.initAreaTree();
            });
        },

        // 初始化jstree
        initAreaTree: function () {
            this.convertDataGridRows2TreeData();
            this.createTree();
            this.tree = $("#areaTree").jstree(true);
        },

        // 將資料轉換成jstree格式
        convertDataGridRows2TreeData: function () {
            var self = this;
            var lo_root = _.findWhere(vm.dataGridRows, {parent_cod: "ROOT"});
            this.treeData = new Tree(lo_root);

            var la_childRows = _.where(vm.dataGridRows, {parent_cod: lo_root.area_cod});

            _.each(la_childRows, function(lo_childNode){

            });

            // _.each(vm.dataGridRows, function (eachRow, Idx) {
            //     if (eachRow.parent_cod != "ROOT") {
            //         var lo_parentNode = searchNode(self.treeData.root, eachRow.parent_cod);
            //
            //         var lo_child = new Node(eachRow);
            //         if (_.isNull(lo_parentNode)) {
            //             self.treeData.root.children.push(lo_child);
            //         }
            //         else {
            //             lo_parentNode.children.push(lo_child);
            //         }
            //     }
            // });

            this.treeData = JSON.stringify(this.treeData);
            this.treeData = JSON.parse(this.treeData);

        },

        createTree: function () {
            // areaTree demo

            $('#areaTree').jstree({
                "core": {
                    "animation": 0,
                    "themes": {"stripes": true},
                    "multiple": false,                  //不可多選
                    "check_callback": true,
                    "data": vm.treeData.root
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
                    "#": {"max_children": 1, "valid_children": ["root"]},
                    "root": {"icon": "/images/icon/taiwan.png", "valid_children": ["default"]},
                    "default": {"icon": "/images/icon/taiwan.png", "valid_children": ["default", "file"]},
                    "file": {"icon": "fa fa-user", "valid_children": []}
                },
                "plugins": ["dnd", "search", "state", "types", "wholerow", "checkbox"]
            });
        },

        tmpCudHandler: function (rowData, type) {
            var self = this;
            var lo_sel_node = this.getSelectedNode();
            lo_sel_node = this.tree.get_node(lo_sel_node);
            var la_parentNode = this.tree.get_node(this.tree.get_parent(lo_sel_node));


            _.each(la_parentNode.children, function (lo_childNode, Idx) {
                var lo_dgRowData = _.findWhere(self.dataGridRows, {area_cod: lo_childNode});
                lo_dgRowData.sort_cod = Idx;

                // 清除已在暫存資料
                _.each(self.tmpCud, function (obj, key) {
                    self.tmpCud[key] = _.without(obj, lo_dgRowData);
                });

                self.tmpCud[type].push(lo_dgRowData);
            });
        },

        doSave: function () {
            waitingDialog.show('Saving...');

            var fieldData = [
                {ui_field_name: 'athena_id', keyable: 'Y'},
                {ui_field_name: "area_cod", keyable: "Y"}
            ];

            var params = {
                prg_id: gs_prg_id,
                tmpCUD: this.tmpCud,
                fieldData: fieldData,
                mainTableName: "area_cod_kvrf"
            };
            $.post('/api/execSQLProcess', params)
                .done(function (response) {
                    waitingDialog.hide();
                    if (response.success) {
                        alert('save success!');
                    } else {
                        alert(response.errorMsg);
                    }
                })
                .fail(function (error) {
                    waitingDialog.hide();
                    console.log(error);
                });
        },

        getSelectedNode: function () {
            var sel = this.tree.get_selected()[0];
            return sel;
        },

        addNode: function () {
            var sel = this.getSelectedNode();
            sel = this.tree.create_node(sel, {"type": "default"});
            if (sel) {
                this.tree.edit(sel);
            }
        },

        renameNode: function () {
            var sel = this.getSelectedNode();
            this.tree.edit(sel);
        },

        delNode: function () {
            var sel = this.getSelectedNode();
            this.tree.delete_node(sel);
        }
    }
});

function searchNode(lo_node, area_cod) {
    var lo_parentNode = null;
    if (lo_node.children.length != 0) {
        lo_parentNode = _.findWhere(lo_node.children, {id: area_cod});
        if (_.isUndefined(lo_parentNode)) {
            _.each(lo_node.children, function (lo_child_node) {
                if (lo_child_node.children.length != 0) {
                    lo_parentNode = searchNode(lo_child_node, area_cod);
                }
            });
        }
    }

    if (_.isUndefined(lo_parentNode)) {
        lo_parentNode = null;
    }

    return lo_parentNode;
}

function Node(rowData) {
    this.id = rowData.area_cod;
    this.text = rowData.area_nam + rowData.sort_cod;
    this.sort_cod = rowData.sort_cod;
    this.children = [];
}

function Tree(rowData) {
    var node = new Node(rowData);
    this.root = node;
}

// tree select时事件
$('#areaTree').on("select_node.jstree", function (e, data) {
    // console.log("The selected nodes are:");
    // console.log(data.node.id);  //选择的node id
    // console.log(data.node.text);  //选择的node text
});

// tree move時事件
$("#areaTree").on("move_node.jstree", function (e, data) {
    $('#areaTree').jstree("deselect_all");
    $('#areaTree').jstree('select_node', data.node);
    var lo_node = data.node;
    var ls_parent = data.parent;
    var li_sort = data.position;

    var lo_dataGrid_row = _.findWhere(vm.dataGridRows, {area_cod: lo_node.id});
    lo_dataGrid_row.parent_cod = ls_parent;
    lo_dataGrid_row.sort_cod = li_sort;

    vm.tmpCudHandler(lo_dataGrid_row, "updateData");
});


