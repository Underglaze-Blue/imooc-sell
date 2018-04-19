<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count > 0" @click.stop.prevent="decreaseCart">
        <i class="inner icon-remove_circle_outline"></i>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add" @click.stop.prevent="addCart($event)">
      <i class="icon-add_circle"></i>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';

export default {
  data () {
    return {

    };
  },
  props: {
    food: Object
  },
  methods: {
    addCart (event) {
      if (!event._constructed) {
        return;
      }
      // 判断当前商品有没有 count属性，如没有 使用Vue.set 设置count属性
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1);
      } else {
        this.food.count++;
      }
      this.$emit('cartAdd', event.target);
    },
    decreaseCart () {
      if (!event._constructed) {
        return;
      }
      if (this.food.count) {
        this.food.count--;
      }
    }
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/variable';
.cartcontrol
  font-size font-size $font-size-none
  .cart-decrease, .cart-add
    display inline-block
    padding 6px
    font-size $font-size-large-x
    line-height 24px
    .icon-remove_circle_outline
      color $color-blue
  .cart-count
    display inline-block
    vertical-align top
    width 12px
    padding-top 6px
    line-height 24px
    text-align center
    font-size $font-size-small-ll
    color $color-theme
  .cart-add
    .icon-add_circle
      color $color-blue

.move-enter, .move-leave-to
  opacity 0
  transform translate3d(24px, 0, 0) rotate(180deg)

.move-enter-active, .move-leave-active
  transition all .2s linear

</style>
