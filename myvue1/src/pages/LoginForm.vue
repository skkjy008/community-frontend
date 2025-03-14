<template>
  <div class="page-wrapper">
    <div class="login-container">
      <h1 class="form-title">로그인</h1>
      <form @submit.prevent="Login" class="login-form">
        <div class="form-group">
          <label for="username">사용자 이름</label>
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="사용자 이름을 입력하세요"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>
        <button type="submit" class="submit-btn">로그인</button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <router-link to="/register" class="link-btn">회원가입</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async Login() {
      try {
        const response = await axios.post("http://localhost:8080/api/auth/login", {
          username: this.username,
          password: this.password
        });
        const accessToken = response.data.accessToken;
        const refreshToken = response.data.refreshToken;
        localStorage.setItem("jwtaccess", accessToken);
        localStorage.setItem("jwtrefresh", refreshToken);
        this.$router.push("/boards");
      } catch (err) {
        this.errorMessage = "Invalid username or password";
      }
    }
  }
};
</script>

<style scoped>
.page-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f7f7f7;
}

.login-container {
  background: #fff;
  padding: 40px;
  border: 2px solid #333;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  text-align: left;
}

.form-title {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #3490dc;
  border: none;
  color: #fff;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.submit-btn:hover {
  background-color: #2779bd;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}

.link-btn {
  display: block;
  text-align: center;
  margin-top: 15px;
  color: #3490dc;
  text-decoration: none;
}

.link-btn:hover {
  text-decoration: underline;
}
</style>
