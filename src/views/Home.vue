<template>
  <div class="hello">
    <KeybindingInfo>
      <KeybindingItem :active="keybindings.refresh">refresh: cmd + r</KeybindingItem>
      <KeybindingItem :active="keybindings.save">save: cmd + s</KeybindingItem>
      <KeybindingItem :active="keybindings.bookmark">bookmark: cmd + d</KeybindingItem>
      <KeybindingItem :active="keybindings.copy">copy: cmd + c</KeybindingItem>
      <KeybindingItem :active="keybindings.paste">paste: cmd + v</KeybindingItem>
      <KeybindingItem :active="keybindings.del">del: cmd + backspace</KeybindingItem>
      <KeybindingItem :active="keybindings.selectAll">select all (one-time use): cmd + a</KeybindingItem>
    </KeybindingInfo>
    <MainKeyContainer :main-key="primary"/>
    <ModifierContainer
      :ctrl="modifiers.ctrlKey"
      :shift="modifiers.shiftKey"
      :alt="modifiers.altKey"
      :meta="modifiers.metaKey"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import ModifierContainer from '@/components/ModifierContaienr.vue';
import MainKeyContainer from '@/components/MainKeyContainer.vue';
import KeybindingInfo from '@/components/KeybindingInfo.vue';
import KeybindingItem from '@/components/KeybindingItem.vue';
import { KeybindingEvent } from '@/plugins/keybinding/plugin/event/index.d.ts';

export default Vue.extend({
  name: 'Home',
  components: {
    MainKeyContainer,
    ModifierContainer,
    KeybindingInfo,
    KeybindingItem
  },
  props: {
    msg: String
  },
  data() {
    return {
      modifiers: {
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false
      } as Record<string, any>,
      primary: '',
      bindingsSubscribing: [],
      keybindings: {
        refresh: false,
        save: false,
        bookmark: false,
        copy: false,
        paste: false,
        del: false
      } as Record<string, any>
    };
  },
  mounted() {
    // Block browser from refreshing
    // Can be used for saving file
    this.$keybinding.subscribe(['cmd', 'r'], evt => {
      this.keybindings.refresh = true;
    });

    // Can be used for saving file
    this.$keybinding.subscribe(['cmd', 's'], evt => {
      this.keybindings.save = true;
    });

    // Block accidentaly add bookmark
    this.$keybinding.subscribe(['cmd', 'd'], evt => {
      this.keybindings.bookmark = true;
    });

    this.$keybinding.subscribe(['cmd', 'c'], evt => {
      this.keybindings.copy = true;
    });

    this.$keybinding.subscribe(['cmd', 'v'], evt => {
      this.keybindings.paste = true;
    });

    this.$keybinding.subscribe(['command', 'backspace'], evt => {
      this.keybindings.del = true;
    });

    this.$keybinding.subscribeOnce(['command', 'a'], evt => {
      this.keybindings.selectAll = true;
    });

    this.$keybinding.subscribeOnce(['command', 'right'], evt => {
      this.$router.push('/advanced');
    });

    const handleKeybindingChange = (evt: KeybindingEvent) => {
      this.modifiers = evt.modifiers;
      this.primary = evt.primary.toUpperCase();

      if (evt.type === 'keybinding:keyup') {
        for (const key of Object.keys(this.keybindings)) {
          this.keybindings[key] = false;
        }
      }
    };

    this.$on('keybinding:keydown', handleKeybindingChange);
    this.$on('keybinding:keyup', handleKeybindingChange);

    this.$on('keybinding:bindingsChange', (evt: any) => {
      this.bindingsSubscribing = evt.bindings;
    });

    this.$keybinding.attach();
  }
});
</script>

<style lang="less">
.hello {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 32px;

  .container {
    width: 750px;
    margin: 0 auto;
  }
}
</style>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
