<template>
  <div class="hello">
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

export default Vue.extend({
  name: 'HelloWorld',
  components: {
    MainKeyContainer,
    ModifierContainer
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
      mainKey: ''
    };
  },
  mounted() {
    // Block browser from refreshing
    // Can be used for saving file
    this.$shortKey.subscribe(['cmd', 'r'], evt => {
      // tslint:disable-next-line:no-console
      console.log('press cmd+r', evt);
    });

    // Can be used for saving file
    this.$shortKey.subscribe(['cmd', 's'], evt => {
      // tslint:disable-next-line:no-console
      console.log('saving', evt);
    });

    // Block accidentaly close the tab
    this.$shortKey.subscribe(['cmd', 'd'], evt => {
      // tslint:disable-next-line:no-console
      console.log('press cmd+d', evt);
    });

    // Block accidentaly close the tab
    this.$shortKey.subscribe(['cmd', 'c'], evt => {
      // tslint:disable-next-line:no-console
      console.clear();
    });

    this.$shortKey.subscribe(['command', 'backspace'], evt => {
      // tslint:disable-next-line:no-console
      console.log('press cmd+delete', evt);
    });

    this.$shortKey.subscribeOnce(['backspace', 'meta'], evt => {
      // tslint:disable-next-line:no-console
      console.log('press cmd+delete once', evt);
    });

    this.$shortKey.subscribe(
      ['ctrl', 's'],
      evt => {
        // tslint:disable-next-line:no-console
        console.log('press ctrl+s again', evt);
      },
      true
    );

    this.$shortKey.subscribe('b', cmb => {
      // tslint:disable-next-line:no-console
      console.log(cmb);
    });

    const handleKeybindingsChanged = (evt: any) => {
      // tslint:disable-next-line:no-console
      console.log('keydown', evt);
      this.modifiers = evt.modifiers;
      this.mainKey = evt.key.toUpperCase();
    };

    this.$on('shortKey:keydown', handleKeybindingsChanged);
    this.$on('shortKey:keyup', handleKeybindingsChanged);

    this.$on('shortKey:capture', (evt: any) => {
      // tslint:disable-next-line:no-console
      console.log('capture', evt);
    });

    this.$shortKey.attach();

    // this.$shortKey.unsubscribe(['command', 'backspace']);
  }
});
</script>

<style>
.container {
  width: 800px;
  margin: 0 auto;
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
