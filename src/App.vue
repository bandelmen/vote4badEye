<template>
  <div id="main-layout">
    <HeaderPanel />
    <div class="container">
      <div class="left-side">
        <VotePanel />
      </div>
      <div class="right-side">
        <ResultPanel />
      </div>
    </div>
    <el-backtop :right="50" :bottom="80" />
  </div>
</template>

<script>
import ResultPanel from './components/ResultPanel.vue';
import VotePanel from './components/VotePanel.vue';
import HeaderPanel from './components/HeaderPanel.vue';

export default {
  name: 'App',
  components: {
    VotePanel,
    ResultPanel,
    HeaderPanel,
  },
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}

.container {
  display: flex;
  justify-content: space-between;
}

.left-side,
.right-side {
  width: 50%;
  margin: 10px;
}

/* 将左右布局转换为垂直布局，适应手机屏幕 */
@media screen and (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .left-side,
  .right-side {
    width: auto;
    margin: 10px 10px;
  }
}
</style>
