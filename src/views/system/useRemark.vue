<template>
  <div class="contentBox">
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" label-width="80px" :inline="true">
            <el-form-item label="内容：" prop="content">
              <el-input class="myInput" v-model="searchForm.content" placeholder="内容" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getList(1)">查询</el-button>
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
        <el-table :data="List" border style="width: 100%" v-loading="listLoading" height="470">
          <el-table-column align="center" label="顺序">
            <template slot-scope="scope">{{ scope.row.orderNum}}</template>
          </el-table-column>
          <el-table-column align="center" label="内容">
            <template slot-scope="scope">{{ scope.row.content || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="添加时间">
            <template slot-scope="scope">{{ scope.row.createTime || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作"  fixed="right">
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
        @pagination="getList"
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
      >
        <el-form-item label="内容" prop="content">
          <el-input v-model="userForm.content" placeholder="常用语内容"/>
        </el-form-item>
        <el-form-item label="顺序" prop="orderNum">
          <el-input v-model="userForm.orderNum" placeholder="必须是数字"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirmUser">确认</el-button>
        <el-button type="danger" @click="dialogVisible = false;userForm = {};">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { remark, getRemarkById, addRemark, editRemark, delRemark } from '@/api/remark'
  import Pagination from '@/components/Pagination'
  export default {
    name: 'useRemark',
    components: { Pagination },
    data() {
      return {
        isReadOnly: false,
        List: [],
        dialogVisible: false,
        searchForm: {
          pageNo: 1
          , pageSize:20,
          content: ''
        } ,
        listLoading: false,
        total: 0,
        dialogType: '',
        // 添加、修改表单数据
        userForm: {
          content: '',
          orderNum: ''
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
          content: '',
          orderNum: ''
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
        getRemarkById(score.row.id).then(res =>{
          this.dialogType = '查看标签';
          this.setDetailData(res);
          this.showOrHideDialog();
        })
      },
      // 修改标签
      handleEditInfo(score) {
        this.isReadOnly = false;
        getRemarkById(score.row.id).then(res =>{
          this.dialogType = '修改标签';
          this.setDetailData(res);
          this.showOrHideDialog();
          this.userForm.id = res.data.id;
        })
      },
      // 获取用户列表信息
      getList(num) {
        if(num == 1) {
          this.searchForm.pageNo = 1;
        }
        this.listLoading = true;
        remark(this.searchForm).then(res => {
          this.List = res.data.rows;
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
              addRemark(this.userForm).then(res => {
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
            if(this.dialogType == '修改标签') {
              editRemark(this.userForm).then(res => {
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
        this.$confirm('确定要删除该备注吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            await delRemark(score.row.id).then(res => {
              if(res.status == 1){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getList();
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
          content: res.data.content,
          orderNum: res.data.orderNum
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
