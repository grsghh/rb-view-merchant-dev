<template>
  <view class="building">
    <view class="building-main">
      <img :src="img">
      <text>{{textFont || '开发中……'}}</text>
    </view>
  </view>
</template>

<script>
    export default {
        props:['textFont'],
        name: "building"
        ,data(){
            return {
                img:require('../../assets/imgs/building.png')
            }
        }
    }
</script>

<style scoped>
  .building{}
  .building .building-main{display: flex;flex-direction: column;align-items: center;}
  .building img{width: 101px;margin: 200px auto (72px/2);}
  .building text{color:#8C8C8C;font-size: 14px;}

</style>
