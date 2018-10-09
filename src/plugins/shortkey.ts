import Vue, { VNode } from 'vue';

type ShortKeyCallback = (resp: CallbackResp) => void;
type ShortKeyHandler = (
  keyBindings: string[] | string,
  handler?: ShortKeyCallback,
  canRepeat?: boolean,
  times?: number
) => void;

interface ShortKeyCombination {
  raw: string[];
  modifier: string[];
  key: string;
}

interface CallbackResp {
  combinations: ShortKeyCombination;
}

interface ShortKeyPluginState {
  listeners: Set<ShortKeyListener>;
  componentsListening: Set<Vue>;
  keyActived: string;
  modifierActived: Record<string, boolean>;
}

interface ShortKeyPlugin {
  subscribe: ShortKeyHandler;
  subscribeOnce: ShortKeyHandler;
  unsubscribe: ShortKeyHandler;
  attach: () => void;
  getState: () => ShortKeyPluginState;
}

interface ShortKeyHandlerRef {
  component: Vue;
  handler: ShortKeyCallback;
  times: number;
}

interface ShortKeyListener {
  expected: ShortKeyCombination;
  canRepeat: boolean;
  handlerRef: ShortKeyHandlerRef;
}

declare module 'vue/types/vue' {
  interface Vue {
    $shortKey: ShortKeyPlugin;
  }
}

export function install(ctor: typeof Vue, options: any) {
  const state: ShortKeyPluginState = {
    listeners: new Set<ShortKeyListener>(),
    componentsListening: new Set<Vue>(),
    keyActived: '',
    modifierActived: {
      metaKey: false,
      altKey: false,
      ctrlKey: false,
      shiftKey: false
    }
  };

  const keyboardCodePattern = /Key([A-Z])/;

  function parseKeybinding(keys: string[]): ShortKeyCombination {
    return keys.reduce(
      (parsed: ShortKeyCombination, key: string): ShortKeyCombination => {
        const lowerKey = key.toLowerCase();
        switch (lowerKey) {
          case 'meta':
          case 'super':
          case 'command':
          case 'cmd':
            parsed.modifier.push('meta');
            break;
          case 'ctrl':
          case 'control':
            parsed.modifier.push('ctrl');
            break;
          case 'alt':
          case 'options':
            parsed.modifier.push('alt');
            break;
          case 'shift':
            parsed.modifier.push('shift');
            break;
          case 'del':
          case 'delete':
            parsed.key = 'delete';
            break;
          default:
            if (parsed.key !== '') {
              // tslint:disable-next-line:no-console
              console.warn(
                `${JSON.stringify(keys)}: ${
                  parsed.key
                } will be replaced by ${lowerKey}`
              );
            }
            parsed.key = lowerKey;
        }

        return parsed;
      },
      {
        raw: keys,
        modifier: [],
        key: ''
      }
    );
  }

  function combineCombination(combination: ShortKeyCombination): string {
    return [...combination.modifier, combination.key].sort().join(',');
  }

  function combine(keys: string[]): string {
    return combineCombination(parseKeybinding(keys));
  }

  function matchKeybinding(expected: ShortKeyCombination): boolean {
    return (
      expected.key === state.keyActived &&
      expected.modifier.every(
        modifierKey => state.modifierActived[`${modifierKey}Key`]
      )
    );
  }

  function didMatchKeybinding(): ShortKeyListener[] {
    const keybindingsMatched: ShortKeyListener[] = [];
    // Filter through listeners
    for (const listener of state.listeners) {
      if (matchKeybinding(listener.expected)) {
        keybindingsMatched.push(listener);
      }
    }
    return keybindingsMatched;
  }

  // Normalize key of [a-z]
  function parseKeyboardCode(code: string) {
    if (keyboardCodePattern.test(code)) {
      return code.replace(keyboardCodePattern, '$1').toLowerCase();
    }

    return code.toLowerCase();
  }

  document.addEventListener('keydown', evt => {
    switch (evt.key) {
      case 'Meta':
        // Command key pressed
        state.modifierActived.metaKey = true;
        break;
      case 'Win':
        // Window key pressed
        state.modifierActived.metaKey = true;
        break;
      case 'Alt':
        // alt/options key pressed
        state.modifierActived.altKey = true;
        break;
      case 'Control':
        state.modifierActived.ctrlKey = true;
        break;
      case 'Shift':
        state.modifierActived.shiftKey = true;
        break;
      default:
        state.modifierActived = {
          ...state.modifierActived,
          metaKey: evt.metaKey,
          altKey: evt.altKey,
          ctrlKey: evt.ctrlKey,
          shiftKey: evt.shiftKey
        };
        state.keyActived = evt.code
          ? parseKeyboardCode(evt.code)
          : evt.key.toLowerCase();
        break;
    }

    state.componentsListening.forEach(component => {
      // Generic keydown event
      component.$emit('shortKey:keydown', {
        key: state.keyActived,
        ...state.modifierActived,
        repeat: evt.repeat
      });
    });

    const keybindingsMatched = didMatchKeybinding();

    if (keybindingsMatched.length > 0) {
      // Block default actions of browser
      evt.preventDefault();
      evt.stopPropagation();

      keybindingsMatched.forEach((match: ShortKeyListener) => {
        if (evt.repeat && !match.canRepeat) {
          // Decide whether short key can be triggered
          // repeatedly
          return;
        }

        const ref = match.handlerRef;

        ref.handler.call(ref.component, {
          combination: match.expected
        });

        // Broadcast a match
        state.componentsListening.forEach(component => {
          // Generic keydown event
          component.$emit('shortKey:capture', {
            expected: match.expected.raw,
            key: state.keyActived,
            ...state.modifierActived
          });
        });

        // Count down handler valid counts
        // ref.times === -1 means Infiniy
        if (ref.times >= 0) {
          ref.times -= 1;
          if (ref.times <= 0) {
            // Deregister handler
            state.listeners.delete(match);
          }
        }
      });
    }
  });

  document.addEventListener('keyup', evt => {
    // tslint:disable-next-line:no-console
    switch (evt.key) {
      case 'Meta':
        // Command key pressed
        state.modifierActived.metaKey = false;
        // Other key will not trigger `keyup` while `meta` key is down
        // So reset them here
        state.keyActived = '';
        break;
      case 'Win':
        // Window key pressed
        state.modifierActived.metaKey = false;
        break;
      case 'Alt':
        // alt/options key pressed
        state.modifierActived.altKey = false;
        break;
      case 'Control':
        state.modifierActived.ctrlKey = false;
        break;
      case 'Shift':
        state.modifierActived.shiftKey = false;
        break;
      default:
        state.modifierActived = {
          ...state.modifierActived,
          metaKey: evt.metaKey,
          altKey: evt.altKey,
          ctrlKey: evt.ctrlKey,
          shiftKey: evt.shiftKey
        };
        state.keyActived = '';
        break;
    }
  });

  function onVNodeAttached(this: Vue) {
    state.componentsListening.add(this);
    this.$once('hook:beforeDestroy', () => {
      // tslint:disable-next-line:no-console
      console.log('destroy', this);
      state.componentsListening.delete(this);
    });
  }

  function onGlobalKeyDown(
    this: Vue,
    keyBinding: string[] | string,
    handler: ShortKeyCallback,
    canRepeat: boolean = false,
    times: number = -1
  ) {
    const keys = typeof keyBinding === 'string' ? [keyBinding] : keyBinding;
    state.listeners.add({
      expected: parseKeybinding(keys),
      canRepeat,
      handlerRef: {
        component: this,
        handler,
        times
      }
    });
  }

  function onceGlobalKeyDownOnce(
    this: Vue,
    keyBinding: string[] | string,
    handler: ShortKeyCallback,
    canRepeat: boolean
  ) {
    return onGlobalKeyDown.call(this, keyBinding, handler, canRepeat, 1);
  }

  function offGlobalKeyDown(
    keyBinding: string[] | string,
    handler?: ShortKeyCallback
  ) {
    const keys = typeof keyBinding === 'string' ? [keyBinding] : keyBinding;
    const pattern = combine(keys);
    // tslint:disable-next-line:no-console
    for (const listener of state.listeners) {
      // Match keybinding
      const identity = combineCombination(listener.expected);
      // tslint:disable-next-line:no-console
      if (identity === pattern) {
        // Remove specific listener
        if (typeof handler === 'function') {
          if (listener.handlerRef.handler === handler) {
            state.listeners.delete(listener);
          }
        } else {
          // Remove all listener with same combinations
          state.listeners.delete(listener);
        }
      }
    }
  }

  Object.defineProperties(ctor.prototype, {
    $shortKey: {
      get(this: Vue) {
        return {
          subscribe: onGlobalKeyDown.bind(this),
          subscribeOnce: onceGlobalKeyDownOnce.bind(this),
          unsubscribe: offGlobalKeyDown.bind(this),
          attach: onVNodeAttached.bind(this),
          getState() {
            return state;
          }
        };
      }
    }
  });
}
