<template>
  <!-- visible이 true일 때만 모달 표시 -->
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <p>{{ message }}</p>
      <button @click="close" class="modal-close-button">확인</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "DefaultModal",
  props: {
    message: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close() {
      // 부모 컴포넌트에서 v-model 바인딩한 값을 변경하기 위해 이벤트 emit
      this.$emit("update:visible", false);
      this.$emit("confirmed");
    },
  },
};
</script>

<style scoped>
/* 모달 전체를 덮는 어두운 배경 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;

  /* 중앙 정렬 */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 모달 내부 흰색 박스 */
.modal-content {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  min-width: 300px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* 닫기 버튼 */
.modal-close-button {
  margin-top: 16px;
  padding: 8px 12px;
  border: none;
  background: #3490dc;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}
</style>
