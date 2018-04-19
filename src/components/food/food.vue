<template>
  <transition name="move_left">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" />
          <div class="back" @click="back">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food" @cartAdd="add"></cartcontrol>
          </div>
          <transition name="fade-transition">
            <!-- 当商品的count不为0 的时候当前DOM隐藏，使用cartcontrol组件-->
            <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFirst($event)">
              加入购物车
            </div>
          </transition>
        </div>
        <split v-if="food.info"></split>
        <div class="info" v-if="food.info">
          <h1 class="title">商品介绍</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <!-- 在向子组件传值时，会传入要显示的评论类型、是否只显示有内容的评价、评论类型的文案、评论的数组 -->
          <ratingselect :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings" @ratingTypeSelect="ratingTypeSelect" @toggleContent="toggleContent"></ratingselect>
          <div class="rating-wrapper">
            <ul v-if="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType, rating.text)" v-for="(rating, key) in food.ratings" :key="key" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" class="avatar" />
                </div>
                <!-- 数据绑定中使用了filter属性,用作数据过滤 -->
                <div class="time">{{rating.rateTime | formaDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up' : rating.rateType === 0,'icon-thumb_down' : rating.rateType === 1}"></span>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-if="!food.ratings || !food.rating.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import Vue from 'vue';

// 自定义方法，用作格式化时间
import { _formaDate } from 'common/js/date';

import cartcontrol from '@/components/cartcontrol/cartcontrol';
import split from '@/components/split/split';
import ratingselect from '@/components/ratingselect/ratingselect';

const ALL = 2;

export default {
  data () {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: false,
      desc: {
        all: '全部',
        great: '推荐',
        bad: '吐槽'
      }
    };
  },
  props: {
    food: Object
  },
  methods: {
    // show方法，在父组件goods中，当点击商品时，也会调用
    show () {
      this.showFlag = true;
      this.selectType = ALL;
      this.onlyContent = false;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    // 返回到商品页
    back () {
      this.showFlag = false;
    },
    // 点击加入购物车方法，会调用goods组件中 _drop 方法
    add (target) {
      this.$emit('cartAdd', target);
    },
    // addFirst 用作dom结构 加入购物车使用，在商品详情页，第一次点击加入购物车用的组件不是 cartcontrol
    addFirst (event) {
      if (!event._constructed) {
        return;
      }
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1);
      }
      this.$emit('cartAdd', event.target);
    },
    // 子组件ratingselect 会通过 $emit 调用，用作改变显示评论的类型
    ratingTypeSelect (type) {
      this.selectType = type;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    // 子组件ratingselect 会通过 $emit 调用，用作改变是否显示有内容评价
    toggleContent (onlyContent) {
      this.onlyContent = !this.onlyContent;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    // 通过子组件传值来判断 父组件中评论区显示的内容
    needShow (type, text) {
      // 选中只显示有内容评价，而当前元素没有内容
      if (this.onlyContent && !text) {
        return false;
      }
      // 显示所有
      if (this.selectType === ALL) {
        return true;
      } else {
        // 判断当前评论type是否为我们选择的要展示的
        return type === this.selectType;
      }
    }
  },
  components: {
    cartcontrol,
    split,
    ratingselect
  },
  filters: {
    // filters 用作数据过滤，这里是把时间戳转换为要求的格式
    formaDate (time) {
      let date = new Date(time);
      return _formaDate(date, 'yyyy-MM-dd hh:mm');
    }
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/_mixin';
@import '~common/stylus/variable';
.food
  position fixed
  top 0
  left 0
  bottom 48px
  z-index 18
  width 100%
  background $color-white
  transform translate3d(0, 0, 0)
  &.move_left-enter-active, &.move_left-leave-active
    transition all 0.2s linear
  &.move_left-enter, &.move_left-leave-active
    transform translate3d(-100%, 0, 0)
  .image-header
    position relative
    width 100%
    height 0
    padding-bottom 100%
    img
      position absolute
      top 0
      left 0
      width 100%
      height 100%
    .back
      position absolute
      top 10px
      left 0
      .icon-arrow_lift
        display block
        padding 10px
        font-size 20px
        color $color-white
  .content
    padding 18px
    position relative
    .title
      margin-bottom 8px
      font-weight 700
      font-size $font-size-midium
      color $color-theme-d
      line-height 14px
    .detail
      margin-bottom 18px
      height 10px
      font-size $font-size-none
      color $color-theme
      line-height 10px
      .sell-count
        font-size $font-size-small-ll
        margin-right 12px
      .rating
        font-size $font-size-small-ll
    .price
      font-weight 700
      line-height 24px
      font-size $font-size-none
      .now
        margin-right 8px
        font-size $font-size-midium
        color $color-red
      .old
        text-decoration line-through
        font-size $font-size-small-ll
        color $color-theme
    .cartcontrol-wrapper
      position absolute
      right 12px
      bottom 12px
    .buy
      position absolute
      right 18px
      bottom 18px
      z-index 9
      height 24px
      line-height 24px
      padding 0 12px
      box-sizing border-box
      border-radius 12px
      font-size $font-size-small-ll
      color $color-white
      background $color-blue
      &.fade-transition-enter-active, &.fade-transition-leave-active
        transition all 0.2s
      &.fade-transition-enter, &.fade-transition-leave-active
        opacity 0
        background $color-blue-zero
  .info
    padding 18px
    .title
      margin-bottom 6px
      font-size $font-size-midium
      color $color-theme-d
    .text
      padding 0 8px
      font-size $font-size-small-x
      line-height 24px
      font-weight 200
      color $color-theme-l
  .rating
    padding 18px 0
    .title
      margin-left 18px
      font-size $font-size-midium
      color $color-theme-d
    .rating-wrapper
      padding 0 18px
      .rating-item
        position relative
        padding 16px 0
        border-1px($color-border)
        .user
          position absolute
          right 0
          top 16px
          font-size $font-size-none
          line-height 12px
          .name
            display inline-block
            vertical-align top
            color $color-theme
            margin-right 6px
            font-size $font-size-small-ll
          .avatar
            border-radius 50%
            width 12px
            height 12px
        .time
          margin-bottom 6px
          line-height 12px
          font-size $font-size-small-ll
          color $color-theme
        .text
          font-size $font-size-small-x
          color $color-theme-d
          line-height 16px
          .icon-thumb_down, .icon-thumb_up
            margin-right 4px
          .icon-thumb_down
            color $color-theme
          .icon-thumb_up
            color $color-blue
  .no-rating
    padding 16px 0
    font-size $font-size-small-x
    color $color-theme
</style>
