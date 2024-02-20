// const { defineConfig } = require('@vue/cli-service');
// module.exports = defineConfig({
//   transpileDependencies: true,
// });

module.exports = {
  devServer: {
    hot: true, // 启用热重载
    open: true, // 自动打开浏览器
    port: 8080, // 本地开发服务器端口号
    host: '0.0.0.0', // 主机地址
  },
};
