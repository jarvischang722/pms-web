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

    tmpCUD: {
        createData: [],
        updateData: [],
        deleteData: [],
        dt_createData: [],
        dt_updateData: [],
        dt_deleteData: []
    }
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
    },
    //設定相關人員資料
    setRpDataGridRowsData(state, payload) {
        state.go_allData.ga_rpDataGridRowsData = payload.ga_rpDataGridRowsData;
        state.go_allOriData.ga_rpDataGridRowsData = payload.ga_rpOriDataGridRowsData;
    },
    //設定合約內容資料
    setCcDataGridRowsData(state, payload) {
        state.go_allData.ga_ccDataGridRowsData = payload.ga_ccDataGridRowsData;
        state.go_allOriData.ga_ccDataGridRowsData = payload.go_ccOriDataGridRowsData;
    },
    //設定業務備註資料
    setRemarkDataGridRowsData(state, payload) {
        state.go_allData.ga_remarkDataGridRowsData = payload.ga_remarkDataGridRowsData;
        state.go_allOriData.ga_remarkDataGridRowsData = payload.ga_remarkOriDataGridRowsData;
    },
    //設定拜訪紀錄資料
    setVrDataGridRowsData(state, payload) {
        state.go_allData.ga_vrDataGridRowsData = payload.ga_vrDataGridRowsData;
        state.go_allOriData.ga_vrDataGridRowsData = payload.ga_vrOriDataGridRowsData;
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
    qryAllDataIsChange({state}){
        var lb_isDataChanged = false;
        _.each(state.go_allData, function(val, key){
            if(_.isArray(val)){
                if(val.length != state.go_allOriData[key].length){
                    lb_isDataChanged = true;
                    return;
                }
                else{
                    _.each(val, function(lo_val, idx){
                        if(!_.isMatch(lo_val, state.go_allOriData[key][idx])){
                            lb_isDataChanged = true;
                            return;
                        }
                    });
                }
            }
            else{
                if(!_.isMatch(val, state.go_allOriData[key])){
                    lb_isDataChanged = true;
                    return;
                }
            }
        });
        return {success: true, isChange: lb_isDataChanged};
    },
    //清空所有資料
    setAllDataClear({dispatch}){
        dispatch("setMnSingleData",{
            go_mnSingleData: {},
            go_mnOriSingleData: {}
        });
        dispatch("setRsSingleData",{
            go_rsSingleData: {},
            go_rsOriSingleData: {}
        });
        dispatch("setRpDataGridRowsData",{
            ga_rpDataGridRowsData: [],
            ga_rpOriDataGridRowsData: []
        });
        dispatch("setCcDataGridRowsData",{
            ga_ccDataGridRowsData: [],
            go_ccOriDataGridRowsData: []
        });
        dispatch("setRemarkDataGridRowsData",{
            ga_remarkDataGridRowsData: [],
            ga_remarkOriDataGridRowsData: []
        });
        dispatch("setVrDataGridRowsData",{
            ga_vrDataGridRowsData: [],
            ga_vrOriDataGridRowsData:[]
        });
    },
    //儲存所有資料
    doSaveAllData({commit, dispatch, state}){
        var err = null;
        if(state.gb_isCreateStatus){

            console.log(state.go_allData.go_mnSingleData);
        }
        else if(state.gb_isCreateStatus){

        }

        return({success: true, errorMsg:err});
    }
};

const getters = {};

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});


