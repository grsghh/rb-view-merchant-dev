<template>
      <span class="state"
            :class="{'base-red':stateData.orderState === 1
            ,'base-blue':stateData.orderState === 3
            ,'base-org':stateData.orderState === 2 || stateData.orderState === 10
            ,'base-gray':stateData.orderState === 0 || stateData.orderState === 5 || stateData.orderState === 7
            ,'base-green':stateData.orderState === 4 || stateData.orderState === 8
            }"
      >
        {{stateData.orderState | getStateName}}
      </span>
</template>

<script>
    export default {
        name: "OrderStateTag"
        ,props:{
            stateData:{
                require:true
                ,type:Object
            }
        }
    }
</script>

<style scoped>
  .state{clear: both;text-align: center;}
</style>
