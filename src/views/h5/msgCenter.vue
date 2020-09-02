<template>
  <div class="theMsgCenter">
    <message-component :params="params"></message-component>
  </div>
</template>

<script>
    import MessageComponent from './components/MessageComponent'
    export default {
        name: "msgCenter",
        components: { MessageComponent },
        data() {
            return {
                params: {

                }
            }
        }
    }
</script>

<style scoped lang="scss">
  .theMsgCenter {
    position: relative;
    height: 100%;
    background-color: #F0F0F0;
    /*overflow: hidden;*/
  }
  .noSelect {
    -webkit-user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    user-select: none;
  }
</style>
