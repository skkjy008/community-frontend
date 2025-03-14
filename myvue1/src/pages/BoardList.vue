<template>
  <div class="page-wrapper">

    <AppNavbar />


    <main class="main-content">
      <div class="board-container">
        <h1>게시판</h1>


        <div class="search-bar">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="검색어를 입력하세요" 
            class="input-search"
            />
          <button @click="searchPosts" class="btn-search">검색</button>
        </div>

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
            <tr v-for="post in filteredPosts" :key="post.id">
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
      </div>
    </main>

    <!-- 하단 푸터 -->
    <AppFooter />
  </div>
</template>

<script>
import AppNavbar from "@/components/AppNavbar.vue";
import AppFooter from "@/components/AppFooter.vue";

export default {
  name: "BoardList",
  components: {
    AppNavbar,
    AppFooter,
  },
  data() {
    return {
      searchQuery: "",
      posts: [
        { id: 1, title: "첫번째 게시글", content: "게시글 내용입니다.", writer: "Alice", createdAt: "2025-03-20" },
        { id: 2, title: "두번째 게시글", content: "또 다른 게시글 내용입니다.", writer: "Bob", createdAt: "2025-03-21" },
      ],
    };
  },
  computed: {
    filteredPosts() {
      if (!this.searchQuery) return this.posts;
      return this.posts.filter(post => {
        return (
          post.title.includes(this.searchQuery) ||
          post.content.includes(this.searchQuery) ||
          post.writer.includes(this.searchQuery)
        );
      });
    },
  },
  methods: {
    searchPosts() {
      // 현재 computed에서 필터링되므로 별도 로직은 필요 없음.
    },
  },
};
</script>

<style scoped>
/* 전체 페이지를 100vh로 채우고 flex로 배치 */
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Navbar와 Footer는 고정하지 않고, 자연스럽게 배치 */
.main-content {
  flex: 1;
  overflow: hidden; /* 스크롤이 발생하지 않도록 */
}

/* 게시판 영역 */
.board-container {
  max-width: 900px;
  margin: 80px auto 20px; /* 상단 80px 여백: Navbar 높이 고려 */
  padding: 20px;
  text-align: left;
}

/* 검색 바 스타일 */
.search-bar {
  margin-bottom: 20px;
  display: flex;
}
.btn-search{
  width: 10%;
  padding: 10px;
  background-color: #3490dc;
  border: none;
  color: #fff;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.input-search{
  margin-right: 30px;
  margin-top: 10px;
  padding: 10px;
  height: 40px;
}

/* 게시판 테이블 스타일 */
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
</style>
