import bacSelect from './bac-select';
import bacSelectGrid from './bac-select-grid';
import bacSearchComp from './bac-search-comp';
import bacUtils from './bac-utils';

Vue.component('bac-select', bacSelect);
Vue.component('bac-select-grid', bacSelectGrid);
Vue.component('search-comp', bacSearchComp);

window.bacUtils = bacUtils;