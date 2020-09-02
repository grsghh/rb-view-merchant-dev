<template>
  <div class="msgServe">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="交易物流" name="first">
          <msg-serve-component :params="params" v-if="activeName == 'first'"></msg-serve-component>
      </el-tab-pane>
      <el-tab-pane label="代理通知" name="second">
        <msg-serve-component :params="agentParams" v-if="activeName == 'second'"></msg-serve-component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
    import MsgServeComponent from './components/MsgServeComponent'
    export default {
        name: "MsgServe",
        components: { MsgServeComponent },
        data() {
            return {
                activeName: 'first',
                params: {
                    id: 1
                },
                agentParams: {
                    id: 2
                }
            }
        },
        methods: {
            handleClick(tab, event) {
                switch (this.activeName) {
                    case 'first':
                        // this.getList();
                        break;
                    case 'second':
                        // this.getLogistics();
                        // this.getMyLogistics();
                        break;
                }
            }
        }
    }
</script>

<style scoped>
.msgServe {
  margin: 20px;
  padding: 20px;
  background-color: #fff;
}
</style>
