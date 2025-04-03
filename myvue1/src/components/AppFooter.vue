<template>
  <footer class="footer">
    <div class="footer-container">
      <p>&copy; 2025 My Commuity Board. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style scoped>
.footer {
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
  padding: 1rem;
  width: 100%;
  /* Footer를 고정하지 않고 자연스럽게 배치 */
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}
</style>
