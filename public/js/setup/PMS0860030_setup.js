/**
 * Created by a16010 on 2017/8/14.
 * 程式編號: PMS0860030
 * 程式名稱: 區域別設定
 */

var gs_prg_id = $("#prg_id").val();
var vmHub = new Vue;
var ga_treeData = [];
var gs_action = null;

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
        },
        maxAreaCod: null
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
                vm.dataGridRows = _.map(result.dataGridRows, _.clone);
                vm.fieldData = result.fieldData;
                self.maxAreaCod = _.sortBy(result.dataGridRows, "area_cod");
                self.maxAreaCod = self.maxAreaCod[self.maxAreaCod.length - 1].area_cod;
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
            var lo_rootDataRow = _.findWhere(vm.dataGridRows, {parent_cod: "ROOT"});
            this.treeData = new Tree(lo_rootDataRow);

            searchChildAndInsert(this.treeData.root);
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

        tmpCudHandler: function (dgRowData, type, isSort) {
            var self = this;
            var lo_sel_node = this.getSelectedNode();
            lo_sel_node = this.tree.get_node(lo_sel_node);

            if (isSort) {
                var la_parentNode = this.tree.get_node(this.tree.get_parent(lo_sel_node));
                if (type == "deleteData" || type == "createData") {
                    if (type == "createData") {
                        dgRowData.sort_cod = la_parentNode.children.length;
                    }
                    la_parentNode.children = _.without(la_parentNode.children, dgRowData.area_cod);
                }
                if (la_parentNode.children.length != 0) {
                    _.each(la_parentNode.children, function (lo_childNode, Idx) {
                        var lo_dgRowData = _.findWhere(self.dataGridRows, {area_cod: lo_childNode});
                        lo_dgRowData.sort_cod = Idx;

                        // 清除已在暫存資料
                        _.each(self.tmpCud, function (obj, key) {
                            self.tmpCud[key] = _.without(obj, lo_dgRowData);
                        });

                        if (type == "deleteData") {
                            self.tmpCud[type].push(dgRowData);
                            type = "updateData";
                        }
                        else if (type == "createData") {
                            self.tmpCud[type].push(dgRowData);
                            type = "updateData";
                        }
                        self.tmpCud[type].push(lo_dgRowData);

                    });
                }
                else {
                    self.tmpCud[type].push(dgRowData);
                }
            }
            else {
                // 清除已在暫存資料
                _.each(this.tmpCud, function (obj, key) {
                    self.tmpCud[key] = _.without(obj, dgRowData);
                });
                this.tmpCud[type].push(dgRowData);
            }
        },

        doSave: function () {
            waitingDialog.show('Saving...');
            var self = this;
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
                        self.loadDataGridByPrgID();
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

        delNode: function () {
            var lo_selNode = this.getSelectedNode();
            var lo_dgRow = _.findWhere(vm.dataGridRows, {area_cod: lo_selNode});

            // 更節點不能刪除
            if (lo_dgRow.parent_cod == "ROOT") {
                return false;
            }

            $.post("/api/handleDataGridDeleteEventRule", {
                prg_id: gs_prg_id,
                deleteData: lo_dgRow
            }, function (err, result) {
                if (err) {
                    alert(err.errorMsg);
                }
                else {
                    this.tmpCudHandler(lo_dgRow, "deleteData", true);
                    this.tree.delete_node(lo_selNode);
                }
            });


        }
    }
});

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
        if (lo_node.parent_cod == "ROOT") {
            vm.treeData.root.children.push(lo_childNode);
            searchChildAndInsert(lo_childNode);
        }
        else {
            lo_node.children.push(lo_childNode);
            searchChildAndInsert(lo_childNode);
        }
    });
}

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
    this.text = rowData.area_nam;
    this.sort_cod = rowData.sort_cod;
    this.parent_cod = rowData.parent_cod;
    this.children = [];
}

function Tree(rowData) {
    var node = new Node(rowData);
    this.root = node;
}

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

function genNewAreaCod() {

    var ls_firstStr;
    var li_sortNumber;
    var ls_newStr;
    var li_newSortNumber;
    var ls_rtnAreaCod;
    var li_maxAreaCod = Number(vm.maxAreaCod);

    // 9999轉英文A1
    if (li_maxAreaCod >= 9999) {
        ls_firstStr = "A";
        li_sortNumber = 1;

        li_newSortNumber = padLeft(li_sortNumber, 3);
        ls_rtnAreaCod = ls_firstStr + li_newSortNumber;
    }
    // 有英文數字
    else if (_.isNaN(li_maxAreaCod)) {
        ls_firstStr = vm.maxAreaCod.substr(0, 1);
        li_sortNumber = Number(vm.maxAreaCod.substr(1, 3));

        if (li_sortNumber >= 999) {
            li_newSortNumber = 1;
            ls_newStr = nextChar(ls_firstStr);
        }
        else {
            li_newSortNumber = ++li_sortNumber;
            ls_newStr = ls_firstStr;
        }

        li_newSortNumber = padLeft(li_newSortNumber, 3);    // 補0
        ls_rtnAreaCod = ls_newStr + li_newSortNumber;
    }
    // 存數字
    else {
        li_newSortNumber = li_maxAreaCod;
        li_newSortNumber = ++li_newSortNumber;
        li_newSortNumber = padLeft(li_newSortNumber, 4);

        ls_rtnAreaCod = li_newSortNumber;
    }
    return ls_rtnAreaCod;
}

function padLeft(str, lenght) {
    if (str.length >= lenght) {
        return str;
    }
    else {
        return padLeft("0" + str, lenght);
    }
}

$("#areaTree").on("rename_node.jstree", function (e, data) {
    var lo_node = data.node;
    var lo_dgRow;
    if (gs_action == "rename") {
        lo_dgRow = _.findWhere(vm.dataGridRows, {area_cod: lo_node.id});
        lo_dgRow.area_nam = lo_node.text;

        vm.tmpCudHandler(lo_dgRow, "updateData", false);
        gs_action = null;
    }
    else if (gs_action == "create") {
        lo_dgRow = vm.dataGridRows[0];
        var ls_newAreaCod = genNewAreaCod();

        console.log(data);
        lo_dgRow.area_cod = ls_newAreaCod;
        lo_dgRow.area_nam = lo_node.text;
        lo_dgRow.parent_cod = lo_node.parent;
        vm.tmpCudHandler(lo_dgRow, "createData", true);
        gs_action = null;
    }
});

// tree move時事件
$("#areaTree").on("move_node.jstree", function (e, data) {
    $('#areaTree').jstree("deselect_all");
    $('#areaTree').jstree('select_node', data.node);
    var lo_node = data.node;
    var ls_parent = data.parent;
    var li_sort = data.position;

    var lo_dgRow = _.findWhere(vm.dataGridRows, {area_cod: lo_node.id});
    lo_dgRow.parent_cod = ls_parent;
    lo_dgRow.sort_cod = li_sort;

    vm.tmpCudHandler(lo_dgRow, "updateData", true);
});


