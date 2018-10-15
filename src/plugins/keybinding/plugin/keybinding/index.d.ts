/**
 * Input parameter to declare the keybinding
 * @example
 * - ['ctrl', 's']
 * - 'f1'
 */
export declare type BindingDeclaration = string[] | string;

/**
 * Alphabetically sorted
 * [ alt, ctrl, meta, shift ]
 */
export declare type ModifierArray = [boolean, boolean, boolean, boolean];

export declare type ModifierMap = {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
};

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
   * Matched to [ altKey, ctrlKey, metaKey, shiftKey ]
   */
  modifiers: [boolean, boolean, boolean, boolean];
  /**
   * Primary key:
   * @example 'a'...'z', 'f1'...'f9', 'backspace', etc.
   */
  primary: string;
}
