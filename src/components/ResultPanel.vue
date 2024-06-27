<template>
  <div class="weekly-section">
    <h1 class="section-title">本周烂眼儿排名</h1>
    <div class="medal-container">
      <div
        v-for="(user, index) in weeklyResult"
        :key="index"
        class="user-info-weekly"
        :class="{
          gold: index === 0,
          silver: index === 1,
          bronze: index === 2,
        }"
      >
        <div v-if="index === 0" class="medal gold-medal">{{ getRankEmoji(0) }}</div>
        <div v-else-if="index === 1" class="medal silver-medal">{{ getRankEmoji(1) }}</div>
        <div v-else class="medal bronze-medal">{{ getRankEmoji(2) }}</div>
        <div class="user-details">
          <div class="user-detail-name">{{ user.candidateName }}</div>
          <div class="user-detail-vote_num">总票数: {{ user.totalVotes }}</div>
        </div>
      </div>
    </div>
  </div>

  <el-divider></el-divider>

  <div class="history-section">
    <h1 class="section-title">历史烂眼儿总计排名</h1>
    <div v-for="(user, index) in totalResults" :key="index" class="user-info-history">
      <div class="history-section-left">
        <div class="medal">{{ getRankEmoji(index) }}</div>
        <div v-for="(user, index) in user" :key="index" class="user-info-total">
          <el-avatar class="user-detail-avatar" :size="30" :src="user.imagePath" />
          <div class="user-detail-name">{{ user.candidateName }}</div>
        </div>
      </div>
      <div class="user-detail-vote_num">总票数: {{ user[0].totalVotes }}</div>
    </div>
  </div>
</template>

<script>
import { eventBus } from '@/utils/event-bus';
import axios from 'axios';

export default {
  name: 'ResultPanel',
  data() {
    return {
      weeklyResult: [],
      totalResults: [],
    };
  },
  computed: {
    // topThreeTotalResults() {
    //   const sortedUsers = this.weeklyResult.slice(0, 3);
    //   if (sortedUsers.length === 3) {
    //     const temp = sortedUsers[0];
    //     sortedUsers[0] = sortedUsers[1];
    //     sortedUsers[1] = temp;
    //   }
    //   return sortedUsers;
    // },
  },
  created() {
    eventBus.on('clearVotes', () => {
      this.weeklyResult = [];
      this.totalResults = [];
    });

    eventBus.on('getVotes', async () => {
      await this.getTop();
      await this.getTotal();
    });
  },
  async mounted() {
    await this.getTop();
    await this.getTotal();
  },
  methods: {
    getRankEmoji(index) {
      if (index === 0) return '🥇'; // 金牌
      if (index === 1) return '🥈'; // 银牌
      if (index === 2) return '🥉'; // 铜牌
      return index + 1;
    },
    // 本周排名
    async getTop() {
      try {
        const response = await axios.get('/api/votes/top');
        if (response.data.code === 200) {
          console.log('本周排名：', response.data.data);
          this.weeklyResult = this.mergeTop(response.data.data);
        }
      } catch (error) {
        console.log('Error:', error);
      }
    },
    // 合并 totalVotes 一样的数据
    mergeTop(data) {
      const mergedResults = [];

      // 遍历数据，将相同投票数的候选人名称合并
      for (let i = 0; i < data.length; i++) {
        const current = data[i];
        const prev = data[i - 1];

        if (prev && prev.totalVotes === current.totalVotes) {
          // 如果当前候选人与前一个候选人的投票数相同，则合并名称
          mergedResults[mergedResults.length - 1].candidateName += ` / ${current.candidateName}`;
        } else {
          // 如果投票数不同，则直接添加新的数据项
          mergedResults.push({
            totalVotes: current.totalVotes,
            candidateName: current.candidateName,
          });
        }
      }

      return mergedResults;
    },
    // 总票数
    async getTotal() {
      try {
        const response = await axios.get('/api/votes/total');
        if (response.data.code === 200) {
          console.log('总票数：', response.data.data);
          this.totalResults = this.mergeTotal(response.data.data);
        }
      } catch (error) {
        console.log('Error:', error);
      }
    },
    mergeTotal(data) {
      const mergedResults = [];

      let currentTotal = null;
      let currentGroup = [];

      // 遍历数据，根据投票数分组合并
      for (const user of data) {
        if (currentTotal === null || currentTotal === user.totalVotes) {
          // 如果是第一个数据或者投票数与当前分组相同，则将当前用户添加到当前分组中
          currentGroup.push(user);
        } else {
          // 如果投票数与当前分组不同，则将当前分组添加到结果数组中，并创建新的分组
          mergedResults.push([...currentGroup]);
          currentGroup = [user];
        }

        currentTotal = user.totalVotes;
      }

      // 将最后一个分组添加到结果数组中
      if (currentGroup.length > 0) {
        mergedResults.push([...currentGroup]);
      }

      console.log(mergedResults);

      return mergedResults;
    },
  },
};
</script>

<style>
.medal-container {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
}

.user-info-weekly {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: 31%;
  border-radius: 5px;
  background-color: #f5f5f5;
}

.gold {
  order: 2;
}

.silver {
  order: 1;
}

.bronze {
  order: 3;
}

.section-title {
  margin-top: 10px;
  margin-bottom: 10px;
}

.history-section-left {
  display: flex;
  align-items: center;
  max-width: 70%;
  overflow: auto;
}

.user-detail-avatar {
  margin-right: 10px;
}

.user-info-history {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  height: 40px;
}

.user-info-total {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.medal {
  font-size: 18px;
  margin-right: 15px;
  text-align: center;
  flex-shrink: 0;
  width: 30px;
}

.gold-medal {
  font-size: 35px; /* 金牌较大 */
}

.silver-medal {
  font-size: 28px; /* 银牌中等大小 */
}

.bronze-medal {
  font-size: 24px; /* 铜牌较小 */
}

.user-detail-name {
  font-size: 18px;
}

.user-detail-vote_num {
  margin: 0;
  color: #777;
  font-size: 14px;
}
</style>
