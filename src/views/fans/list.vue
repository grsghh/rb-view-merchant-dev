<template>
  <div class="contentBox">
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" label-width="82px" :inline="true">
            <el-form-item label="名称：" prop="nickname">
              <el-input class="myInput" v-model="searchForm.nickname" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="mobile">
              <el-input class="myInput" v-model="searchForm.mobile" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item label="所属代理：" prop="agentName">
              <el-input v-model="searchForm.agentName" placeholder="所属代理"></el-input>
            </el-form-item>
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
              <el-button size="small" type="primary" @click="getFansList(1)">查询</el-button>
              <el-button size="small" type="warning" @click="reset()">重置</el-button>
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
        <!--        >新增</el-button>-->
        <el-button
          v-if="$store.state.user.pageBtns.includes('export')"
          type="primary"
          @click="educe()"
        >导出
        </el-button>
        <!--        v-if="$store.state.user.pageBtns.includes('add')"-->
      </div>
      <div class="table">
        <el-table :data="userList" border @sort-change="sortChange" style="width: 100%" v-loading="listLoading"
                  height="470"
        >
          <el-table-column align="center" label="姓名">
            <template slot-scope="scope">{{ scope.row.nickname || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="手机号" width="110">
            <template slot-scope="scope">{{ scope.row.mobile || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="所属代理">
            <template slot-scope="scope">{{ scope.row.agentName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" width="120" label="粉丝消费" prop="member_self_cost" sortable="custom">
            <template slot-scope="scope">{{ scope.row.memberSelfCost || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              {{ scope.row.disabled | userDisabledState}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="加入时间" width="160">
            <template slot-scope="scope">{{ scope.row.createTime || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="所在区域" :width="$settings.dateWidth">
            <template slot-scope="scope">
              {{scope.row.provinceName}}{{scope.row.cityName}}{{scope.row.countyName}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="地址" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.address || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="生日">
            <template slot-scope="scope">{{ scope.row.birthday || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="360" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="handleEditInfo(scope)"
                v-if="$store.state.user.pageBtns.includes('shopAddress')"
              >收货地址
              </el-button>
              <el-button
                size="small"
                type="warning"
                @click="handleTag(scope)"
                v-if="$store.state.user.pageBtns.includes('tag')"
              >标签
              </el-button>
              <el-button type="danger" size="mini"
                         v-if="$store.state.user.pageBtns.includes('lock') && scope.row.disabled === 0"
                         @click="changeUserState({id:scope.row.id,disabled:1})">
                锁定
              </el-button>
              <el-button type="success" size="mini"
                         v-if="$store.state.user.pageBtns.includes('unlock') && scope.row.disabled === 1"@click="changeUserState({id:scope.row.id,disabled:0})">
                解锁
              </el-button>
              <br>
              <el-button
                size="small"
                type="primary"
                @click="handleAgent(scope)"
                style="margin-top: 5px;"
                v-if="$store.state.user.pageBtns.includes('setAgent')"
              >设为代理
              </el-button>
              <!--              v-if="$store.state.user.pageBtns.includes('changeAgent')"-->
              <el-button
                size="small"
                type="primary"
                @click="changeAgent(scope)"
                v-if="$store.state.user.pageBtns.includes('changeAgent')"
              >更换代理
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
        @pagination="getFansList"
      />
    </div>
    <!--    收货地址列表-->
    <el-dialog :visible.sync="dialogAddress" title="收货地址列表" @close="dialogAddress = false">
      <el-table :data="addressList" border style="width: 100%" height="500">
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
    <!-- 标签的弹框 -->
    <el-dialog :visible.sync="dialogVisible" title="粉丝标签设置" @close="dialogClose()" width="30%">
      <el-form v-if="dialogVisible" :model="operatorForm" label-width="100px">
        <el-form-item label="" label-width="35px">
          <el-checkbox-group v-model="operatorForm.tagIds">
            <el-checkbox name="tagIds" v-for="item in tagList" :key="item.id" :label="item.id">{{item.name}}
            </el-checkbox>
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
    <!--    更改代理弹窗-->
    <el-dialog :visible.sync="dialogChangeAgent" title="粉丝更换代理" width="50%" @close="closeChangeAgent">
      <el-form v-if="dialogChangeAgent" :model="agentChangeForm" label-width="120px" :rules="changeRuleForm"
               ref="changeRuleForm">
        <el-form-item label="上级代理" prop="agentId">
          <el-select v-model="agentChangeForm.agentId" style="width: 35%;" filterable clearable placeholder="选择代理">
            <el-option
              v-for="item in allAgentList"
              :key="item.id"
              :label="`${item.nickname}(${item.mobile})`"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirmChangeAgent">
          确认
        </el-button>
        <el-button type="danger" @click="closeChangeAgent">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {allAgents} from '@/api/fansAnalysis'
    import {
        getAllagentLevel,
        getAllfansTag,
        members,
        getprefansTag,
        setprefansTag,
        getfansAddress,
        makeAgent,
        changeTheAgent
        ,
        apisChangeUserState
    } from '@/api/agentlabel'
    import Pagination from '@/components/Pagination'
    import {exportExcel} from '@/utils/exportExcel'
    import {listExport} from '@/api/report'
    import {setTimer} from '@/utils/index'

    export default {
        name: 'productTag',
        components: {Pagination},
        data() {
            return {
                userList: [],//粉丝列表
                dialogChangeAgent: false, // 更改代理
                dialogVisible: false,
                dialogAgent: false,
                dialogAddress: false,
                agentChangeForm: {id: '', agentId: ''}, // 更改代理绑定的数据
                searchForm: {
                    pageNo: 1,
                    pageSize: 20,
                    agentName: "",
                    createTimeEnd: "",
                    createTimeStart: "",
                    mobile: "",
                    nickname: "",
                    orderRule: "accumulate_sales desc",
                    type: 2
                },
                operatorForm: {
                    tagIds: []
                },
                tagid: '',
                listLoading: false,
                total: 0,
                agentForm: {
                    nickname: '',
                    agentLevelId: '',
                    id: ''
                },
                addressList: [],//收货地址列表
                tagList: [],//粉丝标签列表
                agentList: [],//标签列表
                allAgentList: [],
                changeRuleForm: {
                    agentId: [{required: true, message: '请选择上级代理', trigger: 'change'}]
                }
            }
        },
        methods: {
            //获取所有代理
            getAllAgents() {
                allAgents('').then(res => {
                    if (res.status == 1) {
                        this.allAgentList = res.data;
                    }
                })
            },
            //排序事件
            sortChange(column, prop, order) {
                if (column.order == 'ascending') {
                    column.order = 'asc'
                } else {
                    column.order = 'desc'
                }
                this.searchForm.orderRule = `${column.prop} ${column.order}`
                this.getFansList()
            },
            //重置
            reset() {
                this.searchForm = {
                    pageNo: 1,
                    pageSize: 20,
                    agentName: "",
                    createTimeEnd: "",
                    createTimeStart: "",
                    mobile: "",
                    nickname: "",
                    orderRule: "accumulate_sales desc",
                    type: 2
                }
            },
            // 取消修改
            dialogClose() {
                this.dialogVisible = false
            },
            closeDialogAgent() {
                this.dialogAgent = false
                this.agentForm = {
                    nickname: '',
                    agentLevelId: '',
                    id: ''
                }
            },
            //显示新增 修改 查看 的隐藏弹窗
            showOrHideDialog() {
                this.dialogVisible = !this.dialogVisible
            },
            // 新增标签
            addDialog() {
                this.dialogType = '新增标签'
                this.isReadOnly = false
                this.showOrHideDialog()
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
            //标签弹窗
            handleTag(score) {
                this.showOrHideDialog()
                this.tagid = score.row.id
                getprefansTag({id: this.tagid}).then(res => {
                    if (res.status == 1) {
                        this.operatorForm.tagIds = res.data
                    }
                })
            },
            //确定
            confirm() {
                setprefansTag(this.operatorForm.tagIds, this.tagid).then(res => {
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '设置成功！'
                        })
                        this.showOrHideDialog()
                    }
                })
            },
            // 关闭更改代理弹框
            closeChangeAgent() {
                this.dialogChangeAgent = false;
                this.agentChangeForm = {id: '', agentId: ''};
            },
            // 更换代理的弹框
            changeAgent(data) {
                this.dialogChangeAgent = true;
                this.agentChangeForm.id = data.row.id;
            },
            // 确认更改代理
            confirmChangeAgent() {
                this.$refs['changeRuleForm'].validate((valid) => {
                    if (valid) {
                        changeTheAgent(this.agentChangeForm).then(res => {
                            if (res.status === 1) {
                                this.$message({
                                    type: 'success',
                                    message: '更换成功！'
                                });
                                this.closeChangeAgent();
                                this.getFansList();
                            }
                        })
                    }
                });
            },
            //设为代理按钮
            handleAgent(score) {
                // this.dialogAgent = true
                this.agentForm.id = score.row.id;
                // this.agentForm.nickname = score.row.nickname
                this.$confirm('确定要设为代理吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        await makeAgent(this.agentForm).then(res => {
                            if (res.status === 1) {
                                this.$message({
                                    type: 'success',
                                    message: '成功设为代理！'
                                });
                                this.getFansList()
                            }
                        })
                    })
                    .catch(err => {
                        console.error(err)
                    })
            },
            // 获取用户列表信息
            getFansList(num) {
                if (num == 1) {
                    this.searchForm.pageNo = 1
                }
                this.listLoading = true
                members(this.searchForm).then(res => {
                    this.userList = res.data.rows
                    this.total = res.data.total
                    setTimeout(() => {
                        this.listLoading = false
                    }, 500)
                })
            },
            //导出
            educe() {
                let exl = {
                    //表头，必填
                    tHeader: ['姓名', '手机号', '所在区域', '地址', '生日', '所属代理', '粉丝消费', '加入时间'],
                    //表头对应的数据，顺序要与表头一致 ，必填
                    filterVal: ['nickname', 'mobile', 'area', 'address', "birthday", 'agentName', 'memberSelfCost', 'createTime']
                    ,
                    filename: '粉丝列表'
                };
                listExport(this.searchForm).then(res => {
                    //需要导出的数据 ，必填
                    for (let i in res.data) {
                        res.data[i].area = res.data[i].provinceName + res.data[i].cityName + res.data[i].countyName
                    }
                    exl.list = res.data;
                    exportExcel(exl);
                })
            },
            //获取格式化之后的时间
            getUtilsTime() {
                let selectTime = this.$route.query.selectTime
                let objTime = setTimer({selectTime: selectTime})
                this.searchForm.createTimeStart = objTime.sTime
                this.searchForm.createTimeEnd = objTime.eTime
                this.getFansList()
            }
            //锁定/解锁用户
            , changeUserState(data) {
                apisChangeUserState(data).then(res => {
                    if(res.status === 1){
                        this.getFansList()
                        this.$message({
                            type: 'success',
                            message: '操作成功！'
                        })
                    }
                })
            }
        },
        created() {
            if (this.$route.query.selectTime) {
                this.getUtilsTime()
            } else {
                this.getFansList()
            }
            this.getAllAgents(); // 获取所有代理
            //代理等级
            getAllagentLevel().then(res => {
                if (res.status == 1) {
                    this.levelsList = res.data
                }
            })
            //所有粉丝标签
            getAllfansTag().then(res => {
                if (res.status == 1) {
                    this.tagList = res.data
                }
            })
        }
    }
</script>

<style>
  .main-block .myInput .el-input__inner {
    width: 100%;
  }
</style>
