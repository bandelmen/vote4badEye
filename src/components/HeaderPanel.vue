<template>
  <header class="page-header">
    <div class="page-container">
      <div class="header-buttons">
        <el-button type="primary" @click="showLogin">登录</el-button>
        <el-button type="success" @click="showRegister">注册</el-button>
      </div>
    </div>
  </header>

  <el-dialog v-model="showLoginDialog" title="用户登录" :show-close="false" :width="getDialogWidth">
    <el-form :model="form">
      <el-form-item label="用户名：" :label-width="formLabelWidth">
        <el-input v-model="form.name" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码：" :label-width="formLabelWidth">
        <el-input v-model="form.pwd" type="password" placeholder="请输入密码" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelLoginDialog">取消</el-button>
        <el-button type="primary" @click="confirmLoginDialog"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="showRegisterDialog"
    title="用户注册"
    :show-close="false"
    :width="getDialogWidth"
  >
    <el-form :model="form">
      <el-form-item label="用户名：" :label-width="formLabelWidth">
        <el-input v-model="form.name" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码：" :label-width="formLabelWidth">
        <el-input v-model="form.pwd" type="password" placeholder="请输入密码" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelRegisterDialog">取消</el-button>
        <el-button type="primary" @click="confirmRegisterDialog"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'HeaderPanel',
  data() {
    return {
      showLoginDialog: false,
      showRegisterDialog: false,
      form: {
        name: '',
        pwd: '',
      },
      formLabelWidth: '100px',
      screenWidth: 0,
    };
  },
  computed: {
    getDialogWidth() {
      if (this.screenWidth < 768) {
        return '90%';
      } else {
        return '700px';
      }
    },
  },
  mounted() {
    // 在组件挂载后获取屏幕宽度
    this.screenWidth = window.innerWidth;

    // 监听窗口变化，动态更新屏幕宽度
    window.addEventListener('resize', this.updateScreenWidth);
  },
  methods: {
    showLogin() {
      this.showLoginDialog = true;
    },
    cancelLoginDialog() {
      this.showLoginDialog = false;
    },
    confirmLoginDialog() {
      this.showLoginDialog = false;
      // TODO:处理登录逻辑
    },
    showRegister() {
      this.showRegisterDialog = true;
    },
    cancelRegisterDialog() {
      this.showRegisterDialog = false;
    },
    confirmRegisterDialog() {
      this.showRegisterDialog = false;
    },
    updateScreenWidth() {
      // 更新屏幕宽度
      this.screenWidth = window.innerWidth;
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