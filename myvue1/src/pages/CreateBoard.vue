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
          v-model="title"
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
          v-model="content"
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
    <teleport to="body">
      <DefaultModal 
        v-model:visible="modalVisible" 
        :message="modalMessage"
        :showCancel="showModalCancel"
        @confirmed="onModalConfirmed"
        @cancelled="onModalCancelled" />
    </teleport>
    </main>

    <!-- 하단 푸터 -->
    <AppFooter />
  </div>
</template>

<script>
import AppNavbar from "@/components/AppNavbar.vue";
import AppFooter from "@/components/AppFooter.vue";
import DefaultModal from "@/components/DefaultModal.vue";
import axios from "axios";

export default {
  name: "CreateBoard",
  components: { AppNavbar, AppFooter, DefaultModal },
  data() {
    return {
      title: '',
      content: '',
      writer: localStorage.getItem("nickname") || '',
      username: localStorage.getItem("username") || '',
      modalVisible: false,
      modalMessage: '',
      uploadSuccess: false,
      showModalCancel: false
    };
  },
  methods: {
    writePosts()
    {
      console.log("click!");
      if(!this.title.trim() || !this.content.trim())
    {
      this.modalMessage = '제목과 내용 모두 입력하세요,';
      this.showModalCancel = false;
      this.uploadSuccess = false;
      this.modalVisible = true;
      return;
    }
    axios.post("http://localhost:8080/api/boards/create",
      {
        title: this.title,
        content: this.content,
        writer: this.writer,
        username: this.username
      },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtaccess")}`
      }

    }).then(response=>{
          if(response.data.statusCode==2002)
          {
          this.modalMessage = '게시글 작성이 완료 되었습니다!';
          this.showModalCancel = false; 
          this.modalVisible = true;
          this.uploadSuccess = true;
          }

      }).catch(err => { // eslint-disable-line no-unused-vars
        this.modalMessage = '게시글 작성 중 오류가 발생했습니다.';
        this.showModalCancel = false;
        this.modalVisible = true;

      });

    },
    onModalConfirmed() {
      this.modalVisible = false;
      if(this.uploadSuccess)
    {
      this.$router.push('/boards');
    }
  },
  onModalCancelled()
  {
    this.modalVisible = false;
  },
    cancelPosts()
    {
        if(this.title.trim() || this.content.trim())
          {
            this.modalMessage = '현재 작성중인 내용이 존재합니다. 페이지를 벗어나면 사라집니다.';
            this.showModalCancel = true;
            this.modalVisible = true;
            this.uploadSuccess = true;
          }
        else
          {
          this.$router.push("/boards");
          }
    },
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
