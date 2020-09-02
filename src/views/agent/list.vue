<template>
  <div class="main-content">
    <el-row class="main-block main-ipt">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" label-width="82px" :inline="true">
            <el-form-item label="名称：" prop="nickname">
              <el-input v-model="searchForm.nickname" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="mobile">
              <el-input v-model="searchForm.mobile" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="上级代理：" prop="agentLevelId">
              <el-input v-model="searchForm.agentName" placeholder="请输入上级代理"></el-input>
              <!--                <el-select v-model="searchForm.agentLevelId" filterable clearable placeholder="全部">-->
              <!--                  <el-option-->
              <!--                    v-for="item in levelsList"-->
              <!--                    :key="item.id"-->
              <!--                    :label="item.name"-->
              <!--                    :value="item.id">-->
              <!--                  </el-option>-->
              <!--                </el-select>-->
            </el-form-item>
            <el-form-item label="身份：" prop="agentLevelId">
              <div class="">
                <el-select v-model="searchForm.agentLevelId" filterable clearable placeholder="全部">
                  <el-option
                    v-for="item in levelsList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <br>
            <el-form-item label="加入时间：" prop="createTimeStart">
              <el-date-picker
                v-model="searchForm.createTimeStart"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="开始时间">
              </el-date-picker>
            </el-form-item>
            <span class="pcikerJoin">____</span>
            <el-form-item label="" prop="createTimeEnd">
              <el-date-picker
                v-model="searchForm.createTimeEnd"
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
          <el-button v-if="$store.state.user.pageBtns.includes('export')" size="small" type="primary" @click="educe()">
            导出
          </el-button>
        </el-row>
        <el-table :data="List" style="width: 100%;"
                  border
                  v-loading="listLoading"
                  height="470"
                  @sort-change="sortChange"
        >
          <el-table-column align="center" label="姓名" width="110">
            <template slot-scope="scope">
              {{ scope.row.nickname || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="手机号" width="110">
            <template slot-scope="scope">
              {{ scope.row.mobile || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="店铺名称" width="120">
            <template slot-scope="scope">
              {{ scope.row.shopName || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sub_agent_num" label="上级代理" width="120">
            <template slot-scope="scope">
              {{ scope.row.agentName}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sub_agent_num" label="下级代理" width="120" sortable="custom">
            <template slot-scope="scope">
              {{ scope.row.subAgentNum}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="fans_num" label="粉丝数量" width="120" sortable="custom">
            <template slot-scope="scope">
              {{ scope.row.fansNum}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="accumulate_sales" label="累计销量" width="120" sortable="custom">
            <template slot-scope="scope">
              {{ scope.row.accumulateSales || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="accumulate_earnings" label="累计收益" width="120" sortable="custom">
            <template slot-scope="scope">
              {{ scope.row.accumulateEarnings || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="身份">
            <template slot-scope="scope">
              {{ scope.row.agentLevelName || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              {{ scope.row.disabled | userDisabledState}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="加入时间" width="160">
            <template slot-scope="scope">
              {{ scope.row.upgradeAgentTime || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="所在区域" :width="$settings.dateWidth">
            <template slot-scope="scope">
              {{scope.row.provinceName}}{{scope.row.cityName}}{{scope.row.countyName}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="地址" :width="$settings.dateWidth">
            <template slot-scope="scope">
              {{ scope.row.address || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="生日" width="100">
            <template slot-scope="scope">
              {{ scope.row.birthday || '-'}}
            </template>
          </el-table-column>
          <!--          <el-table-column align="center" label="邀请码">-->
          <!--            <template slot-scope="scope">-->
          <!--              {{ scope.row.invitationCode || '-'}}-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column align="center" label="备注" width="220">
            <template slot-scope="scope">
              {{ scope.row.remark || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="right" label="操作" width="350">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="handleEditInfo(scope)"
              >收货地址
              </el-button>
              <el-button type="primary" size="mini" v-if="$store.state.user.pageBtns.includes('preview')"
                         @click="handleView(scope)">
                预览
              </el-button>
              <el-button type="warning" size="mini" v-if="$store.state.user.pageBtns.includes('promote')" @click="handleEdit(scope)">
                推广
              </el-button>
              <br>
              <el-button type="warning" size="mini" v-if="$store.state.user.pageBtns.includes('tag')"
                         style="margin-top: 5px;"
                         @click="handleTag(scope)">
                标签
              </el-button>
              <el-button type="danger" size="mini" v-if="$store.state.user.pageBtns.includes('lock') && scope.row.disabled === 0"
                         @click="changeUserState({id:scope.row.id,disabled:1})">
                锁定
              </el-button>
              <el-button type="success" size="mini" v-if="$store.state.user.pageBtns.includes('unlock') && scope.row.disabled === 1"
                         @click="changeUserState({id:scope.row.id,disabled:0})">
                解锁
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize"
                    @pagination="getList"/>
      </el-card>
    </el-row>

    <!--    推广弹窗-->
    <el-dialog :visible.sync="dialogPromote" title="代理推广情况" class="agentdialog" @close="Close()">
      <el-tabs v-model="tgtype" type="border-card" @tab-click="agentAndfans">
        <el-tab-pane name="first" label="代理">
          <el-table style="width: 100%;" :data="recList" border height="500px">
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
            <el-table-column align="center" label="累计收益">
              <template slot-scope="scope">
                {{ scope.row.accumulateEarnings || '-'}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="累计销量">
              <template slot-scope="scope">
                {{ scope.row.accumulateSales || '-'}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="下级代理">
              <template slot-scope="scope">
                {{ scope.row.subAgentNum}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="下级粉丝">
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
        </el-tab-pane>
        <el-tab-pane name="two" label="粉丝">
          <el-table :data="recList" style="width: 100%;" border height="500px">
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
            <el-table-column align="center" label="累计销量">
              <template slot-scope="scope">
                {{ scope.row.memberSelfCost || '-'}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="加入时间">
              <template slot-scope="scope">
                {{ scope.row.createTime || '-'}}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!--    标签弹窗-->
    <el-dialog :visible.sync="dialogVisible" title="代理标签设置" @close="dialogClose()" width="30%">
      <el-form v-if="dialogVisible" :model="operatorForm" label-width="100px">
        <el-form-item label="" label-width="35px">
          <el-checkbox-group v-model="operatorForm.tagIds">
            <el-checkbox name="tagIds" v-for="item in tagList" :key="item.id" :label="item.id">{{item.name}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirmChauffeur">
          确认
        </el-button>
        <el-button type="danger" @click="noConfirmChauffeur">
          取消
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title=" "
      :visible.sync="dialogPreview"
      custom-class="miniDialog"
      destroy-on-close
    >
      <Preview :miniParam="miniParam" v-if="dialogPreview"></Preview>
    </el-dialog>
    <!--    收货地址列表-->
    <el-dialog :visible.sync="dialogAddress" title="收货地址列表" @close="dialogAddress = false">
      <el-table :data="addressList" border style="width: 100%">
        <el-table-column align="center" label="联系人">
          <template slot-scope="scope">{{ scope.row.linkMan || '-'}}</template>
        </el-table-column>
        <el-table-column align="center" label="手机号">
          <template slot-scope="scope">{{ scope.row.mobile || '-'}}</template>
        </el-table-column>
        <el-table-column align="center" label="所在区域" :width="$settings.dateWidth">
          <template slot-scope="scope">
            {{scope.row.provinceName}}{{scope.row.cityName}}{{scope.row.countyName}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="详细地址" :width="$settings.dateWidth">
          <template slot-scope="scope">{{ scope.row.address || '-'}}</template>
        </el-table-column>
        <el-table-column align="center" label="是否默认地址">
          <template slot-scope="scope">{{ scope.row.isDefault ? '是':'否'}}</template>
        </el-table-column>
        <el-table-column align="center" label="备注">
          <template slot-scope="scope">{{ scope.row.remark || '-'}}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
    import {
        getAllagentLevel,
        getAllagentTag,
        members,
        agentPromote,
        getpreagentTag,
        setpreagentTag,
        getfansAddress,
        apisChangeUserState
    } from '@/api/agentlabel'
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination
    import Preview from '@/components/preview/preview'
    import {exportExcel} from '@/utils/exportExcel'
    import {listExport} from '@/api/report'
    import {setTimer} from '@/utils/index'

    export default {
        name: 'list',
        components: {Pagination, Preview},
        data() {
            return {
                searchForm: {
                    pageNo: 1,
                    pageSize: 20,
                    agentLevelId: "",
                    createTimeEnd: "",
                    createTimeStart: "",
                    mobile: "",
                    nickname: "",
                    agentName: '',
                    orderRule: "accumulate_sales desc",
                    type: 1
                },
                operatorForm: {
                    tagIds: []
                },
                tagid: '',
                dialogVisible: false,
                dialogPromote: false,
                dialogAddress: false,
                List: [],//列表
                listLoading: true,
                total: 0,
                levelsList: [],//等级
                presentId: '',
                tgtype: 'first',
                addressList: [],//收货地址列表
                tagList: [],//代理标签列表
                recList: []//推广列表
                , dialogPreview: false
                , miniParam: {
                    name: 'home'
                    , param: {shopName: ''}
                }
            }
        },
        created() {
            if (this.$route.query.selectTime) {
                this.getUtilsTime()
            } else {
                this.getList()
            }
            //   this.getUtilsTime()
            // this.getList()
            //所有代理等级
            getAllagentLevel().then(res => {
                if (res.status == 1) {
                    this.levelsList = res.data
                }
            })
            //所有代理标签
            getAllagentTag().then(res => {
                if (res.status == 1) {
                    this.tagList = res.data
                }
            })
        },
        methods: {
            // 清空
            reset() {
                this.searchForm = {
                    pageNo: 1,
                    pageSize: 20,
                    agentLevelId: "",
                    createTimeEnd: "",
                    createTimeStart: "",
                    mobile: "",
                    nickname: "",
                    agentName: "",
                    orderRule: "accumulate_sales desc",
                    type: 1
                }
            },
            //获取格式化之后的时间
            getUtilsTime() {
                let selectTime = this.$route.query.selectTime
                let objTime = setTimer({selectTime: selectTime})
                this.searchForm.createTimeStart = objTime.sTime
                this.searchForm.createTimeEnd = objTime.eTime
                this.getList()
            },
            //排序事件
            sortChange(column, prop, order) {
                if (column.order == 'ascending') {
                    column.order = 'asc'
                } else {
                    column.order = 'desc'
                }
                this.searchForm.orderRule = `${column.prop} ${column.order}`
                this.getList()
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
                if (num == 1) this.searchForm.pageNo = num
                members(this.searchForm).then(res => {
                    if (res.status == 1) {
                        this.List = res.data.rows
                        this.total = res.data.total
                        setTimeout(() => {
                            this.listLoading = false
                        }, 500)
                    }
                })
            },
            //提交
            confirmChauffeur() {
                setpreagentTag(this.operatorForm.tagIds, this.tagid).then(res => {
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '设置成功！'
                        })
                        this.showOrHideDialog()
                    }
                })
            },
            noConfirmChauffeur() {
                this.showOrHideDialog();
            },
            //店铺跳转
            handleView(score) {
                this.dialogPreview = true;
                this.miniParam.param.shopName = score.row.shopName;
            },
            // 收货地址
            handleEditInfo(score) {
                this.dialogAddress = true
                getfansAddress({id: score.row.id}).then(res => {
                    if (res.status == 1) {
                        this.addressList = res.data
                    }
                })
            },
            //推广弹窗
            handleEdit(score) {
                this.dialogPromote = !this.dialogPromote
                this.presentId = score.row.id
                this.agentAndfans(this.presentId, 1)
            },
            //点击tab切换
            agentAndfans(a) {
                if (this.tgtype == "first") {
                    a = 1
                } else {
                    a = 2
                }
                agentPromote({id: this.presentId, type: a}).then(res => {
                    if (res.status == 1) {
                        this.recList = res.data
                    }
                })
            },
            Close() {
                this.dialogPromote = false
            },
            //标签弹窗
            handleTag(score) {
                this.showOrHideDialog()
                this.tagid = score.row.id
                getpreagentTag({id: this.tagid}).then(res => {
                    if (res.status == 1) {
                        this.operatorForm.tagIds = res.data
                    }
                })
            },
            //删除运营商信息
            handleDelete(score) {
                this.$confirm('确定要删除该运营商吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await delOperator(score.row.id).then(res => {
                        if (res.status == 1) {
                            this.getList()
                            this.$message({
                                type: 'success',
                                message: '删除成功！'
                            })
                        }
                    })
                }).catch(err => {
                    console.log(err)
                })
            }
            //查看/修改详情时回显数据
            , setDetailData(res) {
                this.operatorForm.name = res.data.name
                this.operatorForm.linkMan = res.data.linkMan
                this.operatorForm.mobile = res.data.mobile
                this.operatorForm.address = res.data.address
                this.operatorForm.state = res.data.state.toString()
                this.operatorForm.id = res.data.id
                this.operatorForm.billingType = res.data.billingType
                this.operatorForm.code = res.data.code
                this.operatorForm.cooperationArea = res.data.cooperationArea
                this.operatorForm.createTime = res.data.createTime
                this.operatorForm.creditCode = res.data.creditCode
                this.operatorForm.description = res.data.description
                this.operatorForm.endTime = res.data.endTime
                this.operatorForm.startTime = res.data.startTime
                this.operatorForm.updateTime = res.data.updateTime
                this.operatorForm.type = res.data.type.toString()
            },
            //导出
            educe() {
                let exl = {
                    //表头，必填
                    tHeader: ['姓名', '手机号', '店铺名称', '所在区域', '地址', '生日', '邀请码', '下级代理', '粉丝数量', '累计销量', '累计收益', '身份', '备注', '加入时间']
                    ,
                    //表头对应的数据，顺序要与表头一致 ，必
                    filterVal: ['nickname', 'mobile', 'shopName', 'area', 'address', "birthday", 'invitationCode', 'subAgentNum', 'fansNum', 'accumulateSales', 'accumulateEarnings', 'agentLevelName', 'remark', 'upgradeAgentTime']
                    ,
                    filename: '代理列表'
                };
                listExport(this.searchForm).then(res => {
                    //需要导出的数据 ，必填
                    for (let i in res.data) {
                        res.data[i].area = res.data[i].provinceName + res.data[i].cityName + res.data[i].countyName
                    }
                    exl.list = res.data;
                    exportExcel(exl);
                })
            }
            //锁定/解锁用户
            , changeUserState(data) {
                apisChangeUserState(data).then(res => {
                    if(res.status === 1){
                        this.getList();
                        this.$message({
                            type: 'success',
                            message: '操作成功！'
                        })
                    }
                })
            }
        }
        ,filters:{
        }
    }
</script>

<style scoped>

</style>
