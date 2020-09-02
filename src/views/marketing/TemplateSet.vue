<template>
  <div class="contentBox">
    <el-row class="main-block">
      <!--      <el-card class="box-card">-->
      <!--        <div slot="header" class="clearfix">-->
      <!--          <span>查询条件</span>-->
      <!--        </div>-->
      <!--        <div class="main-block">-->
      <!--          <el-form ref="searchForm" :model="searchForm" label-width="80px" :inline="true">-->
      <!--            <el-form-item label="模板分类：" prop="name">-->
      <!--              <el-input class="myInput" v-model="searchForm.name" placeholder="粉丝模板分类" clearable></el-input>-->
      <!--            </el-form-item>-->
      <!--            <el-form-item>-->
      <!--              <el-button size="small" type="primary" @click="getList(1)">查询</el-button>-->
      <!--              <el-button size="small" type="warning" @click="$refs.searchForm.resetFields()">重置</el-button>-->
      <!--            </el-form-item>-->
      <!--          </el-form>-->
      <!--        </div>-->
      <!--      </el-card>-->
    </el-row>
    <div class="queryContent">
      <div class="top">
        <el-button
          type="primary"
          @click="addDialog"
          v-if="$store.state.user.pageBtns.includes('add')"
        >新增</el-button>
        <!--        v-if="$store.state.user.pageBtns.includes('add')"-->
      </div>
      <div class="table">
        <el-table :data="userList" border style="width: 100%" v-loading="listLoading" height="470">
          <!--          <el-table-column-->
          <!--            type="selection"-->
          <!--            width="55">-->
          <!--          </el-table-column>-->
          <el-table-column align="center" label="名称">
            <template slot-scope="scope">{{ scope.row.name || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="排序">
            <template slot-scope="scope">{{ scope.row.orderNum}}</template>
          </el-table-column>
          <el-table-column align="center" label="属性">
            <template slot-scope="scope">{{ scope.row.isSystemPreConfig ? '系统预设' : '自定义' }}</template>
          </el-table-column>
          <el-table-column align="center" label="备注">
            <template slot-scope="scope">{{ scope.row.remark || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="创建时间">
            <template slot-scope="scope">{{ scope.row.createTime || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" :width="$settings.dateWidth" fixed="right">
            <template slot-scope="scope">
              <!--              <el-button size="small" type="primary" @click="handleView(scope)">查看</el-button>-->
              <el-button
                size="small"
                type="warning"
                @click="handleEditInfo(scope)"
                :disabled="scope.row.isSystemPreConfig == 1"
                v-if="$store.state.user.pageBtns.includes('edit')"
              >修改</el-button>
              <!--                v-if="!scope.row.isSystemPreConfig && $store.state.user.pageBtns.includes('edit')"-->
              <!--              v-if="$store.state.user.pageBtns.includes('edit')"-->
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope)"
                :disabled="scope.row.isSystemPreConfig == 1"
                v-if="$store.state.user.pageBtns.includes('del')"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="searchForm.pageNo"
        :limit.sync="searchForm.pageSize"
        @pagination="getList"
      />
    </div>
    <!-- 新增 修改 查看的弹框 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType" @close="dialogClose">
      <el-form
        v-if="dialogVisible"
        :disabled="isReadOnly"
        :model="templateForm"
        label-width="80px"
        ref="templateForm"
        :rules="formRule"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="templateForm.name" placeholder="输入模板名称"/>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input v-model="templateForm.orderNum" placeholder="必须是数字"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="templateForm.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;" v-show='dialogType =="查看模板分类" ? false : true '>
        <el-button type="primary" @click="confirmUser">确认</el-button>
        <el-button type="danger" @click="dialogVisible = false;templateForm = {};">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import { getAllTemplate, getTemplates, addTemplate, editTemplate, delTemplate } from '@/api/messageTemplate'
    import Pagination from '@/components/Pagination'
    export default {
        name: 'TemplateSet',
        components: { Pagination },
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
                templateForm: {
                    name: '',
                    orderNum: '',
                    remark: '',
                    isSystemPreConfig: 0
                },
                multipleSelection: [],
                formRule: {
                    name: [{ required: true, message: '请输入模板分类名称', trigger: 'blur' }],
                    orderNum:[{ required: true, message: '请输入排序字段', trigger: 'blur' }],
                }
            }
        },
        methods: {
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 取消修改
            dialogClose() {
                this.templateForm = {
                    name: '',
                    orderNum: '',
                    remark: '',
                    isSystemPreConfig: 0
                };
            },
            //显示新增 修改 查看 的隐藏弹窗
            showOrHideDialog() {
                this.dialogVisible = !this.dialogVisible;
            },
            // 新增模板分类
            addDialog() {
                this.dialogType = '新增模板分类';
                this.isReadOnly = false;
                this.showOrHideDialog();
            },
            //查看模板分类
            handleView(score) {
                this.isReadOnly = true;
                getDetailById(score.row.id).then(res =>{
                    this.dialogType = '查看模板分类';
                    this.setDetailData(res);
                    this.showOrHideDialog();
                })
            },
            // 修改模板分类
            handleEditInfo(score) {
                this.isReadOnly = false;
                // getDetailById(score.row.id).then(res =>{
                //     this.dialogType = '修改模板分类';
                //     this.setDetailData(res);
                //     this.showOrHideDialog();
                //     this.templateForm.id = res.data.id;
                // })
                this.dialogType = '修改模板分类';
                this.setDetailData(score);
                this.showOrHideDialog();
                this.templateForm.id = score.row.id;
            },
            // 获取用户列表信息
            getList(num) {
                // if(num == 1) {
                //     this.searchForm.pageNo = 1;
                // }
                this.listLoading = true;
                getTemplates(this.searchForm).then(res => {
                    this.userList = res.data.rows;
                    this.total = res.data.total;
                    setTimeout(() => {
                        this.listLoading = false
                    }, 500)
                })
            },
            // 确认新增 修改
            confirmUser(score) {
                this.$refs['templateForm'].validate((valid) => {
                    if (valid) {
                        if(this.dialogType == '新增模板分类') {
                            addTemplate(this.templateForm).then(res => {
                                if(res.status == 1) {
                                    this.$message({
                                        type: 'success',
                                        message: '新增成功！'
                                    });
                                    this.getList();
                                    this.showOrHideDialog();
                                }
                            });
                        }
                        if(this.dialogType == '修改模板分类') {
                            editTemplate(this.templateForm).then(res => {
                                if(res.status == 1) {
                                    this.$message({
                                        type: 'success',
                                        message: '修改成功！'
                                    });
                                    this.getList();
                                    this.showOrHideDialog();
                                }
                            })
                        }
                    }
                })
            },
            //删除角色
            handleDelete(score) {
                this.$confirm('确定要删除该模板吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        await delTemplate(score.row.id).then(res => {
                            this.getList();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            })
                        })
                    })
                    .catch(err => {
                        console.error(err)
                    })
            },
            //查看/修改信息时赋值
            setDetailData(res){
                // this.templateForm = {
                //     name: res.data.name,
                //     orderNum: res.data.orderNum,
                //     remark: res.data.remark
                // }
                this.templateForm = {
                    name: res.row.name,
                    orderNum: res.row.orderNum,
                    remark: res.row.remark
                }
            },
        },
        created() {
            this.getList();
        }
    }
</script>

<style>
  .main-block .myInput .el-input__inner {
    width: 100%;
  }
</style>
