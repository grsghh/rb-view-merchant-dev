<template>
  <div class="contentBox">
<!--    <el-row class="main-block">-->
<!--      <el-card class="box-card">-->
<!--        <div slot="header" class="clearfix">-->
<!--          <span>查询条件</span>-->
<!--        </div>-->
<!--        <div class="main-block">-->
<!--          <el-form ref="searchForm" :model="searchForm" label-width="80px" :inline="true">-->
<!--            <el-form-item label="标签：" prop="name">-->
<!--              <el-input class="myInput" v-model="searchForm.name" placeholder="商品标签"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item>-->
<!--              <el-button size="small" type="primary" @click="getLevelsList(1)">查询</el-button>-->
<!--              <el-button size="small" type="warning" @click="$refs.searchForm.resetFields()">重置</el-button>-->
<!--            </el-form-item>-->
<!--          </el-form>-->
<!--        </div>-->
<!--      </el-card>-->
<!--    </el-row>-->
    <div class="queryContent">
      <div class="top">
        <el-button
          type="primary"
          @click="addDialog"
          v-if="$store.state.user.pageBtns.includes('add')"
        >新增</el-button>
        <!--        <el-button-->
        <!--          type="primary"-->
        <!--        >导出</el-button>-->
        <!--        v-if="$store.state.user.pageBtns.includes('add')"-->
      </div>
      <div class="table">
<!--        @selection-change="handleSelectionChange"-->
        <el-table :data="userList" border style="width: 100%" v-loading="listLoading" height="470" >
<!--          <el-table-column-->
<!--            type="selection"-->
<!--            width="55">-->
<!--          </el-table-column>-->
          <el-table-column align="center" label="身份">
            <template slot-scope="scope">{{ scope.row.name || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="顺序">
            <template slot-scope="scope">{{ scope.row.orderNum}}</template>
          </el-table-column>
          <el-table-column align="center" label="备注">
            <template slot-scope="scope">{{ scope.row.remark || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" :width="$settings.dateWidth" fixed="right">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="handleView(scope)" v-if="$store.state.user.pageBtns.includes('set') &&scope.row.type != 4">设置</el-button>
              <el-button
                size="small"
                type="warning"
                @click="handleEditInfo(scope)"
                v-if="$store.state.user.pageBtns.includes('edit') && scope.row.name != '初始代理'"
              >修改</el-button>
<!--              <el-button-->
<!--                size="small"-->
<!--                type="danger"-->
<!--                @click="handleDelete(scope)"-->
<!--                v-if="$store.state.user.pageBtns.includes('del') && scope.row.name != '初始代理'"-->
<!--              >删除</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="searchForm.pageNo"
        :limit.sync="searchForm.pageSize"
        @pagination="getLevelsList"
      />
    </div>
<!--    设置的弹框-->
    <set-agent v-if="params.visible" :params="params" @componentClose="params.visible = false;" @childrenComfirm="setAgent"></set-agent>
    <set-high-agent v-if="highParams.visible1" :highParams="highParams" @componentClose="highParams.visible1 = false;" @childrenComfirm="setAgent"></set-high-agent>
    <set-super-agent v-if="superParams.visible" :superParams="superParams" @componentClose="superParams.visible = false;" @childrenComfirm="setAgent"></set-super-agent>

    <!-- 新增 修改 查看的弹框 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType" @close="dialogClose">
      <el-form
        v-if="dialogVisible"
        :disabled="isReadOnly"
        :model="userForm"
        label-width="80px"
        ref="userForm"
        :rules="formRule"
      >
        <el-form-item label="身份名称" prop="name">
          <el-input v-model="userForm.name" placeholder="等级名称"/>
        </el-form-item>
        <el-form-item label="排序字段" prop="orderNum">
          <el-input v-model="userForm.orderNum" placeholder="必须是数字"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="userForm.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;" v-show='dialogType =="查看标签" ? false : true '>
        <el-button type="primary" @click="confirmUser">确认</el-button>
        <el-button type="danger" @click="dialogVisible = false;userForm = {};">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import SetAgent  from './components/SetAgent'
    import SetHighAgent  from './components/SetHighAgent'
    import SetSuperAgent  from './components/SetSuperAgent'
    import { getLevels, getDetailById, addLevel, editLevel, delLevel, setGeneralUpgrade, setHighUpgrade, setLianUpgrade } from '@/api/level'
    import Pagination from '@/components/Pagination'
    export default {
        name: 'level',
        components: { Pagination, SetAgent, SetHighAgent, SetSuperAgent },
        data() {
            return {
                isReadOnly: false,
                name: '',
                mobile: '',
                value: '',
                userList: [],
                dialogVisible: false,
                searchForm: {
                    pageNo: 1
                    , pageSize:20
                } ,
                listLoading: false,
                total: 0,
                dialogType: '',
                // 添加、修改表单数据
                userForm: {
                    name: '',
                    orderNum: '',
                    remark: ''
                },
                multipleSelection: [],
                formRule: {
                    name: [{ required: true, message: '请输入代理名称', trigger: 'blur' }],
                    orderNum:[{ required: true, message: '请输入排序字段', trigger: 'blur' }],
                },
                params: {
                    visible: false
                },
                highParams: {
                    visible1: false
                },
                superParams: {
                    visible: false
                }
            }
        },
        methods: {
            setAgent(data) {
                let that = this;
                if(data.id == 1) {
                    this.setGeneralUpgrade(data);
                } else if(data.id == 2) {
                    this.setHighUpgrade(data);
                } else if(data.id == 3) {
                    this.setLianUpgrade(data);
                }
            },
            // 设置普通代理升级条件
            setGeneralUpgrade(data) {
                setGeneralUpgrade(data).then(res => {
                    if(res.status == 1) {
                        this.$message({
                            message: '设置成功！',
                            type: 'success'
                        });
                        this.params.visible = false
                    }
                })
            },
            setHighUpgrade(data) {
                setHighUpgrade(data).then(res => {
                    if(res.status == 1) {
                        this.$message({
                            message: '设置成功！',
                            type: 'success'
                        });
                        this.highParams.visible1 = false
                    }
                })
            },
            setLianUpgrade(data) {
                setLianUpgrade(data).then(res => {
                    if(res.status == 1) {
                        this.$message({
                            message: '设置成功！',
                            type: 'success'
                        });
                        this.superParams.visible = false
                    }
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 取消修改
            dialogClose() {
                this.userForm = {
                    name: '',
                    orderNum: '',
                    remark: '',
                };
            },
            //显示新增 修改 查看 的隐藏弹窗
            showOrHideDialog() {
                this.dialogVisible = !this.dialogVisible;
            },
            // 新增代理等级
            addDialog() {
                this.dialogType = '新增代理身份';
                this.isReadOnly = false;
                this.showOrHideDialog();
            },
            //查看标签
            handleView(score) {
                // this.isReadOnly = true;
                // getDetailById(score.row.id).then(res =>{
                //     this.dialogType = '查看标签';
                //     this.setDetailData(res);
                //     this.showOrHideDialog();
                // })
                if(score.row.type == 1) {
                    this.params = {
                        visible: true
                    }
                } else if(score.row.type == 2) {
                    this.highParams = {
                        visible1: true
                    }
                } else if(score.row.type == 3) {
                    this.superParams = {
                        visible: true
                    }
                }

            },
            // 修改代理等级
            handleEditInfo(score) {
                this.isReadOnly = false;
                getDetailById(score.row.id).then(res =>{
                    this.dialogType = '修改代理身份';
                    this.setDetailData(res);
                    this.showOrHideDialog();
                    this.userForm.id = res.data.id;
                })
            },
            // 获取用户列表信息
            getLevelsList(num) {
                // if(num == 1) {
                //     this.searchForm.pageNo = 1;
                // }
                this.listLoading = true;
                getLevels().then(res => {
                    this.userList = res.data.rows;
                    this.total = res.data.total;
                    setTimeout(() => {
                        this.listLoading = false
                    }, 500)
                })
            },
            // 确认新增 修改
            confirmUser(score) {
                this.$refs['userForm'].validate((valid) => {
                    if (valid) {
                        if(this.dialogType == '新增代理身份') {
                            addLevel(this.userForm).then(res => {
                                if(res.status == 1) {
                                    this.$message({
                                        type: 'success',
                                        message: '新增成功！'
                                    });
                                    this.getLevelsList();
                                    this.showOrHideDialog();
                                }
                            });
                        }
                        if(this.dialogType == '修改代理身份') {
                            editLevel(this.userForm).then(res => {
                                if(res.status == 1) {
                                    this.$message({
                                        type: 'success',
                                        message: '修改成功！'
                                    });
                                    this.getLevelsList();
                                    this.showOrHideDialog();
                                }
                            })
                        }
                    }
                })
            },
            //删除角色
            handleDelete(score) {
                this.$confirm('确定要删除该身份吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        await delLevel(score.row.id).then(res => {
                          if(res.status == 1){
                            this.getLevelsList();
                            this.$message({
                              type: 'success',
                              message: '删除成功!'
                            })
                          }
                        })
                    })
                    .catch(err => {
                        console.error(err)
                    })
            },
            //查看/修改信息时赋值
            setDetailData(res){
                this.userForm = {
                    name: res.data.name,
                    orderNum: res.data.orderNum,
                    remark: res.data.remark
                }
            }
        },
        created() {
            this.getLevelsList();
        }
    }
</script>

<style>
  .main-block .myInput .el-input__inner {
    width: 100%;
  }
</style>
