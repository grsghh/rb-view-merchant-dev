<template>
    <div>
      <el-dialog :visible.sync="params.detailDialog" title="明细列表" @close="params.detailDialog=false">
        <div class="queryContent">
          <div class="table">
            <el-table style="width: 100%;" :data="detailsList" border height="500px">
              <el-table-column align="center" label="姓名">
                <template slot-scope="scope">
                  {{ scope.row.nickname || '-'}}
                </template>
              </el-table-column>
              <el-table-column align="center" label="手机号">
                <template slot-scope="scope">
                  {{ scope.row.mobile || '-'}}
                </template>
              </el-table-column>
              <el-table-column align="center" label="会员身份">
                <template slot-scope="scope">
                  {{ scope.row.type == 1 ? '代理':'粉丝'}}
                </template>
              </el-table-column>
              <el-table-column align="center" label="加入时间" width="180">
                <template slot-scope="scope">
                  {{ scope.row.joinTime || '-'}}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import {receiveDetail} from '@/api/station'
  export default {
    name:'TheDetail',
    props:{
      params:{
        type:Object
      }
    },
    data(){
      return{
        detailsList:[]//明细列表
      }
    },
    methods:{
      getDetail(){
        let dataForm = {
          type : this.params.type,
          memberIds : this.params.memberIds
        }
        receiveDetail(dataForm).then(res=>{
          if(res.status == 1){
            this.detailsList = res.data
          }
        })
      }
    },
    mounted() {
      this.getDetail()
    }
  }
</script>

<style scoped>

</style>
