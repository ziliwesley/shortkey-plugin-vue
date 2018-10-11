<template>
  <div class="hello">
    <KeybindingInfo>
      <KeybindingItem
        :active="keybindings.left">
        left, h
      </KeybindingItem>
      <KeybindingItem
        :active="keybindings.up">
        up, j
      </KeybindingItem>
      <KeybindingItem
        :active="keybindings.down">
        down, k
      </KeybindingItem>
      <KeybindingItem
        :active="keybindings.right">
        right, l
      </KeybindingItem>
      <KeybindingItem
        :active="keybindings.space">
        (can repeat) space: {{ count }}
      </KeybindingItem>
      <KeybindingItem
        :active="keybindings.esc">
        Reset counter: esc
      </KeybindingItem>
      <KeybindingItem
        :active="keybindings.advanced">
        Complex combination: cmd + shift + p
      </KeybindingItem>
      <KeybindingItem>
        Back Home: cmd + h
      </KeybindingItem>
    </KeybindingInfo>
    <MainKeyContainer :main-key="mainKey" />
    <ModifierContainer
      :ctrl="modifiers.ctrlKey"
      :shift="modifiers.shiftKey"
      :alt="modifiers.altKey"
      :meta="modifiers.metaKey" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import ModifierContainer from '@/components/ModifierContaienr.vue';
import MainKeyContainer from '@/components/MainKeyContainer.vue';
import KeybindingInfo from '@/components/KeybindingInfo.vue';
import KeybindingItem from '@/components/KeybindingItem.vue';

export default Vue.extend({
  name: 'About',
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
      mainKey: '',
      bindingsSubscribing: [],
      count: 0,
      keybindings: {
        left: false,
        up: false,
        down: false,
        right: false,
        space: false,
        esc: false,
        advanced: false
      } as Record<string, any>
    };
  },
  mounted() {
    // h, j, k, l
    this.$shortKey.subscribe(['h'], evt => {
      this.keybindings.left = true;
    });
    this.$shortKey.subscribe(['arrowleft'], evt => {
      this.keybindings.left = true;
    });
    this.$shortKey.subscribe(['j'], evt => {
      this.keybindings.up = true;
    });
    this.$shortKey.subscribe(['arrowup'], evt => {
      this.keybindings.up = true;
    });
    this.$shortKey.subscribe(['k'], evt => {
      this.keybindings.down = true;
    });
    this.$shortKey.subscribe(['arrowdown'], evt => {
      this.keybindings.down = true;
    });
    this.$shortKey.subscribe(['l'], evt => {
      this.keybindings.right = true;
    });
    this.$shortKey.subscribe(['arrowright'], evt => {
      this.keybindings.right = true;
    });

    this.$shortKey.subscribe(
      ['space'],
      evt => {
        this.keybindings.space = true;
        this.count += 1;
      },
      true
    );

    this.$shortKey.subscribe(['esc'], evt => {
      this.keybindings.esc = true;
      this.count = 0;
    });

    this.$shortKey.subscribe(['cmd', 'shift', 'p'], evt => {
      this.keybindings.advanced = true;
    });

    this.$shortKey.subscribe(['command', 'h'], evt => {
      this.$router.push('/');
    });

    const handleKeybindingsChanged = (evt: any) => {
      this.modifiers = evt.modifiers;
      this.mainKey = evt.key.toUpperCase();

      if (evt.type === 'shortKey:keyup') {
        for (const key of Object.keys(this.keybindings)) {
          this.keybindings[key] = false;
        }
      }
    };

    this.$on('shortKey:keydown', handleKeybindingsChanged);
    this.$on('shortKey:keyup', handleKeybindingsChanged);

    this.$on('shortKey:bindingsChange', (evt: any) => {
      this.bindingsSubscribing = evt.bindings;
    });

    this.$shortKey.attach();
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