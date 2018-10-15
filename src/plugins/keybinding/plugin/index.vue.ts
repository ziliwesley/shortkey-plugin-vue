import Vue from 'vue';
import { Pluggable, PluginContext } from './index.d';
import { EventHandler } from './event/index.d';
import { BindingDeclaration } from './keybinding/index.d';
import { attachListeners } from './state';
import createPluginContext from './context';

declare module 'vue/types/vue' {
  interface Vue {
    $keybinding: Pluggable;
  }
}

const BEFORE_DESTROY_HOOK = 'hook:beforeDestroy';

export default function createVuePlugin(): Pluggable {
  const ctx = createPluginContext<Vue>({
    emit(consumer, evtName, ...evtArgs) {
      consumer.$emit(evtName, ...evtArgs);
    },
    // hooks
    afterAttach(consumer) {
      // Auto clear
      consumer.$once(BEFORE_DESTROY_HOOK, () => {
        ctx.dispatcher.detach(consumer);
      });
    },
    afterRegister(matcher) {
      // Auto deregister
      matcher.vm.$once(BEFORE_DESTROY_HOOK, () => {
        ctx.coordinator.deregister(matcher);
      });
    }
  });

  // DOM event binding
  attachListeners(ctx.state);

  return {
    subscribe(
      this: Vue,
      pattern: BindingDeclaration,
      handler: EventHandler,
      canRepeat: boolean,
      once: boolean
    ): void {
      const matcher = ctx.coordinator.registerDeclaration(
        pattern,
        handler,
        this,
        canRepeat,
        once
      );
    },
    subscribeOnce(
      this: Vue,
      pattern: BindingDeclaration,
      handler: EventHandler,
      canRepeat: boolean
    ): void {
      ctx.coordinator.registerDeclaration(
        pattern,
        handler,
        this,
        canRepeat,
        true
      );
    },
    unsubscribe(
      this: Vue,
      pattern: BindingDeclaration,
      handler?: EventHandler
    ): boolean {
      return ctx.coordinator.deregisterDeclaration(pattern, handler);
    },
    attach(this: Vue): void {
      return ctx.dispatcher.attach(this);
    },
    detach(this: Vue): void {
      return ctx.dispatcher.detach(this);
    }
  };
}
