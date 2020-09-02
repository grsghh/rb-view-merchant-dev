<template>
  <el-table :data="lists" style="width: 100%;"
            border
  >
    <el-table-column align="center" label="下单粉丝账号":width="$settings.dateWidth">
      <template slot-scope="scope">
        {{ scope.row.orderFansNickname }}
      </template>
    </el-table-column>
    <el-table-column align="center" label="订单编号" :width="$settings.dateWidth">
      <template slot-scope="scope">
        {{ scope.row.orderNO }}
      </template>
    </el-table-column>
    <el-table-column align="center" label="收益额" width="180">
      <template slot-scope="scope">
        {{ scope.row.earnings }}
      </template>
    </el-table-column>
    <el-table-column align="center" label="收益时间" :width="$settings.dateWidth">
      <template slot-scope="scope">
        {{ scope.row.earningsTime }}
      </template>
    </el-table-column>
    <el-table-column align="center" label="描述">
      <template slot-scope="scope">
        {{ scope.row.memo }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
    export default {
        name: "EarnCanGet"
        ,props:{
            lists:{
                type:Array
            }
        }
        ,data(){
            return {
            }
        }
    }
</script>

<style scoped>

</style>
