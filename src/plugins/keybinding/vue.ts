import Vue from 'vue';
import createVuePlugin from './plugin/index.vue';
import { Pluggable } from './plugin/index.d';

/**
 * Plugin entrance for vue
 * @example
 * import KeybindingPlugin from 'path-to-plugin';
 * Vue.use(KeybindingPlugin)
 * @param ctor constructor of Vue
 */
export function install(ctor: typeof Vue) {
  const plugin = createVuePlugin();

  // Extend Vue.prototype
  Object.defineProperties(ctor.prototype, {
    $keybinding: {
      get(this: Vue) {
        const extension: Pluggable = {
          subscribe: plugin.subscribe.bind(this),
          subscribeOnce: plugin.subscribeOnce.bind(this),
          unsubscribe: plugin.unsubscribe.bind(this),
          attach: plugin.attach.bind(this),
          detach: plugin.detach.bind(this)
        };
        return extension;
      }
    }
  });
}

export default {
  install
};
