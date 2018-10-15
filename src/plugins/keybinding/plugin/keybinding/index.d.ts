import { ModifierKeys } from '../enums';

/**
 * Input parameter to declare the keybinding
 * @example
 * - ['ctrl', 's']
 * - 'f1'
 */
export declare type BindingDeclaration = string[] | string;

/**
 * Used inside the plugin to define a specifc keybinding combination
 */
export declare interface KeybindingCombination {
  /**
   * Original definition passed in:
   * @example
   * ['cmd', 'r']
   * 'f5'
   */
  raw: BindingDeclaration;
  /**
   * Modifier keys parsed from `.raw`:
   * @example ['ctrlKey', 'altKey']
   */
  modifiers: ModifierKeys[];
  /**
   * Primary key:
   * @example 'a'...'z', 'f1'...'f9', 'backspace', etc.
   */
  primary: string;
}
