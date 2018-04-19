<template>
  <div class="rating-select">
    <div class="rating-type border-1px">
      <span @click="select(2, $event)" class="block great" :class="{active: selectType === 2}">
        {{desc.all}}
        <span class="count">{{ratings.length}}</span>
      </span>
      <span @click="select(0, $event)" class="block great" :class="{active: selectType === 0}">
        {{desc.great}}
        <span class="count">{{great.length}}</span>
      </span>
      <span @click="select(1, $event)" class="block bad" :class="{active: selectType === 1}">
        {{desc.bad}}
        <span class="count">{{bad.length}}</span>
      </span>
    </div>
    <div class="switch" :class="{on: onlyContent}" @click="toggleContent">
      <i class="icon-check_circle"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

const GREAT = 0;
const BAD = 1;
const ALL = 2;

export default {
  data () {
    return {
    };
  },
  props: {
    ratings: {
      type: Array,
      default () {
        return [];
      }
    },
    selectType: {
      default: ALL
    },
    onlyContent: {},
    desc: {
      default () {
        return {
          all: '全部',
          great: '满意',
          bad: '不满意'
        };
      }
    }
  },
  methods: {
    // 改变要是显示的评论类型
    select (type, event) {
      if (!event._constructed) {
        return;
      }
      this.$emit('ratingTypeSelect', type);
    },
    // 显示有内容的评价
    toggleContent () {
      this.$emit('toggleContent');
    }
  },
  computed: {
    great () {
      // 返回一个数据，数据内容为所有评论数据匹配到的GREAT
      // 正面的评价内容
      return this.ratings.filter((rating) => {
        return rating.rateType === GREAT;
      });
    },
    // 返回一个数据，数据内容为所有评论数据匹配到的BAD
    // 负面的评价内容
    bad () {
      return this.ratings.filter((rating) => {
        return rating.rateType === BAD;
      });
    }
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/_mixin'
@import '~common/stylus/variable';
.rating-select
  .rating-type
    padding 18px 0
    margin 0 18px
    font-size $font-size-none
    border-1px($color-border)
    .block
      display inline-block
      padding 8px 12px
      margin-right 8px
      border-radius 1px
      color $color-theme-l
      font-size $font-size-small-x
      line-height 16px
      &.active
        color $color-white
      &.great
        background $color-background-a
        &.active
          background $color-blue
      &.bad
        background $color-background-b
        &.active
          background $color-theme-l
      .count
        font-size $font-size-small
  .switch
    padding 12px 18px
    font-size $font-size-none
    color $color-theme
    border-bottom 1px solid $color-border
    line-height 24px
    &.on
      .icon-check_circle
        color #00c850
    .icon-check_circle
      display inline-block
      vertical-align top
      font-size $font-size-large-x
      margin-right 4px
    .text
      display inline-block
      vertical-align top
      font-size $font-size-small-x
</style>
