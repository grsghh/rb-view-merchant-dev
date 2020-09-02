<template>
  <div class="main-content">
    <el-row class="main-block">
      <el-card class="box-card">
        <send-message v-if="loaded" :props-data="propsData"></send-message>
      </el-card>
    </el-row>
  </div>
</template>

<script>
  import SendMessage from "./components/SendMessage"
  export default {
    name: 'msgMarket',
    components:{
      SendMessage
    },
    data(){
      return{
        propsData:{
          receiveIds:[],
          receiveShow:true,
          detailId:''
        },
        loaded:false
      }
    },
    mounted() {
      if(sessionStorage.msgData){
        let msgData = JSON.parse(sessionStorage.msgData)
        this.propsData.receiveIds = msgData.receiveIds
        this.propsData.receiveShow = msgData.receiveShow
      }
      sessionStorage.removeItem('msgData')
      if(this.$router.query){
        this.propsData.detailId = this.$route.query.detailId
      }
      this.loaded = true
    }
  }
</script>

<style scoped>

</style>
