<template>
  <div class="contentBox">
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" label-width="80px" :inline="true">
            <el-form-item label="标签：" prop="name">
              <el-input class="myInput" v-model="searchForm.name" placeholder="商品标签" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getTagsList(1)">查询</el-button>
              <el-button size="small" type="warning" @click="$refs.searchForm.resetFields()">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
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
        <el-table :data="userList" border style="width: 100%" v-loading="listLoading" height="470">
<!--          <el-table-column-->
<!--            type="selection"-->
<!--            width="55">-->
<!--          </el-table-column>-->
          <el-table-column align="center" label="标签">
            <template slot-scope="scope">{{ scope.row.name || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="显示顺序">
            <template slot-scope="scope">{{ scope.row.orderNum}}</template>
          </el-table-column>
          <el-table-column align="center" label="备注">
            <template slot-scope="scope">{{ scope.row.remark || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" :width="$settings.dateWidth" fixed="right">
            <template slot-scope="scope">
<!--              <el-button size="small" type="primary" @click="handleView(scope)">查看</el-button>-->
              <el-button
                size="small"
                type="warning"
                @click="handleEditInfo(scope)"
                v-if="$store.state.user.pageBtns.includes('edit')"
              >修改</el-button>
              <!--              v-if="$store.state.user.pageBtns.includes('edit')"-->
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope)"
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
        @pagination="getTagsList"
      />
    </div>
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="userForm.name" placeholder="商品标签名称"/>
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
    import { getTags, getDetailById, addTags, editTags, delTags } from '@/api/productTag'
    import Pagination from '@/components/Pagination'
    export default {
        name: 'productTag',
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
                    , pageSize:20,
                    name: ''
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
                    name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
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
            // 新增标签
            addDialog() {
                this.dialogType = '新增标签';
                this.isReadOnly = false;
                this.showOrHideDialog();
            },
            //查看标签
            handleView(score) {
                this.isReadOnly = true;
                getDetailById(score.row.id).then(res =>{
                    this.dialogType = '查看标签';
                    this.setDetailData(res);
                    this.showOrHideDialog();
                })
            },
            // 修改标签
            handleEditInfo(score) {
                this.isReadOnly = false;
                getDetailById(score.row.id).then(res =>{
                    this.dialogType = '修改标签';
                    this.setDetailData(res);
                    this.showOrHideDialog();
                    this.userForm.id = res.data.id;
                })
            },
            // 获取用户列表信息
            getTagsList(num) {
                if(num == 1) {
                    this.searchForm.pageNo = 1;
                }
                this.listLoading = true;
                getTags(this.searchForm).then(res => {
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
                        if(this.dialogType == '新增标签') {
                            addTags(this.userForm).then(res => {
                                if(res.status == 1) {
                                    this.$message({
                                        type: 'success',
                                        message: '新增成功！'
                                    });
                                    this.getTagsList();
                                    this.showOrHideDialog();
                                }
                            });
                        }
                        if(this.dialogType == '修改标签') {
                            editTags(this.userForm).then(res => {
                                if(res.status == 1) {
                                    this.$message({
                                        type: 'success',
                                        message: '修改成功！'
                                    });
                                    this.getTagsList();
                                    this.showOrHideDialog();
                                }
                            })
                        }
                    }
                })
            },
            //删除角色
            handleDelete(score) {
                this.$confirm('确定要删除该标签吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        await delTags(score.row.id).then(res => {
                          if(res.status == 1){
                            this.$message({
                              type: 'success',
                              message: '删除成功!'
                            })
                            this.getTagsList();
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
            },
        },
        created() {
            this.getTagsList();
        }
    }
</script>

<style>
  .main-block .myInput .el-input__inner {
    width: 100%;
  }
</style>
