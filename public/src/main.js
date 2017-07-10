import Vue from 'vue';
import ElementUI from "element-ui";
import "element-ui/lib/theme-default/index.css";
import App from './components/App.vue';
Vue.use(ElementUI)

new Vue({
    el: '#app',
    components: { App },
    mounted:function(){

    },
    methods:{
        doJun:function(){
            alert('doJun');
        }
    }
})