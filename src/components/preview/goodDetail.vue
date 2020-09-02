<template>
  <div class="goodDetail miniapp">
    <!--      <div class="backBtn bgw" style="top:navHeightpx;" bindtap="goBack"></div>-->
    <div class="top bgw">
      <div class="logs">
        <div class="fl">
          <img class=""
               src="https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ermBl1GHRhv7m0j5pCfFUTh3SrQfBrF4xcP5pibEYgzwTkOvJHRvIOsf3icQwttW1bAKL8Ze1icvqtUA/132">
          <span class="hideOver">张三</span>购买了
        </div>
        <div class="fr">
          <i></i>
          <span class="hideOver">李四</span>分享了
        </div>
      </div>
      <!-- logs -->
      <img class="swiper-item" v-if="detail.productImages" :src="detail.productImages[0].url">
      <div class="good-txt">
        <h1>{{detail.name}}</h1>
        <div class="price">
          <em class="base-redColor">￥{{detail.retailPrice}}</em>
        </div>
        <p class="flex-wrp base-delColor">
          <em>已售 {{detail.totalSales}}</em>
          <em>库存 {{detail.totalInventory}}</em>
        </p>
      </div>
      <!-- good-txt -->
    </div>
    <div class="block bgw" v-if="detail.inventoryType == 2">
      <div class="bar" bindtap="showSKuDialog" data-type="0">
        <div class="left">
          <em class="base-delColor">规格</em>
          <span>{{detail.specificationNames}}</span>
        </div>
        <div class="right"></div>
      </div>
      <!-- bar -->
    </div>
    <!-- block -->
    <div class="bgw block">
      <div class="dialog-sku-computed base-borderTop">
        <h3>购买数量</h3>
        <div class="computed">
          <div class='goSingle' bindtap="reduce">-</div>
          <p class='goSingle'>
            1
          </p>
          <div class="goSingle" bindtap="add">+</div>
          <!-- computed -->
        </div>
      </div>
    </div>
    <div class="block bgw">
      <div class="bar">
        <div class="left">
          <em class="base-delColor">运费</em>
          <span v-if="detail.isPinkage == 1">免运费</span>
          <span v-else>{{detail.carriage}}</span>
        </div>
        <div class="right"></div>
      </div>
    </div>
    <div class="block bgw">
      <h3 class='promsg' style="padding-bottom:20px;">产品信息</h3>
    </div>
    <!-- block -->
    <section v-html="detail.content"></section>
    <div class="toolBar flex-wrp bgw">
      <div class="left">
    <span>
      <i class="kefu"></i>
      <em>客服</em>
      <button open-type="contact"></button>
    </span>
        <a hover-class="none" url="/pages/cart/cart" open-type="switchTab">
          <i class="cart"></i>
          <em>购物车</em>
        </a>
      </div>
      <div class="toolBar-add" bindtap="showSKuDialog" data-type="1">加入购物车</div>
      <div class="base-bgColor toolBar-buy" bindtap="showSKuDialog" data-type="2">
        <p>￥{{detail.retailPrice}}</p>
        <div>立即购买</div>
      </div>
    </div>
  </div>
</template>

<script>
    import {onSaleDetail,proDetail} from '@/api/minishop'
    export default {
        name: "goodDetail"
        , props: ['param']
        , data() {
            return {
                detail: {}
            }
        }
        , methods: {
            getDetailData() {
                proDetail(this.param).then(res => {
                    if (res.status === 1) {
                        this.detail = res.data;
                    }
                })
            }
        }
        , mounted() {
            this.getDetailData();
        }
    }
</script>

<style lang="scss">
  .goodDetail {
    position: relative;
    background: #F9F9F9;
    padding-bottom: (108px/2);
    height: 100%;
    overflow-y: auto;

    .swiper-item {
      width: 100%;
      vertical-align: middle;
    }

    .goodDetail > .top {
      margin-bottom: 1px;
    }

    .good-txt {
      padding: (32px/2) (37px/2) (38px/2);
      position: relative;
    }

    .good-txt h1 {
      line-height: (48px/2);
      margin-bottom: (25px/2);
      font-size: (28px/2);
    }

    .good-txt .price {
      margin: (5px/2) 0;
      overflow: hidden;
    }

    .good-txt .price em {
      font-size: (36px/2);
    }

    .good-txt del {
      margin-left: (20px/2);
    }

    .good-txt p {
      justify-content: space-between;
    }

    /* 横块儿 */
    .block {
      padding: 0 (38px/2);
      color: #707070;
      margin-bottom: (10px/2);
      font-size: (28px/2);
    }

    .block .bar {
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .block .left {
      display: flex;
      align-items: center;
      position: relative;
      width: 85%;
    }

    .block .left .icon {
      width: (29px/2);
      height: 20px;
      left: (85px/2);
      top: 50%;
      transform: translateY(-50%);
      background-size: 100% 100%;
      background-image: url('https://www.zzrbsy.com/minishop/rbshop/icon-loc.png');
      position: absolute;
      border-radius: 0
    }

    .block .left span {
      padding-left: 25px;
      position: relative;
      width: 85%;
    }

    .block .left i {
      width: 5px;
      height: 5px;
      border-radius: 50%;
    }

    .block .left em.txt {
      margin-left: 10px;
      margin-right: 10px;
      vertical-align: middle;
    }

    .block .right {
      width: 6px;
      height: 10px;
    }

    .block ul {
      overflow: hidden;
      margin-left: (72px/2);
      padding-bottom: 20px;
    }

    .block ul li {
      float: left;
      margin-right: (26px/2);
    }

    .block ul li img {
      width: 30px;
      height: 30px;
    }

    .block ul span {
      width: (168px/2);
      height: 30px;
      background: rgba(238, 238, 238, 1);
      line-height: 30px;
      text-align: center;
    }

    section {
      padding-bottom: 20px;
    }

    section img {
      width: 100%;
      vertical-align: middle;
    }

    .promsg {
      padding-top: 15px;
    }

    /* 底部工具栏 */
    .toolBar {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 10;
      height: (108px/2);
      justify-content: space-between;
      font-size: (28px/2);
    }

    .toolBar .left {
      width: (312px/2);
      display: flex;
      justify-content: space-around;
      align-items: center;
      font-size: 10px;
      color: #333;
    }

    .toolBar .left a, .toolBar .left span {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: relative;
    }

    .toolBar .left i {
      width: (52px/2);
      height: (52px/2);
      background-size: 100% 100%;
      margin-bottom: 3px;
    }

    .toolBar .left em {
      font-size: 10px;
      color: #333;
    }

    .toolBar .left button {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
    }

    .kefu {
      background-image: url('https://www.zzrbsy.com/minishop/rbshop/icon-kefu.png');
    }

    .cart {
      background-image: url('https://www.zzrbsy.com/minishop/rbshop/icon-cart.png');
    }

    .toolBar-add {
      width: 110px;
      line-height: (108px/2);
      background: rgba(246, 171, 210, 1);
      color: #fff;
      text-align: center;
    }

    .toolBar-buy {
      width: 110px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    /* tab */
    nav {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 50px;
      font-size: 14px;
      color: #333;
    }

    nav .cur {
      border-bottom: 3px solid #FF62B3;
    }

    nav view {
      height: 22px;
    }

    /* 推广列表 */
    .shareList {
      padding: 0 (27px/2);
    }

    .shareList li {
    }

    .shareList li h2 {
      padding: 10px 0;
      font-size: 12px;
    }

    .shareList li view {
      padding: 10px;
      padding-left: 100px;
      position: relative;
      border: 1px solid rgba(238, 238, 238, 1);
    }

    .shareList li view dl {
      width: (288px/2);
    }

    .shareList li view dl image {
      width: (160px/2);
      height: (160px/2);
      position: absolute;
      left: 10px;
      top: 10px;
    }

    .shareList li view dl dd h3 {
      font-size: 14px;
      color: #333;
      margin-bottom: 5px;
    }

    .shareList li view dl dd p {
      line-height: 20px;
    }

    .shareList li view span {
      position: absolute;
      right: (32px/2);
      top: 25px;
      width: (92px/2);
      height: (92px/2);
      background-image: url('https://www.zzrbsy.com/minishop/rbshop/icon-share.png');
      background-size: 100% 100%;
    }

    .shareList li view span button {
      width: 100%;
      height: 100%;
      opacity: 0;
    }

    .logs {
      position: fixed;
      top: 5px;
      width: 100%;
      padding: 0 11px;
      display: flex;
      justify-content: space-between;
      z-index: 8;
    }

    .logs div {
      background: rgba(51, 51, 51, .5);
      height: (58px/2);
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      border-radius: 100px;
      padding-right: 11px;
      font-size: 10px;
    }

    .logs div img {
      width: (52px/2);
      height: (52px/2);
      border-radius: 50%;
      margin-right: 4px;
    }

    .logs div.fl span {
      max-width: (160px/2);
    }

    .logs div.fr {
      color: #FF7474;
      padding-left: 12px;
    }

    .logs div.fr i {
      width: (35px/2);
      height: (34px/2);
      background-image: url('https://www.zzrbsy.com/minishop/rbshop/icon-favo.png');
      background-size: 100% 100%;
      margin-right: 6px;
    }

    .backBtn {
      position: fixed;
      top: (64px/2);
      left: 22px;
      width: 34px;
      height: 34px;
      z-index: 9;
      background-size: (23px/2) 20px;
      background-image: url('https://www.zzrbsy.com/minishop/rbshop/icon-arrow-left.png');
      background-position: 10px center;
      background-repeat: no-repeat;
      border-radius: 50%;
    }

    .dialog-sku-computed {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      height: 50px;
    }

    .computed {
      bottom: 0;
      margin-top: 0;
      position: relative;
    }
  }
</style>
