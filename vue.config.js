module.exports = {
  devServer: {
    open: true,
    host: 'www2.sxytest.sitezt.cn',
    proxy: {
      '/api': {
          target: 'http://sxytest.sitezt.cn', // 后端服务器
          pathRewrite: {
              // '^/api': ''
          }
      }
  }
  }
}