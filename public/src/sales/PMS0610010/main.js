import PMS0610010 from './components/PMS0610010.vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import {custMnModule} from './store';

const store = new Vuex.Store({
    modules: {
        custMnModule
    }
});

new Vue({
    el: "#PMS0610010App",
    store,
    render: h => h(PMS0610010)
});

