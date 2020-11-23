import Vue from "vue";
import VueRouter from "vue-router";

import Home from "~/views/Home";
import About from "~/views/About";
import TodoApp from "~/views/TodoApp";

Vue.use(VueRouter);

const routes = [
  {
    name: "index",
    path: "/",
    component: Home,
  },
  {
    name: "about",
    path: "/about",
    component: About,
  },
  {
    name: "todos",
    path: "/todos",
    component: TodoApp,
  },
];

export default new VueRouter({
  // https://router.vuejs.org/kr/guide/essentials/history-mode.html
  // mode: 'history',
  routes,
});
