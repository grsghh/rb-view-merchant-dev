<template>
    <div class="home miniapp">
      <div class="main">
        <div class="topBar">
          <div class="imgBox base-backColor">
            <div class="tl f14 shopName">店铺名称: {{ param.shopName }}</div>
            <div class="imgLeft">
              <button open-type="contact" class="openTypeContact"></button>
            </div>
          </div>
          <!-- tabBar切换 -->
          <div class="tabScroll" scroll-x="true">
            <div v-for="(item,index) in sortList" :key="item.iconFileId" class="tabItem tl" :class="{active:index == 0 }">{{ item.name}}</div>
          </div>
        </div>
        <div class="main-right" v-if="list.length != 0">
          <ul class="list-goods">
            <li class="" v-for="(item,index) in list" :key="item.id">
              <a href="javascript:;">
                <img :src="item.mainImageURL">
                <h2 class="hideOver">
                  {{item.name}}
                  <span class="pageView">浏览 {{item.browseNum}}</span>
                </h2>
              </a>
              <div class="infos">
                <span class="base-redColor">￥{{item.retailPrice}}</span>
                <del>￥{{ item.marketPrice }}</del>
              </div>
            </li>
          </ul>
        </div>
        <div v-else>
          <building textFont="SORRY 暂无商品"></building>
        </div>
      </div>
    </div>
</template>

<script>
    import {homeList,homeSort} from '@/api/minishop'
    import building from '@/components/preview/building'
    export default {
        components: {building},
        props:['param']
        ,name: "home"
        ,data(){
            return{
                num: 0,
                flag: true,
                // userInfo: wx.getStorageSync("userInfo"),
                pageNo: 1,
                pageSize:20,
                state: 3,
                list: [], //商品的列表
                sortList: [] // 商品分类
            }
        }
        ,methods:{
            // 获取页面初始化的数据
            getList(searchInfo) {
                let that = this;
                homeList({ pageNo: that.pageNo, pageSize: that.pageSize, state: that.state, productCategoryLevel: 1, productCategoryId: searchInfo, }).then(res => {
                    if (res.status == 1) {
                        this.list = res.data.rows;
                    }
                })
            },
            // 获取商品类别
            getSort() {
                homeSort().then(res => {
                    if (res.status == 1) {
                        this.sortList = res.data;
                        this.getList(this.sortList[0].id);
                    }
                })
            },
        }
        ,mounted() {
            this.getSort();
        }
    }
</script>

<style lang="scss">
  .home{
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    background-color: #f9f9f9;
    position: relative;
    .topBar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 9999;
      background-color: #fff;
    }
    .top {
      width: 100%;
      height: (118px/2);
    }
    .imgBox {
      position: relative;
      background-color: #fff;
      padding-bottom: 12px;
    }
    .header {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      position: absolute;
      top: -27px;
      left: 50%;
      transform: translateX(-50%);
    }
    .shopName {
      padding-top: (76px/2);
    }
    .imgLeft,
    .imgRight {
      position: absolute;
      top: 20px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #EFEFEF;
    }
    .imgLeft {
      left: (78px/2);
      background-image: url('https://www.zzrbsy.com/minishop/rbshop/icon-myService.png');
      background-size: 20px 20px;
      background-position: center;
      background-repeat: no-repeat;
    }
    .imgRight {
      right: (78px/2);
      background-image: url('https://www.zzrbsy.com/minishop/rbshop/icon-message.png');
      background-size: 20px (34px/2);
      background-position: center;
      background-repeat: no-repeat;
    }
    .openTypeContact {
      position: absolute;top: 0;left: 0;right: 0;bottom: 0;opacity: 0;
    }
    .flex-wrp {
      height: (92px/2);
    }
    .flex-item {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
    }
    .active::before {
      content: '';
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 5px;
      width: 45px;
      height: 2px;
      background-color: #FF62B3;
    }
    .iconBox {
      overflow: hidden;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background-color: #FF62B3;
    }
    .iconName {
      width: 100%;
      padding: 10px 0 2px;
    }
    .hideOver{
      position: relative;
      width: (345px/2);
      height: 34px;
      display: -webkit-box !important;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      white-space: normal;
    }
    .pageView {
      position: absolute;
      right: 0;
      bottom: 0;
      font-size: 10px;
      color: #AFAFAF;
      height: 34px;
      background-color: #fff;
      line-height: (34px/2);
      padding: 0 8px;
    }
    .tabScroll {display: flex; width: 100%; justify-content: space-between; background-color: #f9f9f9; }
    .tabItem {
      position: relative;
      display: inline-block;
      width: 20%;
      height: 42px;
      line-height: 42px;
      font-size: 12px;
    }
    .tabItem.active {
      font-size: 15px;
    }
    /* 商品框样式 */
    .list-goods li{width: (364px/2);float: left;margin-bottom: 10px;background-color: #fff;}
    .list-goods li:nth-of-type(even){margin-left: 11px;}
    .list-goods li a img{height: (364px/2);margin-bottom: 7px;width: 100%;}
    .list-goods li .infos{display: flex;justify-content: space-between;padding:0 8px;align-items: center;background-color: #fff;}
    .main-right{width: 100%; margin-top: 111px;}

  }
</style>
