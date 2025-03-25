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
        
        <!-- 댓글 섹션 -->
        <div class="comment-section">
          <h2 class="comment-section-title">댓글</h2>
          <div class="comment-list">
            <div class="comment-item" v-for="comment in comments" :key="comment.id">
              <div class="comment-header">
                <span class="comment-writer">{{ comment.writer }}</span>
                <span class="comment-createdAt">{{ comment.createdAt }}</span>
              </div>
              <div class="comment-content">
                {{ comment.content }}
                <div class="comment-edit">
                    <a href="#" @click.prevent="toggleReply(comment)">답글</a>
                    <a href="#" @click.prevent="toggleEdit(comment)">편집</a>
                    <a href="#" @click.prevent="deleteComment(comment)">삭제</a>
                </div>
            </div>
            </div>
          </div>
          <div class="comment-input">
            <textarea v-model="newComment" placeholder="댓글을 입력하세요" ></textarea>
            <button @click="submitComment">댓글 등록</button>
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
    name: "BoardPage",
    components: { AppNavbar, AppFooter },
    data() {
      return {
        post: {},

        comments: [

        ],
        newComment: "",
        title: "",
        writer: ""
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
    
      axios.get(`http://localhost:8080/boards/${postId}/api/comments`,
      {
        headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtaccess")}`
         }
      })
      .then(response => {
      if (response.data.statusCode === 200) {
        this.comments = response.data.data;
      }
    })
    .catch(error => {
      console.error("댓글 조회 실패:", error);
    });

    },
    methods: {
      submitComment() {

        const postId = this.$route.params.id;

        if (this.newComment.trim() !== "") {

            axios.post(`http://localhost:8080/boards/${postId}/api/comments`,
            {
                content: this.newComment,
                writer: localStorage.getItem("nickname"),
                postId: this.$route.params.id
            },
            {
                headers:
            {
                 Authorization: `Bearer ${localStorage.getItem("jwtaccess")}`
            }
        })
        .then(response=>
        {
                if(response.data.statusCode===200)
            {
                this.comments.push(response.data.data);
                console.log("댓글 작성이 완료되었습니다.");
                this.newComment= '';
                
            }
        })
        .catch(err =>// eslint-disable-line no-unused-vars
        {
            console.log("댓글 작성 중, 오류가 발생했습니다.");
        })


        }
    if(this.newComment.trim() == "")
    {
        console.log("댓글을 써 주세요.");
    }
      }
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
  
  /* 게시글 관련 스타일 */
  .post-title {
    font-size: 1.8rem;
    margin-bottom: 10px;
    white-space: normal;
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
  
  .back-list {
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
  
  /* 댓글 섹션 */
  .comment-section {
    max-width: 900px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    background-color: #fafafa;
  }

  
  .comment-section-title {
    margin-bottom: 20px;
    font-size: 1.5rem;
  }
  
  .comment-list {
    margin-bottom: 20px;
  }
  
  .comment-item {
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .comment-item:last-child {
    border-bottom: none;
  }
  
  .comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: 0.9rem;
    color: #555;
  }
  
  .comment-text {
    font-size: 1rem;
    line-height: 1.4;
    word-break: break-word;
  }
  
  /* 댓글 입력창 */
  .comment-input {
    display: flex;
    flex-direction: column;
  }
  
  .comment-content
  {
    display: flex;
  }

  .comment-edit
  {
    text-align: right;
    margin-top: 5px;

  }

  .comment-input textarea {
    width: 100%;
    height: 80px;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: none;
  }
  
  .comment-input button {
    align-self: flex-end;
    padding: 8px 16px;
    background-color: #3490dc;
    border: none;
    color: #fff;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>
  