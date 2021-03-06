import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 安装依赖
import './plugins/element.js'
import axios from 'axios'
// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
//请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use((config) => {
  //为请求头对象，添加token验证的Authorization字段
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

/* 导入全局样式表 */
import './assets/css/global.css'
/* 导入Icon图标 */
import './assets/font/iconfont.css'
Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
