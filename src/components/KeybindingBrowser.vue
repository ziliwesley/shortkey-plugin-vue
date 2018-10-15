<template>
  <div class="keybinding-browser">
    <p>Current Keybindings:</p>
    <ul class="keybindings">
      <li v-for="(item, index) in bindingsSubscribing" :key="index">{{ item.join(' + ') }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      bindingsSubscribing: []
    };
  },
  beforeCreate() {
    this.$on('keybinding:bindingsChange', evt => {
      this.bindingsSubscribing = evt.bindings;
    });

    this.$keybinding.attach();
  }
};
</script>

<style lang="less">
.keybinding-browser {
  border-left: 1px dashed #e8e8e8;
  text-align: left;
  box-sizing: border-box;
  padding-left: 20px;

  .keybindings {
    padding: 0;
    list-style: none;
    line-height: 32px;
  }
}
</style>
