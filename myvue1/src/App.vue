<template>
  <div id="app">
    <router-view></router-view>
      </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
};
</script>

<style>
/* 전체 페이지 기본 스타일 */
html, body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

/* #app 컨테이너는 100% 너비 사용 */
#app {
  width: 100%;
  min-height: 100vh;
  /* flex 레이아웃 등을 활용할 수도 있음 */
}
</style>
