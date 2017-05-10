/**
 * Created by Jun on 2017/5/10.
 */
var _ = require('underscore');
var _s = require('underscore.string');
var config = require("../configs/database");
require('../plugins/kplug-oracle/DB').create(config.oracle);
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var funcSvc = require("../services/roleFuncService");
var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var alasql = require("alasql");
var langSvc = require("../services/langService");
var sys_id = "PMS0000000";
var athena_id = 1;
var func_hotel_cod = '02';
var user_id = 'a14017'
var user_comp_cod = 'MIRACHU'
sys_id = 'PMS0000000', '123455';
getSysMdl();
// queryAgent.queryList("QRY_BAC_SUBSYSTEM_BY_SYS_ID", {sys_id: sys_id}, 0, 0, function (err, processList) {
//     console.log(processList);
// });
function getSysMdl() {
    var la_locales = ['en','zh_TW'];
    var params = {
        user_comp_cod: user_comp_cod,
        user_id: user_id,
        athena_id: athena_id,
        func_hotel_cod: func_hotel_cod,
    };
    var la_menuList = [];
    async.waterfall([
        function (callback) {
            queryAgent.queryList("QRY_BAC_SYS_MODULE_BY_USER", params, 0, 0, function (err, menuList) {
                if (err) {
                    menuList = [];
                }
                menuList = _.where(menuList, {
                    menu_athena_id: athena_id,
                    func_comp_cod: user_comp_cod,
                    func_hotel_cod: func_hotel_cod
                });
                la_menuList = menuList;
                callback(err, menuList);
            });
        },
        function (la_menuSubSys, callback) {
            //找出系統全部子系統
            var la_menuSubSys = _.where(la_menuList, {
                pre_id: sys_id,
                id_typ: 'SUBSYS'
            });
            queryAgent.queryList("QRY_BAC_SUBSYSTEM_BY_SYS_ID", {sys_id: sys_id}, 0, 0, function (err, subsysList) {
                subsysList = alasql("select subsys.* " +
                    "from  ? subsys  " +
                    "inner join ? meun_sub_sys  on meun_sub_sys.current_id = subsys.subsys_id "
                    , [subsysList, la_menuSubSys]);


                langSvc.handleMultiLangContentByField("lang_bac_subsysmenu_rf",'subsys_nam','',function(err,langContent){

                    _.each(subsysList,function(subsys,sysIdx){
                        _.each(la_locales,function(locale){
                            var lo_subsysLang = _.findWhere(langContent,{subsys_id:subsys.subsys_id,locale:locale});
                            subsysList[sysIdx]["subsys_name_"+locale] = lo_subsysLang ? lo_subsysLang.words : "";
                        })

                    })

                    callback(err, subsysList);

                });


            });
        },
        function (subsysList, callback) {

            queryAgent.queryList("QRY_S99_PROCESS_BY_SYS_MODULE", {sys_id: sys_id}, 0, 0, function (err, mdlProList) {
                // console.log(mdlProList);
                var mdlList = [];
                var mdlGrp = _.groupBy(mdlProList, "mdl_id");
                _.each(mdlGrp, function (processGrp, mdl_id) {
                    var lo_mdlInfo = mdlGrp[mdl_id][0];
                    mdlList.push({
                        mdl_id: lo_mdlInfo.mdl_id,
                        mdl_name_zh_TW: lo_mdlInfo.mdl_name_zh_tw,
                        mdl_name_en: lo_mdlInfo.mdl_name_en,
                        processGrp: processGrp
                    });
                });

                _.each(subsysList, function (subsys,sIdx) {
                      var menuMdlList = _.where(la_menuList,{
                          pre_id: subsys.subsys_id,
                          id_typ: 'MODEL'
                      })
                    var la_mdlList = [];
                        _.each(menuMdlList,function(mdl){
                             var ls_mdl_id = mdl.current_id;
                             if(_.findIndex(mdlList , {mdl_id :ls_mdl_id})> -1){
                                 la_mdlList.push( mdlList[_.findIndex(mdlList , {mdl_id :ls_mdl_id})] );
                             }
                        })
                    subsysList[sIdx]["mdlGrp"] = la_mdlList;
                });

                callback(err, subsysList);
            });


        }
    ], function (err, result) {

    });

}