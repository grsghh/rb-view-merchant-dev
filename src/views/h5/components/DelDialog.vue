<template>
  <div>
<!--    :visible.sync="dialogVisible"-->
    <el-dialog
      :visible.sync="theParams.visible"
      width="70%"
      class="noSelect myDelDialog"
      :before-close="handleClose">
      <span class="font30">您确认要删除该消息吗</span>
      <div class="confirmBox">
        <div class="myDiv font30 noSureDel" @click="noSureDel">取消</div>
        <div class="myDiv suerDel" @click="sureDel">确认</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "DelDialog",
        props: {
            theParams: {
                type: Object
            }
        },
        data() {
            return{

            }
        },
        methods: {
            handleClose() {
                this.$emit('dialogClose');
            },
            noSureDel() {
                this.$emit('dialogClose');
            },
            sureDel() {
                this.$emit('sureDel');
            }
        }
    }
</script>

<style scoped>
 .noSelect {
   -webkit-user-select: none;
   -ms-user-select: none;
   -moz-user-select: none;
   -khtml-user-select: none;
   user-select: none;
 }
</style>
