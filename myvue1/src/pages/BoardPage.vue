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


            <div class="comment-item" v-for="comment in nestedComments" :key="comment.id">
              <div class="comment-header">
                <span class="comment-writer">{{ comment.writer }}</span>
                <span class="comment-createdAt">{{ comment.createdAt }}</span>
              </div>
              <div class="comment-content">
                {{ comment.content }}
                <div class="comment-edit">
                    <a href="#" @click.prevent="toggleReply(comment)">답글</a>
                    <a v-if="comment.writer === currentUser" href="#" @click.prevent="toggleEdit(comment)">편집</a>
                    <a v-if="comment.writer === currentUser" href="#" @click.prevent="deleteComment(comment)">삭제</a>
                </div>

                <div class="reply-section" v-if="comment.showReply">
                    <textarea v-model="comment.newReply" placeholder="답글을 입력하세요"></textarea>
                    <button @click="submitReply(comment)">등록</button>
                    <button @click="toggleReply(comment)">취소</button>
                </div>

                <div class="edit-section" v-if="comment.showEdit">
                    <textarea v-model="comment.editContent" placeholder="댓글을 수정하세요">
                    </textarea>
                    <button @click="submitEdit(comment)">수정</button>
                    <button @click="toggleEdit(comment)">취소</button>
                </div>
            </div>

            <!--답글 파트-->
            <div class="child-comments" v-if="comment.replies && comment.replies.length">
              <div class="comment-item reply-item" v-for="reply in comment.replies" :key="reply.id">
                <div class="comment-header">
                  <span class="comment-writer">{{ reply.writer }}</span>
                  <span class="comment-createdAt">{{ reply.createdAt }}</span>
                </div>
                <div class="comment-content">
                  {{ reply.content }}
                  <div class="comment-edit">
                    <a href="#" @click.prevent="toggleReply(reply)">답글</a>
                    <a v-if="reply.writer === currentUser" href="#" @click.prevent="toggleEdit(reply)">편집</a>
                    <a v-if="reply.writer === currentUser" href="#" @click.prevent="deleteComment(reply)">삭제</a>
                  </div>
                  <div class="reply-section" v-if="reply.showReply">
                    <textarea v-model="reply.newReply" placeholder="답글을 입력하세요"></textarea>
                    <button @click="submitReply(reply)">등록</button>
                    <button @click="toggleReply(reply)">취소</button>
                  </div>
                  <div class="edit-section" v-if="reply.showEdit">
                    <textarea v-model="reply.editContent" placeholder="댓글을 수정하세요"></textarea>
                    <button @click="submitEdit(reply)">수정</button>
                    <button @click="toggleEdit(reply)">취소</button>
                  </div>
                </div>
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
        comments: [],
        newComment: "",
        currentUser: localStorage.getItem("nickname")||""
      };
    },
    computed:
    {

        nestedComments() {
            const commentMap = {};
            // 각 댓글에 replies 배열을 초기화하고, map에 저장합니다.
            this.comments.forEach(comment => {
                comment.replies = [];
                commentMap[comment.id] = comment;
            });
            const nested = [];
            // 각 댓글이 부모 댓글을 가지고 있으면 replies에 추가, 그렇지 않으면 최상위로 처리합니다.
            this.comments.forEach(comment => {
                if (comment.parentComment && comment.parentComment.id) {
                const parentId = comment.parentComment.id;
                if (commentMap[parentId]) {
                    commentMap[parentId].replies.push(comment);
                }
                } else {
                nested.push(comment);
                }
            });
            return nested;
        }
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
        // 각 댓글 객체에 UI 제어 상태를 추가
        this.comments = response.data.data.map(comment => ({
          ...comment,
          showReply: false,
          showEdit: false,
          newReply: "",
          editContent: comment.content
        }));
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
                const newCmt = {
                    ...response.data.data,
                    showReply: false,
                    showEdit: false,
                    newReply: "",
                    editContent: response.data.data.content,
                    replies: []
                };
                this.comments.push(newCmt);
                console.log("댓글 작성이 완료되었습니다.");
                this.newComment= "";
                
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
      },
      toggleReply(comment)
      {
        this.comments.forEach(c => {
            if(c.id !== comment.id)
        {
            c.showReply = false;
        }
        });

        comment.showReply = !comment.showReply;
        if(comment.showReply)
      {
        comment.showEdit = false;
        comment.newReply = "";
      }

    },
    toggleEdit(comment)
    {
        this.comments.forEach(c => {
            if(c.id !== comment.id)
        {
            c.showEdit = false;
        }
        });
        comment.showEdit = !comment.showEdit;
        if(comment.showEdit)
            {
                comment.showReply = false;
                comment.editContent = comment.content;
            }else
            {
                comment.editContent = comment.content;
            }
    },
    deleteComment(comment){
        const postId = this.$route.params.id;
        axios.delete(`http://localhost:8080/boards/${postId}/api/comments/${comment.id}`,
         {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwtaccess")}`} 
        })
        .then(response =>
        {
            if(response.data.statusCode === 200)
        {
            this.comments = this.comments.filter(c => c.id !== comment.id);
        }
        })
        .catch(err =>{ // eslint-disable-line no-unused-vars
            console.log("댓글 삭제 오류:",err);
        });
    },
    //답글 작성
    submitReply(comment)
    {
        const postId = this.$route.params.id;
            if(comment.newReply.trim() !=="")
        {
            axios.post(`http://localhost:8080/boards/${postId}/api/comments/${comment.id}/reply`,
                {
                    content: comment.newReply,
                    writer: localStorage.getItem("nickname"),
                    postId: postId,
                    parentComment: comment
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("jwtaccess")}` }  
                })
                .then(response =>
                {
                    if(response.data.statusCode === 200)
                {
                    const newReply = 
                    {
                        ...response.data.data,
                        showReply: false,
                        showEdit: false,
                        newReply: "",
                        editContent: response.data.data.content,
                        replies: []
                    };
                    this.comments.push(newReply);
                    comment.showReply = false;
                }
            })
            .catch(err => { // eslint-disable-line no-unused-vars
                console.log("덧글 수정중 오류 발생");
            });
        }
    },
    submitEdit(comment)
    {
        const postId = this.$route.params.id;
        if(comment.editContent.trim() !== "")
    {
        axios.put(`http://localhost:8080/boards/${postId}/api/comments/${comment.id}`,
            {
                content: comment.editContent,
                writer: comment.writer
            },
        {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwtaccess")}`}
        })
        .then(response=>
        {
            if(response.data.statusCode === 200)
        {
            comment.content = comment.editContent;
            comment.showEdit = false;
        }
        })
        .catch(err =>// eslint-disable-line no-unused-vars
        {
            console.log("댓글 수정 중 오류 발생");
        })
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
  
  .comment-text p {
    margin: 0 0 5px 0;
    font-size: 1rem;
    line-height: 1.4;
    word-break: break-word;
  }
  
  /* 댓글 입력창 */
  .comment-input {
    display: flex;
    flex-direction: column;
  }
  


  .comment-edit
  {
    text-align: right;
    margin-top: 5px;

  }

  /* 댓글 액션 버튼 (답글, 편집, 삭제) */

.comment-edit a {
  margin-left: 10px;
  color: #3490dc;
  text-decoration: underline;
  cursor: pointer;
}

.reply-section,
.edit-section {
  display: flex;
  margin-top: 10px;
}
.reply-section textarea,
.edit-section textarea {
  width: 100%;
  height: 60px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
  margin-bottom: 5px;
}
.reply-section button,
.edit-section button {
  padding: 6px 12px;
  background-color: #3490dc;
  border: none;
  color: #fff;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
}

/* 새 댓글 입력창 */
.comment-input {
  display: flex;
  flex-direction: column;
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
  .child-comments {
  margin-left: 30px;
  border-left: 2px solid #ddd;
  padding-left: 15px;
  margin-top: 10px;
}

.reply-item {
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 3px;
  padding: 8px;
  margin-bottom: 10px;
}
  </style>
  