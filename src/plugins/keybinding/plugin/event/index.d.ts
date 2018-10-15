import { EventName } from '../enums';
import { BindingDeclaration, ModifierMap } from '../keybinding/index.d';

// Event Body

/**
 * Required fields inside an event body
 */
export declare interface KeybindingEventCompulsory {
  modifiers: ModifierMap;
  primary: string;
}

/**
 * Optional fields can appear in an event body
 */
export declare interface KeybindingEventOptional {
  expected: BindingDeclaration;
  repeat: boolean;
}

/**
 * Define an event body
 */
export declare interface KeybindingEvent
  extends KeybindingEventCompulsory,
    Partial<KeybindingEventOptional> {
  type?: EventName;
}

export declare interface MatchersUpdateEvent {
  bindings: Array<string[]>;
  type?: EventName;
}

export declare type EventBody = KeybindingEvent | MatchersUpdateEvent;

/**
 * Define the callback event handler used inside the plugin
 * @example
 * evt => doSomethingWith(evt)
 */
export declare type EventHandler = (resp: EventBody) => void;
