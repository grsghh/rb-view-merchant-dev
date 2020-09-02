<template>
  <el-table :data="lists" style="width: 100%;"
            border
  >
    <el-table-column align="center" label="冻结金额" :width="$settings.dateWidth">
      <template slot-scope="scope">
        {{ scope.row.earnings }}
      </template>
    </el-table-column>
    <el-table-column align="center" label="时间" :width="$settings.dateWidth">
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
        name: "EarnFreeze"
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
