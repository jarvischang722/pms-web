import PMS0210060 from './components/PMS0210060.vue';
import Vuex from 'vuex';

import {ghistMnModule} from '../PMS0210010/store';
import {custMnModule} from '../../sales/PMS0610010/store';
import {orderMnModule} from '../../reservation/PMS0110040/store';

const store = new Vuex.Store({
    modules: {
        ghistMnModule,
        custMnModule,
        orderMnModule
    }
});

new Vue({
    el: "#PMS0210060App",
    store,
    render: h => h(PMS0210060)
});
