<template>
  <div class="star" :class="starType">
    <span class="star-item" v-for='(itemClass, key) in itemClasses' :key="key" :class="itemClass"></span>
  </div>
</template>

<script type="text/ecmascript-6">

const STAR_LENGTH = 5;
const CLASS_ON = 'on';
const CLASS_HALF = 'half';
const CLASS_OFF = 'off';

export default {
  data () {
    return {

    };
  },
  props: {
    size: Number,
    score: Number
  },
  computed: {
    // star组件大小
    starType () {
      return 'star-' + this.size;
    },
    itemClasses () {
      let result = [];
      let score = Math.round(this.score * 2) / 2; // 先乘2，再取四舍五入，然后除以2，算出新的评星 例 4.9 评分应该为满星
      let hasDecimal = score % 1 !== 0; // 取余1，看有没有半星
      let integer = Math.floor(score); // 取整
      // result push常量，这里常量为定义的class名
      for (let i = 0; i < integer; i++) {
        result.push(CLASS_ON);
      };
      if (hasDecimal) {
        result.push(CLASS_HALF);
      };
      while (result.length < STAR_LENGTH) {
        result.push(CLASS_OFF);
      };
      return result;
    }
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/_mixin'
.star
  .star-item
    display inline-block
    background-repeat no-repeat
  &.star-48
    .star-item
      width 20px
      height 20px
      margin-right 22px
      background-size 20px 20px
      &:last-child
        margin-right 0
      &.on
        bg-image('star48_on')
      &.half
        bg-image('star48_half')
      &.off
        bg-image('star48_off')
  &.star-36
    .star-item
      width 15px
      height 15px
      margin-right 6px
      background-size 15px 15px
      &:last-child
        margin-right 0
      &.on
        bg-image('star36_on')
      &.half
        bg-image('star36_half')
      &.off
        bg-image('star36_off')
  &.star-24
    .star-item
      width 10px
      height 10px
      margin-right 3px
      background-size 10px 10px
      &:last-child
        margin-right 0
      &.on
        bg-image('star24_on')
      &.half
        bg-image('star24_half')
      &.off
        bg-image('star24_off')
</style>
