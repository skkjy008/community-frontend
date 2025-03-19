<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <p>{{ message }}</p>
      <div class="button-group">
        <button @click="onConfirm" class="modal-button confirm-button">확인</button>
        <button v-if="showCancel" @click="onCancel" class="modal-button cancel-button">취소</button>
      </div>
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
    showCancel: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onConfirm() {
      this.$emit("update:visible", false);
      this.$emit("confirmed");
    },
    onCancel() {
      this.$emit("update:visible", false);
      this.$emit("cancelled");
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  min-width: 300px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  text-align: center;
}
.button-group {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
.modal-button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 5px;
}
.confirm-button {
  background: #3490dc;
  color: #fff;
}
.cancel-button {
  background: #ccc;
  color: #333;
}
</style>
