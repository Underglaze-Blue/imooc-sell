<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :selectType="selectType" :onlyContent="onlyContent" :ratings="ratings" @ratingTypeSelect="ratingTypeSelect" @toggleContent="toggleContent"></ratingselect>
      <div class="ratings-wrapper">
        <ul>
          <li v-for="(rating, key) in ratings" :key="key" v-show="needShow(rating.rateType, rating.text)" class="rating-item border-1px">
            <div class="avatar">
              <img :src="rating.avatar" />
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-if="rating.deliveryTime">{{rating.deliveryTime}}分钟</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-if="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span v-for="(item, key) in rating.recommend" :key="key" class="item">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formaDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';

import { _formaDate } from 'common/js/date';

import star from '@/components/star/star';
import split from '@/components/split/split';
import ratingselect from '@/components/ratingselect/ratingselect';

const ALL = 2; // 默认显示所有评论
const ERR_OK = 0;

export default {
  name: 'ratings',
  data () {
    return {
      selectType: ALL,
      onlyContent: true,
      ratings: []
    };
  },
  props: {
    seller: Object
  },
  components: {
    star,
    split,
    ratingselect
  },
  methods: {
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
      if (this.onlyContent && !text) {
        return false;
      }
      if (this.selectType === ALL) {
        return true;
      } else {
        return type === this.selectType;
      }
    }
  },
  created () {
    this.$http('/api/ratings').then((response) => {
      response = response.data;
      if (response.errno === ERR_OK) {
        this.ratings = response.data;
      }
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.ratings, {
          click: true
        });
      });
    }).catch((error) => {
      console.log(error);
    });
  },
  filters: {
    formaDate (time) {
      let date = new Date(time);
      return _formaDate(date, 'yyyy-MM-dd hh:mm');
    }
  }

};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/_mixin'
@import '~common/stylus/variable';
.ratings
  position absolute
  top 174px
  left 0
  bottom 0
  width 100%
  overflow hidden
  .overview
    display flex
    padding 18px 0
    .overview-left
      flex 0 0 137px
      padding 6px 0
      width 137px
      border-right 1px solid $color-border
      text-align center
      @media only screen and (max-width: 320px)
        flex 0 0 120px
        width 120px
      .score
        margin-bottom 6px
        font-size $font-size-large-x
        line-height 28px
        color $color-yellow
      .title
        margin-bottom 8px
        line-height 12px
        font-size $font-size-small-x
        color $color-theme-d
      .rank
        font-size $font-size-small-ll
        line-height 10px
        color $color-theme
    .overview-right
      flex 1
      padding 6px 0 6px 24px
      @media only screen and (max-width: 320px)
        padding-left 6px
      .score-wrapper
        margin-bottom 8px
        font-size $font-size-none
        .title
          display inline-block
          vertical-align top
          font-size $font-size-small-x
          line-height 18px
          color $color-theme-d
        .star
          display inline-block
          vertical-align top
          margin 0 12px
          @media only screen and (max-width: 320px)
            margin 0 6px
        .score
          display inline-block
          vertical-align top
          font-size $font-size-small-x
          line-height 18px
          color $color-yellow
      .delivery-wrapper
        font-size $font-size-none
        line-height 18px
        .title
          font-size $font-size-small-x
          color $color-theme-d
        .delivery
          margin-left 12px
          font-size $font-size-small-x
          color $color-theme
          @media only screen and (max-width: 320px)
            margin-left 6px
  .ratings-wrapper
    padding 0 18px
    .rating-item
      display flex
      padding 18px 0
      border-1px($color-border)
      .avatar
        flex 0 0 28px
        margin-right 12px
        width 28px
        height 28px
        border-radius 50%
        overflow hidden
      .content
        position relative
        flex 1
        .name
          margin-bottom 4px
          font-size $font-size-small-ll
          line-height 12px
          color $color-theme-d
        .star-wrapper
          margin-bottom 6px
          font-size $font-size-none
          .star
            display inline-block
            margin-right 6px
            vertical-align top
          .delivery
            display inline-block
            vertical-align top
            font-size $font-size-small-ll
            line-height 12px
            color $color-theme
        .text
          margin-bottom 8px
          font-size $font-size-small-x
          color $color-theme-d
          line-height 18px
        .recommend
          font-size $font-size-none
          line-height 16px
          .icon-thumb_up, .item
            display inline-block
            vertical-align top
            margin 0 8px 4px 0
          .icon-thumb_up
            font-size $font-size-small-x
            color $color-blue
          .item
            font-size $font-size-small-l
            padding 0 6px
            border 1px solid $color-border
            background $color-white
            color $color-theme
            border-radius 1px
        .time
          position absolute
          top 0
          right 0
          line-height 12px
          font-size $font-size-small-ll
          color $color-theme
</style>
