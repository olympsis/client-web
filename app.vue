<template>
  <div id="app">
    <NuxtPage/>
  </div>
</template>

<style scoped>
#app {
  margin: 0;
  width: 100vw;
  height: 100dvh;
  display: flex;
  overflow-y: auto;
  overflow-x: hidden;
  align-items: center;
  flex-direction: column;
  -webkit-overflow-scrolling: touch;
  background-color: var(--primary-background-color);
}
</style>
