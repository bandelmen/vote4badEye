<template>
  <header class="page-header">
    <div class="page-container">
      <div class="header-buttons" v-if="!isLoggedIn">
        <el-button type="primary" @click="showLogin">登录</el-button>
        <el-button type="success" @click="showRegister">注册</el-button>
      </div>
      <div class="user-info" v-else>
        <el-avatar class="user-info_avatar" :src="userInfo.avatar" size="default" />
        <span class="user-info_username">{{ userInfo.username }}</span>
        <el-dropdown>
          <el-icon class="setting_icon" :size="20"><Setting /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <el-upload
                  class="avatar-uploader"
                  action="http://localhost:3000/upload/uploadAvatar"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  name="avatar"
                  :data="{ username: userInfo.username }"
                >
                  <el-icon><User /></el-icon>上传头像
                </el-upload>
              </el-dropdown-item>
              <el-dropdown-item @click="logout"
                ><el-icon><SwitchButton /></el-icon>退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>

  <el-dialog v-model="showLoginDialog" title="用户登录" :show-close="false" :width="getDialogWidth">
    <el-form :model="loginForm">
      <el-form-item label="邮箱：" :label-width="formLabelWidth">
        <el-input
          v-model="loginForm.email"
          placeholder="请输入邮箱"
          @keyup.enter="focusLoginPasswordInput"
        />
      </el-form-item>
      <el-form-item label="密码：" :label-width="formLabelWidth">
        <el-input
          ref="loginPasswordInput"
          v-model="loginForm.pwd"
          type="password"
          placeholder="请输入密码"
          show-password
          @keyup.enter="confirmLoginDialog"
        />
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
    <el-form :model="registerForm">
      <el-form-item label="用户名：" :label-width="formLabelWidth">
        <el-input
          v-model="registerForm.username"
          placeholder="请输入用户名"
          @keyup.enter="focusRegisterEmailInput"
        />
      </el-form-item>
      <el-form-item label="邮箱：" :label-width="formLabelWidth">
        <el-input
          ref="registerEmailInput"
          v-model="registerForm.email"
          placeholder="请输入邮箱"
          @keyup.enter="focusRegisterPasswordInput"
        />
      </el-form-item>
      <el-form-item label="密码：" :label-width="formLabelWidth">
        <el-input
          ref="registerPasswordInput"
          v-model="registerForm.pwd"
          type="password"
          placeholder="请输入密码"
          show-password
          @keyup.enter="confirmRegisterDialog"
        />
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
import { eventBus } from '@/utils/event-bus';
import axios from 'axios';

export default {
  name: 'HeaderPanel',
  data() {
    return {
      showLoginDialog: false,
      showRegisterDialog: false,
      registerForm: {
        username: '',
        pwd: '',
        email: '',
      },
      loginForm: {
        email: '',
        pwd: '',
      },
      userInfo: {
        email: '',
        username: '',
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
    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.updateScreenWidth);

    const userDataJSON = JSON.parse(localStorage.getItem('userData'));

    // console.log(userDataJSON.);

    if (userDataJSON) {
      const token = userDataJSON.token;

      console.log(token);
      axios
        .post('http://localhost:3000/auth/verifyToken', null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response);
          if (response.data.code === 200) {
            this.isLoggedIn = true;
            console.log(userDataJSON);
            this.userInfo = {
              email: userDataJSON.email,
              username: userDataJSON.username,
              userId: userDataJSON.userId,
              avatar: userDataJSON.avatar
                ? userDataJSON.avatar
                : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            };
          }
        })
        .catch(() => {
          console.log('error token');
          this.logout();
        });
    } else {
      console.log('no token');
      this.logout();
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('userData');

      this.userInfo.username = '';
      this.userInfo.userId = '';
      this.isLoggedIn = false;
    },
    showLogin() {
      this.showLoginDialog = true;
    },
    cancelLoginDialog() {
      this.showLoginDialog = false;
    },
    showRegister() {
      this.showRegisterDialog = true;
    },
    cancelRegisterDialog() {
      this.showRegisterDialog = false;
    },
    // 登录模块
    async confirmLoginDialog() {
      if (!this.loginForm.email || !this.loginForm.pwd) {
        this.showEmptyFieldsAlert();
        return;
      }

      try {
        const response = await axios.post('http://localhost:3000/auth/login', {
          email: this.loginForm.email,
          password: this.loginForm.pwd,
        });

        if (response.data.code === 200) {
          this.handleSuccessfulLogin(response.data.data);
        } else {
          this.handleLoginFailure();
        }
      } catch (error) {
        this.handleRequestFailure();
      }
    },
    handleSuccessfulLogin(data) {
      console.log('登录成功', data);
      showMessage('登录成功', 'success', () => {
        this.clearLoginForm();
        this.closeLoginDialog();
        this.updateUserInfo(data);
        this.isLoggedIn = true;
      });
      // 将用户数据保存到 localStorage
      localStorage.setItem(
        'userData',
        JSON.stringify({
          token: data.token,
          username: data.username,
          userId: data.id,
          email: data.email,
          avatar: data.avatar,
        })
      );
    },
    clearLoginForm() {
      this.loginForm.email = '';
      this.loginForm.pwd = '';
    },
    closeLoginDialog() {
      this.isShowErrorMsg = false;
      this.showLoginDialog = false;
    },
    updateUserInfo(data) {
      this.userInfo.email = data.email;
      this.userInfo.username = data.username;
      this.userInfo.userId = data.id;
      if (data.avatar !== null) {
        this.userInfo.avatar = data.avatar;
      }
    },
    handleLoginFailure() {
      if (!this.isShowErrorMsg) {
        this.isShowErrorMsg = true;
        showMessage('用户名或密码错误', 'warning', () => {
          this.isShowErrorMsg = false;
        });
      }
    },
    focusLoginPasswordInput() {
      this.$refs.loginPasswordInput.focus();
    },
    // 注册模块
    async confirmRegisterDialog() {
      if (!this.registerForm.username || !this.registerForm.email || !this.registerForm.pwd) {
        this.showEmptyFieldsAlert();
        return;
      }
      try {
        const response = await axios.post('http://localhost:3000/auth/register', {
          username: this.registerForm.username,
          password: this.registerForm.pwd,
          email: this.registerForm.email,
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
        this.closeRegisterDialog();
      });
      eventBus.emit('refreshCandidates');
    },
    clearRegistrationForm() {
      this.registerForm.username = '';
      this.registerForm.email = '';
      this.registerForm.pwd = '';
    },
    closeRegisterDialog() {
      this.isShowErrorMsg = false;
      this.showRegisterDialog = false;
    },
    handleRegistrationFailure() {
      if (!this.isShowErrorMsg) {
        this.isShowErrorMsg = true;
        showMessage('邮箱已被注册', 'warning', () => {
          this.isShowErrorMsg = false;
        });
      }
    },
    focusRegisterEmailInput() {
      this.$refs.registerEmailInput.focus();
    },
    focusRegisterPasswordInput() {
      this.$refs.registerPasswordInput.focus();
    },
    // 通用模块
    handleRequestFailure() {
      if (!this.isShowErrorMsg) {
        this.isShowErrorMsg = true;
        showMessage('请求失败', 'error', () => {
          this.isShowErrorMsg = false;
        });
      }
    },
    updateScreenWidth() {
      this.screenWidth = window.innerWidth;
    },
    handleAvatarSuccess(res) {
      console.log(res);
      this.userInfo.avatar = res.data.fileUrl;
      showMessage('上传头像成功', 'success', () => {});

      // 更新 localStorage 中的 userData 数据
      const userDataJSON = localStorage.getItem('userData');
      if (userDataJSON) {
        const userData = JSON.parse(userDataJSON);
        userData.avatar = res.data.fileUrl;
        localStorage.setItem('userData', JSON.stringify(userData));
      }

      eventBus.emit('refreshCandidates');
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
          showMessage('上传头像图片大小不能超过 2MB', 'error', () => {
            this.isShowErrorMsg = false;
          });
        }
      }

      return isJPG && isLt2M;
    },
    showEmptyFieldsAlert() {
      if (!this.isShowErrorMsg) {
        this.isShowErrorMsg = true;
        showMessage('请正确填写信息', 'error', () => {
          this.isShowErrorMsg = false;
        });
      }
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

.setting_icon {
  margin-left: 10px;
}

.box-item {
  width: 110px;
  margin-top: 10px;
}
</style>
