import Vue from 'vue';
import 'vue-easytable/libs/themes-base/index.css';
import {VTable,VPagination} from 'vue-easytable';

Vue.component(VTable.name, VTable);
Vue.component(VPagination.name, VPagination);


new Vue({
    el: '#app',
    mounted: function(){

    },
    methods: {
        doJun: function(){
            alert('doJun');
        }
    }
});