<template>
  <div class="development">
    <div class="deve">
      <h2 class="font">正在开发中，敬请期待！</h2>
      <p class="en_font">This page is under development, stay tuned!</p>
    </div>
    <div class="step">
      <el-progress :show-text="showText" :percentage="50" status="exception"></el-progress>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data(){
      return{
        showText:false
      }
    }
  }
</script>

<style scoped>
  .development{
    height: 85vh;
    margin:30px;
    border-radius: 4px;
    background:rgba(0,0,0,0.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.3);
    background-image:linear-gradient(0deg,#ddd 1px, transparent 0),
    linear-gradient(90deg,#ddd 1px, transparent 0);
    background-size:30px 30px;
  }
  .deve{
    padding-top: 15%;
    text-align: center;
    line-height: 30px;
  }
  .font{
    font-size: 24px;
    font-weight: 500;
  }
  .en_font{
    font-size: 17px;
  }
  .step{
    width: 20%;
    margin: 0 auto;
    margin-top: 30px;
  }
</style>
