<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/boards" class="navbar-brand">My Bulletin Board</router-link>
      <ul class="navbar-nav">
        <li><router-link to="/boards">게시판</router-link></li>
        <li><router-link to="/mypage">마이페이지</router-link></li>
        <li><a href="#" @click.prevent="logout">로그아웃</a></li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "AppNavbar",
  methods: {
    logout() {
      localStorage.removeItem("jwtaccess");
      localStorage.removeItem("jwtrefresh");
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.navbar {
  background-color: #333;
  color: #fff;
  padding: 1rem;
  width: 100%;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
}

.navbar-brand {
  font-size: 1.2rem;
  text-decoration: none;
  color: #fff;
}

.navbar-nav {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar-nav li {
  margin-left: 1rem;
}

.navbar-nav a {
  color: #fff;
  text-decoration: none;
}
</style>
