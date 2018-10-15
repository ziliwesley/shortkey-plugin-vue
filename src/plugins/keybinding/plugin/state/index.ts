import { NativeEventConsumer, NativeEventConsumerOptions } from './index.d';
export { attachListeners } from './dom';
import { updateModifiers } from '../keybinding';
import { noop } from '../util';
import { ModifierKey } from '../enums';

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
      updateModifiers(state.modifiers, ModifierKey.Meta, true);
      break;
    case 'Win':
      // Window key pressed
      updateModifiers(state.modifiers, ModifierKey.Meta, true);
      break;
    case 'Alt':
      // alt/options key pressed
      updateModifiers(state.modifiers, ModifierKey.Alt, true);
      break;
    case 'Control':
      updateModifiers(state.modifiers, ModifierKey.Ctrl, true);
      break;
    case 'Shift':
      updateModifiers(state.modifiers, ModifierKey.Shift, true);
      break;
    default:
      updateModifiers(state.modifiers, ModifierKey.Meta, evt.metaKey);
      updateModifiers(state.modifiers, ModifierKey.Alt, evt.altKey);
      updateModifiers(state.modifiers, ModifierKey.Ctrl, evt.ctrlKey);
      updateModifiers(state.modifiers, ModifierKey.Shift, evt.shiftKey);
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
      updateModifiers(state.modifiers, ModifierKey.Meta, false);
      // Other key will not trigger `keyup` while `meta` key is down
      // So reset them here
      state.primary = '';
      break;
    case 'Win':
      // Window key released
      updateModifiers(state.modifiers, ModifierKey.Meta, false);
      break;
    case 'Alt':
      // alt/options key released
      updateModifiers(state.modifiers, ModifierKey.Alt, false);
      break;
    case 'Control':
      updateModifiers(state.modifiers, ModifierKey.Ctrl, false);
      break;
    case 'Shift':
      updateModifiers(state.modifiers, ModifierKey.Shift, false);
      break;
    default:
      updateModifiers(state.modifiers, ModifierKey.Meta, evt.metaKey);
      updateModifiers(state.modifiers, ModifierKey.Alt, evt.altKey);
      updateModifiers(state.modifiers, ModifierKey.Ctrl, evt.ctrlKey);
      updateModifiers(state.modifiers, ModifierKey.Shift, evt.shiftKey);
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
    modifiers: [false, false, false, false],
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
