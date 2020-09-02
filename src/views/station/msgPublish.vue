<template>
  <div class="main-content">
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>发布消息</span>
        </div>
        <post-msg v-if="loaded" :props-data="propsData"></post-msg>
      </el-card>
    </el-row>
  </div>
</template>

<script>
  import PostMsg from "./components/PostMsg"
  export default {
    name: 'msgPublish',
    components:{
      PostMsg
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
