<template>
  <div>
    <div class="goods">
      <div class="menu-wrapeer" ref="menuWrapper">
        <ul>
          <li v-for="(item, key) in goods" :key="key" class="menu-item" :class='{current:currentIndex === key}' @click="selectMenu(key, $event)" ref="menuItem">
            <span class="text border-1px">
              <span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapeer" ref="foodsWrapper">
        <ul>
          <li v-for="(item, key) in goods" :key="key" class="food-list" ref="foodListHook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="(food, key) in item.foods" :key="key" class="food-item border-1px" @click="choseFood(food,$event)">
                <div class="icon">
                  <img :src="food.icon" />
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>好评率{{food.rating}}%
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food" @cartAdd="_drop"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :selectFoods="selectFoods" ref="shopcart"></shopcart>
    </div>
    <!-- 由子组件 $emit 传递的方法 在父组件通过v-on:方法名 接收 -->
    <food :food="selectFood" ref="food" @cartAdd="_drop"></food>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';

import shopcart from '@/components/shopcart/shopcart';
import cartcontrol from '@/components/cartcontrol/cartcontrol';
import food from '@/components/food/food';

const ERR_OK = 0;

export default {
  name: 'goods',
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectFood: {}
    };
  },
  props: {
    seller: {}
  },
  components: {
    shopcart,
    cartcontrol,
    food
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    this.$http('/api/goods').then((response) => {
      response = response.data;
      if (response.errno === ERR_OK) {
        this.goods = response.data;
        // 在数据加载过程中，异步执行方法 用作初始化 BScroll 和 计算列表高度
        this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
        });
      }
    }).catch((error) => {
      console.log(error);
    });
  },
  methods: {
    _initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      });
      this.foodScroll = new BScroll(this.$refs.foodsWrapper, {
        probeType: 3,
        click: true
      });

      this.foodScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y));
        this.menuScroll.scrollToElement(this.$refs.menuItem[this.currentIndex], 300);
      });
    },
    _calculateHeight () {
      let foodList = this.$refs.foodListHook;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    // 用作接收子组件传递事件
    _drop (target) {
      // 体验优化，异步执行下落动画
      this.$nextTick(() => {
        // 让子组件shopcart执行方法
        this.$refs.shopcart.drop(target);
      });
    },
    // 在 dom 结构中会传入 $event 代表当前dom
    selectMenu (index, event) {
      // 用作阻止默认点击事件 BScroll 方法
      if (!event._constructed) {
        return;
      };
      let foodList = this.$refs.foodListHook;
      // 滑动到制定位置 BScroll 方法
      this.foodScroll.scrollToElement(foodList[index], 300);
    },
    // 打开商品详情
    choseFood (food, event) {
      if (!event._constructed) {
        return;
      };
      this.selectFood = food;
      this.$refs.food.show();
    }
  },
  computed: {
    // 用作计算当前商品展示区域对应的菜单栏
    // 也就是通过右侧商品列表计算左侧对应的菜单
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    },
    // 用作给购物车传递商品信息，传递所有包含count属性的商品
    selectFoods () {
      let foods = [];
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food);
          }
        });
      });
      return foods;
    }
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/_mixin';
@import '~common/stylus/variable';
.goods
  display flex
  position absolute
  top 174px
  bottom 46px
  width 100%
  overflow hidden
  .menu-wrapeer
    flex 0 0 80px
    width 80px
    background #f3f5f7
    .menu-item
      display table
      height 54px
      width 56px
      padding 0 12px
      line-height 14px
      font-size $font-size-none
      &.current
        position relative
        top -1px
        z-index 10
        background $color-white
        font-weight 700
        .text
          border-none()
      .text
        display table-cell
        width 56px
        vertical-align middle
        font-size $font-size-small-x
        border-1px($color-border)
        .icon
          display inline-block
          width 12px
          height 12px
          margin-right 2px
          background-size 12px 12px
          background-repeat no-repeat
          vertical-align top
          &.decrease
            bg-image('./decrease_3')
          &.discount
            bg-image('./discount_3')
          &.guarantee
            bg-image('./guarantee_3')
          &.invoice
            bg-image('./invoice_3')
          &.special
            bg-image('./special_3')
  .foods-wrapeer
    flex 1
    .title
      padding-left 14px
      height 26px
      line-height 26px
      border-left 2px solid #d9dde1
      font-size $font-size-small-x
      color $color-theme
      background #f3f5f7
    .food-item
      display flex
      margin 18px
      padding-bottom 18px
      border-1px($color-border)
      &:last-child
        border-none()
        margin-bottom 0
      .icon
        flex 0 0 57px
        width 57px
        margin-right 10px
      .content
        flex 1
        .name
          margin 2px 0 8px
          height 14px
          line-height 14px
          font-size $font-size-midium
          color $color-theme-d
        .desc, .extra
          margin-bottom 8px
          line-height 12px
          font-size $font-size-small-ll
          color $color-theme
        .extra
          margin-bottom 0
          line-height 10px
          .count
            margin-right 12px
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
          right 0
          bottom 12px
</style>
