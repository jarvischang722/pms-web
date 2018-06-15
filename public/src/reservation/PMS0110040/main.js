import PMS0110040 from './components/PMS0110040.vue';
import store from '../../frontDesk/PMS0210010/store';

new Vue({
    el: "#PMS0110040App",
    store,
    render: h => h(PMS0110040)
});