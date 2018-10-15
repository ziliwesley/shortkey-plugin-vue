import { KeybindingMatchable } from './index.d';
import {
  BindingDeclaration,
  KeybindingCombination
} from '../keybinding/index.d';
import { NativeEventConsumer } from '../state/index.d';
import { EventHandler } from '../event/index.d';
import { parse } from '../keybinding';

export default class KeybindingMatcher<T> implements KeybindingMatchable<T> {
  public expected: KeybindingCombination;

  constructor(
    declaration: BindingDeclaration,
    /**
     * Handler function passed in
     */
    public handler: EventHandler,
    public vm: T,
    public canRepeat: boolean,
    public once: boolean
  ) {
    this.expected = parse(declaration);
  }

  public matchPattern(pattern: BindingDeclaration): boolean {
    const own = JSON.stringify(this.expected.raw);
    const target = JSON.stringify(pattern);
    return own === target;
  }

  public matchState(state: NativeEventConsumer): boolean {
    const expected = this.expected;

    // if (state.primary !== expected.primary) {
    //   return false;
    // }

    // for (const prop of Object.keys(state.modifiers)) {
    //   if (state.modifiers[prop])
    // }

    return true;
  }
}
