<template>
  <header class="page-header">
    <div class="page-container">
      <div class="header-buttons" v-if="!isLoggedIn">
        <el-button type="primary" @click="showLoginDialog = true">登录</el-button>
        <el-button type="success" @click="showRegisterDialog = true">注册</el-button>
      </div>
      <div class="user-info" v-else>
        <el-avatar class="user-info_avatar" :src="userInfo.avatar" :size="32" />
        <span class="user-info_username">{{ userInfo.username }}</span>
        <el-dropdown>
          <el-button class="setting_icon" circle>
            <el-icon><Setting /></el-icon>
          </el-button>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <el-upload
                  class="avatar-uploader"
                  action="http://localhost:3000/api/avatars"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :on-error="handleAvatarError"
                  :with-credentials="true"
                  :before-upload="beforeAvatarUpload"
                  name="avatar"
                  :data="{ username: userInfo.username }"
                >
                  <el-icon><UploadFilled /></el-icon>上传头像
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

  <el-dialog
    v-model="showLoginDialog"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    title="用户登录"
    :show-close="false"
    :width="getDialogWidth"
  >
    <el-form ref="ruleLoginFormRef" :model="loginForm" :rules="loginRules">
      <el-form-item label="邮箱：" prop="email" :label-width="formLabelWidth">
        <el-input
          v-model="loginForm.email"
          placeholder="请输入邮箱"
          @keyup.enter="focusLoginPasswordInput"
        />
      </el-form-item>
      <el-form-item label="密码：" prop="password" :label-width="formLabelWidth">
        <el-input
          ref="loginPasswordInput"
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          show-password
          @keyup.enter="confirmLoginDialog('ruleLoginFormRef')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button :disabled="isLoginBtnDisabled" @click="cancelLoginDialog">取消</el-button>
        <el-button
          type="primary"
          :disabled="isLoginBtnDisabled"
          @click="confirmLoginDialog('ruleLoginFormRef')"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="showRegisterDialog"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    title="用户注册"
    :show-close="false"
    :width="getDialogWidth"
  >
    <el-form ref="ruleRegisterFormRef" :model="registerForm" :rules="registerRules">
      <el-form-item label="用户名：" prop="username" :label-width="formLabelWidth">
        <el-input
          v-model="registerForm.username"
          placeholder="请输入用户名"
          @keyup.enter="focusRegisterEmailInput"
        />
      </el-form-item>
      <el-form-item label="邮箱：" prop="email" :label-width="formLabelWidth">
        <el-input
          ref="registerEmailInput"
          v-model="registerForm.email"
          placeholder="请输入邮箱"
          @keyup.enter="focusRegisterPasswordInput"
        />
      </el-form-item>
      <el-form-item label="密码：" prop="password" :label-width="formLabelWidth">
        <el-input
          ref="registerPasswordInput"
          v-model="registerForm.password"
          type="password"
          placeholder="请输入密码"
          show-password
          @keyup.enter="confirmRegisterDialog('ruleRegisterFormRef')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button :disabled="isRegisterBtnDisabled" @click="cancelRegisterDialog">取消</el-button>
        <el-button
          :disabled="isRegisterBtnDisabled"
          type="primary"
          @click="confirmRegisterDialog('ruleRegisterFormRef')"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { showMessage } from '@/utils/common';
import { eventBus } from '@/utils/event-bus';
import axios from 'axios';
import debounce from 'lodash/debounce';

export default {
  name: 'HeaderPanel',
  data() {
    return {
      showLoginDialog: false,
      showRegisterDialog: false,
      isLoginBtnDisabled: false,
      isRegisterBtnDisabled: false,
      registerForm: {
        username: '',
        password: '',
        email: '',
      },
      loginForm: {
        email: '',
        password: '',
      },
      userInfo: {
        userId: '',
        username: '',
        email: '',
        avatar: '',
      },
      formLabelWidth: '100px',
      screenWidth: 0,
      isShowErrorMsg: false,
      isLoggedIn: false,
      loginRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度至少为 6 位', trigger: 'blur' },
        ],
      },
      registerRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度至少为 6 位', trigger: 'blur' },
        ],
      },
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
  created() {
    this.verifyToken();
  },
  mounted() {
    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.updateScreenWidth);
  },
  methods: {
    // 退出
    async logout() {
      try {
        const response = await axios.post('/api/logout', null);
        if (response.data.code === 200) {
          // 更新组件状态
          this.isLoggedIn = false;
          this.userInfo = {};
          localStorage.removeItem('userData');
          eventBus.emit('userLogout');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    cancelLoginDialog() {
      this.showLoginDialog = false;
      this.clearLoginForm();
    },
    cancelRegisterDialog() {
      this.showRegisterDialog = false;
      this.clearRegistrationForm();
    },
    // 新版登录模块
    confirmLoginDialog: debounce(async function (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.isLoginBtnDisabled = true;
          try {
            const res = await axios.post('/api/login', {
              email: this.loginForm.email,
              password: this.loginForm.password,
            });

            if (res.data.code === 200) {
              const resData = res.data.data;
              this.closeLoginDialog();
              this.clearLoginForm();
              this.updateUserInfo(resData);
              this.isLoggedIn = true;
              eventBus.emit('userLogin');
              showMessage('登录成功', 'success', () => {});
              // 将用户数据保存到 localStorage
              localStorage.setItem(
                'userData',
                JSON.stringify({
                  username: resData.username,
                  userId: resData.userId,
                  email: resData.email,
                  avatar: resData.avatar,
                })
              );
            }
          } catch (err) {
            if (err.response && err.response.status === 401) {
              this.handleLoginFailure(err.response.data.message);
            } else {
              this.handleRequestFailure();
            }
          }
        }
      });
    }, 500),
    // 清空登陆表单
    clearLoginForm() {
      this.loginForm.email = '';
      this.loginForm.password = '';
    },
    // 关闭登录对话框
    closeLoginDialog() {
      this.isShowErrorMsg = false;
      this.showLoginDialog = false;
      this.isLoginBtnDisabled = false;
    },
    // 更新用户信息
    updateUserInfo(data) {
      this.userInfo = data;
    },
    // 处理登录失败
    handleLoginFailure(message) {
      if (!this.isShowErrorMsg) {
        this.isShowErrorMsg = true;
        showMessage(message, 'warning', () => {
          this.isShowErrorMsg = false;
        });
      }
    },
    // 聚焦登录密码输入框
    focusLoginPasswordInput() {
      this.$refs.loginPasswordInput.focus();
    },
    // 新版注册模块
    confirmRegisterDialog: debounce(async function (formName) {
      this.isRegisterBtnDisabled = true;
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const res = await axios.post('/api/register', {
              username: this.registerForm.username,
              password: this.registerForm.password,
              email: this.registerForm.email,
            });

            if (res.data.code === 200) {
              this.closeRegisterDialog();
              this.clearRegistrationForm();
              showMessage('注册成功', 'success', () => {});
              eventBus.emit('refreshCandidates');
            }
          } catch (err) {
            if (err.response && err.response.status === 400) {
              this.handleRegistrationFailure('邮箱已被注册');
            } else if (err.response && err.response.status === 500) {
              this.handleRegistrationFailure('服务器错误，注册失败');
            } else {
              this.handleRequestFailure();
            }
          }
        }
      });
    }, 500),
    // 清空注册表单
    clearRegistrationForm() {
      this.registerForm.username = '';
      this.registerForm.email = '';
      this.registerForm.password = '';
    },
    // 关闭注册对话框
    closeRegisterDialog() {
      this.isShowErrorMsg = false;
      this.showRegisterDialog = false;
      this.isRegisterBtnDisabled = false;
    },
    // 处理注册失败
    handleRegistrationFailure(message) {
      if (!this.isShowErrorMsg) {
        this.isShowErrorMsg = true;
        showMessage(message, 'warning', () => {
          this.isShowErrorMsg = false;
        });
      }
    },
    // 聚焦注册邮箱输入框
    focusRegisterEmailInput() {
      this.$refs.registerEmailInput.focus();
    },
    // 聚焦注册密码输入框
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
    // 监听屏幕宽度变化
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
    handleAvatarError() {
      if (!this.isShowErrorMsg) {
        this.isShowErrorMsg = true;
        showMessage('上传头像失败，请稍后再试', 'error', () => {
          this.isShowErrorMsg = false;
        });
      }
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
    async verifyToken() {
      try {
        const res = await axios.post('/api/verifyToken');
        console.log(res.data);
        if (res.data.data.valid) {
          console.log('用户验证成功');
          // 如果 JWT 有效，更新登录状态为已登录
          this.isLoggedIn = true;
          // 从 localStorage 中获取用户数据
          const userDataJSON = JSON.parse(localStorage.getItem('userData'));
          console.log(userDataJSON);
          if (userDataJSON !== null) {
            this.userInfo = userDataJSON;
          } else {
            this.logout();
          }
        } else {
          this.isLoggedIn = false;
          this.userInfo = {};
          localStorage.removeItem('userData');
        }
      } catch (err) {
        this.isLoggedIn = false;
        this.userInfo = {};
        localStorage.removeItem('userData');
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
