<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript" target="_blank" rel="noopener">typescript</a></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  mounted() {
    // Block browser from refreshing
    // Can be used for saving file
    this.$shortKey.subscribe(['cmd','r'], (evt) => {
      // tslint:disable-next-line:no-console
      console.log('press cmd+r', evt);
    })

    // Can be used for saving file
    this.$shortKey.subscribe(['cmd','s'], (evt) => {
      // tslint:disable-next-line:no-console
      console.log('saving', evt);
    })

    // Block accidentaly close the tab
    this.$shortKey.subscribe(['cmd','d'], (evt) => {
      // tslint:disable-next-line:no-console
      console.log('press cmd+d', evt);
    })

    // Block accidentaly close the tab
    this.$shortKey.subscribe(['cmd','c'], (evt) => {
      // tslint:disable-next-line:no-console
      console.clear();
    })

    this.$shortKey.subscribe(['command','backspace'], (evt) => {
      // tslint:disable-next-line:no-console
      console.log('press cmd+delete', evt);
    })

    this.$shortKey.subscribeOnce(['backspace', 'meta'], (evt) => {
      // tslint:disable-next-line:no-console
      console.log('press cmd+delete once', evt);
    })

    this.$shortKey.subscribe(['ctrl', 's'], (evt) => {
      // tslint:disable-next-line:no-console
      console.log('press ctrl+s again', evt);
    }, true)

    this.$shortKey.subscribe('b', cmb => {
      // tslint:disable-next-line:no-console
      console.log(cmb);
    })

    this.$on('shortKey:keydown', (evt: any) => {
      // tslint:disable-next-line:no-console
      console.log('keydown', evt);
    })

    this.$on('shortKey:capture', (evt: any) => {
      // tslint:disable-next-line:no-console
      console.log('capture', evt);
    })

    this.$shortKey.attach()

    // this.$shortKey.unsubscribe(['command', 'backspace']);
  },
});
</script>

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
