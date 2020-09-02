<template>
  <el-dialog :visible.sync="defineData.defineDialog" title="自定义选择接收人" width="70%" @close="defineData.defineDialog = false">
    <el-row class="main-block person">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" label-width="80px" :inline="true">
            <div>
              <el-form-item class="proTag" label="会员身份">
                <el-radio-group v-model="searchForm.type" size="" @change="changeMember">
                  <el-radio-button label="1">代理</el-radio-button>
                  <el-radio-button label="2">粉丝</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>
            <el-form-item label="姓名" prop="nickname">
              <el-input class="myInput" v-model="searchForm.nickname" placeholder="姓名" clearable></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input class="myInput" v-model="searchForm.mobile" placeholder="手机号" clearable></el-input>
            </el-form-item>
            <el-form-item label="所属上级" prop="agentName">
              <el-input class="myInput" v-model="searchForm.agentName" placeholder="所属上级" clearable></el-input>
            </el-form-item>
            <el-form-item label="代理身份" prop="agentLevelId" v-if="searchForm.type==1">
              <el-select class="select" v-model="searchForm.agentLevelId" clearable placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in AgentLevels"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <div class="flexBox" v-if="searchForm.type==2">
              <el-form-item class="proTag" label="粉丝标签">
                <el-radio-group v-model="searchForm.memberTagId" size="" >
                  <el-radio-button label="" >不限</el-radio-button>
                  <el-radio-button  v-for="item in fansTags" :key="item.id" :label="item.id">{{item.name}}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="flexBox" v-if="searchForm.type==1">
              <el-form-item class="proTag" label="代理标签">
                <el-radio-group v-model="searchForm.memberTagId" size="" >
                  <el-radio-button label="" >不限</el-radio-button>
                  <el-radio-button  v-for="item in agentTags" :key="item.id" :label="item.id">{{item.name}}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-form>
          <div style="text-align:right;margin-right: 200px;">
            <el-button size="small" type="primary" @click="getMembers(1)">查询</el-button>
            <el-button size="small" type="warning" @click="reset()">重置</el-button>
          </div>
        </div>
      </el-card>
    </el-row>
    <div class="queryContent">
      <div class="table">
        <el-table style="width: 100%;" max-height="400" :data="defineList" border @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
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
          <el-table-column align="center" label="所属上级">
            <template slot-scope="scope">
              {{ scope.row.agentName || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="累计收益" v-if="searchForm.type==1">
            <template slot-scope="scope">
              {{ scope.row.accumulateEarnings || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="累计销量">
            <template slot-scope="scope">
              {{ scope.row.accumulateSales || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="下级代理" v-if="searchForm.type==1">
            <template slot-scope="scope">
              {{ scope.row.subAgentNum}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="下级粉丝" v-if="searchForm.type==1">
            <template slot-scope="scope">
              {{ scope.row.fansNum}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="加入时间" width="180">
            <template slot-scope="scope">
              {{ scope.row.createTime || '-'}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="searchForm.pageNo"
        :limit.sync="searchForm.pageSize"
        @pagination="getMembers"
      />
    </div>
    <div style="text-align:right;margin-top: 20px;">
      <el-button type="primary" @click="defineSure">确定</el-button>
      <el-button type="danger" @click="defineData.defineDialog = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getAllTags, getAllLevels } from '@/api/agentAnalysis'
  import { members } from '@/api/agentlabel'
  import { getAllFansTags } from '@/api/fansAnalysis'
  import Pagination from '@/components/Pagination'
  export default {
    name:'DefinePerson',
    props:{
      defineData:{
        type:Object
      }
    },
    components:{
      Pagination
    },
    data(){
      return{
        searchForm:{
          pageNo: 1
          , pageSize: 20,
          agentLevelId: '',
          agentName: "",
          memberTagId: '',
          mobile: "",
          nickname: "",
          type: '1'
        },
        AgentLevels:[],//代理身份
        agentTags:[],//代理标签
        fansTags:[],//粉丝标签
        defineList:[],//自定义选择列表
        total:0,
        listLoading:false,
        multipleSelection:[],//列表选择集合
        selectIds:[]//选择的id集合
      }
    },
    methods:{
      //重置
      reset(){
        this.searchForm = {
          agentLevelId: '',
          agentName: "",
          memberTagId: '',
          mobile: "",
          nickname: "",
          type: '1'
        }
      },
      //确定
      defineSure(){
        if(!this.multipleSelection.length){
          this.$message.warning('至少选择一条记录')
          return
        }
        let arr = []
        for(let i in this.multipleSelection){
          arr.push(this.multipleSelection[i].id)
        }
        this.selectIds = arr
        this.defineData.defineDialog = false
        this.$emit('defineComfirm',this.selectIds)
      },
      //列表点击选择
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 获取所有代理标签
      getAgentTags() {
        getAllTags().then(res => {
          if(res.status == 1) {
            this.agentTags = res.data;
          }
        })
      },
      // 获取所有代理身份
      getAgentLevels() {
        getAllLevels().then(res => {
          if(res.status == 1) {
            this.AgentLevels = res.data;
          }
        })
      },
      // 获取所有粉丝标签
      getFansTags() {
        getAllFansTags().then(res => {
          if(res.status == 1) {
            this.fansTags = res.data;
          }
        })
      },
      //会员列表
      getMembers(num){
        if (num === 1) {
          this.searchForm.pageNo = 1;
        }
        this.listLoading = true;
        members(this.searchForm).then(res=>{
          if(res.status == 1){
            this.defineList = res.data.rows
            this.total = res.data.total
            setTimeout(() => {
              this.listLoading = false
            }, 500)
          }
        })
      },
      //选择会员身份
      changeMember(){
        this.searchForm.agentLevelId = ''
        this.searchForm.agentName = ""
        this.searchForm.memberTagId = ''
        this.searchForm.mobile = ""
        this.searchForm.nickname = ""
        this.getMembers()
      }
    },
    mounted() {
      this.getAgentLevels()
      this.getAgentTags()
      this.getFansTags()
      this.getMembers()
    }
  }
</script>

<style lang="scss" scoped>
  .person{
    .el-card.is-always-shadow{
      box-shadow:none;
    }
  }
</style>
