<template>
  <div class="history-browser">
    <p>Captured:</p>
    <ul class="keybindings">
      <li
        v-for="(item, index) in captured"
        :key="index">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HistoryBrowser',
  data() {
    return {
      captured: []
    };
  },
  beforeCreate() {
    this.$on('shortKey:capture', evt => {
      this.captured.push(evt.combination.join(' + '));
    });

    this.$shortKey.attach();
  }
};
</script>

<style lang="less">
.history-browser {
  border-right: 1px dashed #e8e8e8;
  text-align: left;
  box-sizing: border-box;
  padding-right: 20px;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;

  .keybindings {
    padding: 0;
    list-style: none;
    line-height: 32px;
    display: flex;
    flex-direction: column-reverse;

    > li:last-child {
      font-weight: 800;
      font-size: 24px;
      line-height: 36px;
    }
  }
}
</style>
