<template>
  <div class="contentBox h5MaterialDetail">
    <div class="article">
      <h1>{{detail.title}}</h1>
      <h2 class="base-delColor">{{detail.createTime}} 浏览 {{detail.pageView}}</h2>
      <article v-html="detail.content"></article>
      <div class="tools">
        <span @click="sendIdea(1)"><van-icon name="good-job-o" /><b>{{detail.support}}</b></span>
        <span @click="sendIdea(2)"><van-icon name="good-job-o" class="down"/><b>{{detail.dissenter}}</b></span>
      </div>
    </div>
  </div>
</template>

<script>
    import {shareConfig} from '@/api/material'
    import {apiHelpDetail,apiFeedback} from '@/api/help'
    import wx from 'weixin-js-sdk'
    import 'vant/lib/index.css';
    import Vue from 'vue';
    import { Icon } from 'vant';

    Vue.use(Icon);
    export default {
        name: "helpDetail"
        , props: ['param']
        , data() {
            return {
                detail: {}
                ,form:{
                    id: ''
                    ,type:2
                }
            }
        }
        , methods: {
            getParam(){
                //以组件形式载入 (预览)
                if (this.param) {
                    this.form = {
                        id :this.param.id
                    };
                    return;
                }
                this.form.id = this.$route.query.id;
            }
            ,getData(){
                apiHelpDetail(this.form.id).then(res=>{
                    if(res.status == 1){
                        this.detail = res.data;
                        // this.getWxConfig();
                    }
                })
            }
            //获取公众号配置
            ,getWxConfig(){
                shareConfig({shareUrl:location.href.split('#')[0]}).then(res=>{
                    //微信公众号配置
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: res.data.appid, // 必填，公众号的唯一标识
                        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
                        signature: res.data.signature,// 必填，签名，
                        jsApiList: [
                            'onMenuShareAppMessage'
                            ,'onMenuShareQQ'
                            ,'onMenuShareTimeline'
                            ,'onMenuShareQZone'
                        ] // 必填，需要使用的 JS 接口列表
                    });
                    this.wxShare();
                })
            }
            //分享
            ,wxShare(){
                let _this = this;
                // config信息验证后会执行ready方法
                let shareInfo = {
                    title: _this.detail.title, // 分享标题
                    desc: _this.detail.summary, // 分享描述
                    link:location.href.split('#')[0]+'#'+location.href.split('#')[1], // 分享链接
                    imgUrl: _this.detail.mainImageURL// 分享图标
                }
                wx.ready(function(){
                    //分享朋友
                    wx.onMenuShareAppMessage(shareInfo)
                    //分享QQ
                    wx.onMenuShareQQ(shareInfo)
                    //分享朋友圈
                    wx.onMenuShareTimeline(shareInfo)
                    //分享qq空间
                    wx.onMenuShareQZone(shareInfo)
                });
            }
            ,sendIdea(type){
                if(!this.detail.operated){
                    let form = {id:this.form.id,operateResult:type};
                    apiFeedback(form).then(res=>{
                        if(res.status == 1){
                            this.$message({
                                type: 'success',
                                message: '反馈成功！'
                            });
                            this.getData();
                        }
                    })
                }else{
                    this.$message({
                        type:'error',
                        message:'已反馈，不能重复反馈！'
                    })
                }
            }
        }
        , created() {
            this.getParam();
            this.getData();
        }
    }
</script>

<style scoped lang="scss">
  .tools{display: flex;justify-content: center;font-size: 12px;margin-top: 10px;color: #999;
    span{display: flex;align-items: center; }
    i{font-size: 30px;margin-right: 5px;}
    /deep/ .down{margin-left: 40px;transform: rotateZ(90deg) rotateX(180deg)}
  }
</style>
