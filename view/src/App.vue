<template>
  <div id="nav" class="ui-cell">
    <router-link to="/">Home</router-link>|
    <router-link to="/about">About</router-link>
  </div>
  <router-view />
</template>
<style lang="scss">
@import 'style/base';
#nav {
  animation: myfirst 5s;
}
@keyframes myfirst {
  from {
    background: red;
  }
  to {
    background: yellow;
  }
}
</style>
