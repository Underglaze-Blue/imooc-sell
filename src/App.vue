<template>
  <div id="app">
    <sellheader :seller="this.seller"></sellheader>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 路由显示区域，加 keep-active 是为了防止在路由切换是刷新页面，导致重新加载内容，重新请求，造成网络压力 ，在router-view 中传值，它的路由组件都可以用props接收到-->
    <keep-alive>
      <router-view :seller="seller" />
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
// 引入自定义方法，用于截取url参数,因为是方法，所以需要用{}包裹
import { _urlParse } from 'common/js/until';

// 引入组件 header
import sellheader from './components/header/header';

const ERR_OK = 0;

export default {
  name: 'App',
  data () {
    return {
      seller: {
        id: (() => {
          let queryParam = _urlParse(); // 会根据不同的商家，seller会有不同的id，用作数据储存
          return queryParam.id;
        })()
      }
    };
  },
  created () {
    // http请求，这个步骤为请求商家信息，如果商家信息只在header组件中使用的话，这一步可以放到header中操作，在本项目中，seller在多个组件中都会使用，所以请求放到了 app.vue中
    // http请求使用的是 axios
    this.$http(`/api/seller?id=${this.seller.id}`).then((response) => {
      response = response.data;
      if (response.errno === ERR_OK) {
        // this.seller = response.data;
        // 使用 es6 中的方法，将两个对象合并为一个新的对象，在其他组件中需要使用id，所以不能直接赋值，不然会覆盖
        this.seller = Object.assign({}, this.seller, response.data);
      }
    }).catch((error) => {
      console.log(error);
    });
  },
  components: {
    sellheader
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/_mixin'
@import '~common/stylus/variable';
#app
  .tab
    display flex
    width 100%
    height 40px
    line-height 40px
    border-1px($color-border)
    .tab-item
      flex 1
      text-align center
      & > a
        display block
        font-size $font-size-midium
        color $color-theme-l
        &.active
          color $color-red
</style>
