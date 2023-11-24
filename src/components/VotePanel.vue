<template>
  <div class="vote-panel">
    <h1>投票页面</h1>
    <form @submit.prevent="submitVote">
      <div v-for="(user, index) in users" :key="index">
        <label>
          <input type="checkbox" v-model="selectedUsers" :value="user.id" />
          {{ user.name }}
        </label>
      </div>
      <el-button @click="vote">提交投票</el-button>
    </form>
  </div>
</template>

<script>
import { ElButton } from 'element-plus';

export default {
  name: 'VotePanel',
  data() {
    return {
      users: [
        { id: 1, name: 'User A' },
        { id: 2, name: 'User B' },
        // ... 其他用户
      ],
      selectedUsers: [],
    };
  },
  methods: {
    vote() {
      console.log('Selected Users:', this.selectedUsers);
      alert('投票成功！');
      // 实际情况下，你需要在这里调用后端API提交投票数据
    },
  },
  components: {
    ElButton,
  },
};
</script>

<style>
/* 添加样式 */
</style>
