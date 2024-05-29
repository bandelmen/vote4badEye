<template>
  <div class="vote-panel">
    <h1 class="vote-title">投票页面</h1>
    <div class="card-container">
      <div
        v-for="(value, key) in candidates"
        :key="key"
        class="card-box"
        :class="{
          'vote-bg': value.checked,
          'unvote-bg': selectedUsers.length >= 3 && !value.checked,
        }"
        @click="vote(value)"
      >
        <div class="card-header">
          <div class="card-avatar">
            <el-avatar :size="30" :src="value.avatar" />
          </div>
          <div class="card-name">
            <span>{{ value.username }}</span>
          </div>
        </div>
      </div>
    </div>
    <el-button type="primary" v-if="isShowVotebtn" @click="showConfirmation" :disabled="hasVoted"
      >提交投票</el-button
    >
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
      candidates: [],
      selectedUsers: [],
      isShowErrorMsg: false,
      hasVoted: false,
      isShowVotebtn: false,
    };
  },
  created() {
    eventBus.on('refreshCandidates', async () => {
      await this.getCandidates();
      await this.getVotes();
    });

    eventBus.on('userLogout', () => {
      this.candidates = [];
      this.selectedUsers = [];
      this.hasVoted = false;
      this.isShowVotebtn = false;
    });

    eventBus.on('userLogin', async () => {
      this.isShowVotebtn = true;
      await this.getCandidates();
      await this.getVotes();
    });
  },
  async mounted() {
    await this.getCandidates();
    await this.getVotes();
  },
  methods: {
    // 获取用户本周期内投票的数据
    async getVotes() {
      try {
        const response = await axios.get('/api/votes');
        // 处理返回的数据，把每条数据 data.badEye.userId 存放到 selectedUsers 中
        if (response.data.code === 200) {
          const votes = response.data.data;
          if (votes && votes.length > 0) {
            this.hasVoted = true;
            votes.forEach((vote) => {
              this.selectedUsers.push(vote.badEye._id);
              this.candidates.forEach((candidate) => {
                if (candidate.candidateId === vote.badEye._id) {
                  candidate.checked = true;
                }
              });
            });
          }
        }
      } catch (error) {
        console.error('用户未登录');
      }
    },
    async getCandidates() {
      try {
        const response = await axios.get('/api/candidates');

        if (response.data.code === 200) {
          const candidates = response.data.data;

          if (candidates && candidates.length > 0) {
            this.candidates = candidates.map((candidate) => ({
              candidateId: candidate.candidateId,
              username: candidate.username,
              userId: candidate.userId,
              avatar: candidate.imagePath,
              checked: false,
            }));

            this.isShowVotebtn = true;
          } else {
            this.candidates = [];
          }
        } else {
          showMessage('获取候选人有误', 'error', () => {});
          this.candidates = [];
        }
      } catch (error) {
        this.candidates = [];
      }
    },
    vote(user) {
      if (!this.hasVoted) {
        console.log('==', user);
        // 检查用户是否已在 selectedUsers 中
        const existingUser = this.selectedUsers.find((uid) => uid === user.candidateId);

        if (existingUser) {
          user.checked = false;
          this.selectedUsers = this.selectedUsers.filter((uid) => uid !== user.candidateId);
        } else if (this.selectedUsers.length < 3) {
          user.checked = true;
          this.selectedUsers.push(user.candidateId);
        } else {
          // 如果已经显示了错误提示，则不再重复显示
          if (!this.isShowErrorMsg) {
            this.isShowErrorMsg = true;
            showMessage('不能选择超过三个烂眼儿', 'warning', () => {
              this.isShowErrorMsg = false;
            });
          }
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
            this.submitVotes(this.selectedUsers);
          })
          .catch(() => {});
      } else {
        this.$confirm('确定要选他们三个吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.submitVotes(this.selectedUsers);
          })
          .catch(() => {});
      }
    },
    async submitVotes(selectedUsers) {
      console.log(selectedUsers);
      try {
        await axios.post('/api/votes', {
          candidateIds: selectedUsers,
        });
        showMessage('投票提交成功！', 'success', () => {});
        this.getVotes();
        eventBus.emit('getVotes');
      } catch (error) {
        console.error('Error:', error);
      }
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
