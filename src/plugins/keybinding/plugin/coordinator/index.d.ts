import { KeybindingCombination } from '../keybinding/index.d';
import { KeybindingEvent, EventHandler } from '../event/index.d';
import { NativeEventConsumer } from '../state/index.d';
import { BindingDeclaration } from '../keybinding/index.d';

export declare interface KeybindingMatchable<T> {
  /**
   * The keybinding combination expected to respond
   */
  expected: KeybindingCombination;
  /**
   * Decide whether this matcher should be triggerd repeatedly while it is being
   * held down by the user
   */
  canRepeat: boolean;
  /**
   * Corresponding view model context
   */
  vm: T;
  /**
   * Should destroy after the first use
   */
  once: boolean;
  /**
   * A string of pattern describes the keybinding
   */

  /**
   * The handler function passed in
   */
  handler: EventHandler;

  /**
   * Return true if it matches the declaration pattern passed in
   * @param pattern keybinding declartaion
   */
  matchPattern(pattern: BindingDeclaration): boolean;

  /**
   * Return true if it matches the keyboard state
   * @param state keyboard state
   */
  matchState(state: NativeEventConsumer): boolean;
}

export declare interface KeybindingCoordinator<T> {
  matchers: Set<KeybindingMatchable<T>>;
  filterByState(state: NativeEventConsumer): Array<KeybindingMatchable<T>>;
  register(matcher: KeybindingMatchable<T>): void;
  registerDeclaration(
    declaration: BindingDeclaration,
    handler: EventHandler,
    vm: T,
    canRepeat: boolean,
    once: boolean
  ): void;
  deregister(matcher: KeybindingMatchable<T>): boolean;
  deregisterDeclaration(
    declaration: BindingDeclaration,
    handler?: EventHandler
  ): boolean;
  invoke(matcher: KeybindingMatchable<T>, evt: KeybindingEvent): void;
}

export declare interface KeybindingCoordinatorOptions<T> {
  afterRegister?(
    this: KeybindingCoordinator<T>,
    matcher: KeybindingMatchable<T>
  ): void;
}
