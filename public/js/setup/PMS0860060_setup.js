/**
 * Created by a16010 on 2017/8/25.
 * 程式編號: PMS0860060
 * 程式名稱: 業務員組別設定
 */

var gs_prg_id = $("#prg_id").val();
var gs_action = null;

var vm = new Vue({
    el: "#PMS0860060_body",
    mounted: function () {
        this.fetchUserInfo();
        this.loadDataGridByPrgID();
    },
    data: {
        userInfo: {},
        treeDataRows: {},
        dataGridRows: {},
        fieldData: {},
        tree: null,
        maxClassCod: null,
        tmpCud: {               //新刪修暫存
            createData: [],
            updateData: [],
            deleteData: []
        },
        isTreeCreate: false
    },
    methods: {
        //取得使用者資料
        fetchUserInfo: function () {
            var self = this;
            bacUtils.doHttpPostAgent('/api/getUserInfo', function (result) {
                if (result.success) {
                    self.userInfo = result.userInfo;
                }
            });
        },

        initTemCud: function(){
            this.tmpCud.createData = [];
            this.tmpCud.updateData = [];
            this.tmpCud.deleteData = [];
        },

        //抓取顯示資料
        loadDataGridByPrgID: function () {
            var self = this;
            bacUtils.doHttpPostAgent("/api/prgDataGridDataQuery", {prg_id: gs_prg_id}, function (result) {
                vm.treeDataRows = _.map(result.dataGridRows, function (obj) {
                    if (obj.class_cod.trim() != "ROOT") {
                        var li_class_cod = Number(obj.class_cod);
                        if (_.isNaN(li_class_cod)) {
                            obj.class_cod = padLeft(obj.class_cod, 5);
                        }
                        else {
                            obj.class_cod = padLeft(obj.class_cod, 6);
                        }
                    }
                    return _.clone(obj);
                });
                self.fieldData = result.fieldData;
                if (vm.dataGridRows.length != 0) {
                    result.dataGridRows = _.without(result.dataGridRows, _.findWhere(result.dataGridRows, {class_cod: "ROOT"}));
                    self.maxClassCod = _.sortBy(result.dataGridRows, "class_cod");
                    self.maxClassCod = self.maxClassCod[self.maxClassCod.length - 1].class_cod;
                }
                else {
                    self.maxClassCod = "000000";
                }

                self.initAreaTree();
            });
        },

        initAreaTree: function () {
            this.convertDataGridRows2TreeData();
            if(this.isTreeCreate == false){
                this.createTree();
                this.tree = $("#areaTree").jstree(true);
                this.isTreeCreate = true;
            }
            else{
                this.tree.settings.core.data = vm.treeData.root;
                this.tree.refresh();
            }
        },

        convertDataGridRows2TreeData: function () {
            var self = this;
            var lo_rootDataRow = {};

            var lo_rootNode = _.findWhere(vm.treeDataRows, {class_cod: "ROOT"});
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

        createTree: function () {
            $('#areaTree').jstree({
                "core": {
                    "animation": 0,
                    "themes": {"stripes": true},
                    "multiple": false,                 //不可多選
                    "check_callback": true,
                    'data': vm.treeData.root
                },
                "checkbox": {
                    "keep_selected_style": true,
                    "whole_node": false,
                    "tie_selection": false               // 選取時，false只會選到父節點，不會選到子結點
                },
                "dnd": {
                    "dnd": true,
                    "drag_selection": true,
                    "check_while_dragging": true
                },
                "plugins": ["dnd", "search", "state", "types", "wholerow", "checkbox"]
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
            var lo_selNode = this.getSelectedNode();
            var lo_node = this.tree.get_node(lo_selNode);
            if (lo_node.id == "ROOT") {
                return true;
            }
            this.tree.edit(lo_selNode);
            gs_action = "rename";
        },

        delNode: function () {
            var self = this;
            var lo_selNode = this.getSelectedNode();
            var lo_node = this.tree.get_node(lo_selNode);
            var lo_dgRow = _.findWhere(vm.treeDataRows, {class_cod: lo_selNode});

            // 根節點不能刪除
            if (lo_node.id == "ROOT") {
                return true;
            }

            if(lo_node.createStatus == "Y"){
                this.tmpCud["createData"] = _.without(this.tmpCud["createData"], _.findWhere(this.tmpCud["createData"], {
                    class_cod: lo_node.id
                }));
                this.tree.delete_node(lo_selNode);
                return true;
            }

            var la_allDelRowData = searchNode(lo_node, []);
            la_allDelRowData.push(new rowData(lo_node));

            bacUtils.doHttpPostAgent("/api/handleDataGridDeleteEventRule", {
                prg_id: gs_prg_id,
                deleteData: la_allDelRowData
            }, function (result) {
                if (result.success) {
                    _.each(la_allDelRowData, function(delRowData){
                        var lo_childNode = self.tree.get_node(delRowData.class_cod);
                        lo_childNode.deleteStatus = "Y";
                        self.tmpCudHandler(lo_childNode);
                    });

                    self.tree.delete_node(lo_selNode);

                }
                else {
                    alert(result.errorMsg);
                }
            });


        },

        tmpCudHandler: function (currNode) {
            var self = this;
            var lo_parentNode = this.tree.get_node(this.tree.get_parent(currNode));

            // 取排序
            if (lo_parentNode.children.length != 0) {
                _.each(lo_parentNode.children, function (childNode, Idx) {
                    var lo_childNode = self.tree.get_node(childNode);
                    lo_childNode.position = Idx;
                    if(lo_childNode.createStatus == "N" || lo_childNode.deleteStatus == "N"){
                        lo_childNode.updateStatus = "Y";
                    }
                });
            }

            _.each(lo_parentNode.children, function (childNode) {
                var lo_childNode = self.tree.get_node(childNode);
                // 去除暫存重複
                _.each(self.tmpCud, function (obj, key) {
                    if (obj.length != 0) {
                        self.tmpCud[key] = _.without(obj, _.findWhere(obj, {
                            class_cod: childNode
                        }));
                    }
                });

                if(lo_childNode.createStatus == "Y"){
                    self.tmpCud["createData"].push(new rowData(lo_childNode));
                }
                if(lo_childNode.updateStatus == "Y"){
                    self.tmpCud["updateData"].push(new rowData(lo_childNode));
                }
                if(lo_childNode.deleteStatus == "Y"){
                    self.tmpCud["deleteData"].push(new rowData(lo_childNode));
                }
            });
        },

        doSave: function () {
            var self = this;
            var fieldData = [
                {ui_field_name: 'athena_id', keyable: 'Y'},
                {ui_field_name: 'class_cod', keyable: 'Y'}
            ];

            var params = {
                prg_id: gs_prg_id,
                tmpCUD: this.tmpCud,
                fieldData: fieldData,
                mainTableName: "sales_class_kvrf"
            };
            bacUtils.doHttpPostAgent('/api/execSQLProcess', params)
                .done(function (response) {
                    if (response.success) {
                        self.initTemCud();
                        self.loadDataGridByPrgID();
                        alert(go_i18nLang.SystemCommon.saveSuccess);
                    } else {
                        alert(response.errorMsg);
                    }
                })
                .fail(function (error) {
                    console.log(error);
                });
        },

        qrySalesMn: function (class_cod) {
            var self = this;
            bacUtils.doHttpPostAgent("/api/sales/qrySalesMn", {class_cod: class_cod}, function (getResult) {
                if (getResult.success) {
                    self.dataGridRows = getResult.data;
                    self.initDataGrid();
                }
                else {
                    console.error = getResult.errorMsg;
                }
            });
        },

        // 初始化業務員設定(多筆) dataGrid
        initDataGrid: function () {
            var self = this;
            $('#PMS0860060-table').datagrid({
                singleSelect: true,
                collapsible: true,
                data: self.dataGridRows,
                columns: [[
                    {field: 'sales_cod', title: '業務員代號', width: 100},
                    {field: 'sales_nam', title: '業務員姓名', width: 150},
                    {
                        field: 'hotel_sales', title: '飯店業務', width: 100, formatter: function (value) {
                        if (value == "Y") {
                            return '<input type="checkbox" name="hotel_sales" checked="checked" disabled>';
                        }
                        else {
                            return '<input type="checkbox" name="hotel_sales" disabled>';
                        }
                    }
                    },
                    {
                        field: 'bq_sales', title: '餐飲業務', width: 100, formatter: function (value) {
                        if (value == "Y") {
                            return '<input type="checkbox" name="bq_sales" checked="checked" disabled>';
                        }
                        else {
                            return '<input type="checkbox" name="bq_sales" disabled>';
                        }
                    }
                    },
                    {
                        field: 'member_sales', title: '會員業務', width: 100, formatter: function (value) {
                        if (value == "Y") {
                            return '<input type="checkbox" name="member_sales" checked="checked" disabled>';
                        }
                        else {
                            return '<input type="checkbox" name="member_sales" disabled>';
                        }
                    }
                    }
                ]]
            });
        }
    }
});

function rowData(node) {
    this.class_cod = node.id;
    this.class_nam = node.text;
    this.sort_cod = node.position;
    this.parent_cod = node.parent;
    this.level_nos = node.parents.length-1;
}

function Node(rowData) {
    this.id = rowData.class_cod;
    this.text = rowData.class_nam;
    this.sort_cod = rowData.sort_cod;
    this.parent_cod = rowData.parent_cod;
    this.createStatus = "N";
    this.updateStatus = "N";
    this.deleteStatus = "N";
    this.children = [];
}

function Tree(rowData) {
    var node = new Node(rowData);
    this.root = node;
}

function searchChildAndInsert(lo_node) {
    var la_childRows = _.where(vm.treeDataRows, {parent_cod: lo_node.id});

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

function searchNode(lo_node, la_allNode) {
    if (lo_node.children.length != 0) {
        _.each(lo_node.children, function (lo_child_node) {
            var lo_childNode = vm.tree.get_node(lo_child_node);
            la_allNode.push(new rowData(lo_childNode));
            if (lo_childNode.children.length != 0) {
                searchNode(lo_childNode, la_allNode);
            }
        });
    }

    return la_allNode;
}

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

function genNewClassCod() {

    var ls_firstStr;
    var li_sortNumber;
    var ls_newStr;
    var li_newSortNumber;
    var ls_rtnAreaCod;
    var li_maxClassCod = Number(vm.maxClassCod);

    // 999999轉英文A1
    if (li_maxClassCod >= 999999) {
        ls_firstStr = "A";
        li_sortNumber = 1;

        li_newSortNumber = padLeft(li_sortNumber, 5);
        ls_rtnAreaCod = ls_firstStr + li_newSortNumber;
    }
    // 有英文數字
    else if (_.isNaN(li_maxClassCod)) {
        ls_firstStr = vm.maxClassCod.substr(0, 1);
        li_sortNumber = Number(vm.maxClassCod.substr(1, 5));

        if (li_sortNumber >= 99999) {
            li_newSortNumber = 1;
            ls_newStr = nextChar(ls_firstStr);
        }
        else {
            li_newSortNumber = ++li_sortNumber;
            ls_newStr = ls_firstStr;
        }

        li_newSortNumber = padLeft(li_newSortNumber, 5);    // 補0
        ls_rtnAreaCod = ls_newStr + li_newSortNumber;
    }
    // 存數字
    else {
        li_newSortNumber = li_maxClassCod;
        li_newSortNumber = ++li_newSortNumber;
        li_newSortNumber = padLeft(li_newSortNumber, 6);

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

// jstree rename event
$("#areaTree").on("rename_node.jstree", function (e, data) {
    var lo_node = data.node;
    var lo_dgRow;

    vm.tree.deselect_all();
    vm.tree.select_node(lo_node);

    if (gs_action == "rename") {
        lo_dgRow = _.findWhere(vm.treeDataRows, {class_cod: lo_node.id});
        if (_.isUndefined(lo_dgRow)) {
            lo_node.createStatus = "Y";
            vm.tmpCudHandler(lo_node);
        }
        else {
            lo_node.updateStatus = "Y";
            vm.tmpCudHandler(lo_node);
        }
        gs_action = null;
    }
    else if (gs_action == "create") {
        var ls_newClassCod = genNewClassCod();
        vm.maxClassCod = ls_newClassCod;
        vm.tree.set_id(lo_node, ls_newClassCod);
        lo_node.createStatus = "Y";

        vm.tmpCudHandler(lo_node);
        gs_action = null;
    }
});

// tree move event
$("#areaTree").on("move_node.jstree", function (e, data) {
    var lo_node = data.node;
    vm.tree.deselect_all();
    vm.tree.select_node(lo_node);
    if(lo_node.createStatus != "Y"){
        lo_node.updateStatus = "Y";
    }
    vm.tmpCudHandler(lo_node);
});

$("#areaTree").on("select_node.jstree", function (e, data) {
    var lo_node = data.node;
    vm.qrySalesMn(lo_node.id);
});