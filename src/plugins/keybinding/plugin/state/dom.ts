// Interact with dom:
// - register/deregister dom event listener
import { NativeEventConsumer } from './index.d';

/**
 * Register DOM event listeners
 * @param ctx plugin context
 */
export function attachListeners(ctx: NativeEventConsumer) {
  // Handle `keydown` event
  document.addEventListener('keydown', evt => ctx.handleKeydown(evt));
  document.addEventListener('keyup', evt => ctx.handleKeyup(evt));
}
