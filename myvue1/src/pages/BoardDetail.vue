<template>
    <div>
      <h1>{{ board.title }}</h1>
      <p>{{ board.content }}</p>
      <router-link to="/">목록으로</router-link>
    </div>
  </template>
  
  <script>
  import api from "../services/api";
  
  export default {
    data() {
      return {
        board: {},
      };
    },
    async created() {
      const response = await api.get(`/${this.$route.params.id}`);
      this.board = response.data;
    },
  };
  </script>
  