import Vue from 'vue'
import App from './App'
import router from './router'

new Vue({
  el: '#app',
  router,
  render: (createElement) => createElement(App)
})
// 보통 h=>h(App) 으로 사용
