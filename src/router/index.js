import Vue from 'vue';
import Router from 'vue-router';

// 引用组件
import goods from '@/components/goods/goods.vue';
import seller from '@/components/seller/seller';
import ratings from '@/components/ratings/ratings';

Vue.use(Router);

// 定义router中 routes 数组值，也就是路由
const routes = [{
  path: '/goods',
  name: 'goods',
  component: goods
},
{
  path: '/ratings',
  name: 'ratings',
  component: ratings
},
{
  path: '/seller',
  name: 'seller',
  component: seller
},
{
  path: '/',
  redirect: 'goods' // 重定向
}
];

// 初始化 router
const router = new Router({
  routes,
  linkActiveClass: 'active' // 更改 router-link-active 为 active
});

export default router; // 抛出
