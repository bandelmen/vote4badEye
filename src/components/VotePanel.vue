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
import { ElMessage } from 'element-plus';

export default {
  name: 'VotePanel',
  data() {
    return {
      users: [
        {
          id: 1,
          name: '摩洛哥煎饼',
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
          checked: false,
        },
        {
          id: 2,
          name: '捷豹',
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
          checked: false,
        },
        {
          id: 3,
          name: 'kaoyah',
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
          checked: false,
        },
        {
          id: 4,
          name: 'XiaoC',
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
          checked: false,
        },
        {
          id: 5,
          name: '强少',
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
          checked: false,
        },
        {
          id: 6,
          name: '带哥',
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
          checked: false,
        },
        {
          id: 7,
          name: '尧尧',
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
          checked: false,
        },
        {
          id: 8,
          name: 'AC',
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
          checked: false,
        },
        {
          id: 9,
          name: '阿辉',
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
          checked: false,
        },
        {
          id: 10,
          name: '阿明',
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
          checked: false,
        },
        {
          id: 11,
          name: 'side',
          avatar: require('../assets/images/摩洛哥煎饼.jpg'),
          checked: false,
        },
      ],
      selectedUsers: [], // 存储用户选择的投票选项
      isShowErrorMsg: false, // 控制是否显示错误提示的标志位
    };
  },
  methods: {
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
        if (!this.showErrorMsg) {
          this.showErrorMsg = true;
          ElMessage({
            message: '不能选择超过三个烂眼儿',
            type: 'error',
            onClose: () => {
              // 在消息关闭时重置标志位，以便下次可以再次触发错误提示
              this.showErrorMsg = false;
            },
          });
        }
      }
    },
    showConfirmation() {
      if (this.selectedUsers.length < 3) {
        let num = 3 - this.selectedUsers.length;
        this.$confirm('还可以继续选个 ' + num + ' 烂眼儿', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            // 用户点击了确定按钮
            this.submitVotes();
          })
          .catch(() => {
            // 用户点击了取消按钮或点击遮罩层触发的关闭
            // 可以不做任何操作
          });
      } else {
        this.$confirm('确定要选他们三个吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            // 用户点击了确定按钮
            this.submitVotes();
          })
          .catch(() => {
            // 用户点击了取消按钮或点击遮罩层触发的关闭
            // 可以不做任何操作
          });
      }
    },
    submitVotes() {
      // 展示成功的消息提示
      this.$message({
        message: '投票提交成功！',
        type: 'success',
      });
      // 这里可以添加提交逻辑，例如向后端发送投票选项数据等
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
  margin: 10px -5px 10px 0; /* 设置 margin 使卡片之间产生间距 */
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
  margin-right: 5px; /* 设置适当的右边距 */
}

.card-name {
  font-weight: bold;
  font-size: 1em; /* 使用 em 作为字体大小单位 */
}

.vote-bg {
  background-color: #a7e8b8;
}

.unvote-bg {
  background-color: #e5e9f2;
  color: #a8abb2;
}
</style>
