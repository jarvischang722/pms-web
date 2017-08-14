/**
 * Created by a16010 on 2017/8/14.
 * 程式編號: PMS0860030
 * 程式名稱: 區域別設定
 */

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

// areaTree demo
$('#areaTree').jstree({
    "core" : {
        "animation" : 0,
        "themes" : { "stripes" : true },
        "check_callback" : true
    },
    "types" : {
        "#" : { "max_children" : 1, "max_depth" : 4, "valid_children" : ["root"] },
        "root" : { "icon" : "/images/icon/taiwan.png", "valid_children" : ["default"] },
        "default" : {"icon" : "/images/icon/taiwan.png",  "valid_children" : ["default","file"] },
        "file" : { "icon" : "fa fa-user", "valid_children" : [] }
    },
    "plugins" : [ "contextmenu", "dnd", "search", "state", "types", "wholerow" ]
});


