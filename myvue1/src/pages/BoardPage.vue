<template>
    <div class="page-wrapper">
      <AppNavbar />
      <main class="main-content">
        <div class="board-container">
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-meta">
            <span class="post-writer">작성자: {{ post.writer }}</span>
            <span class="post-date">작성일: {{ post.createdAt }}</span>
          </div>
          <div class="post-content">{{ post.content }}</div>
          <div class="back-list">
          <router-link to="/boards" class="back-button">목록으로 돌아가기</router-link>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  </template>
  
  <script>
  import AppNavbar from "@/components/AppNavbar.vue";
  import AppFooter from "@/components/AppFooter.vue";
  import axios from "axios";
  
  export default {
    name: "BoardDetail",
    components: { AppNavbar, AppFooter },
    data() {
      return {
        post: {}
      };
    },
    mounted() {
      const postId = this.$route.params.id;
      axios
        .get(`http://localhost:8080/api/boards/${postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtaccess")}`
          }
        })
        .then(response => {
          if (response.data.statusCode === 200) {
            this.post = response.data.data;
          }
        })
        .catch(error => {
          console.error("게시글 상세 조회 실패:", error);
        });
    }
  };
  </script>
  
  <style scoped>
  /* 전체 페이지 */
  .page-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  /* 메인 콘텐츠 영역 */
  .main-content {
    flex: 1;
    padding: 20px;
    box-sizing: border-box;
  }
  
  /* 게시판 영역 */
  .board-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }
  

  .post-title {
    font-size: 1.8rem;
    margin-bottom: 10px;
    white-space: normal;          /* 여러 줄로 표시 */
    overflow-wrap: break-word; 
  }
  

  .post-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    font-size: 0.9rem;
    color: #555;
    margin-bottom: 20px;
  }
  

  .post-writer,
  .post-date {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .post-content {
    font-size: 1rem;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
    margin-bottom: 20px;
  }
  .back-list
  {
    margin-top: 80px;
    text-align: center;
  }
  
  .back-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #3490dc;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
  }
  </style>
  