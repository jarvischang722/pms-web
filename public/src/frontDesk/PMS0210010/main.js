import PMS0210010 from './components/PMS0210010.vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import {ghistMnModule} from './store';

const store = new Vuex.Store({
    modules: {
        ghistMnModule
    }
});

new Vue({
    el: "#PMS0210010App",
    store,
    render: h => h(PMS0210010)
});