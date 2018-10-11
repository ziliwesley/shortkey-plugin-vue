<template>
  <div class="modifier-container container">
  <div
    :class="ctrl ? 'active' : ''"
    class="modifier-item">
    <span class="modifier-id">Ctrl</span>
  </div>
  <div
    :class="shift ? 'active' : ''"
    class="modifier-item">
    <span class="modifier-id">Shift</span>
  </div>
  <div
    :class="alt ? 'active' : ''"
    class="modifier-item">
    <span class="modifier-id">Alt</span>
  </div>
  <div
    :class="meta ? 'active' : ''"
    class="modifier-item">
    <span class="modifier-id">Meta(Command)</span>
  </div>
</div>
</template>

<script>
export default {
  name: 'ModifierContainer',
  props: {
    ctrl: Boolean,
    shift: Boolean,
    alt: Boolean,
    meta: Boolean
  }
};
</script>

<style scoped lang="less">
.modifier-container {
  display: flex;
  justify-content: space-between;
  .modifier-item {
    width: 180px;
    height: 48px;
    border: 1px solid #efefef;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: all 0.3s ease-in-out;

    &.active {
      transform: scale(0.95);
      color: #f1f1f1;
      background-color: #11aa88;
    }
  }
}
</style>
