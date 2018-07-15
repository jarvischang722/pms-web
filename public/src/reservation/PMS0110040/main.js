import PMS0110040 from './components/PMS0110040.vue';
import Vuex from 'vuex';

import {ghistMnModule} from '../../frontDesk/PMS0210010/store';
import {custMnModule} from '../../sales/PMS0610010/store';
import {orderMnModule} from './store';

const store = new Vuex.Store({
    modules: {
        ghistMnModule,
        custMnModule,
        orderMnModule
    }
});

Vue.use(Vuex);
new Vue({
    el: "#PMS0110040App",
    store,
    render: h => h(PMS0110040)
});