<template>
  <div class="main-content">
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" :inline="true">
            <el-form-item label="日志类型：" prop="type">
              <el-select class="select" popper-class="longSelect" v-model="searchForm.type" clearable
                         filterable placeholder="请选择日志类型">
                <el-option
                  v-for="item in logTypeList"
                  :key="item.id"
                  :label="item.entryValue"
                  :value="item.entryKey"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="操作人：" prop="username">
              <el-input v-model="searchForm.username" clearable placeholder="请输入操作人"></el-input>
            </el-form-item>
            <el-form-item label="操作时间："  prop="operateStartTime">
              <el-date-picker
                v-model="searchForm.operateStartTime"
                type="datetime"
                clearable
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择开始时间">
              </el-date-picker>
            </el-form-item>
            <span class="pcikerJoin">____</span>
            <el-form-item label="" prop="operateEndTime">
              <el-date-picker
                v-model="searchForm.operateEndTime"
                type="datetime"
                clearable
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择截止时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getLogs(1)">查询</el-button>
              <el-button size="small" type="warning" @click="$refs.searchForm.resetFields()">清空</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
    <el-row class="main-block">
      <el-card>
        <el-table :data="logList" style="width: 100%;"
                  border
                  v-loading="listLoading"
        >
          <el-table-column align="center" label="日志类型" width="150">
            <template slot-scope="scope">
              {{ scope.row.typeName}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作人" :width="$settings.dateWidth">
            <template slot-scope="scope">
              {{ scope.row.username }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作时间" :width="$settings.dateWidth">
            <template slot-scope="scope">
              {{ scope.row.operateTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="描述">
            <template slot-scope="scope">
              {{ scope.row.memo }}
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize"
                    @pagination="getLogs"/>
      </el-card>
    </el-row>
  </div>
</template>

<script>
    import {apisLogs} from '@/api/operationLogs'
    import {dicts} from '@/api/system'
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination
    export default {
        name: 'OperationLogs',
        components: {Pagination}
        , data() {
            return {
                searchForm: {
                    pageNo: 1
                    , pageSize: 20
                    , operateStartTime: ''
                    , operateEndTime: ''
                    , type: ''
                    , username: ''
                }
                , total: 0
                , listLoading: true
                ,logTypeList:[]
                ,logList:[]
            }
        }
        , mounted() {
            this.getLogTypeList();
            this.getLogs();
        }
        , methods: {
            //获取操作日志
            getLogs(num) {
                if (num == 1) {
                    this.searchForm.pageNo = 1;
                }
                this.listLoading = true;
                apisLogs(this.searchForm).then(res => {
                    if (res.status == 1) {
                        this.logList = res.data.rows;
                        this.total = res.data.total;
                        setTimeout(() => {
                            this.listLoading = false
                        }, 500)
                    }
                })
            }
            //获取日志类型字典
            ,getLogTypeList(){
                dicts('100019').then(res =>{
                    if(res.status === 1){
                        this.logTypeList = res.data;
                    }
                  }
                )
            }
        }
        ,filters:{
            logType(type){
                switch (type) {
                    case 1:
                        return '登录';
                    case 2:
                        return '设置代理分佣';
                    case 3:
                        return '商品管理';
                    case 4:
                        return '代理接单奖励发放';
                    case 5:
                        return '审核代理升级';
                    case 6:
                        return '粉丝升级代理';
                    case 7:
                        return '粉丝更换代理';
                    case 8:
                        return '收益提现审核';
                    case 9:
                        return '微信提现';
                }
            }
        }
    }
</script>

<style scoped>

</style>
