import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import * as KeybindingPlugin from './plugins/keybinding/vue';

Vue.config.productionTip = false;
Vue.use(KeybindingPlugin);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
