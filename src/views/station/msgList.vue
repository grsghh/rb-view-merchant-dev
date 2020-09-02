<template>
  <div class="contentBox">
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" label-width="120px" :inline="true">
            <el-form-item label="消息类型：" prop="messageType">
              <el-select v-model="searchForm.messageType" placeholder="请选择" clearable>
                <el-option
                  v-for="item in msgTypeList"
                  :key="item.entryKey"
                  :label="item.entryValue"
                  :value="item.entryKey">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态：" prop="name">
              <el-radio-group v-model="searchForm.isRead">
                <el-radio :label="0">未读</el-radio>
                <el-radio :label="1">已读</el-radio>
              </el-radio-group>
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
            <br>
            <el-form-item label="接收人：" prop="receiveMemberName">
              <el-input class="myInput" v-model="searchForm.receiveMemberName"></el-input>
            </el-form-item>
            <el-form-item label="标题：" prop="title">
              <el-input class="myInput" v-model="searchForm.title"></el-input>
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
        <!--        <el-button-->
        <!--          type="primary"-->
        <!--          @click="addDialog"-->
        <!--        >批量删除</el-button>-->
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
          <el-table-column align="center" label="发送人">
            <template slot-scope="scope">{{ scope.row.senderName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="接收人">
            <template slot-scope="scope">{{ scope.row.receiveMemberName}}</template>
          </el-table-column>
          <el-table-column align="center" label="类型">
            <template slot-scope="scope">{{ scope.row.messageTypeName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="标题">
            <template slot-scope="scope">{{ scope.row.title || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="发送时间">
            <template slot-scope="scope">{{ scope.row.createTime}}</template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <el-link type="danger" :underline="false" v-show="scope.row.isRead === 0">未读</el-link>
              <el-link type="success" :underline="false" v-show="scope.row.isRead === 1">已读</el-link>
            </template>
          </el-table-column>
          <el-table-column align="center" label="阅读时间">
            <template slot-scope="scope">{{ scope.row.readTime || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" :width="$settings.dateWidth" fixed="right">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="handleView(scope)">详情</el-button>
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
    <el-dialog
      title="详情"
      destroy-on-close
      :visible.sync="dialogVisible"
    >
      <msg-detail
        v-if="dialogVisible"
        :props-data="detailInfo"
      ></msg-detail>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import {apisMsgList,apisDelMsg,apisDelMulitMsg} from '@/api/station'
    import {dicts} from '@/api/system'
    import MsgDetail from '@/views/station/components/PostMsg'
    import Pagination from '@/components/Pagination'

    export default {
        name: 'msgList',
        components: {Pagination,MsgDetail},
        data() {
            return {
                msgList: [],
                dialogVisible: false,
                searchForm: {
                    pageNo: 1
                    , pageSize: 20,
                    isRead: ''
                    ,messageType: ''
                    ,receiveMemberName: ''
                    ,sendEndTime: ''
                    ,sendStartTime: ''
                    ,title: ''
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
                apisMsgList(this.searchForm).then(res => {
                    this.msgList = res.data.rows;
                    this.total = res.data.total;
                    setTimeout(() => {
                        this.listLoading = false
                    }, 500)
                })
            },
            //删除角色
            handleDelete(score) {
                this.$confirm('确定要删除该消息吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        await apisDelMsg({id:score.row.id}).then(res => {
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
                this.$confirm('确定要删除该消息吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        const ids = this.multipleSelection.map(item => item.id);
                        await apisDelMulitMsg(ids).then(res => {
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
