import { KeybindingEventCompulsory, KeybindingEventOptional } from './index.d';
import { NativeEventConsumer } from '../state/index.d';
import { KeybindingMatchable } from '../coordinator/index.d';

export function fromState(
  { modifiers, primary }: NativeEventConsumer,
  optionalFields: Partial<KeybindingEventOptional> = {}
): KeybindingEventCompulsory & Partial<KeybindingEventOptional> {
  // Return a shallow copy of the state
  return {
    modifiers: { ...modifiers },
    primary,
    ...optionalFields
  };
}

export function fromMatchers<T>(bindings: Set<KeybindingMatchable<T>>) {
  return {
    bindings: Array.from(bindings).map(matcher => [
      ...matcher.expected.modifiers,
      matcher.expected.primary
    ])
  };
}
