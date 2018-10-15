import { KeybindingEventCompulsory, KeybindingEventOptional } from './index.d';
import { NativeEventConsumer } from '../state/index.d';
import { KeybindingMatchable } from '../coordinator/index.d';
import { fromArray } from '../keybinding/format';
import { ModifierKey } from '../enums';

export function fromState(
  { modifiers, primary }: NativeEventConsumer,
  optionalFields: Partial<KeybindingEventOptional> = {}
): KeybindingEventCompulsory & Partial<KeybindingEventOptional> {
  // Return a shallow copy of the state
  return {
    modifiers: {
      altKey: modifiers[ModifierKey.Alt],
      ctrlKey: modifiers[ModifierKey.Ctrl],
      metaKey: modifiers[ModifierKey.Meta],
      shiftKey: modifiers[ModifierKey.Shift]
    },
    primary,
    ...optionalFields
  };
}

export function fromKeyboardEvent(
  evt: KeyboardEvent,
  optionalFields: Partial<KeybindingEventOptional> = {}
): KeybindingEventCompulsory & Partial<KeybindingEventOptional> {
  return {
    modifiers: {
      altKey: evt.altKey,
      ctrlKey: evt.ctrlKey,
      metaKey: evt.metaKey,
      shiftKey: evt.shiftKey
    },
    primary: evt.key,
    ...{
      repeat: evt.repeat
    },
    ...optionalFields
  };
}

export function fromMatchers<T>(bindings: Set<KeybindingMatchable<T>>) {
  return {
    bindings: Array.from(bindings).map(matcher => [
      ...fromArray(matcher.expected.modifiers),
      matcher.expected.primary
    ])
  };
}
