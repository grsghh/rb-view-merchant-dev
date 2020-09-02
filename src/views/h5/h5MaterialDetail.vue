<template>
  <div class="contentBox h5MaterialDetail">
    <div class="article">
      <h1>{{detail.title}}</h1>
      <h2 class="base-delColor">{{detail.createTime}} 浏览 {{detail.browseNum}}</h2>
      <table cellpadding="10" width="100%">
        <tr>
          <td width="100">商品名称</td>
          <td>{{detail.productName}}</td>
        </tr>
        <tr>
          <td>供货商</td>
          <td>{{detail.supplierName}}</td>
        </tr>
        <tr>
          <td>品牌</td>
          <td>{{detail.brandName}}</td>
        </tr>
        <tr>
          <td>货号</td>
          <td>{{detail.productNo}}</td>
        </tr>
      </table>
      <article v-html="detail.content"></article>
      <input type="text" class="shareUrl">
      <div class="h5MaterialDetail-share">
        <el-button type="primary" @click="toShare" v-clipboard:copy="copyTxt" v-clipboard:success="onCopy">复制分享链接</el-button>
      </div>
    </div>
  </div>
</template>

<script>
    import {materialContent,shareConfig} from '@/api/material'
    import wx from 'weixin-js-sdk'
    export default {
        name: "h5MaterialDetail"
        , props: ['param']
        , data() {
            return {
                detail: {}
                ,form:{
                    id: ''
                    ,type:2
                }
                ,copyTxt:''
            }
        }
        , methods: {
            toShare() {
                this.copyTxt = this.detail.shortUrl;
                this.wxShare();
            }
            ,onCopy(){
                this.$message({
                    type: 'success',
                    message: '复制成功'
                })
            }
            ,getParam(){
                //以组件形式载入 (预览)
                if (this.param) {
                    this.form = {
                        id :this.param.id
                        ,type:1
                    };
                    return;
                }
                this.form.id = this.$route.query.id;
            }
            ,getData(){
                materialContent(this.form).then(res=>{
                    if(res.status == 1){
                        this.detail = res.data;
                        this.changePageTitle();
                        this.getWxConfig();
                    }
                })
            }
            ,changePageTitle(){
                document.title = this.detail.title;
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
        }
        , created() {
            this.getParam();
            this.getData();
        }
    }
</script>

<style lang="scss">


</style>
