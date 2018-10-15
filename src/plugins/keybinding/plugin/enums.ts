// Define enum types

/**
 * All modifier keys alphabetically sorted
 */
export enum ModifierKey {
  Alt,
  Ctrl,
  Meta,
  Shift
}

export enum KeybindingFormat {
  Array = 'array',
  Map = 'map'
}

// Define all events will be emitted
export enum EventName {
  bindingsChange = 'keybinding:bindingsChange',
  capture = 'keybinding:capture',
  keydown = 'keybinding:keydown',
  keyup = 'keybinding:keyup',
  press = 'keybinding:press'
}
