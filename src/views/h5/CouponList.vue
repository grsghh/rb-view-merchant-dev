<template>
    <div class="coupon">
      <van-sticky>
        <div class="coupon-tit">
          <ul>
            <li @click="tabClick(item.entryKey)" v-for="item in CouponTypeList" :class="{active:item.entryKey == index}">{{item.entryValue}}</li>
          </ul>
          <i @click="CouponRule" class="iconfont iconico_explain"></i>
        </div>
      </van-sticky>
      <div class="coupon-con">
        <ul v-if="list.length">
          <template v-for="item in list">
            <li :key="item.id" :class="index == 1 ? 'useno' : '' || index == 2 ? 'used' : '' || index == 3 ? 'expired' : ''">
              <div class="coupon-con-left" :class="index == 1 ? 'pinkColor' : '' || index == 3 ? 'grayColor' : ''">
                <p><span>￥</span>{{item.parValue}}</p>
                <h3 v-if="item.isLimit == 0">无门槛使用</h3>
                <h3 v-else>满{{item.limitMoney}}元可用</h3>
              </div>
              <div class="coupon-con-right">
                <div class="right-new" :class="index == 1 ? 'useno-dashed' : '' || index == 2 ? 'used-dashed' : '' || index == 3 ? 'expired-dashed' : ''">
                  <h3 :class="index == 3 ? 'grayColor' : ''">{{item.name}}<p>{{item.startDate}}至{{item.expireDate}}</p></h3>
                  <span class="pinkColor" v-if="index == 1" @click="ImmediateUse">立即使用</span>
                  <i v-if="index == 2"></i>
                  <i v-if="index == 3" class="iconfont iconyiguoqi"></i>
                </div>
                <p v-if="item.limitCount != 0 ">同一用户仅限领{{item.limitCount}}张，全场通用</p>
                <p v-else>无限制</p>
              </div>
            </li>
          </template>
        </ul>
        <div class="noInfo" v-else>
          <div class="noIconBox">
            <i class="iconfont iconicon_coupon"></i>
          </div>
          <div class="noInfoTitle">您还没有优惠券哦~</div>
        </div>
      </div>
    </div>
</template>

<script>
  import {setH5FontSize,removeH5FontSize} from '@/utils'
  import { miniCouponsList } from '@/api/coupons'
  import {dicts} from '@/api/system'
  import wx from 'weixin-js-sdk'
  import 'vant/lib/index.css';
  import Vue from 'vue';
  import { Sticky } from 'vant';

  Vue.use(Sticky);

  export default {
    name:'CouponList',
    components:{},
    data(){
      return{
        index:1,
        CouponTypeList:[],//状态列表
        list:[]//优惠券列表
      }
    },
    methods:{
      //tab点击事件
      tabClick(key){
        this.index = key
        this.getList()
      },
      //优惠券列表
      getList(){
        miniCouponsList({state:this.index}).then(res=>{
          if(res.status == 1){
            this.list = res.data
          }
        })
      },
      //优惠券使用状态
      async getCouponType(){
        await dicts('100017').then(res=>{
          if(res.status === 1){
            this.CouponTypeList = res.data;
          }
        })
      },
      //优惠券使用规则
      CouponRule(){
        this.$router.push('/CouponRule')
      },
      //立即使用
      ImmediateUse(){
        wx.miniProgram.switchTab({
          url: '/pages/home/home'
        })
      }
    },
    beforeCreate(){
      setH5FontSize();
    },
    mounted(){
      document.title = '优惠券';
      this.getCouponType()
      this.getList()
    },
    beforeRouteLeave(to,from,next) {
      removeH5FontSize();
      next();
    }
  }
</script>

<style scoped>

</style>
