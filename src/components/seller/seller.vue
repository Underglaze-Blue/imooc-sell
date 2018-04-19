<template>
  <div class="seller" ref="seller">
    <div class="seller-wrapper">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <div class="remark">
          <div class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </div>
          <div class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </div>
          <div class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </div>
        </div>
        <div class="favorite" @click="toggleFavorite($event)">
          <i class="icon-favorite" :class="{active:favorite}"></i>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item border-1px" v-for="(item, key) in seller.supports" :key="key">
            <span class="icon" :class="classMap[seller.supports[key].type]"></span>
            <span class="text">{{seller.supports[key].description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="(pic, key) in seller.pics" :key="key">
              <img :src="pic" />
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item border-1px" v-for="(info, key) in seller.infos" :key="key">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';

// localStorageae 储存和取值
import { _saveToLocal, _loadFromLocal } from 'common/js/store';

import star from '@/components/star/star';
import split from '@/components/split/split';

export default {
  name: 'seller',
  data () {
    return {
      favorite: (() => {
        return _loadFromLocal(this.seller.id, 'favorite', false); // 取localstorage
      })()
    };
  },
  props: {
    seller: Object
  },
  components: {
    star,
    split
  },
  created () {
    // 优惠信息等图标
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  },
  mounted () {
    // 如果当前组件存在商家实景图，计算图片占总宽，赋值给父级ul
    if (this.seller.pics) {
      let picWidth = 120;
      let margin = 6;
      let width = (picWidth + margin) * this.seller.pics.length - margin;
      this.$refs.picList.style.width = width + 'px';
    }
    this.$nextTick(() => {
      // 初始化页面scroll
      this.scroll = new BScroll(this.$refs.seller, {
        click: true
      });
      // 初始化横向图片滑动
      this.picScroll = new BScroll(this.$refs.picWrapper, {
        scrollX: true,
        eventPassthrough: 'vertical'
      });
    });
  },
  computed: {
    // 通过计算属性判断是否收藏了店铺，返回文案
    favoriteText () {
      if (this.favorite) {
        return '已收藏';
      } else {
        return '收藏';
      }
    }
  },
  methods: {
    // 在点击收藏按钮时，改变 favorite 的值 并且更新localstorage
    toggleFavorite (evnet) {
      if (!event._constructed) {
        return;
      }
      this.favorite = !this.favorite;
      _saveToLocal(this.seller.id, 'favorite', this.favorite);
    }
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/_mixin'
@import '~common/stylus/variable';
.seller
  position absolute
  top 174px
  left 0
  bottom 0
  width 100%
  overflow hidden
  .overview
    padding 18px
    .title
      margin-bottom 8px
      font-size $font-size-midium
      line-height 14px
      color $color-theme-d
    .desc
      padding-bottom 18px
      font-size $font-size-none
      border-1px($color-border)
      .star
        display inline-block
        vertical-align top
        margin-right 8px
      .text
        display inline-block
        vertical-align top
        margin-right 12px
        font-size $font-size-small-ll
        line-height 18px
        color $color-theme-l
        &:last-child
          margin-right 0
    .remark
      display flex
      padding-top 18px
      .block
        flex 1
        text-align center
        border-right 1px solid $color-border
        &:last-child
          border none
        h2
          margin-bottom 4px
          line-height 10px
          font-size $font-size-small-ll
          color $color-theme
        .content
          font-size $font-size-small-ll
          line-height 24px
          color $color-theme-d
          .stress
            font-size $font-size-large-x
    .favorite
      position absolute
      right 11px
      top 18px
      width 44px
      text-align center
      .icon-favorite
        display block
        margin-bottom 4px
        color #d4d6d9
        font-size $font-size-large-x
        line-height 24px
        &.active
          color $color-red
      .text
        font-size $font-size-small-ll
        line-height 10px
        color $color-theme-l
  .bulletin
    padding 18px 18px 0
    .title
      margin-bottom 8px
      font-size $font-size-midium
      line-height 14px
      color $color-theme-d
    .content-wrapper
      padding 0 12px 16px
      border-1px($color-border)
      .content
        line-height 24px
        font-size $font-size-small-x
        color $color-red
    .supports
      .support-item
        padding 16px 12px
        font-size $font-size-none
        border-1px($color-border)
        &:last-child
          border-none()
        .icon
          display inline-block
          width 16px
          height 16px
          vertical-align top
          margin-right 6px
          background-size 16px 16px
          background-repeat no-repeat
          &.decrease
            bg-image('./decrease_4')
          &.discount
            bg-image('./discount_4')
          &.guarantee
            bg-image('./guarantee_4')
          &.invoice
            bg-image('./invoice_4')
          &.special
            bg-image('./special_4')
        .text
          line-height 16px
          font-size $font-size-small-x
          color $color-theme-d
  .pics
    padding 18px
    .title
      margin-bottom 12px
      font-size $font-size-midium
      line-height 14px
      color $color-theme-d
    .pic-wrapper
      width 100%
      overflow hidden
      white-space nowrap
      .pic-list
        font-size $font-size-none
        .pic-item
          display inline-block
          width 120px
          height 90px
          margin-right 6px
          &:last-child
            margin-right 0
          img
            width 120px
            height 90px
  .info
    padding 18px
    .title
      padding-bottom 12px
      font-size $font-size-midium
      line-height 14px
      color $color-theme-d
      border-1px($color-border)
    .info-item
      padding 16px 12px
      border-1px($color-border)
      font-size $font-size-small-x
      line-height 16px
      color $color-theme-d
      &:last-child
        border-none()
</style>
