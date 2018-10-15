import { BindingDeclaration } from './keybinding/index.d';
import { EventHandler } from './event/index.d';
import {
  NativeEventConsumer,
  NativeEventConsumerOptions
} from './state/index.d';
import {
  KeybindingCoordinator,
  KeybindingCoordinatorOptions
} from './coordinator/index.d';
import { EventProducer, EventProducerOptions } from './dispatcher/index.d';

/**
 * Interface exposed, should be framework independent.
 */
export declare interface Pluggable {
  subscribe(
    keys: BindingDeclaration,
    handler: EventHandler,
    canRepeat?: boolean,
    once?: boolean
  ): void;
  subscribeOnce(
    keys: BindingDeclaration,
    handler: EventHandler,
    canRepeat?: boolean
  ): void;
  unsubscribe(keys: BindingDeclaration, handler?: EventHandler): boolean;
  attach(): void;
  detach(): void;
}

export declare interface PluginContext<T> {
  state: NativeEventConsumer;
  coordinator: KeybindingCoordinator<T>;
  dispatcher: EventProducer<T>;
}

export declare interface PluginContextOptions<T>
  extends NativeEventConsumerOptions,
    EventProducerOptions<T>,
    KeybindingCoordinatorOptions<T> {}
