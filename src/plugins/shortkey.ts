import Vue, { VNode } from 'vue';

interface HandlerRef {
  vnode: VNode;
  handler: ShortKeyCallback;
  times: number;
}

interface CallbackResp {
  keys: string[];
  keyCodes: string[];
}

interface ShortKeyPluginState {
  keysActived: Set<string>;
  keyCodesActived: Set<string>;
  keysListening: Map<string[], HandlerRef>;
}

interface ShortKeyPlugin {
  subscribe: VueShortKeyHandler;
  subscribeOnce: VueShortKeyHandler;
  unsubscribe: VueShortKeyHandler;
  getState: () => ShortKeyPluginState;
}

type ShortKeyCallback = (resp: CallbackResp) => void;
type VueShortKeyHandler = (
  keyBindings: string[] | string,
  handler: ShortKeyCallback,
  times?: number
) => void;

declare module 'vue/types/vue' {
  interface Vue {
    $shortKey: ShortKeyPlugin;
  }
}

export function install(ctor: typeof Vue, options: any) {
  const keysActived = new Set();
  const keyCodesActived = new Set<string>();
  const keysListening: Map<string[], HandlerRef> = new Map();

  function didMatchKeybinding(): string[][] {
    const keybindingsMatched: string[][] = [];
    for (const combinations of keysListening.keys()) {
      // tslint:disable-next-line:no-console
      // console.log('match against', combinations);
      const match = combinations.every(
        key => keysActived.has(key) || keyCodesActived.has(key)
      );
      if (match) {
        keybindingsMatched.push(combinations);
      }
    }
    return keybindingsMatched;
  }

  document.addEventListener('keydown', evt => {
    // tslint:disable-next-line:no-console
    // console.log('down', {
    //   key: evt.key,
    //   code: evt.keyCode
    // });
    keysActived.add(evt.key.toLowerCase());
    keyCodesActived.add(evt.code.toString());
    // tslint:disable-next-line:no-console
    // console.log('stack', Array.from(keysActived));
    // tslint:disable-next-line:no-console
    // console.log('stack', keysListening);
    const keybindingsMatched = didMatchKeybinding();

    if (keybindingsMatched.length > 0) {
      evt.preventDefault();
      evt.stopPropagation();
      keybindingsMatched.forEach((match: string[]) => {
        // tslint:disable-next-line:no-console
        console.log('trigger', match);
        const ref = keysListening.get(match) as HandlerRef;

        ref.handler.call(ref.vnode, {
          keys: Array.from(keysActived),
          keyCodes: Array.from(keyCodesActived)
        });

        // Count down handler valid counts
        if (ref.times >= 0) {
          ref.times -= 1;
          if (ref.times <= 0) {
            // Deregister handler
            keysListening.delete(match);
          }
        }
      });

      // Clear keys pressed so that handler will not be triggerd again until
      // corresponding keys are pressed again
      keysActived.clear();
      keyCodesActived.clear();
    }
  });

  document.addEventListener('keyup', evt => {
    // tslint:disable-next-line:no-console
    console.log('trigger', evt);
    keysActived.delete(evt.key);
    keyCodesActived.delete(evt.code);
  });

  function onGlobalKeyDown(
    this: Vue,
    keyBinding: string[] | string,
    handler: ShortKeyCallback,
    times: number = -1
  ) {
    const keys = typeof keyBinding === 'string' ? [keyBinding] : keyBinding;
    keysListening.set(keys, {
      vnode: this.$vnode,
      handler,
      times
    });
  }

  function onceGlobalKeyDownOnce(
    this: Vue,
    keyBinding: string[] | string,
    handler: ShortKeyCallback
  ) {
    return onGlobalKeyDown.call(this, keyBinding, handler, 1);
  }

  function offGlobalKeyDown(
    keyBinding: string[] | string,
    handler: ShortKeyCallback
  ) {
    // tslint:disable-next-line:no-console
    console.log('deregister', keyBinding, handler);
    const keys = typeof keyBinding === 'string' ? [keyBinding] : keyBinding;
    for (const [k, v] of keysListening.entries()) {
      // Match keybinding
      if (keys.join(',') === k.join(',')) {
        if (v.handler === handler) {
          keysListening.delete(k);
          return;
        }
      }
    }
  }

  ctor.prototype.$shortKey = {
    subscribe: onGlobalKeyDown,
    subscribeOnce: onceGlobalKeyDownOnce,
    unsubscribe: offGlobalKeyDown,
    getState() {
      return {
        keysActived,
        keyCodesActived,
        keysListening
      };
    }
  };
}
