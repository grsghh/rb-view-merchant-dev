<template>
  <div class="contentBox">
    <el-row class="main-block">
      <el-card class="box-card">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="查询条件" name="1">
            <div class="main-block">
              <el-form ref="searchForm" :model="searchForm" label-width="80px" :inline="true">
                <div>
                  <el-form-item label="粉丝名称" prop="nickname">
                    <el-input class="myInput" v-model="searchForm.nickname" placeholder="粉丝名称" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="手机号" prop="mobile">
                    <el-input class="myInput" v-model="searchForm.mobile" placeholder="手机号" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="所属代理" prop="agentId">
                    <el-select class="select" v-model="searchForm.agentId" clearable placeholder="请选择" filterable clearable>
                      <el-option
                        filterable
                        v-for="item in agentList"
                        :label="item.nickname"
                        :value="item.id"
                        :key="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-button size="small" type="primary" @click="getFansList(1)">查询</el-button>
                  <el-button size="small" type="warning" @click="reset()">重置</el-button>
                </div>
                <div>
                  <el-form-item class="proTag" label="最近消费">
                    <el-radio-group v-model="time" size="" @change="timeInterval()">
                      <el-radio-button label="" >不限</el-radio-button>
                      <el-radio-button label="1" >1周</el-radio-button>
                      <el-radio-button label="2" >2周</el-radio-button>
                      <el-radio-button label="3" >1个月内</el-radio-button>
                      <el-radio-button label="4" >1个月前</el-radio-button>
                      <el-radio-button label="5" >2个月前</el-radio-button>
                      <el-radio-button label="6" >3个月前</el-radio-button>
                      <el-radio-button label="7" >6个月前</el-radio-button>
                      <span class="defined" @click="defined('visibleTime')">自定义</span>
                    </el-radio-group>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item class="proTag" label="购买次数">
                    <el-radio-group v-model="searchForm.buyNum" @change="radioChange()" size="" >
                      <el-radio-button label="" >不限</el-radio-button>
                      <el-radio-button label="0次" >0次</el-radio-button>
                      <el-radio-button label="5次+" >5次+</el-radio-button>
                      <el-radio-button label="10次+" >10次+</el-radio-button>
                      <el-radio-button label="20次+" >20次+</el-radio-button>
                      <el-radio-button label="40次+" >40次+</el-radio-button>
                    </el-radio-group>
                    <span class="defined" @click="defined('showCount')">自定义</span>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item class="proTag" label="商品类目">
                    <el-radio-group v-model="searchForm.lastBuyProductCategoryId" size="" >
                      <el-radio-button label="" >不限</el-radio-button>
                      <el-radio-button  v-for="item in productList" :key="item.id" :label="item.id">{{item.name}}</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item class="proTag" label="消费金额">
                    <el-radio-group v-model="searchForm.memberSelfCost">
                      <el-radio-button label="" >不限</el-radio-button>
                      <el-radio-button label="0-100" >0-100</el-radio-button>
                      <el-radio-button label="100-500" >100-500</el-radio-button>
                      <el-radio-button label="500-1000" >500-1000</el-radio-button>
                      <el-radio-button label="1000+" >1000+</el-radio-button>
                    </el-radio-group>
                    <span class="defined" @click="defined('showMoneyCount')">自定义</span>
                  </el-form-item>
                </div>
                <div class="flexBox">
                  <el-form-item class="proTag" label="会员标签">
                    <el-radio-group v-model="searchForm.fansTagId" size="" >
                      <el-radio-button label="" >不限</el-radio-button>
                      <el-radio-button  v-for="item in fansTags" :key="item.id" :label="item.id">{{item.name}}</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </el-row>
    <div class="queryContent">
      <div class="top">
        <el-button
          type="primary"
          @click="batchAddTag()"
        >批量添加标签</el-button>
<!--        <el-button-->
<!--          type="primary"-->
<!--          @click="hint()"-->
<!--        >发放优惠券</el-button>-->
        <el-button
          type="primary"
          @click="sendMultiMsg"
        >群发消息</el-button>
        <el-button
          type="primary"
          @click="sendMultiMsg(1)"
        >群发短信</el-button>
      </div>
      <div class="table">
        <el-table
          :data="fansListData"
          border style="width: 100%"
          v-loading="listLoading"
          height="470"
          @sort-change="sortChange"
          @selection-change="handleSelectionChange">
          <el-table-column
            fixed
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column align="center" label="粉丝名称" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.nickname || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="手机号" width="120px">
            <template slot-scope="scope">{{ scope.row.mobile || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="所属代理" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.agentName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="会员标签" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.fansTagsName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="累计消费" width="120px" prop="member_self_cost" sortable="custom">
            <template slot-scope="scope">{{ scope.row.memberSelfCost || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="消费次数" width="120px" prop="buy_num" sortable="custom">
            <template slot-scope="scope">{{ scope.row.buyNum}}</template>
          </el-table-column>
          <el-table-column align="center" label="最近消费时间" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.lastBuyTime || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="购买商品分类" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.lastBuyProductCategoryNames || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="加入时间" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.createTime || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="所在区域" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.region || '-'}}</template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="searchForm.pageNo"
        :limit.sync="searchForm.pageSize"
        :page-sizes="[20, 50, 100, 200]"
        @pagination="getFansList"
      />
    </div>
    <!-- 自定义时间的弹框 -->
    <el-dialog :visible.sync="visibleTime" :title="dialogTitle" width="34%" @click="closeTimeDialog">
      <el-form v-if="visibleTime" :model="searchForm" inline>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.lastBuyStartTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始日期">
          </el-date-picker>
          <span>--</span>
          <el-date-picker
            v-model="searchForm.lastBuyEndTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="visibleTime = false;time = 0; getFansList()">确定</el-button>
          <el-button size="small" type="warning" @click="closeTimeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 自定义数量的弹框 -->
    <el-dialog :visible.sync="showCount" :title="dialogTitle" width="34%" @click="closeShowCount">
      <el-form v-if="showCount" :model="searchForm" inline>
        <el-form-item>
          <el-input class="myInput" v-model="minBuyNum" placeholder="最小" clearable></el-input>
        </el-form-item>
        <el-form-item>
          --
        </el-form-item>
        <el-form-item>
          <el-input class="myInput" v-model="maxBuyNum" placeholder="最大" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="setCusParam(1)">确定</el-button>
          <el-button size="small" type="warning" @click="closeShowCount">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 自定义金额的弹框 -->
    <el-dialog :visible.sync="showMoneyCount" :title="dialogTitle" width="34%" @click="closeShowCount">
      <el-form v-if="showMoneyCount" :model="searchForm" inline>
        <el-form-item>
          <el-input class="myInput" v-model="minMoney" placeholder="最小" clearable></el-input>
        </el-form-item>
        <el-form-item>
          --
        </el-form-item>
        <el-form-item>
          <el-input class="myInput" v-model="maxMoney" placeholder="最大" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="setCusParam(0)">确定</el-button>
          <el-button size="small" type="warning" @click="closeShowCount">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 标签的弹框 -->
    <el-dialog :visible.sync="dialogVisible" title="批量添加标签" @close="dialogClose()" width="50%">
      <el-form v-if="dialogVisible" :model="tagForm" label-width="100px">
        <el-form-item label="" label-width="35px">
          <el-checkbox-group v-model="tagForm.tagIds">
            <el-checkbox class="checkboxItem" name="tagIds" v-for="item in fansTags" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
        <el-button type="danger" @click="dialogVisible = false;">
          取消
        </el-button>
      </div>
    </el-dialog>
    <!-- 开发中的提示弹框 -->
    <el-dialog :visible.sync="dialogDev" :title="dialogTitle" @close="closeDialogDev" width="50%" height="100" style="overflow: hidden;">
      <development></development>
    </el-dialog>
  </div>
</template>

<script>
    import development from "@/components/development/index"
    import { getAllFansTags, getProductList,fansList ,mutiAddTags,allAgents} from '@/api/fansAnalysis'
    import Pagination from '@/components/Pagination'
    import {FormatTime} from '@/utils/index'
    export default {
        name: 'analysis',
        components: { Pagination, development },
        data() {
            return {
                searchForm: {
                    pageNo: 1,
                    pageSize:20,
                    agentId: '',
                    buyNum: '',
                    fansTagId: '',
                    lastBuyEndTime: '',
                    lastBuyProductCategoryId:'',
                    lastBuyStartTime: '',
                    memberSelfCost:'',
                    mobile: '',
                    nickname: '',
                    orderRule: '',
                } ,
                activeNames:['1'],
                agentList:[],
                dialogTitle: '',
                showCount: false,
                showMoneyCount: false,
                visibleTime:false,
                tag:'',
                time:'',
                minMoney: '',
                maxMoney: '',
                minBuyNum: '',
                maxBuyNum: '',
                productCategoryList: [],//分类列表
                fansListData: [],
                selectedId:[],//分类选中的id
                dialogVisible: false,
                tagForm:{
                    tagIds:[]
                    ,
                    fansIds:[]
                },
                listLoading: false,
                total: 0,
                multipleSelection:[],
                tagList: [],
                dialogDev: false, // 发放优惠券,群发短信
                options: [] ,// 所属代理列表
                fansTags: [],
                productList: [] // 一级商品分类列表
            }
        },
        methods: {
            //排序
            sortChange(column,prop,order){
                if(column.order == 'ascending'){
                    column.order ='asc'
                }else{
                    column.order ='desc'
                }
                this.searchForm.orderRule = `${column.prop} ${column.order}`
                this.getFansList()
            },
            //设置自定义筛选条件
            setCusParam(index){
                if(index == 0) this.searchForm.memberSelfCost = `${this.minMoney}-${this.maxMoney}`;
                if(index == 1) this.searchForm.buyNum = `${this.minBuyNum}-${this.maxBuyNum}`;
                this.visibleTime = this.showCount = this.showMoneyCount = false;
                this.getFansList();
            },
            //选择时间
            timeInterval(){
                this.countDate(this.time)
            },
            //计算日期
            countDate(t){
                let date = new Date().getTime();
                let sTime = "";
                let eTime = "";
                switch (t) {
                    case '1':
                        sTime = date  - 7 * 24 * 60 * 60 * 1000;
                        eTime = date;
                        break;
                    case '2':
                        sTime = date - 14 * 24 * 60 * 60 * 1000;
                        eTime = date;
                        break;
                    case '3':
                        let year = new Date().getFullYear()
                        let monthFirst = new Date().getMonth()+1
                        sTime = new Date(year + "-" + monthFirst + "-01").getTime();
                        eTime = date;
                        break;
                    case '4':
                        sTime = '';
                        eTime = date - 30 * 24 * 60 * 60 * 1000;
                        break;
                    case '5':
                        sTime = '';
                        eTime = date - 60 * 24 * 60 * 60 * 1000;
                        break;
                    case '6':
                        sTime = '';
                        eTime = date - 365/4 * 24 * 60 * 60 * 1000;
                        break;
                    case '7':
                        sTime = '';
                        eTime = date - 365/2 * 24 * 60 * 60 * 1000;
                        break;
                }
                this.searchForm.lastBuyStartTime = sTime == '' ? '' : FormatTime(new Date(sTime))
                this.searchForm.lastBuyEndTime = eTime == '' ? '' : FormatTime(new Date(eTime))
            },
            defined(dialogName){
                switch (dialogName) {
                    case 'visibleTime':
                        this.dialogTitle = '自定义时间';
                        this.visibleTime = true;
                        break;
                    case 'showCount':
                        this.dialogTitle = '自定义次数';
                        this.showCount = true;
                        break;
                    case 'showMoneyCount':
                        this.dialogTitle = '自定义金额';
                        this.showMoneyCount = true;
                        break;
                }
            },
            hint() {
                this.dialogTitle = '';
                this.dialogDev = true;
            },
            //群发消息
            sendMultiMsg(type = 0){
                if(this.checkMultiSelect()){
                    let msgData = {
                        receiveIds:this.multipleSelection.map(item => item.memberId),
                        receiveShow:false
                    };
                    sessionStorage.msgData = JSON.stringify(msgData);
                    //群发短信
                    if(type === 1){
                        this.$router.push(`/marketing/msgSend`)
                    }else{
                        //群发消息
                        this.$router.push(`/station/msgPublish`)
                    }
                }
            }
            ,closeTimeDialog() { // 关闭时间弹框
                this.visibleTime = false;
                this.searchForm.startTime = '';
                this.searchForm.endTime = '';
                this.dialogTitle = '';
            },
            closeShowCount() { // 关闭数量的弹框
                this.showCount = false;
                this.dialogTitle = '';
            },
            closeDialogDev() { // 关闭开发中提示弹框
                this.dialogDev = false;
            },
            //重置
            reset(){
                this.searchForm = {
                    pageNo: 1,
                    pageSize:20,
                    agentId: '',
                    buyNum: '',
                    fansTagId: '',
                    lastBuyEndTime: '',
                    lastBuyProductCategoryId:'',
                    lastBuyStartTime: '',
                    memberSelfCost:'',
                    mobile: '',
                    nickname: '',
                    orderRule: '',
                };
                this.minMoney = this.minBuyNum = this.maxMoney = this.maxBuyNum = '';
                this.selectedId = []
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 取消修改
            dialogClose() {
                this.tagForm.tagIds = [];
            },
            //显示新增 修改 查看 的隐藏弹窗
            showOrHideDialog() {
                this.dialogVisible = !this.dialogVisible;
            },
            // 批量添加标签
            batchAddTag() {
                if(!this.multipleSelection.length){
                    this.$message.warning('至少选择一条记录');
                    return;
                }
                this.showOrHideDialog();
            },
            //添加标签的确定按钮
            confirm(){
                for(let i in this.multipleSelection){
                    this.tagForm.fansIds.push(this.multipleSelection[i].memberId);
                }
                mutiAddTags(this.tagForm).then(res=>{
                    if(res.status == 1){
                        this.$message.success('添加成功')
                        this.showOrHideDialog();
                        this.getFansList();
                        this.tagForm = {
                            tagIds: []
                            ,fansIds: []
                        }
                    }
                });
            },
            // 获取粉丝列表
            getFansList(num) {
                if(num == 1) {
                    this.searchForm.pageNo = 1;
                }
                this.listLoading = true;
                fansList(this.searchForm).then(res => {
                    this.fansListData = res.data.rows;
                    this.total = res.data.total;
                    setTimeout(() => {
                        this.listLoading = false
                    }, 500)
                })
            },
            // 获取所有粉丝标签
            getAllTags() {
              getAllFansTags().then(res => {
                    if(res.status == 1) {
                        this.fansTags = res.data;
                    }
                })
            },
            //获取所有商品一级分类
            getProductList() {
                getProductList().then(res => {
                    if(res.status == 1) {
                        this.productList = res.data;
                    }
                })
            }
            //获取所有代理
            ,getAllAgents(){
                allAgents('').then(res=>{
                    if(res.status == 1) {
                        this.agentList = res.data;
                    }
                })
            }
            //校验是否选择了一条数据
            ,checkMultiSelect(){
                if(!this.multipleSelection.length){
                    this.$message({
                        type: 'error',
                        message: '至少选择一条记录!'
                    })
                    return false;
                }
                return true;
            }
        },
        created() {
            this.getAllAgents();
            this.getAllTags();
            this.getProductList();
            this.getFansList();
        }
    }
</script>

<style scoped>
  .main-block .myInput .el-input__inner {
    width: 100%;
  }
  .checkboxItem {
    width: 90px;
  }
  .development /deep/{
    height: 500px;
  }
</style>
