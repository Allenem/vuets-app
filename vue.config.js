module.exports = {
  publicPath: './',
  outputDir: 'dist',
  //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  //生产环境是否生成 sourceMap 文件，一般情况不建议打开
	productionSourceMap: false,
  //反向代理
  devServer: {
    open: false,
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      // 配置跨域
      '/api':{
        target: 'https://vuets-api.herokuapp.com/api/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api':''
        }
      }
    },
    before: app => {}
  }
};