<template>
  <div class="page-wrapper">
    <div class="register-container">
      <h1 class="form-title">회원가입</h1>
      <div class="register-form">
        <input v-model="username" type="text" placeholder="Username" required />
        <div v-if="errors.username" class="error-message">{{ errors.username }}</div>
        <input v-model="nickname" type="text" placeholder="Nickname" required />
        <div v-if="errors.nickname" class="error-message">{{ errors.nickname }}</div>
        <input v-model="email" type="email" placeholder="Email" required />
        <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
        <input v-model="password" type="password" placeholder="Password" required />
        <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
        <button @click="register" class="submit-btn">회원가입</button>
      </div>
      <router-link to="/" class="link-btn">로그인으로 돌아가기</router-link>
    </div>
    <!-- Teleport으로 모달 렌더링 (필요 시) -->
    <teleport to="body">
      <DefaultModal 
        v-model:visible="modalVisible" 
        :message="modalMessage"
        @confirmed="onModalConfirmed" />
    </teleport>
  </div>
</template>

<script>
import axios from 'axios';
import DefaultModal from '../components/DefaultModal.vue';

export default {
  name: 'RegisterForm',
  components: { DefaultModal },
  data() {
    return {
      username: '',
      nickname: '',
      email: '',
      password: '',
      modalVisible: false,
      modalMessage: '',
      registrationSuccess: false,
      errors: {}
    };
  },
  methods: {
    async register() {
      if(!this.validation())
      {
        return;
      }
      
      try {
        const response = await axios.post('http://localhost:8080/api/auth/register', {
          username: this.username,
          nickname: this.nickname,
          email: this.email,
          password: this.password,
        });
        if (response.data.statusCode === 2001) {
          this.modalMessage = '회원 가입이 완료 되었습니다!';
          this.modalVisible = true;
          this.registrationSuccess = true;
        }
      
      } catch (err) {
        if (err.response && err.response.data && err.response.data.statusCode === 4001) {
          this.modalMessage = '중복된 계정이 존재합니다.';
        } else {
          this.modalMessage = '빈 칸이 있는지 확인해주세요.';
        }
        this.modalVisible = true;
        this.registrationSuccess = false;
      }
    
  },
    onModalConfirmed() {
      this.modalVisible = false;
      if(this.registrationSuccess)
    {
      this.$router.push('/');
    }
  },
  validation()
  {
    let valid = true;
    this.errors = {};
    
       if(!this.username.trim())
      {
        this.errors.username = "아이디를 써 주세요.";
        valid = false;
      }
      if(!this.nickname.trim()) {
        this.errors.nickname = "닉네임을 써 주세요.";
        valid = false;
      }
      if(!this.email.trim()) {
        this.errors.email = "이메일을 써 주세요.";
        valid = false;
      }
      if(!this.password.trim()) {
        this.errors.password = "비밀번호를 써 주세요.";
        valid = false;
      }
      return valid;
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

.register-container {
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

.register-form {
  display: flex;
  flex-direction: column;
}

.register-form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 3px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.error-message {
  color: red;
  font-size: 0.9em;
  margin-top: 5px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #38c172;
  border: none;
  color: #fff;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.submit-btn:hover {
  background-color: #1f9d55;
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
