import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import * as ShortKeyPlugin from './plugins/shortkey';

Vue.config.productionTip = false;
Vue.use(ShortKeyPlugin);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
