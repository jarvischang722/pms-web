/**
 *  程式編號: SYS0110010
 *  程式名稱: 權限設定
 */
import permissionMain from './components/permissionMain.vue';
import store from './store';

new Vue({
    el: "#permission-app",
    store,
    render: h=> h(permissionMain)
});
