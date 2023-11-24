<template>
  <div class="result-panel">
    <h1>投票结果</h1>
    <div v-for="(user, index) in users" :key="index">
      <h3>{{ user.name }}</h3>
      <p>总票数: {{ user.totalVotes }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultPanel',
  data() {
    return {
      users: [
        { id: 1, name: 'User A', totalVotes: 14 },
        { id: 2, name: 'User B', totalVotes: 3 },
        // ... 其他用户的数据
      ],
    };
  },
};
</script>

<style>
/* 添加样式 */
</style>
