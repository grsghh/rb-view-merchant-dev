<template>
  <div class="msgList">
    <message-component :params="params"></message-component>
  </div>
</template>

<script>
    import MessageComponent from './components/MessageComponent'
    export default {
        name: "msgList",
        components: { MessageComponent },
        data() {
            return {
                id: this.$route.query.id,
                params: {
                    id: this.$route.query.id,
                    messageType: this.$route.query.id
                }
            }
        },
    }
</script>

<style scoped lang="scss">
  .msgList {
    position: relative;
    height: 100%;
    background-color: #F0F0F0;
  }
  .noSelect {
    -webkit-user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    user-select: none;
  }
</style>
