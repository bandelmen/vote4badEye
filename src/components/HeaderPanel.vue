<template>
  <header class="page-header">
    <div class="page-container">
      <div class="header-buttons">
        <el-button type="primary" @click="showLogin">登录</el-button>
        <el-button type="success" @click="showRegister">注册</el-button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderPanel',
  methods: {
    showLogin() {
      console.log('Show login');
    },
    showRegister() {
      console.log('Show register');
    },
  },
};
</script>

<style scoped>
.page-header {
  position: sticky;
  top: 0;
  left: 0;
}

.page-container {
  position: relative;
  padding: 0 32px;
  border-bottom: 1px solid #dcdfe6;
  height: 55px;
  background-color: #ffffff;
  /* backdrop-filter: saturate(50%) blur(4px); */
  background-size: 4px 4px;
}

.header-buttons {
  display: flex;
  justify-content: right;
  margin: 0 auto;
  height: 100%;
  align-content: center;
  align-items: center;
}
</style>
