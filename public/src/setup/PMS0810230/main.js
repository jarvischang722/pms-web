import PMS0810230 from './components/PMS0810230.vue';
import store from './store';

//vue easy table 刪除按鈕
Vue.component('table-operation', {
    template: '<span class="column-cell-class-delete" @click.stop.prevent="deleteRow(rowData,index)">▬</span>',
    props: {
        rowData: {
            type: Object
        },
        field: {
            type: String
        },
        index: {
            type: Number
        }
    },
    methods: {
        deleteRow() {
            let params = {type: 'delete', index: this.index, rowData: this.rowData};
            this.$emit('on-custom-comp', params);
        }
    }
});

new Vue({
    el: "#PMS0810230App",
    store,
    render: h => h(PMS0810230)
});