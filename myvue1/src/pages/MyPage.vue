<template>
    <div class="page-wrapper">
      <!-- 상단 네비게이션 바 -->
      <AppNavbar />
  
      <main class="main-content">
        <div class="board-container">
          <h1>마이페이지</h1>
        <div class="myInfo">
            <h2>내 정보</h2>

        <div class="myInfo-name-frame">
            <h4>닉네임</h4>
            <input 
          class="myInfo-name" 
          type="text"
          v-model="nickname"
          placeholder="닉네임"
          required/>
        </div>

        <div class="myInfo-email-frame">
            <h4>이메일</h4>
          <input 
          class="myInfo-email" 
          type="text"
          v-model="email"
          placeholder="이메일"
          required/>
            </div>

        <div class="myInfo-password-frame">
            <h4>비밀번호</h4>
          <input 
          class="myInfo-password" 
          type="text"
          v-model="password"
          placeholder="패스워드"
          required/>
        </div>
         <div class="myInfo-passchk-frame">
            <h4>비밀번호 확인</h4>
          <input 
          class="myInfo-passchk" 
          type="text"
          v-model="passchk"
          placeholder="패스워드 확인"
          required/>
         </div>

         <div class="update-mystatus">
            <button>수정</button>
            <button @click="cancelMyPage">취소</button>
         </div>

        </div>

        <div class="my-post">
        <h2>내가 쓴 게시글 </h2>
 
          <!-- 게시글 목록 (테이블 형태) -->
          <table class="board-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="post in pagedPosts" :key="post.id">
                <td>{{ post.id }}</td>
                <td>
                  <router-link :to="'/boards/' + post.id">
                    {{ post.title }}
                  </router-link>
                </td>
                <td>{{ post.writer }}</td>
                <td>{{ post.createdAt }}</td>
              </tr>
            </tbody>
          </table>
  
          <!-- 페이지네이션 버튼 -->
          <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1" class="btn-pagination">이전</button>
            <button 
              v-for="page in totalPages" 
              :key="page" 
              @click="goToPage(page)"
              :class="['btn-pagination', { active: currentPage === page }]"
            >
              {{ page }}
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="btn-pagination">다음</button>
          </div>

        </div>
  
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
    name: "BoardList",
    components: { AppNavbar, AppFooter },
    data() {
      return {
        searchQuery: "",
        searchType: "all",
        posts: [],
        filteredPosts: [],
        currentPage: 1,
        itemsPerPage: 5,
        nickname: localStorage.getItem("nickname") || '',
        email: "",
        password: "",
        passchk: ""
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.filteredPosts.length / this.itemsPerPage);
      },
      pagedPosts() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = this.currentPage * this.itemsPerPage;
        return this.filteredPosts.slice(start, end);
      },
    },
    methods: {
      fetchPosts() {
        const user = localStorage.getItem("nickname");
        axios.get(`http://localhost:8080/api/mypage/${user}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtaccess")}`
          }
        })
        .then(response => {
          if(response.data.statusCode === 200) {
            this.posts = response.data.data;
            this.filteredPosts = this.posts;
          }
        })
        .catch(error => {
          console.log("게시글 조회 실패:", error);
        });
      },
      prevPage() {
        if (this.currentPage > 1) this.currentPage--;
      },
      nextPage() {
        if (this.currentPage < this.totalPages) this.currentPage++;
      },
      goToPage(page) {
        this.currentPage = page;
      },
      cancelMyPage()
      {
        this.$router.push("/boards");
      }
    },
    mounted() {
      this.fetchPosts();
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
  padding: 20px;
  background-color: #f5f5f5;
  }

  .my-post{
    background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  }
  
  /* 게시판 영역 */
  .board-container {
    max-width: 900px;
  margin: 70px auto 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  
  .myInfo{
    background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  
}

.myInfo h2 {
    font-size: 1.8rem;
  color: #333;
  border-bottom: 2px solid #3490dc;
  padding-bottom: 10px;
  margin-bottom: 20px;
}


 
.myInfo-name-frame,
.myInfo-email-frame,
.myInfo-password-frame,
.myInfo-passchk-frame {
  margin-bottom: 20px;
}

.myInfo-name-frame h4,
.myInfo-email-frame h4,
.myInfo-password-frame h4,
.myInfo-passchk-frame h4 {
  font-size: 1rem;
  margin-bottom: 8px;
  color: #555;
}

 
  /* 게시판 테이블 */
  .board-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 30px;
  }

  .myInfo input {
    width: 100%;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.myInfo input:focus {
  border-color: #3490dc;
  outline: none;
}

.update-mystatus {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.update-mystatus button {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #3490dc;
  color: #fff;
  transition: background-color 0.3s ease;
}

.update-mystatus button:hover {
  background-color: #287bb5;
}

  .board-table th,
  .board-table td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: left;
  }
  
  /* 페이지네이션 */
  .pagination {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .btn-pagination {
    padding: 8px 12px;
    margin: 0 5px;
    border: 1px solid #ccc;
    background-color: #fff;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .btn-pagination.active {
    background-color: #3490dc;
    color: #fff;
    border-color: #3490dc;
  }
 
  </style>
  