<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <!-- :scr动态绑定图片的url 等同于 v-bind:src-->
        <img :src="seller.avatar" />
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <!-- 双向数据绑定，vue中使用{{}}来绑定数据-->
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="this.classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <!-- @click 等同于 v-on:click -->
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{seller.bulletin}}</span>
      <span class="icon-keyboard_arrow_right"></span>
    </div>
    <div class="background">
      <img :src="seller.avatar" />>
    </div>
    <!-- transition vue中过度组件 可参考https://cn.vuejs.org/v2/guide/transitions.html-->
    <transition name="fade">
      <div v-show="detailShow" class="detail">
        <div class="detailWrapper clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <!-- 在vue2.x 中 v-for 需要给元素绑定key值 这里绑定的是下标 -->
              <li class="support-item" v-for="(item, key) in seller.supports" :key="key">
                <span class="icon" :class="classMap[seller.supports[key].type]"></span>
                <span class="text">{{seller.supports[key].description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detailClose" @click="hideDetail">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import star from '@/components/star/star';

export default {
  data () {
    return {
      detailShow: false
    };
  },
  props: {
    seller: {}
  },
  components: {
    star
  },
  created () {
    // 定义classMap 用作对比商家优惠信息图标
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  },
  methods: {
    // 显示头部详情
    showDetail () {
      this.detailShow = true;
    },
    // 隐藏头部详情
    hideDetail () {
      this.detailShow = false;
    }
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
// 引入stylus文件
@import '~common/stylus/_mixin'
@import '~common/stylus/variable';
.header
  position relative
  color $color-white
  background $color-background-d
  overflow hidden
  .content-wrapper
    position relative
    padding 24px 12px 18px 24px
    font-size $font-size-none
    .avatar
      display inline-block
      width 64px
      height 64px
      vertical-align top
      border-radius 2px
      overflow hidden
    .content
      display inline-block
      margin-left 16px
      .title
        margin 2px 0 8px 0
        .brand
          display inline-block
          width 30px
          height 18px
          bg-image('./brand')
          background-size 30px 18px
          background-repeat no-repeat
          vertical-align top
        .name
          margin-left 6px
          font-size $font-size-large
          line-height 18px
          font-weight bold
      .description
        margin-bottom 10px
        line-height 12px
        font-size $font-size-small-x
      .support
        .icon
          display inline-block
          width 12px
          height 12px
          margin-right 4px
          background-size 12px 12px
          background-repeat no-repeat
          vertical-align top
          &.decrease
            bg-image('./decrease_1')
          &.discount
            bg-image('./discount_1')
          &.guarantee
            bg-image('./guarantee_1')
          &.invoice
            bg-image('./invoice_1')
          &.special
            bg-image('./special_1')
        .text
          font-size $font-size-small-ll
          line-height 12px
    .support-count
      position absolute
      right 12px
      bottom 14px
      padding 0 8px
      height 24px
      line-height 24px
      border-radius 14px
      background $color-black
      text-align center
      .count
        font-size $font-size-small-ll
        vertical-align top
      .icon-keyboard_arrow_right
        margin-left 2px
        line-height 24px
        font-size $font-size-small-ll
  .bulletin-wrapper
    position relative
    height 28px
    line-height 28px
    padding 0 22px 0 12px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    background $color-background
    .bulletin-title
      display inline-block
      width 22px
      height 12px
      bg-image('bulletin')
      background-size 22px 12px
      background-repeat no-replace
      vertical-align top
      margin-top 8px
    .bulletin-text
      vertical-align top
      font-size $font-size-small-ll
      margin 0 4px
    .icon-keyboard_arrow_right
      position absolute
      font-size $font-size-small-ll
      right 12px
      top 8px
  .background
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    z-index -1
    filter blur(10px)
    overflow hidden
    & > img
      width 100%
  .detail
    position fixed
    top 0
    left 0
    z-index 99
    width 100%
    height 100%
    overflow auto
    background $color-background-l
    opacity 1
    backdrop-filter blur(10px)
    &.fade-enter-active, &.fade-leave-active
      transition all .5s
    &.fade-enter, &.fade-leave-to
      opacity 0
      background $color-background-s
    .detailWrapper
      min-height 100%
      width 100%
      .detail-main
        margin-top 64px
        padding-bottom 64px
        .name
          line-height 16px
          font-weight 700
          text-align center
          font-size $font-size-large
        .star-wrapper
          margin-top 18px
          padding 2px 0
          text-align center
        .title
          display flex
          width 80%
          margin 28px auto
          .line
            flex 1
            position relative
            top -6px
            border-bottom 1px solid $color-white-d
          .text
            font-weight 700
            padding 0 12px
            font-size $font-size-midium
        .supports
          width 80%
          margin 0 auto
          .support-item
            padding 0 12px
            margin-bottom 12px
            font-size $font-size-none
            &:last-child
              margin-bottom 0
            .icon
              display inline-block
              width 16px
              height 16px
              vertical-align top
              margin-right 6px
              background-size 16px 16px
              background-repeat no-repeat
              &.decrease
                bg-image('./decrease_2')
              &.discount
                bg-image('./discount_2')
              &.guarantee
                bg-image('./guarantee_2')
              &.invoice
                bg-image('./invoice_2')
              &.special
                bg-image('./special_2')
            .text
              line-height 16px
              font-size $font-size-small-x
        .bulletin
          width 80%
          margin 0 auto
          .content
            padding 0 12px
            line-height 24px
            font-size $font-size-small-x
    .detailClose
      position relative
      width 32px
      height 32px
      margin -64px auto 0
      clear both
      font-size 32px
</style>
