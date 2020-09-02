<template>
  <div class="contentBox">
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" label-width="120px" :inline="true">
            <el-form-item label="短信类型：" prop="smsTypeId">
              <el-select v-model="searchForm.smsTypeId" placeholder="请选择" clearable>
                <el-option
                  v-for="item in msgTypeList"
                  :key="item.entryKey"
                  :label="item.entryValue"
                  :value="item.entryKey">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接收手机：" prop="receiveMobile">
              <el-input class="myInput" v-model="searchForm.receiveMobile"></el-input>
            </el-form-item>
            <el-form-item label="发送时间：" prop="sendStartTime">
              <el-date-picker
                v-model="searchForm.sendStartTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择开始时间">
              </el-date-picker>
            </el-form-item>
            <span class="pcikerJoin">____</span>
            <el-form-item label="" prop="sendEndTime">
              <el-date-picker
                v-model="searchForm.sendEndTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择截止时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getMsgList(1)">查询</el-button>
              <el-button size="small" type="warning" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
    <div class="queryContent">
      <div class="top">
        <el-button
          v-if="$store.state.user.pageBtns.includes('batchDel')"
          type="danger"
          @click="delMutiRows"
        >批量删除
        </el-button>
      </div>
      <div class="table">
        <el-table :data="msgList" border style="width: 100%" v-loading="listLoading" height="470"
                  @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column align="center" label="接收手机号">
            <template slot-scope="scope">{{ scope.row.receiveMobile}}</template>
          </el-table-column>
          <el-table-column align="center" label="短信内容" width="320" style="cursor:pointer;">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                width="360"
                trigger="hover"
                :content="scope.row.smsContent">
                <p style="width: 300px;cursor:pointer;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" slot="reference">{{scope.row.smsContent}}</p>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" label="短信类型">
            <template slot-scope="scope">
              <span v-show="scope.row.smsTypeId == 1">交易物流</span>
              <span v-show="scope.row.smsTypeId == 2">通知消息</span>
              <span v-show="scope.row.smsTypeId == 3">优惠活动</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="发送状态">
            <template slot-scope="scope">
              <el-link type="danger" :underline="false" v-show="scope.row.isSenderSuccess === 0">失败</el-link>
              <el-link type="success" :underline="false" v-show="scope.row.isSenderSuccess === 1">成功</el-link>
            </template>
          </el-table-column>
          <el-table-column align="center" label="发送时间">
            <template slot-scope="scope">{{ scope.row.sendTime}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button
                v-if="$store.state.user.pageBtns.includes('del')"
                size="small"
                type="danger"
                @click="handleDelete(scope)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="searchForm.pageNo"
        :limit.sync="searchForm.pageSize"
        @pagination="getMsgList"
      />
    </div>
  </div>
</template>

<script>
  import {messageHistory,delHistory,delMutiHistory} from '@/api/msgRecord'
  import {dicts} from '@/api/system'
  import Pagination from '@/components/Pagination'

  export default {
    name: 'MsgRecord',
    components: {Pagination},
    data() {
      return {
        msgList: [],
        dialogVisible: false,
        searchForm: {
          pageNo: 1
          , pageSize: 20
          ,receiveMobile: ''
          ,sendEndTime: ''
          ,sendStartTime: ''
          ,smsTypeId:''
        },
        listLoading: false,
        total: 0,
        multipleSelection: [],
        detailInfo:{
          detailId:''
          ,receiveShow:false
        }
        ,msgTypeList:[]
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //显示新增 修改 查看 的隐藏弹窗
      showOrHideDialog() {
        this.dialogVisible = !this.dialogVisible;
      },
      //查看标签
      handleView(score) {
        //查看非物流详情
        if(score.row.messageType !== 1){
          this.detailInfo.detailId = score.row.id;
          this.showOrHideDialog();
        }else{
          this.$router.push(`/order/orderDetail?id=${score.row.targetId}`)
        }
      },
      // 获取消息列表
      getMsgList(num) {
        if (num === 1) {
          this.searchForm.pageNo = 1;
        }
        this.listLoading = true;
        messageHistory(this.searchForm).then(res => {
          this.msgList = res.data.rows;
          this.total = res.data.total;
          setTimeout(() => {
            this.listLoading = false
          }, 500)
        })
      },
      //删除
      handleDelete(score) {
        this.$confirm('确定要删除该短信吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            await delHistory({id:score.row.id}).then(res => {
              if (res.status === 1) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getMsgList();
              }
            })
          })
          .catch(err => {
            console.error(err)
          })
      },
      //批量删除
      delMutiRows() {
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'error',
            message: '至少选择一条消息'
          })
          return;
        }
        this.$confirm('确定要删除该短信吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            const ids = this.multipleSelection.map(item => item.id);
            await delMutiHistory(ids).then(res => {
              if (res.status === 1) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getMsgList(1);
              }
            })
          })
          .catch(err => {
            console.error(err)
          })
      }
      ,async getMsgType(){
        await dicts('100016').then(res=>{
          if(res.status === 1){
            this.msgTypeList = res.data;
          }
        })
      }
      ,reset(){
        this.searchForm.isRead = '';
        this.$refs.searchForm.resetFields()
      }
    },
    created() {
      this.getMsgType();
      this.getMsgList();
    }
  }
</script>

<style>
  .main-block .myInput .el-input__inner {
    width: 100%;
  }
</style>
