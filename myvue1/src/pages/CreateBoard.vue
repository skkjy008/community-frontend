<template>
    <div>
      <h1>게시글 작성</h1>
      <form @submit.prevent="createBoard">
        <div>
          <label>제목</label>
          <input v-model="title" required />
        </div>
        <div>
          <label>내용</label>
          <textarea v-model="content" required></textarea>
        </div>
        <button type="submit">작성</button>
      </form>
    </div>
  </template>
  
  <script>
  import api from "../services/api";
  
  export default {
    data() {
      return {
        title: "",
        content: "",
      };
    },
    methods: {
      async createBoard() {
        await api.post("/", { title: this.title, content: this.content });
        this.$router.push("/");
      },
    },
  };
  </script>
  