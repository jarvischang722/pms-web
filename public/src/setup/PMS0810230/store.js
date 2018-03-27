import Vuex from 'vuex';
import _ from 'underscore';

Vue.use(Vuex);

const state = {
    go_userInfo: {},

    gb_isCreateStatus: false,
    gb_isEditStatus: false,

    gs_rateCod: "",

    //欄位資料
    ga_utFieldsData: [],

    //所有資料
    go_allData: {
        go_mnSingleData: {},
        ga_utDataGridRowsData: []
    },
    //所有原始資料
    go_allOriData: {
        go_mnSingleData: {},
        ga_utDataGridRowsData: []
    },

    go_utTmpCUD: {},
    go_rtTmpCUD: {}
};

const mutations = {
    //設定使用者資訊
    setUserInfo(state, payload){
        state.go_userInfo = payload.go_userInfo;
    },
    //設定狀態(新增或編輯)
    setStatus(state, payload) {
        state.gb_isCreateStatus = payload.gb_isCreateStatus;
        state.gb_isEditStatus = payload.gb_isEditStatus;
    },
    //設定房價編號
    setRateCod(state, ls_rateCod) {
        state.gs_rateCod = ls_rateCod;
    },
    //設定主檔資料
    setMnSingleData(state, payload){
        state.go_allData.go_mnSingleData = payload.go_mnSingleData;
        state.go_allOriData.go_mnSingleData = payload.go_mnOriSingleData;
    },
    //設定使用期間資料
    setUseTimeData(state, payload) {
        state.ga_utFieldsData = payload.ga_utFieldsData;
        state.go_allData.ga_utDataGridRowsData = payload.ga_utDataGridRowsData;
        state.go_allOriData.ga_utDataGridRowsData = payload.ga_utOriDataGridRowsData;
        state.go_utTmpCUD = payload.go_utTmpCUD;
    },
    //設定房型資料
    setRoomTypData(state, payload){
        state.go_rtTmpCUD = payload.go_rtTmpCUD;
    }
};

const actions = {
    //設定使用者資訊
    setUserInfo({commit}, payload){
        commit("setUserInfo", payload);
    },
    //設定狀態(新增或編輯)
    setStatus({commit}, payload) {
        commit("setStatus", payload);
    },
    //設定房價編號
    setRateCod({commit}, ls_rateCod) {
        commit("setRateCod", ls_rateCod);
    },
    //設定主檔資料
    setMnSingleData({commit}, payload){
        commit("setMnSingleData", payload);
    },
    //設定使用期間資料
    setUseTimeData({commit}, payload) {
        commit("setUseTimeData", payload);
    },
    //設定房型資料
    setRoomTypData({commit}, payload){
        commit("setRoomTypData", payload);
    },
    //清除所有資料
    setAllDataClear({dispatch}) {
        dispatch("setUseTimeData", {
            ga_utFieldsData: [],
            ga_utDataGridRowsData: [],
            ga_utOriDataGridRowsData: [],
            go_utTmpCUD: {}
        });
        dispatch("setRoomTypData", {
            go_rtTmpCUD: {}
        });
    },
    //儲存所有資料
    async doSaveAllData({commit, dispatch, state}){
        let lo_tmpCUD = {
            createData: [],
            updateData: [],
            deleteData: [],
            oriData: []
        };

        if(state.gb_isCreateStatus){
            lo_tmpCUD.createData.push(state.go_allData.go_mnSingleData);
            _.each(state.go_rtTmpCUD.createData, function (lo_createData) {
                lo_tmpCUD.createData.push(lo_createData);
            });
            _.each(state.go_utTmpCUD.createData, function (lo_createData) {
                lo_tmpCUD.createData.push(lo_createData);
            });
        }
        else if(state.gb_isEditStatus){
            lo_tmpCUD.updateData.push(state.go_allData.go_mnSingleData);
            lo_tmpCUD.oriData.push(state.go_allOriData.go_mnSingleData);

            _.each(state.go_rtTmpCUD.createData, function (lo_createData) {
                lo_tmpCUD.createData.push(lo_createData);
            });
            _.each(state.go_utTmpCUD.createData, function (lo_createData) {
                lo_tmpCUD.createData.push(lo_createData);
            });

            _.each(state.go_rtTmpCUD.updateData, function (lo_updateData) {
                lo_tmpCUD.updateData.push(lo_updateData);
            });
            _.each(state.go_utTmpCUD.updateData, function (lo_updateData) {
                lo_tmpCUD.updateData.push(lo_updateData);
            });

            _.each(state.go_rtTmpCUD.oriData, function (lo_oriData) {
                lo_tmpCUD.oriData.push(lo_oriData);
            });
            _.each(state.go_utTmpCUD.oriData, function (lo_oriData) {
                lo_tmpCUD.oriData.push(lo_oriData);
            });

            _.each(state.go_rtTmpCUD.deleteData, function (lo_deleteData) {
                lo_tmpCUD.deleteData.push(lo_deleteData);
            });
            _.each(state.go_utTmpCUD.deleteData, function (lo_deleteData) {
                lo_tmpCUD.deleteData.push(lo_deleteData);
            });
        }
        console.log(lo_tmpCUD);
        return {success: true};
        // return await $.post('/api/execNewFormatSQL', {
        //     prg_id: 'PMS0810230',
        //     func_id: state.gb_isCreateStatus ? "0520" : "0540",
        //     tmpCUD: lo_tmpCUD
        // }).then(result => {
        //     return (result);
        // }).catch(err=>{
        //     throw new Error(err);
        // });
    }
};

const getters = {};

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});