// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';

import 'common/stylus/index.styl';

Vue.prototype.$http = axios; // 定义vue原型中的 $http 为 axios，这样调用是就可以在组件中直接使用 this.$http ,否则在每个需要请求数据的组件中都需要引入 axios
Vue.config.productionTip = false; // 设置为 false 以阻止 vue 在启动时生成生产提示。

/* eslint-disable no-new */
new Vue({
  router,
  /**
   * render: function (createElement) {
   *  return createElement(App);
   * }
   * 进一步缩写为(ES6 语法)：
   * render (createElement) {
   *  return createElement(App);
   * }
   * 再进一步缩写为：
   * render (h){
   *   return h(App);
   * }
   * 按照 ES6 箭头函数的写法，就得到了：render: h => h(App);
   * 是 Vue.js 里面的 createElement 函数，这个函数的作用就是生成一个 VNode节
   * 点，render 函数得到这个 VNode 节点之后，返回给 Vue.js 的 mount 函数，渲染
   * 成真实 DOM 节点，并挂载到根节点上。
   * h 含义如下
   * It comes from the term "hyperscript", which is commonly used in
   * many virtual-dom implementations. "Hyperscript" itself stands for
   * "script that generates HTML structures" because HTML is the
   * acronym for "hyper-text markup language".
   * 它来自术语 hyperscript，这个单词通常用在 virtual-dom 的实现中。
   * Hyperscript 本身是指生成 HTML 结构的 script 脚本，因为 HTML 是
   * hyper-text markup language 的缩写（超文本标记语言）
   */
  render: h => h(App)
}).$mount('#app');
