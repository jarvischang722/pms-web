// import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'underscore';

Vue.use(Vuex);

const state = {
    gb_isCreateStatus: false,
    gb_isEditStatus: false,

    gs_custCod: "",

    //所有資料
    go_allData: {
        go_mnSingleData: {},//主檔資料
        go_rsSingleData: {},//相關設定資料
        ga_rpDataGridRowsData: [],//相關人員資料
        ga_ccDataGridRowsData: [],//合約內容資料
        ga_remarkDataGridRowsData: [],//業務備註資料
        ga_vrDataGridRowsData: []//拜訪紀錄資料
    },
    //所有原始資料
    go_allOriData: {
        go_mnSingleData: {},//主檔資料
        go_rsSingleData: {},//相關設定資料
        ga_rpDataGridRowsData: [],//相關人員資料
        ga_ccDataGridRowsData: [],//合約內容資料
        ga_remarkDataGridRowsData: [],//業務備註資料
        ga_vrDataGridRowsData: []//拜訪紀錄資料
    },

    go_rpTmpCUD: {},
    go_ccTmpCUD: {},
    go_remarkTmpCUD: {},
    go_vrTmpCUD: {}
};

const mutations = {
    //設定狀態(新增或編輯)
    setStatus(state, payload) {
        state.gb_isCreateStatus = payload.gb_isCreateStatus;
        state.gb_isEditStatus = payload.gb_isEditStatus;
    },
    //設定公司編號
    setCustCod(state, ls_custCod) {
        state.gs_custCod = ls_custCod;
    },
    //設定主檔資料
    setMnSingleData(state, payload) {
        state.go_allData.go_mnSingleData = payload.go_mnSingleData;
        state.go_allOriData.go_mnSingleData = payload.go_mnOriSingleData;
    },
    //設定相關設定資料
    setRsSingleData(state, payload) {
        state.go_allData.go_rsSingleData = payload.go_rsSingleData;
        state.go_allOriData.go_rsSingleData = payload.go_rsOriSingleData;
    },//設定相關人員資料
    setRpDataGridRowsData(state, payload) {
        state.go_allData.ga_rpDataGridRowsData = payload.ga_rpDataGridRowsData;
        state.go_allOriData.ga_rpDataGridRowsData = payload.ga_rpOriDataGridRowsData;
        state.go_rpTmpCUD = payload.go_rpTmpCUD;
    },

    //設定合約內容資料
    setCcDataGridRowsData(state, payload) {
        state.go_allData.ga_ccDataGridRowsData = payload.ga_ccDataGridRowsData;
        state.go_allOriData.ga_ccDataGridRowsData = payload.go_ccOriDataGridRowsData;
        state.go_ccTmpCUD = payload.go_ccTmpCUD;
    },
    //設定業務備註資料
    setRemarkDataGridRowsData(state, payload) {
        state.go_allData.ga_remarkDataGridRowsData = payload.ga_remarkDataGridRowsData;
        state.go_allOriData.ga_remarkDataGridRowsData = payload.ga_remarkOriDataGridRowsData;
        state.go_remarkTmpCUD = payload.go_remarkTmpCUD;
    },
    //設定拜訪紀錄資料
    setVrDataGridRowsData(state, payload) {
        state.go_allData.ga_vrDataGridRowsData = payload.ga_vrDataGridRowsData;
        state.go_allOriData.ga_vrDataGridRowsData = payload.ga_vrOriDataGridRowsData;
        state.go_vrTmpCUD = payload.go_vrTmpCUD;
    }
};

const actions = {
    //設定狀態(新增或編輯)
    setStatus({commit}, payload) {
        commit("setStatus", payload);
    },
    //設定公司編號
    setCustCod({commit}, ls_custCod) {
        commit("setCustCod", ls_custCod);
    },
    //設定主檔資料
    setMnSingleData({commit}, payload) {
        commit("setMnSingleData", payload);
    },
    //設定相關設定資料
    setRsSingleData({commit}, payload) {
        commit("setRsSingleData", payload);
    },
    //設定相關人員資料
    setRpDataGridRowsData({commit}, payload) {
        commit("setRpDataGridRowsData", payload);
    },
    //設定合約內容資料
    setCcDataGridRowsData({commit}, payload) {
        commit("setCcDataGridRowsData", payload);
    },
    //設定業務備註資料
    setRemarkDataGridRowsData({commit}, payload) {
        commit("setRemarkDataGridRowsData", payload);
    },
    //設定拜訪紀錄資料
    setVrDataGridRowsData({commit}, payload) {
        commit("setVrDataGridRowsData", payload);
    },
    //取得所有資料是否有改變
    qryAllDataIsChange({state}) {
        var lb_isDataChanged = false;
        _.each(state.go_allData, function (val, key) {
            if (_.isArray(val)) {
                if (val.length != state.go_allOriData[key].length) {
                    lb_isDataChanged = true;
                    return;
                }
                else {
                    _.each(val, function (lo_val, idx) {
                        if (!_.isMatch(lo_val, state.go_allOriData[key][idx])) {
                            lb_isDataChanged = true;
                            return;
                        }
                    });
                }
            }
            else {
                if (!_.isMatch(val, state.go_allOriData[key])) {
                    lb_isDataChanged = true;
                    return;
                }
            }
        });
        return {success: true, isChange: lb_isDataChanged};
    },
    //清空所有資料
    setAllDataClear({dispatch}) {
        dispatch("setMnSingleData", {
            go_mnSingleData: {},
            go_mnOriSingleData: {}
        });
        dispatch("setRsSingleData", {
            go_rsSingleData: {},
            go_rsOriSingleData: {}
        });
        dispatch("setRpDataGridRowsData", {
            ga_rpDataGridRowsData: [],
            ga_rpOriDataGridRowsData: [],
            go_rpTmpCUD: {}
        });
        dispatch("setCcDataGridRowsData", {
            ga_ccDataGridRowsData: [],
            go_ccOriDataGridRowsData: [],
            go_ccTmpCUD: {}
        });
        dispatch("setRemarkDataGridRowsData", {
            ga_remarkDataGridRowsData: [],
            ga_remarkOriDataGridRowsData: [],
            go_remarkTmpCUD: {}
        });
        dispatch("setVrDataGridRowsData", {
            ga_vrDataGridRowsData: [],
            ga_vrOriDataGridRowsData: [],
            go_vrTmpCUD: {}
        });
    },
    //儲存所有資料
    async doSaveAllData({commit, dispatch, state}) {
        var err = null;
        var lo_tmpCUD = {
            createData: [],
            updateData: [],
            deleteData: [],
            oriData: [],
            dt_createData: [],
            dt_updateData: [],
            dt_deleteData: [],
            dt_oriData: []
        };

        let lo_rsSingleData = JSON.parse(JSON.stringify(state.go_allData.go_rsSingleData));
        lo_rsSingleData.ins_dat = moment(new Date(lo_rsSingleData.ins_dat)).format("YYYY/MM/DD HH:mm:ss");
        lo_rsSingleData.cust_idx_credit_amt = go_formatDisplayClass.removeAmtFormat(lo_rsSingleData.cust_idx_credit_amt.toString());
        lo_rsSingleData.cust_idx_ar_amt = go_formatDisplayClass.removeAmtFormat(lo_rsSingleData.cust_idx_ar_amt.toString());
        lo_rsSingleData.cust_idx_ar_amt = go_formatDisplayClass.removeAmtFormat(lo_rsSingleData.cust_idx_ar_amt.toString());
        lo_rsSingleData.cust_idx_credit_sta = lo_rsSingleData.cust_idx_credit_sta ? 'Y' : 'N';

        if (state.gb_isCreateStatus) {
            lo_tmpCUD.createData = [
                _.extend(state.go_allData.go_mnSingleData, state.go_allData.go_rsSingleData)
            ];
            _.each(state.go_rpTmpCUD.createData, function (lo_createData) {
                lo_createData = _.extend(lo_createData, {cust_cod: state.gs_custCod});
                lo_tmpCUD.dt_createData.push(lo_createData);
            });
            _.each(state.go_ccTmpCUD.createData, function (lo_createData) {
                lo_tmpCUD.dt_createData.push(lo_createData);
            });
            _.each(state.go_vrTmpCUD.createData, function (lo_createData) {
                lo_tmpCUD.dt_createData.push(lo_createData);
            });
            _.each(state.go_remarkTmpCUD.createData, function (lo_createData) {
                lo_tmpCUD.dt_createData.push(lo_createData);
            });
        }
        else if (state.gb_isEditStatus) {
            lo_tmpCUD.updateData = [
                _.extend(state.go_allData.go_mnSingleData, lo_rsSingleData)
            ];
            lo_tmpCUD.oriData = [
                _.extend(state.go_allOriData.go_mnSingleData, state.go_allData.go_rsSingleData)
            ];

            _.each(state.go_rpTmpCUD.createData, function (lo_createData) {
                lo_createData = _.extend(lo_createData, {cust_cod: state.gs_custCod});
                lo_tmpCUD.dt_createData.push(lo_createData);
            });
            _.each(state.go_ccTmpCUD.createData, function (lo_createData) {
                lo_tmpCUD.dt_createData.push(lo_createData);
            });
            _.each(state.go_vrTmpCUD.createData, function (lo_createData) {
                lo_tmpCUD.dt_createData.push(lo_createData);
            });
            _.each(state.go_remarkTmpCUD.createData, function (lo_createData) {
                lo_tmpCUD.dt_createData.push(lo_createData);
            });

            _.each(state.go_rpTmpCUD.updateData, function (lo_updateData) {
                lo_updateData = _.extend(lo_updateData, {cust_cod: state.gs_custCod});
                lo_tmpCUD.dt_updateData.push(lo_updateData);
            });
            _.each(state.go_ccTmpCUD.updateData, function (lo_updateData) {
                lo_tmpCUD.dt_updateData.push(lo_updateData);
            });
            _.each(state.go_vrTmpCUD.updateData, function (lo_updateData) {
                lo_tmpCUD.dt_updateData.push(lo_updateData);
            });
            _.each(state.go_remarkTmpCUD.updateData, function (lo_updateData) {
                lo_tmpCUD.dt_updateData.push(lo_updateData);
            });

            _.each(state.go_rpTmpCUD.deleteData, function (lo_deleteData) {
                lo_deleteData = _.extend(lo_deleteData, {cust_cod: state.gs_custCod});
                lo_tmpCUD.dt_deleteData.push(lo_deleteData);
            });
            _.each(state.go_ccTmpCUD.deleteData, function (lo_deleteData) {
                lo_tmpCUD.dt_deleteData.push(lo_deleteData);
            });
            _.each(state.go_vrTmpCUD.deleteData, function (lo_deleteData) {
                lo_tmpCUD.dt_deleteData.push(lo_deleteData);
            });
            _.each(state.go_remarkTmpCUD.deleteData, function (lo_deleteData) {
                lo_tmpCUD.dt_deleteData.push(lo_deleteData);
            });

            _.each(state.go_rpTmpCUD.oriData, function (lo_oriData) {
                lo_oriData = _.extend(lo_oriData, {cust_cod: state.gs_custCod});
                lo_tmpCUD.dt_oriData.push(lo_oriData);
            });
            _.each(state.go_ccTmpCUD.oriData, function (lo_oriData) {
                lo_tmpCUD.dt_oriData.push(lo_oriData);
            });
            _.each(state.go_vrTmpCUD.oriData, function (lo_oriData) {
                lo_tmpCUD.dt_oriData.push(lo_oriData);
            });
            _.each(state.go_remarkTmpCUD.oriData, function (lo_oriData) {
                lo_tmpCUD.dt_oriData.push(lo_oriData);
            });
        }

        return await $.post('/api/doOperationSave', {
            prg_id: 'PMS0610020',
            page_id: 1,
            func_id: lo_tmpCUD.createData.length > 0 ? "0200" : "0400",
            trans_cod: 'PMS0610020',
            tmpCUD: lo_tmpCUD
        }).then(result => {
            return (result);
        });

    }
};

const getters = {};

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});


