import { NativeEventConsumer, NativeEventConsumerOptions } from './index.d';
export { attachListeners } from './dom';
import { noop } from '../util';

// Native keyboard event consumer

// Regexp match `KeyA` to `KeyZ` for keycode of KeyboardEvent
const KeyCodePattern = /Key([A-Z])/;

/**
 * Convert codes like `KeyA`, `KeyE` to `a`, `e`
 * @param code code property of KeyboardEvent
 */
export function normalizeCode(code: string) {
  if (KeyCodePattern.test(code)) {
    return code.replace(KeyCodePattern, '$1').toLowerCase();
  }

  return code.toLowerCase();
}

/**
 * Mutate states based on keydown event
 * @param evt KeyboardEvent
 * @param state internal state
 */
export function matchKeydownEvent(
  state: NativeEventConsumer,
  evt: KeyboardEvent
) {
  switch (evt.key) {
    case 'Meta':
      // Command key pressed
      state.modifiers.metaKey = true;
      break;
    case 'Win':
      // Window key pressed
      state.modifiers.metaKey = true;
      break;
    case 'Alt':
      // alt/options key pressed
      state.modifiers.altKey = true;
      break;
    case 'Control':
      state.modifiers.ctrlKey = true;
      break;
    case 'Shift':
      state.modifiers.shiftKey = true;
      break;
    default:
      state.modifiers = {
        ...state.modifiers,
        metaKey: evt.metaKey,
        altKey: evt.altKey,
        ctrlKey: evt.ctrlKey,
        shiftKey: evt.shiftKey
      };
      // Prefer `evt.code` over `evt.key`
      state.primary = evt.code
        ? normalizeCode(evt.code)
        : evt.key.toLowerCase();
      break;
  }
}

/**
 * Mutate states based on keyup event
 * @param evt KeyboardEvent
 * @param state internal state
 */
export function matchKeyupEvent(
  state: NativeEventConsumer,
  evt: KeyboardEvent
) {
  switch (evt.key) {
    case 'Meta':
      // Command key released alone
      state.modifiers.metaKey = false;
      // Other key will not trigger `keyup` while `meta` key is down
      // So reset them here
      state.primary = '';
      break;
    case 'Win':
      // Window key released
      state.modifiers.metaKey = false;
      break;
    case 'Alt':
      // alt/options key released
      state.modifiers.altKey = false;
      break;
    case 'Control':
      state.modifiers.ctrlKey = false;
      break;
    case 'Shift':
      state.modifiers.shiftKey = false;
      break;
    default:
      state.modifiers = {
        ...state.modifiers,
        metaKey: evt.metaKey,
        altKey: evt.altKey,
        ctrlKey: evt.ctrlKey,
        shiftKey: evt.shiftKey
      };
      state.primary = '';
      break;
  }
}

/**
 * Create an native event consumer mixin
 */
export default function createNativeEventConsumer({
  beforeKeydown = noop,
  afterKeydown = noop,
  beforeKeyup = noop,
  afterKeyup = noop
}: Partial<NativeEventConsumerOptions> = {}): NativeEventConsumer {
  return {
    modifiers: {
      metaKey: false,
      altKey: false,
      ctrlKey: false,
      shiftKey: false
    },
    primary: '',
    handleKeydown(this: NativeEventConsumer, evt: KeyboardEvent): void {
      beforeKeydown.call(this, evt);
      matchKeydownEvent(this, evt);
      afterKeydown.call(this, evt);
    },
    handleKeyup(this: NativeEventConsumer, evt: KeyboardEvent): void {
      beforeKeyup.call(this, evt);
      matchKeyupEvent(this, evt);
      afterKeyup.call(this, evt);
    }
  };
}
