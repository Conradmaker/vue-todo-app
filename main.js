import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";

new Vue({
  el: "#app",
  router,
  store,
  render: (createElement) => createElement(App),
});
// 보통 h=>h(App) 으로 사용
