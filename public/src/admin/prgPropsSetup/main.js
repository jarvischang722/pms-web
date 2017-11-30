import Vue from 'vue';
import 'vue-easytable/libs/themes-base/index.css';
import {VTable,VPagination} from 'vue-easytable';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import App from './PrgProrsSetup';


Vue.use(ElementUI);

// Vue.component(Tabs.name, Tabs);
Vue.component(VTable.name, VTable);
Vue.component(VPagination.name, VPagination);


new Vue({
    el: '#prgPropsSetupVM',
    components: {App},
    mounted(){

    },
    methods: {

    }
});