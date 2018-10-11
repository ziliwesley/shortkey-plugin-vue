<template>
  <div class="mainkey-container">
    <div class="mainkey-item">
      <span class="key-id">{{ mainKey }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainKeyContainer',
  props: {
    mainKey: String
  }
};
</script>

<style scoped lang="less">
.mainkey-container {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;

  .mainkey-item {
    width: 400px;
    height: 176px;
    font-size: 32px;
    border: 1px solid #b7b7b7;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
