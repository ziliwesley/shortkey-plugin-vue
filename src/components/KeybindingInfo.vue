<template>
  <div class="keybinding-info">
    <p>This page will register following keybindings:</p>
    <div class="desc">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KeybindingInfo'
};
</script>

<style lang="less" scoped>
.keybinding-info {
  p {
    line-height: 28px;
    padding: 0;
    margin: 0;
  }
  .desc {
    margin-top: 12px;
    line-height: 28px;
    padding: 0;
    margin-bottom: 32px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
