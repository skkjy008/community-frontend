<template>
  <div class="page-wrapper">
    <!-- 상단 네비게이션 바 -->
    <AppNavbar />

    <main class="main-content">
      <div class="board-container">
        <h1>글 쓰기</h1>
      <div class="title-content-part">
        <div class="title-line">
          <h2>제목</h2>
          <input 
          class="write-title" 
          type="text"
          placeholder="제목을 입력하세요"
          required/>
        <div class="writer-line">
          <h3>작성자</h3>
          <input 
          class="writer-name" 
          type="text"
          v-model="writer"
          readonly/>
        </div>
        </div>
        <div class="board-content">
          <h2>내용</h2>
          <textarea 
          class="write-content" 
          type="text"
          placeholder="내용을 입력하세요"
          required
          />
        </div>
     </div>
      </div>
      <div class="btn-line">
      <button @click="writePosts" class="upload-post">글쓰기</button>
      <button @click="cancelPosts" class="cancel-post">취소</button>
    </div>
    </main>

    <!-- 하단 푸터 -->
    <AppFooter />
  </div>
</template>

<script>
import AppNavbar from "@/components/AppNavbar.vue";
import AppFooter from "@/components/AppFooter.vue";
import axios from "axios";

export default {
  name: "CreateBoard",
  components: { AppNavbar, AppFooter },
  data() {
    return {
      title : '',
      content : '',
      writer : localStorage.getItem("nickname") || '',
      modalVisible: false,
      modalMessage: '',
      uploadSuccess: false,
      errors: {}
    };
  },
  methods: {
    writePosts()
    {
      try {
        const response = axios.post('http://localhost:8080/api/boards/create',
          {
            title: this.title,
            content: this.content,
            writer: this.writer,
          });
          if(response.data.statusCode===2002)
          {
            this.modalMessage = '게시글 작성이 완료 되었습니다!';
            this.modalVisible = true;
            this.uploadSuccess = true;
          }
        
      } catch (err) {
        if (err.response && err.response.data && err.response.data.statusCode === 4002) {
          this.modalMessage = '제목을 써 주세요';
        } else if(err.response && err.response.data && err.response.data.statusCode === 4003)
        {
          this.modalMessage = '내용을 써 주세요';
        }
        this.modalVisible = true;
        this.registrationSuccess = false;
      }

    },
    cancelPosts()
    {
        this.$router.push("/boards");
    },
    validation()
    {
      let valid = true;
      this.errors = {};

        if(!this.title.trim())
        {
            this.errors.title = "제목을 써 주세요";
            valid = false;
        }
      if(!this.title.trim())
        {
            this.errors.content = "내용을 써 주세요";
            valid = false;
        }
        return valid;
    }

  },
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
  overflow: hidden;
}


/* 게시판 영역 */
.board-container {
  max-width: 900px;
  margin: 40px auto 20px;
  padding: 20px;
  text-align: left;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.writer-name
{
  margin-left: 20px;
  background-color: #f2f2f2;
  color: #b3b3b3;
  cursor: not-allowed;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.title-content-part
{
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.title-line
{
  margin: 20px;
  display: flex;
}
.writer-line
{
  margin-top: 10px;
  margin-left: 30px;
  display: flex;

}

.write-title
{
  margin-left: 3rem;
  width: 400px;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.board-content
{
  margin: 20px;
  display: flex;

}

.write-content
{
  margin-left: 3rem;
  width: 700px;
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;

}

.input-search {
  margin-right: 30px;
  margin-top: 10px;
  padding: 10px;
  height: 40px;
  flex: 1;
}

.upload-post {
  padding: 10px 20px;
  background-color: #3490dc;
  border: none;
  color: #fff;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  display: block;
  margin: 0 auto;
}

.cancel-post {
  padding: 10px 20px;
  background-color: #3490dc;
  border: none;
  color: #fff;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  display: block;
  margin: 0 auto;
}
.btn-line
{
  max-width: 200px;
  margin:20px auto 20px;
  margin-left: 1000px;
  display: flex;
}

</style>
