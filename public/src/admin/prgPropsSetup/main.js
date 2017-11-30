import 'vue-easytable/libs/themes-base/index.css';
import {VTable, VPagination} from 'vue-easytable';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import prgPropsTabs from './PrgPropsTabs';
import sysPrgSelect from './SysPrgSelect';

Vue.use(ElementUI);
Vue.component(VTable.name, VTable);
Vue.component(VPagination.name, VPagination);


new Vue({
    el: '#prgPropsSetupVM',
    components: {prgPropsTabs, sysPrgSelect},
    mounted() {
    },
    methods: {}
});