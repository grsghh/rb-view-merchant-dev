<template>
</template>

<script>
    import axios from 'axios';
    import wx from 'weixin-js-sdk'
    export default {
        name: "h5Redirect"
        ,created() {
            let _this = this;
            if(_this.$route.query.token){
                //取token
                axios.defaults.headers.common['Authorization'] = _this.$route.query.token.length === 2
                    ? _this.$route.query.token[0] : _this.$route.query.token;
            }
            this.isWexin();
            //如果能取到跳转路径,则跳转至指定页面
            if(_this.$route.query.path){
                _this.$router.replace({
                    path:_this.$route.query.path
                    ,query:_this.$route.query
                });
            }
        }
        ,methods:{
            isWexin(){
                // let ua = navigator.userAgent.toLowerCase();
                // if(ua.match(/MicroMessenger/i)=="micromessenger") {
                //     //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
                // }
                wx.miniProgram.getEnv((res)=>{
                    this.$miniState.isMini = !!res.miniprogram;
                })
            }
            ,isAndroid(){
                let u = navigator.userAgent;
                if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){
                    return 1;
                }
                return 0;
            }
        }
    }
</script>

<style scoped>

</style>
