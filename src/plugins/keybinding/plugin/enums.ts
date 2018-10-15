// Define enum types

// Define all modifier keys
export enum ModifierKeys {
  Ctrl = 'ctrlKey',
  Alt = 'altKey',
  Shift = 'shiftKey',
  Meta = 'metaKey'
}

// Define all events will be emitted
export enum EventName {
  bindingsChange = 'keybinding:bindingsChange',
  capture = 'keybinding:capture',
  keydown = 'keybinding:keydown',
  keyup = 'keybinding:keyup',
  press = 'keybinding:press'
}
