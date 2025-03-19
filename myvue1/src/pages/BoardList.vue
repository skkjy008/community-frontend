<template>
  <div class="page-wrapper">
    <!-- 상단 네비게이션 바 -->
    <AppNavbar />

    <main class="main-content">
      <div class="board-container">
        <h1>게시판</h1>

        <!-- 검색 바 -->
        <div class="search-bar">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="검색어를 입력하세요" 
            class="input-search"
          />
          <button @click="searchPosts" class="btn-search">검색</button>
        </div>

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
                <router-link :to="'/board/' + post.id">
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

        <!-- 글쓰기 버튼 -->
        <button @click="writePosts" class="btn-post">글쓰기</button>
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
      posts: [
      ],
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  computed: {
    filteredPosts() {
      if (!this.searchQuery) return this.posts;
      return this.posts.filter(post =>
        post.title.includes(this.searchQuery) ||
        post.content.includes(this.searchQuery) ||
        post.writer.includes(this.searchQuery)
      );
    },
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

    fetchPosts()
    {
      axios.get("http://localhost:8080/api/boards",{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtaccess")}`
      }
    })
      .then(response =>
        {
          if(response.data.statusCode===200)
        {
          this.posts = response.data.data;
        }
        })
      .catch(error =>{
        console.log("게시글 조회 실패:",error);
      })
    },

    searchPosts() {
      
      this.currentPage = 1; // 검색 시 첫 페이지로 이동
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
    writePosts() {
      // 글쓰기 페이지로 이동 (예: /create)
      this.$router.push("/create");
    },
  },
  mounted()
  {
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
  overflow: hidden;
}

/* 게시판 영역 */
.board-container {
  max-width: 900px;
  margin: 70px auto 20px;
  padding: 20px;
  text-align: left;
}

/* 검색 바 */
.search-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.input-search {
  margin-right: 30px;
  margin-top: 10px;
  padding: 10px;
  height: 40px;
  flex: 1;
}

.btn-search {
  padding: 10px;
  background-color: #3490dc;
  border: none;
  color: #fff;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

/* 게시판 테이블 */
.board-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
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

/* 글쓰기 버튼 */
.btn-post {
  padding: 10px;
  background-color: #3490dc;
  border: none;
  color: #fff;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  display: block;
  margin: 0 auto;
  float: right;
}
</style>
