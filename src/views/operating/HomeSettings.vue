<template>
  <div class="main-content">
    <el-row class="main-block">
      <el-card class="box-card">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="轮播管理" name="first">
            <loop-manage></loop-manage>
          </el-tab-pane>
          <el-tab-pane label="推荐分类" name="second">
            <recommend-sort></recommend-sort>
          </el-tab-pane>
          <el-tab-pane label="橱窗推荐" name="third">
            <recommend-window></recommend-window>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-row>
  </div>

</template>

<script>
  import LoopManage from './components/LoopManage'
  import RecommendSort from './components/RecommendSort'
  import RecommendWindow from './components/RecommendWindow'
  export default {
    name: 'HomeSettings',
    components:{LoopManage, RecommendSort,RecommendWindow},
    data(){
      return{
        activeName:'first',
      }
    },
    mounted() {

    },
    methods:{
      //切换点击事件
      handleClick(){

      }
    }
  }
</script>

<style scoped>

</style>
