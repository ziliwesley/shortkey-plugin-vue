import { PluginContext, PluginContextOptions } from './index.d';
import { noop } from './util';

import createNativeEventConsumer from './state';
import createKeybindingCoordinator from './coordinator';
import createEventProducer from './dispatcher';

import { fromState, fromMatchers } from './event';
import { EventName } from './enums';

export default function createPluginContext<T>({
  emit,
  afterKeydown = noop,
  afterKeyup = noop,
  afterAttach = noop,
  ...options
}: PluginContextOptions<T>): PluginContext<T> {
  const coordinator = createKeybindingCoordinator<T>(options);
  const dispatcher = createEventProducer<T>({
    ...options,
    emit,
    afterAttach(consumer: T) {
      const evt = fromMatchers(coordinator.matchers);
      dispatcher.broadcast(EventName.bindingsChange, evt);

      // Invoke custom afterAttach hook handler
      afterAttach.call(this, consumer);
    }
  });
  const state = createNativeEventConsumer({
    ...options,
    afterKeydown(evt: KeyboardEvent) {
      const matched = coordinator.filterByState(state);

      const evtBase = fromState(state, {
        repeat: evt.repeat
      });

      if (matched.length > 0) {
        // Block browser's default action
        evt.preventDefault();

        // Trigger registered handler for each matched keybinding
        matched.forEach(matcher => {
          // Decide whether a keybinding can be triggered repeatedly with a
          // "Long Press"
          if (evt.repeat && !matcher.canRepeat) {
            return;
          }

          const evtCaptured = {
            ...evtBase,
            combination: matcher.expected.raw
          };

          // Invoke matcher callback
          coordinator.invoke(matcher, {
            ...evtCaptured,
            type: EventName.press
          });

          // Broadcast a match
          dispatcher.broadcast(EventName.capture, {
            ...evtCaptured,
            type: EventName.capture
          });

          // Auto-deregister the matcher if it's for one-time use only
          if (matcher.once) {
            // Deregister handler
            coordinator.deregister(matcher);
          }
        });
      }

      // Broadcast `keydown` event
      dispatcher.broadcast(EventName.keydown, {
        ...evtBase,
        type: EventName.keydown
      });

      // Invoke custom afterKeydown hook handler
      afterKeydown.call(this, evt);
    },
    afterKeyup(evt: KeyboardEvent) {
      const evtBase = fromState(state);

      // Broadcast `keyup` event
      dispatcher.broadcast(EventName.keyup, {
        ...evtBase,
        type: EventName.keyup
      });

      // Invoke custom afterKeyup hook handler
      afterKeyup.call(this, evt);
    }
  });
  return {
    state,
    coordinator,
    dispatcher
  };
}
