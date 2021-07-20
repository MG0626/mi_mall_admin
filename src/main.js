import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入网络模块
import http from './network/request';

Vue.config.productionTip = false

// 初始化css默认样式
import('./assets/css/normalize.css')
// 全局样式
import('./assets/css/global.css')

// 在vue原型上添加网络请求属性
Vue.prototype.$http = http

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
