<template>
  <div
    :class="active ? 'active' : ''"
    class="keybinding-item">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'KeybindingItem',
  props: {
    active: Boolean
  }
};
</script>

<style lang="less" scoped>
.keybinding-item {
  line-height: 28px;
  background: #f4f4f4;
  transition: all 0.3s ease-in-out;
  padding: 0 8px;
  border-radius: 4px;
  margin-right: 8px;
  margin-bottom: 8px;

  &.active {
    transform: scale(0.95);
    color: #f1f1f1;
    background-color: #11aa88;
  }
}
</style>
