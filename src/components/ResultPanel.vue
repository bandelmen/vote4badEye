<template>
  <div class="weekly-section">
    <h1 class="section-title">本周烂眼儿排名</h1>
    <div class="medal-container">
      <div v-for="(user, index) in topThreeTotalResults" :key="index" class="user-info-weekly">
        <div v-if="index === 0" class="medal silver-medal">{{ getRankEmoji(1) }}</div>
        <div v-else-if="index === 1" class="medal gold-medal">{{ getRankEmoji(0) }}</div>
        <div v-else class="medal bronze-medal">{{ getRankEmoji(2) }}</div>
        <div class="user-details">
          <div class="user-detail-name">{{ user.name }}</div>
          <div class="user-detail-vote_num">总票数: {{ user.totalVotes }}</div>
        </div>
      </div>
    </div>
  </div>

  <hr class="divider" />

  <div class="history-section">
    <h1 class="section-title">历史总计排名</h1>
    <div v-for="(user, index) in totalResults" :key="index" class="user-info-history">
      <div class="history-section-left">
        <div class="medal">{{ getRankEmoji(index) }}</div>
        <el-avatar class="user-detail-avatar" :size="30" :src="user.avatar" />
        <div class="user-detail-name">{{ user.name }}</div>
      </div>
      <div class="user-detail-vote_num">总票数: {{ user.totalVotes }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultPanel',
  data() {
    return {
      weeklyResults: [
        {
          id: 1,
          name: '摩洛哥煎饼',
          totalVotes: 7,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
        {
          id: 2,
          name: '捷豹',
          totalVotes: 4,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
        {
          id: 3,
          name: 'kaoyah',
          totalVotes: 9,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
        {
          id: 4,
          name: 'XiaoC',
          totalVotes: 2,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
        {
          id: 5,
          name: '强少',
          totalVotes: 11,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
        {
          id: 6,
          name: '带哥',
          totalVotes: 6,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
        {
          id: 7,
          name: '尧尧',
          totalVotes: 8,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
        {
          id: 8,
          name: 'AC',
          totalVotes: 5,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
        {
          id: 9,
          name: '阿辉',
          totalVotes: 10,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
        {
          id: 10,
          name: '阿明',
          totalVotes: 3,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
        {
          id: 11,
          name: 'side',
          totalVotes: 12,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
      ],
      totalResults: [
        {
          id: 1,
          name: '摩洛哥煎饼',
          totalVotes: 17,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
        {
          id: 2,
          name: '捷豹',
          totalVotes: 24,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
        {
          id: 3,
          name: 'kaoyah',
          totalVotes: 19,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
        {
          id: 4,
          name: 'XiaoC',
          totalVotes: 21,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
        {
          id: 5,
          name: '强少',
          totalVotes: 17,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
        {
          id: 6,
          name: '带哥',
          totalVotes: 13,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
        {
          id: 7,
          name: '尧尧',
          totalVotes: 38,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
        {
          id: 8,
          name: 'AC',
          totalVotes: 15,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
        {
          id: 9,
          name: '阿辉',
          totalVotes: 18,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
        {
          id: 10,
          name: '阿明',
          totalVotes: 21,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
        {
          id: 11,
          name: 'side',
          totalVotes: 32,
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
        },
      ],
    };
  },
  computed: {
    sortedUsers() {
      return this.weeklyResults.slice().sort((a, b) => {
        if (a.totalVotes !== b.totalVotes) {
          return b.totalVotes - a.totalVotes; // 按照总票数降序排列
        } else {
          return a.name.localeCompare(b.name); // 如果总票数相同，按字母顺序排列
        }
      });
    },
    topThreeTotalResults() {
      const sortedUsers = this.sortedUsers.slice(0, 3);
      if (sortedUsers.length === 3) {
        const temp = sortedUsers[0];
        sortedUsers[0] = sortedUsers[1];
        sortedUsers[1] = temp;
      }
      return sortedUsers;
    },
  },
  methods: {
    getRankEmoji(index) {
      if (index === 0) return '🥇'; // 金牌
      if (index === 1) return '🥈'; // 银牌
      if (index === 2) return '🥉'; // 铜牌
      return index + 1;
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

.section-title {
  margin-top: 10px;
  margin-bottom: 10px;
}

.history-section-left {
  display: flex;
  align-items: center;
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
