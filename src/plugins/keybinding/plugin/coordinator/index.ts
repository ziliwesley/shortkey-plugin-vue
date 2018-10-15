import {
  KeybindingCoordinator,
  KeybindingMatchable,
  KeybindingCoordinatorOptions
} from './index.d';
import { NativeEventConsumer } from '../state/index.d';
import { BindingDeclaration } from '../keybinding/index.d';
import { EventHandler, KeybindingEvent } from '../event/index.d';
import KeybindingMatcher from './matcher';
import { noop } from '../util';

export default function createKeybindingCoordinator<T>({
  afterRegister = noop
}: Partial<KeybindingCoordinatorOptions<T>> = {}): KeybindingCoordinator<T> {
  return {
    matchers: new Set<KeybindingMatcher<T>>(),
    filterByState(state: NativeEventConsumer): Array<KeybindingMatchable<T>> {
      const matched = [];

      for (const matcher of this.matchers) {
        const expected = matcher.expected;
        if (
          expected.primary === state.primary &&
          expected.modifiers.every(modifier => state.modifiers[modifier])
        ) {
          matched.push(matcher);
        }
      }

      return matched;
    },
    register(matcher: KeybindingMatcher<T>): void {
      this.matchers.add(matcher);
      afterRegister.call(this, matcher);
    },
    registerDeclaration(
      declaration: BindingDeclaration,
      handler: EventHandler,
      vm: T,
      canRepeat: boolean = false,
      once: boolean = false
    ) {
      const matcher = new KeybindingMatcher(
        declaration,
        handler,
        vm,
        canRepeat,
        once
      );
      this.register(matcher);
    },
    deregister(matcher: KeybindingMatcher<T>): boolean {
      return this.matchers.delete(matcher);
    },
    deregisterDeclaration(
      declaration: BindingDeclaration,
      handler?: EventHandler
    ) {
      for (const matcher of this.matchers) {
        if (matcher.matchPattern(declaration)) {
          if (typeof handler === 'function') {
            // Remove specific matcher
            if (matcher.handler === handler) {
              this.deregister(matcher);
            }
          } else {
            // Remove all matcher with same declaration
            this.deregister(matcher);
          }
        }
      }
      return false;
    },
    invoke(matcher: KeybindingMatchable<T>, evt: KeybindingEvent): void {
      matcher.handler.call(matcher.vm, evt);
    }
  };
}
