<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/advanced">Advanced</router-link>
    </div>
    <div class="split-view">
      <HistoryBrowser class="aside"/>
      <router-view class="main"/>
      <KeybindingBrowser class="aside"/>
    </div>
  </div>
</template>

<script>
import KeybindingBrowser from '@/components/KeybindingBrowser';
import HistoryBrowser from '@/components/HistoryBrowser';

export default {
  name: 'App',
  components: {
    KeybindingBrowser,
    HistoryBrowser
  }
};
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  display: flex;
  flex-direction: column;

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;
    }

    a.router-link-exact-active {
      color: #42b983;
    }
  }

  .split-view {
    flex: 1;
    display: flex;
    justify-content: space-between;

    .main {
      margin: 0 auto;
    }

    .aside {
      flex: 0 0 300px;
    }
  }
}
</style>
