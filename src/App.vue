<template>
  <div id="app">
    <div class="container">
      <div class="left-side">
        <VotePanel />
      </div>
      <div class="right-side">
        <ResultPanel />
      </div>
    </div>
  </div>
</template>

<script>
import ResultPanel from './components/ResultPanel.vue';
import VotePanel from './components/VotePanel.vue';

export default {
  name: 'App',
  components: {
    VotePanel,
    ResultPanel,
  },
};
</script>

<style>
.container {
  display: flex;
  justify-content: space-between;
}

.left-side,
.right-side {
  width: 48%; /* 设置左右两侧宽度 */
}
</style>
