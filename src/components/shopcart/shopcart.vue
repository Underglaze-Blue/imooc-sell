<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{highlight : totalCount > 0}">
              <i class="icon-shopping_cart"></i>
            </div>
            <div class="num" v-show="totalCount">
              {{totalCount}}
            </div>
          </div>
          <div class="price" :class="{highlight : totalCount > 0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.stop="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="bull-container">
        <transition-group name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
          <div class="ball" v-for="(ball, key) in balls" :key="key" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition-group>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="fold">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li v-for="(food,key) in selectFoods" :key="key" class="food border-1px">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span class="sell">￥</span>{{food.price * food.count}}
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="fold" @click="toggleList"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';

import cartcontrol from '@/components/cartcontrol/cartcontrol';

export default {
  data () {
    return {
      // 小球过渡数组
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [],
      fold: false
    };
  },
  props: {
    selectFoods: {
      type: Array,
      default () {
        return [
          {
            price: 2,
            count: 1
          }
        ];
      }
    },
    deliveryPrice: Number,
    minPrice: Number
  },
  methods: {
    // 在goods组件中，会执行当前方法，el为父组件传递的参数为cartcontrol点击+时的DOM
    drop (el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) { // 判断小球是否显示
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
    // 过渡开始之前
    beforeEnter (el) {
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show) {
          // 获取当前元素相对于窗口的位置
          let rect = ball.el.getBoundingClientRect();
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22);
          el.style.display = 'block';
          // 设置过渡开始前的偏移值
          // 注释掉webkit是因为webpack loader时会自动添加兼容性写法
          // el.style.webkitTransform = `translate3d(0,${y}px,0)`;
          el.style.transform = `translate3d(0,${y}px,0)`;
          let inner = el.getElementsByClassName('inner-hook')[0];
          // inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
          inner.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
    },
    enter (el, done) {
      /**
      * 以下方法会使浏览器发生重绘
      * offsetTop、offsetLeft、offsetWidth、offsetHeight
      * clientTop、clientLeft、clientWidth、clientHeight
      * scrollTop、scrollLeft、scrollWidth、scrollHeight
      * getComputedStyle()（IE中currentStyle）
      * 重绘可参考
      * https://blog.csdn.net/q1056843325/article/details/53340308
      */
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight; // 强制浏览器重绘
      this.$nextTick(() => {
        // 将过渡元素的tanslate属性置为原先值
        // el.style.webkitTransform = `translate3d(0,0,0)`;
        el.style.transform = `translate3d(0,0,0)`;
        let inner = el.getElementsByClassName('inner-hook')[0];
        // inner.style.webkitTransform = `translate3d(0,0,0)`;
        inner.style.transform = `translate3d(0,0,0)`;
        el.addEventListener('transitionend', done);
      });
    },
    afterEnter (el) {
      let ball = this.dropBalls.shift();// 删除数组中第一个元素，并返回新数组
      if (ball) { // 如果返回的新数组不为undefined
        ball.show = false;
        el.style.display = 'none';
      }
    },
    // 购物车列表显示与隐藏的点击事件
    toggleList () {
      // 如果当前购物车中没有商品，将fold置为false
      if (!this.totalCount) {
        this.fold = false;
        return;
      }
      // toggle
      this.fold = !this.fold;
    },
    // 清空购物车，遍历foods，将count值置为0
    empty () {
      this.selectFoods.forEach((food) => {
        food.count = 0;
      });
    },
    // 支付 判断总金额是否大于最小支付金额
    pay () {
      if (this.totalPrice < this.minPrice) {
        return;
      }
      window.alert(`需支付${this.totalPrice}元`);
    }
  },
  computed: {
    // 计算属性，用作计算商品总金额，会遍历当前组件中所有商品
    totalPrice () {
      let total = 0;
      this.selectFoods.forEach((food) => {
        total += food.price * food.count;
      });
      return total;
    },
    // 计算商品总数量
    totalCount () {
      let count = 0;
      this.selectFoods.forEach((food) => {
        count += food.count;
      });
      return count;
    },
    // 改变结算按钮文案，通过最低支付金额判断
    payDesc () {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}起送`;
      } else if (this.totalPrice < this.minPrice) {
        return `还差${this.minPrice - this.totalPrice}起送`;
      } else {
        return '去结算';
      }
    },
    // 结算按钮class绑定，通过最低支付金额判断
    payClass () {
      if (this.totalPrice < this.minPrice) {
        return 'notEnough';
      } else {
        return 'enough';
      }
    }
  },
  components: {
    cartcontrol
  },
  watch: {
    // watch 监听 totalCount 值的改变，用作购物车列表的显示和隐藏
    totalCount: function () {
      if (!this.totalCount) {
        this.fold = false;
      }
      if (!this.fold) {
        this.$nextTick(() => {
          // 判断是不是已经初始化了 BScroll
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
    }
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/_mixin'
@import '~common/stylus/variable';
.shopcart
  position fixed
  left 0
  bottom 0
  z-index 20
  width 100%
  height 48px
  .content
    display flex
    background #141d27
    font-size $font-size-none
    color $color-white-l
    .content-left
      flex 1
      .logo-wrapper
        display inline-block
        position relative
        top -10px
        margin 0 12px
        padding 6px
        border-radius 50%
        width 56px
        height 56px
        background #141d27
        box-sizing border-box
        vertical-align top
        .logo
          width 100%
          height 100%
          border-radius 50%
          background #2b343c
          text-align center
          &.highlight
            background $color-blue
            .icon-shopping_cart
              color $color-white
          .icon-shopping_cart
            font-size $font-size-large-x
            line-height 44px
            color #80858a
        .num
          position absolute
          top 0
          right 0
          width 24px
          height 16px
          line-height 16px
          text-align center
          border-radius 16px
          font-size $font-size-small-l
          font-weight 700
          color $color-white
          background $color-red
          box-shadow 0 4px 8px 0 $color-black-d
      .price
        display inline-block
        vertical-align top
        margin-top 12px
        padding-right 12px
        box-sizing border-box
        font-size $font-size-large
        line-height 24px
        font-weight 700
        border-right 1px solid $color-border-d
        &.highlight
          color $color-white
      .desc
        display inline-block
        vertical-align top
        margin 12px 0 0 12px
        line-height 24px
        font-size $font-size-small-ll
    .content-right
      flex 0 0 105px
      width 105px
      .pay
        height 48px
        line-height 48px
        text-align center
        font-size $font-size-small-x
        font-weight 700
        &.notEnough
          background #2b333b
        &.enough
          background #00b43c
          color $color-white
  .bull-container
    .ball
      position fixed
      left 32px
      bottom 22px
      z-index 300
      &.drop-enter-active
        transition transform 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
      .inner
        display inline-block
        width 16px
        height 16px
        border-radius 50%
        background rgb(0, 150, 220)
        transition transform 0.4s linear
  .shopcart-list
    position absolute
    top 0
    left 0
    z-index -1
    width 100%
    transform translate3d(0, -100%, 0)
    &.fold-enter, &.fold-leave-active
      transform translate3d(0, 0, 0)
    &.fold-enter-active, &.fold-leave-active
      transition all 0.4s linear
    .list-header
      padding 0 18px
      height 40px
      line-height 40px
      background #f3f5f7
      box-sizing border-box
      border-bottom 1px solid $color-border
      .title
        float left
        font-size $font-size-midium
        color $color-theme-d
      .empty
        float right
        font-size $font-size-small-x
        color $color-blue
    .list-content
      padding 0 18px
      max-height 217px
      overflow hidden
      background $color-white
      .food
        position relative
        padding 12px 0
        box-sizing border-box
        border-1px($color-border)
        .name
          line-height 24px
          font-size $font-size-midium
          color $color-theme-d
        .price
          position absolute
          right 90px
          bottom 12px
          line-height 24px
          color $color-red
          font-size $font-size-midium
          font-weight 700
          .sell
            font-size $font-size-small-ll
            font-weight normal
        .cartcontrol-wrapper
          position absolute
          bottom 6px
          right 0
.list-mask
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  background rgba(7, 17, 27, 0.6)
  backdrop-filter blur(10px)
  z-index 19
  opacity 1
  &.fade-enter-active, &.fade-leave-active
    transition all 0.4s
  &.fade-enter, &.fade-leave-active
    opacity 0
    background $color-background-s
</style>
