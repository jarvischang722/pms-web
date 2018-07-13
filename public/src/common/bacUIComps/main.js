import bacSelect from './bac-select';
import bacSelectGrid from './bac-select-grid';
import bacSearchComp from './bac-search-comp';
import bacUtils from './bac-utils';

Vue.component('bac-select', bacSelect);
Vue.component('bac-select-grid', bacSelectGrid);
Vue.component('search-comp', bacSearchComp);

Vue.directive('price', function (el, binding) {
    el.innerHTML = binding.value.toString().replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, function (all, pre, groupOf3Digital) {
        return pre + groupOf3Digital.replace(/\d{3}/g, ',$&');
    });
});
window.BacUtils = bacUtils;