<template>
  <div class="page-wrapper">
    <!-- 상단 네비게이션 바 -->
    <AppNavbar />

    <main class="main-content">
      <div class="board-container">
        <h1>게시판</h1>

        <!-- 검색 바 -->
        <div class="search-bar">
          <select v-model="searchType" class="search-type">
            <option value="all">제목+내용</option>
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="writer">작성자</option>
          </select>
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
              <th>닉네임</th>
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
      searchType: "all",
      posts: [],
      filteredPosts: [],
      currentPage: 1,
      itemsPerPage: 5,
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
      axios.get("http://localhost:8080/api/boards", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtaccess")}`
        }
      })
      .then(response => {
        if(response.data.statusCode === 200) {
          const postsArray = Array.isArray(response.data.data)
          ? response.data.data
          : (response.data.data?[response.data.data]: []);
          this.posts = postsArray.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
          this.filteredPosts = this.posts;
        }
      })
      .catch(error => {
        console.log("게시글 조회 실패:", error);
      });
    },
    searchPosts() {
      if (!this.searchQuery) {
        this.filteredPosts = this.posts;
      } else if(this.searchType === "title")
      {
        this.filteredPosts = this.posts.filter(post=>
          post.title.includes(this.searchQuery)
        );
      }else if(this.searchType === "content")
      {
        this.filteredPosts = this.posts.filter(post=>
          post.content.includes(this.searchQuery)
        );
      }else if(this.searchType === "writer")
      {
        this.filteredPosts = this.posts.filter(post =>
            post.writer.includes(this.searchQuery)
          );
      }else
      {
        this.filteredPosts = this.posts.filter(post =>
          post.title.includes(this.searchQuery) ||
          post.content.includes(this.searchQuery) ||
          post.writer.includes(this.searchQuery)  
        );
      }
      this.currentPage = 1;
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
      this.$router.push("/create");
    },
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
  width: 400px;
  align-items: center;
}
.search-type
{
  width:300px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l5 5 5-5z' fill='%233490dc'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 10px;
}

.input-search {
  margin-right: 20px;
  padding: 10px;
  height: 40px;
  flex: 1;
}

.btn-search {

  padding: 10px;
  width: 150px;
  background-color: #3490dc;
  border: none;
  color: #fff;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
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
