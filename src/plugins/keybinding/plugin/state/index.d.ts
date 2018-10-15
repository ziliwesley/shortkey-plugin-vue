import { ModifierKey } from '../enums';
import { ModifierArray } from '../keybinding/index.d';

/**
 * Consume native keyboard event
 */
export declare interface NativeEventConsumer {
  /**
   * Store states of modifier keys
   */
  modifiers: ModifierArray;
  /**
   * Store state of the primary key
   */
  primary: string;
  /**
   * Consume `keydown` event
   * @param event naitve `keydown` event
   */
  handleKeydown(event: KeyboardEvent): void;
  /**
   * Consume `keyup` event
   * @param event naitve `keyup` event
   */
  handleKeyup(event: KeyboardEvent): void;
}

export declare interface NativeEventConsumerOptions {
  beforeKeydown?(this: NativeEventConsumer, event: KeyboardEvent): void;
  afterKeydown?(this: NativeEventConsumer, event: KeyboardEvent): void;
  beforeKeyup?(this: NativeEventConsumer, event: KeyboardEvent): void;
  afterKeyup?(this: NativeEventConsumer, event: KeyboardEvent): void;
}
