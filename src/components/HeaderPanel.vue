<template>
  <header class="page-header">
    <div class="page-container">
      <div class="header-buttons" v-if="!isLoggedIn">
        <el-button type="primary" @click="showLogin">登录</el-button>
        <el-button type="success" @click="showRegister">注册</el-button>
      </div>
      <div class="user-info" v-else>
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <el-tooltip class="box-item" effect="light" content="点击上传头像" placement="bottom">
            <el-avatar class="user-info_avatar" :src="userInfo.avatar" size="default"
          /></el-tooltip>
        </el-upload>

        <span class="user-info_username">{{ userInfo.username }}</span>
      </div>
    </div>
  </header>

  <el-dialog v-model="showLoginDialog" title="用户登录" :show-close="false" :width="getDialogWidth">
    <el-form :model="form">
      <el-form-item label="邮箱：" :label-width="formLabelWidth">
        <el-input v-model="form.mail" placeholder="请输入邮箱" />
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
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="邮箱：" :label-width="formLabelWidth">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
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
import { showMessage } from '@/utils/common';
import axios from 'axios';

export default {
  name: 'HeaderPanel',
  data() {
    return {
      showLoginDialog: false,
      showRegisterDialog: false,
      form: {
        username: '',
        pwd: '',
        email: '',
      },
      userInfo: {
        email: '',
        username: '暗黑烤鸭',
        userId: '',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      },
      formLabelWidth: '100px',
      screenWidth: 0,
      isShowErrorMsg: false,
      isLoggedIn: false,
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
    async confirmRegisterDialog() {
      try {
        const response = await axios.post('http://localhost:3000/auth/register', {
          username: this.form.username,
          password: this.form.pwd,
          email: this.form.email,
        });

        if (response.data.code === 200) {
          this.handleSuccessfulRegistration(response.data.data);
        } else {
          this.handleRegistrationFailure();
        }
      } catch (error) {
        this.handleRequestFailure();
      }
    },
    handleSuccessfulRegistration(data) {
      console.log('注册成功', data);
      showMessage('注册成功', 'success', () => {
        this.clearRegistrationForm();
        this.updateUserInfo(data);
        this.closeRegisterDialog();
        this.isLoggedIn = true;
      });
    },
    handleRegistrationFailure() {
      if (!this.isShowErrorMsg) {
        this.isShowErrorMsg = true;
        showMessage('邮箱已被注册', 'warning', () => {
          this.isShowErrorMsg = false;
        });
      }
    },
    handleRequestFailure() {
      if (!this.isShowErrorMsg) {
        this.isShowErrorMsg = true;
        showMessage('请求失败', 'error', () => {
          this.isShowErrorMsg = false;
        });
      }
    },
    clearRegistrationForm() {
      this.form.username = '';
      this.form.email = '';
      this.form.pwd = '';
    },
    updateUserInfo(data) {
      this.userInfo.email = data.email;
      this.userInfo.username = data.username;
      this.userInfo.userId = data.userId;
    },
    closeRegisterDialog() {
      this.isShowErrorMsg = false;
      this.showRegisterDialog = false;
    },
    updateScreenWidth() {
      this.screenWidth = window.innerWidth;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      showMessage('上传头像成功', 'success', () => {});
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        if (!this.isShowErrorMsg) {
          this.isShowErrorMsg = true;
          showMessage('上传头像图片只能是 JPG 或 PNG 格式', 'error', () => {
            this.isShowErrorMsg = false;
          });
        }
      }
      if (!isLt2M) {
        if (!this.isShowErrorMsg) {
          this.isShowErrorMsg = true;
          this.$message.error('');
          showMessage('上传头像图片大小不能超过 2MB', 'error', () => {
            this.isShowErrorMsg = false;
          });
        }
      }

      return isJPG && isLt2M;
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

.header-buttons,
.user-info {
  display: flex;
  justify-content: right;
  margin: 0 auto;
  height: 100%;
  align-content: center;
  align-items: center;
}

.user-info_avatar {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.user-info_username {
  font-weight: bold;
  margin-left: 10px;
}

.box-item {
  width: 110px;
  margin-top: 10px;
}
</style>
