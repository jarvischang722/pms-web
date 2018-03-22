/**
 * Created by kaiyue on 2017/10/22.
 * 作業儲存轉接器
 */

let _ = require("underscore");
let async = require("async");
let moment = require("moment");
let mongoAgent = require("../../plugins/mongodb");
let commonRule = require("../../ruleEngine/rules/CommonRule");
let commonTools = require("../../utils/CommonTools");
let langSvc = require("../../services/LangService");

class saveDataAdapter {
    constructor(postData, session) {
        this.session = session;
        this.params = {
            prg_id: postData.prg_id,
            func_id: postData.func_id,
            createData: postData.tmpCUD.createData || [],
            updateData: postData.tmpCUD.updateData || [],
            deleteData: postData.tmpCUD.deleteData || [],
            oriData: postData.tmpCUD.oriData || []
        };
    }


    async formating() {
        let lo_apiFormat = this.apiFormat();
        await this.convertData();
    }

    async convertData() {
        _.each(this.params.createData, function(lo_createData, index){
            this.params.createData[index] = lo_createData.action = "C";
        });
        _.each(this.params.updateData, function(lo_updateData, index){
            this.params.updateData[index] = lo_updateData.action = "U";
        });
        _.each(this.params.deleteData, function(lo_deleteData, index){
            this.params.deleteData[index] = lo_deleteData.action = "D";
        });

        console.log(this.params.createData);

        // let lo_createData = _.groupBy(this.params.createData, "page_id");
        // let lo_updateData = _.groupBy(this.params.updateData, "page_id");
        // let lo_deleteData = _.groupBy(this.params.deleteData, "page_id");

        // let [lo_delData, lo_updData, lo_creData] = await Promise.all([
        //     this.convDeleteData(),
        //     this.convUpdateData(),
        //     this.convCreateData()
        // ]);
    }

    async convDeleteData() {
    }

    async convUpdateData() {

    }

    async convCreateData() {

    }

    apiFormat() {
        return {
            locale: this.session.locale,
            reve_code: this.params.prg_id,
            prg_id: this.params.prg_id,
            func_id: this.params.func_id,
            client_ip: "",
            server_ip: "",
            event_time: "",
            mac: "",
            page_data: {}
        }
    }
}

module.exports = saveDataAdapter;