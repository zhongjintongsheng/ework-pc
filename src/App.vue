<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    this.$store.dispatch('getDict')
    this.$store.dispatch('getPermission')
  }
}
</script>

<style lang="scss">
  html, body {
    height: 100%;
    margin: 0px;
    padding: 0px;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
  }
  #app {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
    justify-content: space-between;
    overflow: hidden;
    overflow-x: auto;
  }
</style>
