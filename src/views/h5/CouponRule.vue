<template>
    <div style="padding: 0 20px">
      <article v-html="content"></article>
    </div>
</template>

<script>
  import { CouponsRule } from '@/api/coupons'
  export default {
    name:'CouponRule',
    data(){
      return{
        content:''
      }
    },
    methods:{
      //获取优惠券使用说明
      getCouponsContent(){
        CouponsRule({id:1}).then(res=>{
          this.content = res.data.content
        })
      }
    },
    mounted() {
      document.title = '优惠券规则说明'
      this.getCouponsContent()
    }
  }
</script>

<style scoped>

</style>
