import 'vue-easytable/libs/themes-base/index.css';
import {VTable, VPagination} from 'vue-easytable';
import prgPropsTabs from './PrgPropsTabs';
import sysPrgSelect from './SysPrgSelect';

Vue.component(VTable.name, VTable);
Vue.component(VPagination.name, VPagination);


new Vue({
    el: '#prgPropsSetupVM',
    components: {prgPropsTabs, sysPrgSelect},
    data(){
        return {
            activePrg:''
        };
    },
    mounted() {

    },
    methods: {
        setActivePrg(_prg_id){
            this.activePrg = _prg_id;
        }
    }
});