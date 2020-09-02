<template>
  <div class="contentBox">
<!--    <el-row class="main-block">-->
<!--      <el-card class="box-card">-->
<!--        <div slot="header" class="clearfix">-->
<!--          <span>查询条件</span>-->
<!--        </div>-->
<!--        <div class="main-block">-->
<!--          <el-form ref="searchForm" :model="searchForm" label-width="80px" :inline="true">-->
<!--            <el-form-item label="昵称：" prop="name">-->
<!--              <el-input class="myInput" v-model="searchForm.name" placeholder="昵称" clearable></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="手机号：" prop="mobile">-->
<!--              <el-input class="myInput" v-model="searchForm.name" placeholder="手机号" clearable></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item>-->
<!--              <el-button size="small" type="primary" @click="getTheList(1)">查询</el-button>-->
<!--              <el-button size="small" type="warning" @click="$refs.searchForm.resetFields()">重置</el-button>-->
<!--            </el-form-item>-->
<!--          </el-form>-->
<!--        </div>-->
<!--      </el-card>-->
<!--    </el-row>-->
    <div class="">
      <div class="top" v-if="!params" style="margin-bottom: 20px;">
        <el-button
          type="primary"
          @click="addDialog"
        >添加收款账户</el-button>

      </div>
      <div class="table">
        <!--        @selection-change="handleSelectionChange"-->
        <el-table :data="userList" border style="width: 100%" v-loading="listLoading" height="470" @current-change="handleCurrentChange">
<!--                    <el-table-column-->
<!--                      type="selection"-->
<!--                      width="55">-->
<!--                    </el-table-column>-->
          <el-table-column align="center" label="头像">
            <template slot-scope="scope">
<!--              v-if="scope.row.memberAvatar != null-->
              <el-image v-if="scope.row.memberAvatar"
                        style="width: 50px; height: 50px;border-radius: 50%;"
                        :src="`${scope.row.memberAvatar}`"
                        :alt="`${scope.row.name}`"
              ></el-image>
              <div v-else slot="error" class="image-slot">
                <i style="font-size: 40px;color: #eee;" class="el-icon-picture-outline"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="昵称">
            <template slot-scope="scope">{{ scope.row.nickname}}</template>
          </el-table-column>
          <el-table-column align="center" label="手机号">
            <template slot-scope="scope">{{ scope.row.mobile || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="注册时间" v-if="!params">
            <template slot-scope="scope">{{ scope.row.createTime || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" :width="$settings.dateWidth" fixed="right" v-if="!params">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
<!--      <pagination-->
<!--        v-show="total>0"-->
<!--        :total="total"-->
<!--        :page.sync="searchForm.pageNo"-->
<!--        :limit.sync="searchForm.pageSize"-->
<!--        @pagination="getTheList"-->
<!--      />-->
    </div>
    <!-- 添加收款账户的弹框 -->
    <el-dialog :visible.sync="dialogVisible" width="75%" :title="dialogType" @close="dialogClose" append-to-body class="selectAccount">
      <select-account selectAccount v-if="dialogVisible" :theParams="theParams" @addAccount="addAccount" @handleView="handleView"></select-account>
    </el-dialog>
  </div>
</template>

<script>
    // import { getDetailById, addTags, editTags, delTags } from '@/api/productTag'
    import { getAccountList, delAcconut } from '@/api/wxTool'
    import Pagination from '@/components/Pagination'
    import SelectAccount from './SelectAccount'
    export default {
        name: 'GatheringAccount',
        components: { Pagination, SelectAccount },
        props: {
            params: {
                type: Object
            }
        },
        data() {
            return {
                theParams: {
                    id: 1,
                    name: 'zsf'
                },
                isReadOnly: false,
                name: '',
                mobile: '',
                value: '',
                userList: [],
                dialogVisible: false,
                searchForm: {} ,
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
                // formRule: {
                //     name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
                //     orderNum:[{ required: true, message: '请输入排序字段', trigger: 'blur' }],
                // }
            }
        },
        methods: {
            handleCurrentChange(val){
                this.$emit('handleCurrentChange',val)
            },
            addAccount(data) {
                this.dialogVisible = false;
                this.getTheList();
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
            // 添加收款账户
            addDialog() {
                this.dialogType = '添加收款账户';
                this.isReadOnly = false;
                this.showOrHideDialog();
            },
            //查看标签
            handleView(score) {
                this.dialogVisible = false;
                this.getTheList();
            },
            // 获取用户列表信息
            getTheList(num) {
                if(num == 1) {
                    this.searchForm.pageNo = 1;
                }
                this.listLoading = true;
                getAccountList(this.searchForm).then(res => {
                    this.userList = res.data;
                    // this.total = res.data.total;
                    setTimeout(() => {
                        this.listLoading = false
                    }, 500)
                })
            },
            // 删除账户
            handleDelete(score) {
                this.$confirm('确定要删除该账户吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        await delAcconut(score.row.id).then(res => {
                            if(res.status == 1){
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                })
                                this.getTheList();
                            }
                        })
                    })
                    .catch(err => {
                        console.error(err)
                    })
            },
            //查看/修改信息时赋值
            // setDetailData(res){
            //     this.userForm = {
            //         name: res.data.name,
            //         orderNum: res.data.orderNum,
            //         remark: res.data.remark
            //     }
            // },
        },
        created() {
            this.getTheList();
        }
    }
</script>

<style>
  .main-block .myInput .el-input__inner {
    width: 100%;
  }
  .selectAccount .el-dialog__body {
    padding-top: 0;
  }
</style>
