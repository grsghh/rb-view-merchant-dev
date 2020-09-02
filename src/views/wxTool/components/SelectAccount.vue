<template>
  <div class="contentBox">
    <el-row class="main-block">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" label-width="80px" :inline="true">
            <el-form-item label="昵称：" prop="nickname">
              <el-input class="myInput" v-model="searchForm.nickname" placeholder="昵称" clearable></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="mobile">
              <el-input class="myInput" v-model="searchForm.mobile" placeholder="手机号" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getTheList(1)">查询</el-button>
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
          @click="addAccount"
        >添加</el-button>
      </div>
      <div class="table">
        <!--        @selection-change="handleSelectionChange"-->
        <el-table :data="userList" border style="width: 100%" v-loading="listLoading" height="470" @selection-change="handleSelectionChange">
                    <el-table-column
                      type="selection"
                      width="55">
                    </el-table-column>
          <el-table-column align="center" label="头像">
              <template slot-scope="scope">
                <el-image v-if="scope.row.memberAvatar != null"
                          style="width: 50px; height: 50px;border-radius: 50%;overflow: hidden;"
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
<!--          <el-table-column align="center" label="操作" :width="$settings.dateWidth" fixed="right">-->
<!--            <template slot-scope="scope">-->
<!--              <el-button size="small" type="primary" @click="handleView(scope)">添加</el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
        </el-table>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="searchForm.pageNo"
        :limit.sync="searchForm.pageSize"
        @pagination="getTheList"
      />
    </div>
    <!-- 新增 修改 查看的弹框 -->
<!--    <el-dialog :visible.sync="dialogVisible" :title="dialogType" @close="dialogClose">-->
<!--      <el-form-->
<!--        v-if="dialogVisible"-->
<!--        :disabled="isReadOnly"-->
<!--        :model="userForm"-->
<!--        label-width="80px"-->
<!--        ref="userForm"-->
<!--        :rules="formRule"-->
<!--      >-->
<!--        <el-form-item label="头像" prop="name">-->
<!--          <el-input v-model="userForm.name" placeholder="商品标签名称"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="排序字段" prop="orderNum">-->
<!--          <el-input v-model="userForm.orderNum" placeholder="必须是数字"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="备注" prop="remark">-->
<!--          <el-input v-model="userForm.remark" placeholder="请输入备注" />-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <div style="text-align:right;" v-show='dialogType =="查看标签" ? false : true '>-->
<!--        <el-button type="primary" @click="confirmUser">确认</el-button>-->
<!--        <el-button type="danger" @click="dialogVisible = false;userForm = {};">取消</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->
  </div>
</template>

<script>
    // import { getTags, getDetailById, addTags, editTags, delTags } from '@/api/productTag'
    import { getAllList, addAccounts } from '@/api/wxTool'
    import Pagination from '@/components/Pagination'
    export default {
        name: 'SelectAccount',
        components: { Pagination },
        props: {
            theParams: {
                type: Object
            }
        },
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
                    mobile: '',
                    nickname: ''
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
            // 批量添加
            addAccount() {
                let that = this;
                if(this.multipleSelection.length == 0) {
                    return this.$message({
                        type: 'warning',
                        message: '至少选择一条记录！'
                    });
                }
                let array = [];
                for(let i = 0, len = that.multipleSelection.length; i < len; i++) {
                    array.push(that.multipleSelection[i].id);
                }
                addAccounts(array).then(res => {
                    if(res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '添加成功！'
                        });
                        setTimeout(function() {
                            that.$emit('addAccount', array);
                        }, 1000);
                    }
                })
            },
            //查看标签
            // handleView(score) {
            //     console.log(score.row);
            //     this.$emit('handleView', score.row)
                // this.isReadOnly = true;
                // getDetailById(score.row.id).then(res =>{
                //     this.dialogType = '查看标签';
                //     this.setDetailData(res);
                //     this.showOrHideDialog();
                // })
            // },
            // 修改标签
            // handleEditInfo(score) {
            //     this.isReadOnly = false;
            //     getDetailById(score.row.id).then(res =>{
            //         this.dialogType = '修改标签';
            //         this.setDetailData(res);
            //         this.showOrHideDialog();
            //         this.userForm.id = res.data.id;
            //     })
            // },
            // 获取用户列表信息
            getTheList(num) {
                if(num == 1) {
                    this.searchForm.pageNo = 1;
                }
                this.listLoading = true;
                getAllList(this.searchForm).then(res => {
                    this.userList = res.data.rows;
                    this.total = res.data.total;
                    setTimeout(() => {
                        this.listLoading = false
                    }, 500)
                })
            },
            // 确认新增 修改
            // confirmUser(score) {
            //     this.$refs['userForm'].validate((valid) => {
            //         if (valid) {
            //             if(this.dialogType == '新增标签') {
            //                 addTags(this.userForm).then(res => {
            //                     if(res.status == 1) {
            //                         this.$message({
            //                             type: 'success',
            //                             message: '新增成功！'
            //                         });
            //                         this.getTheList();
            //                         this.showOrHideDialog();
            //                     }
            //                 });
            //             }
            //             if(this.dialogType == '修改标签') {
            //                 editTags(this.userForm).then(res => {
            //                     if(res.status == 1) {
            //                         this.$message({
            //                             type: 'success',
            //                             message: '修改成功！'
            //                         });
            //                         this.getTheList();
            //                         this.showOrHideDialog();
            //                     }
            //                 })
            //             }
            //         }
            //     })
            // },
            //删除角色
            // handleDelete(score) {
            //     this.$confirm('确定要删除该标签吗？', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     })
            //         .then(async () => {
            //             await delTags(score.row.id).then(res => {
            //                 if(res.status == 1){
            //                     this.$message({
            //                         type: 'success',
            //                         message: '删除成功!'
            //                     })
            //                     this.getTheList();
            //                 }
            //             })
            //         })
            //         .catch(err => {
            //             console.error(err)
            //         })
            // },
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
</style>
