<template>
  <div class="vote-panel">
    <h1 class="vote-title">投票页面</h1>
    <div class="card-container">
      <div
        v-for="(value, key) in users"
        :key="key"
        class="card-box"
        :class="{
          'vote-bg': value.checked,
          'unvote-bg': selectedUsers.length >= 3 && !value.checked,
        }"
        @click="voteHim(value)"
      >
        <div class="card-header">
          <div class="card-avatar">
            <el-avatar :size="30" :src="value.avatar" />
          </div>
          <div class="card-name">
            <span>{{ value.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <el-button type="primary" @click="showConfirmation">提交投票</el-button>
  </div>
</template>

<script>
import { showMessage } from '@/utils/common';
import { eventBus } from '@/utils/event-bus';

import axios from 'axios';

export default {
  name: 'VotePanel',
  data() {
    return {
      users: [],
      selectedUsers: [], // 存储用户选择的投票选项
      isShowErrorMsg: false,
    };
  },
  created() {
    eventBus.on('userRegistered', () => {
      this.fetchCandidates();
    });
  },
  mounted() {
    this.fetchCandidates();
  },
  methods: {
    async fetchCandidates() {
      try {
        const response = await axios.get('http://localhost:3000/api/candidates');
        console.log(response);

        if (response.data.code === 200) {
          const candidates = response.data.data; // Assuming 'data' holds the candidate information

          if (candidates && candidates.length > 0) {
            this.users = candidates.map((candidate) => ({
              id: candidate.userId,
              name: candidate.username,
              avatar: require('../assets/images/摩洛哥煎饼.jpg'),
              checked: false,
            }));
          } else {
            showMessage('候选人信息为空', 'warning', () => {});
          }
        } else {
          showMessage('获取候选人有误', 'error', () => {});
        }
      } catch (error) {
        showMessage('获取候选人信息失败', 'error', () => {});
      }
    },
    voteHim(user) {
      // 检查用户是否已在 selectedUsers 中
      const existingUser = this.selectedUsers.find((uid) => uid === user.id);

      if (existingUser) {
        user.checked = false;
        this.selectedUsers = this.selectedUsers.filter((uid) => uid !== user.id);
      } else if (this.selectedUsers.length < 3) {
        user.checked = true;
        this.selectedUsers.push(user.id);
      } else {
        // 如果已经显示了错误提示，则不再重复显示
        if (!this.isShowErrorMsg) {
          this.isShowErrorMsg = true;
          showMessage('不能选择超过三个烂眼儿', 'warning', () => {
            this.isShowErrorMsg = false;
          });
        }
      }
    },
    showConfirmation() {
      if (this.selectedUsers.length === 0) {
        if (!this.isShowErrorMsg) {
          this.isShowErrorMsg = true;
          showMessage('请选择至少一个人进行投票', 'warning', () => {
            this.isShowErrorMsg = false;
          });
        }
      } else if (this.selectedUsers.length < 3) {
        let num = 3 - this.selectedUsers.length;
        this.$confirm(`还可以继续选个 ${num} 烂眼儿，是否要提交投票`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.submitVotes();
          })
          .catch(() => {});
      } else {
        this.$confirm('确定要选他们三个吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.submitVotes();
          })
          .catch(() => {});
      }
    },
    submitVotes() {
      showMessage('投票提交成功！', 'success', () => {});
    },
  },
};
</script>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  gap: 10px;
  margin: 10px -5px 10px 0;
}

.card-box {
  cursor: pointer;
  width: 30%;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  transition: background-color 0.5s ease;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.card-avatar {
  display: flex;
  align-items: center;
  margin-right: 5px;
}

.card-name {
  font-weight: bold;
  font-size: 1em;
}

.vote-bg {
  background-color: #a7e8b8;
}

.unvote-bg {
  background-color: #e5e9f2;
  color: #a8abb2;
}
</style>
