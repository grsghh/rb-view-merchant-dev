<template>
  <div class="main-content">
    <el-row class="main-block main-ipt">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" label-width="120px" :inline="true">
            <el-form-item label="申请人昵称：" prop="applyMemberName">
              <el-input v-model="searchForm.applyMemberName" placeholder="申请人昵称"></el-input>
            </el-form-item>
            <el-form-item label="申请人手机号：" prop="applyMemberMobile">
              <el-input v-model="searchForm.applyMemberMobile" placeholder="申请人手机号"></el-input>
            </el-form-item>
            <el-form-item label="所属上级：" prop="agentId">
              <el-select
                v-model="searchForm.agentId"
                filterable
                clearable
                remote
                reserve-keyword
                placeholder="所属上级"
                :remote-method="remoteMethod"
                :loading="loading">
                <el-option
                  v-for="item in higherSelectList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请类型：" prop="type">
              <div class="">
                <el-select v-model="searchForm.type" filterable clearable placeholder="全部">
                  <el-option
                    v-for="item in applyType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="审核结果：" prop="auditState">
              <div class="">
                <el-select v-model="searchForm.auditState" filterable clearable placeholder="全部">
                  <el-option
                    v-for="item in applyResult"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="申请时间：" prop="applyStartTime">
              <el-date-picker
                v-model="searchForm.applyStartTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="开始时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="" prop="applyEndTime">
              <el-date-picker
                v-model="searchForm.applyEndTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getList(1)">查询</el-button>
              <el-button size="small" type="warning" @click="reset()">清空</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
    <el-row class="main-block">
      <el-card>
        <el-row class="mb25">
          <el-button v-if="$store.state.user.pageBtns.includes('export')" size="small" type="primary" @click="educe()">导出</el-button>
        </el-row>
        <el-table :data="List" style="width: 100%;"
                  border
                  v-loading="listLoading"
                  height="470"
        >
          <el-table-column align="center" label="申请人昵称"  width="120">
            <template slot-scope="scope">
              {{ scope.row.applyMemberName || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="申请人手机号"  width="130">
            <template slot-scope="scope">
              {{ scope.row.applyMemberMobile || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="总业绩">
            <template slot-scope="scope">
              {{ scope.row.accumulateSales || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="所属上级" width="140">
            <template slot-scope="scope">
              {{ scope.row.agentName || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="当前身份">
            <template slot-scope="scope">
              {{ scope.row.agentLevelName || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="申请类型">
            <template slot-scope="scope">
              <span v-if="scope.row.type == 1">普通代理</span>
              <span v-if="scope.row.type == 2">高级代理</span>
              <span v-if="scope.row.type == 3">联创代理</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="申请时间" width="155">
            <template slot-scope="scope">
              {{ scope.row.applyTime || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="审核状态">
            <template slot-scope="scope">
              <span style="color: #FFBA00" v-if="scope.row.auditState == 1">待审核</span>
              <span style="color: #02B74F" v-if="scope.row.auditState == 2">通过</span>
              <span style="color: #FF0000" v-if="scope.row.auditState == 3">驳回</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="注册时间" width="155">
            <template slot-scope="scope">
              {{ scope.row.registerTime || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="升级为普通代理时间" width="155">
            <template slot-scope="scope">
              {{scope.row.upgradeAgentTime || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="升级为高级代理时间" width="155">
            <template slot-scope="scope">
              {{ scope.row.upgradeAdvancedAgentTime || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="升级为联创代理时间" width="155">
            <template slot-scope="scope">
              {{ scope.row.upgradePartnerAgentTime || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="handleView(scope)"
              >查看
              </el-button>
              <template v-if="scope.row.auditState == 1">
                <el-button v-if="$store.state.user.pageBtns.includes('audit')" type="warning" size="mini" @click="handleEdit(scope)">
                  审核
                </el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize"
                    @pagination="getList"/>
      </el-card>
    </el-row>

    <!--    标签弹窗-->
    <el-dialog :visible.sync="dialogVisible" :title="visibleTitle" @close="dialogClose()">
      <table class="applytable" border="1px solid #ccc" style="width: 90%;border-spacing: 0;">
        <tr>
          <td>申请人昵称 : {{handDetail.applyMemberName || '-'}}</td>
          <td>申请人手机号 : {{handDetail.applyMemberMobile || '-'}}</td>
        </tr>
        <tr>
          <td>总业绩 : {{handDetail.accumulateSales || '-'}}</td>
          <td>所属上级 : {{handDetail.agentName || '-'}}</td>
        </tr>
        <tr>
          <td>当前身份 : {{handDetail.agentLevelName || '-'}}</td>
          <td>申请类型:
            <span v-if="handDetail.type == 1">普通代理</span>
            <span v-if="handDetail.type == 2">高级代理</span>
            <span v-if="handDetail.type == 3">联创代理</span>
          </td>
        </tr>
        <tr>
          <td>申请时间 : {{handDetail.applyTime || '-'}}</td>
          <td>审核状态 :
            <span style="color: #FFBA00" v-if="handDetail.auditState == 1">待审核</span>
            <span style="color: #02B74F" v-if="handDetail.auditState == 2">通过</span>
            <span style="color: #FF0000" v-if="handDetail.auditState == 3">驳回</span>
          </td>
        </tr>
        <tr>
          <td colspan="2">注册时间 : {{handDetail.registerTime || '-'}}</td>
        </tr>
        <tr>
          <td colspan="2">升级为普通代理时间 : {{handDetail.upgradeAgentTime || '-'}}</td>
        </tr>
        <tr>
          <td colspan="2">升级为高级代理时间 : {{handDetail.upgradeAdvancedAgentTime || '-'}}</td>
        </tr>
        <tr>
          <td colspan="2">升级为联创代理时间 : {{handDetail.upgradePartnerAgentTime || '-'}}</td>
        </tr>
      </table>
      <el-form class="audit" v-if="dialogVisible" :model="auditForm" inline label-width="">
        <div>
          <el-form-item label="申请资料：">
            <template v-if="handDetail.applyMaterialUrl">
              <el-image :src="handDetail.applyMaterialUrl" style="width: 100px;"></el-image>
            </template>
            <span v-else>-</span>
          </el-form-item>
        </div>
        <el-form-item label="审核意见：">
          <el-input type="textarea" style="width: 150%;" v-model="auditForm.opinion" maxlength="200" show-word-limit :disabled="visibleTitle == '查看'"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:right;" v-if="visibleTitle !== '查看'">
        <el-button type="primary" @click="passSure">
          通过
        </el-button>
        <el-button type="danger" @click="reject">
          驳回
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {allAgents,applyAgent,applyReject,applyPass} from '@/api/fansAnalysis'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'agentApply',
    components: { Pagination },
    data() {
      return {
        searchForm: {
          pageNo: 1,
          pageSize: 20,
          agentId: '',
          applyEndTime: "",
          applyStartTime: "",
          auditState: '',
          applyMemberMobile: "",
          applyMemberName: "",
          type: ''
        },
        //审核结果
        applyResult: [
          { id: 1, name: '待审核' },
          { id: 2, name: '通过' },
          { id: 3, name: '驳回' },
        ],
        //申请类型
        applyType: [
          { id: 1, name: '普通代理' },
          { id: 2, name: '高级代理' },
          { id: 3, name: '联创代理' },
        ],
        auditForm: {
          opinion:'',
          id:''
        },
        dialogVisible: false,
        visibleTitle:'',
        List: [],//列表
        listLoading: true,
        total: 0,
        highList:[],//所有所属上级列表
        higherSelectList:[],//筛选的所属上级列表
        loading: false,
        handDetail:{}//每条记录的详情
      }
    },
    created() {
      this.getList()
      this.getHighList()
    },
    methods: {
      getHighList(){
        allAgents('').then(res=>{
          let arr = []
          for(let i in res.data){
            arr.push({
              value:res.data[i].id,
              label:res.data[i].nickname
            })
          }
          this.highList = arr
        })
      },
      //检索所属上级列表
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.higherSelectList = this.highList.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.higherSelectList = [];
        }
      },
      // 清空
      reset() {
        this.searchForm = {
          pageNo: 1,
          pageSize: 20,
          agentId: '',
          applyEndTime: "",
          applyStartTime: "",
          auditState: '',
          applyMemberMobile: "",
          applyMemberName: "",
          type: ''
        }
        this.higherSelectList = []
      },
      //显示隐藏弹窗
      showOrHideDialog() {
        this.dialogVisible = !this.dialogVisible
      },
      //关闭弹框时
      dialogClose() {
        this.dialogVisible = false
      },
      //代理列表
      getList(num) {
        this.listLoading = true
        if(num == 1) this.searchForm.pageNo = num
        applyAgent(this.searchForm).then(res => {
          if (res.status == 1) {
            this.List = res.data.rows
            this.total = res.data.total
            setTimeout(() => {
              this.listLoading = false
            }, 500)
          }
        })
      },
      //查看
      handleView(scroe){
        this.showOrHideDialog()
        this.visibleTitle = '查看'
        this.setDetailData(scroe)
      },
      //审核
      handleEdit(scroe){
        this.showOrHideDialog()
        this.visibleTitle = '审核'
        this.setDetailData(scroe)
      },
      //查看/审核信息时赋值
      setDetailData(scroe){
        this.handDetail ={
          accumulateSales: scroe.row.accumulateSales,
          agentId: scroe.row.agentId,
          agentLevelId: scroe.row.agentLevelId,
          agentLevelName: scroe.row.agentLevelName,
          agentName: scroe.row.agentName,
          applyMaterial: scroe.row.applyMaterial,
          applyMaterialUrl: scroe.row.applyMaterialUrl,
          applyMemberId: scroe.row.applyMemberId,
          applyMemberName: scroe.row.applyMemberName,
          applyMemberMobile: scroe.row.applyMemberMobile,
          applyTime: scroe.row.applyTime,
          auditState: scroe.row.auditState,
          id:scroe.row.id,
          registerTime: scroe.row.registerTime,
          type: scroe.row.type,
          upgradeAdvancedAgentTime: scroe.row.upgradeAdvancedAgentTime,
          upgradeAgentTime:scroe.row.upgradeAgentTime,
          upgradePartnerAgentTime: scroe.row.upgradePartnerAgentTime
        }
        this.auditForm = {
          id:scroe.row.id,
          opinion:scroe.row.auditOpinion
        }
      },
      //提交
      passSure(){
        applyPass(this.auditForm).then(res=>{
          if(res.status == 1){
            this.$message({
              type:'success',
              message:'审核通过！'
            })
            this.getList()
            this.showOrHideDialog()
          }
        })
      },
      reject() {
        applyReject(this.auditForm).then(res=>{
          if(res.status == 1){
            this.$message({
              type:'success',
              message:'审核拒绝！'
            })
            this.getList()
            this.showOrHideDialog()
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
.applytable{
  border-color: #eee;
  margin-left: 30px;
  tr{
    td{
      padding: 15px;
    }
  }
}
  .audit{
    margin-left: 30px;
    margin-top: 30px;
  }
</style>
