import Vue from 'vue'
import App from './App'

new Vue({
  el: '#app',
  render: (createElement) => createElement(App)
})
// 보통 h=>h(App) 으로 사용
