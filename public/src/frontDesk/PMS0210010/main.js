import PMS0210010 from './components/PMS0210010.vue';
import store from './store';
import VeeValidate from 'vee-validate';

const dictionary = {
    en: {
        attributes: {
            email: 'Email Address'
        }
    },
    tw: {
        messages: {
            email: "email error"
        }
    }
};

Vue.use(VeeValidate, {
    locale: 'tw',
    dictionary: dictionary
});

new Vue({
    el: "#PMS0210010App",
    store,
    render: h=> h(PMS0210010)
});