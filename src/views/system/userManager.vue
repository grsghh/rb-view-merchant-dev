<template>
  <div class="contentBox">
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" label-width="80px" :inline="true">
            <!--            <el-form-item label="用户名：" prop="userName">-->
            <!--              <el-input class="myInput" v-model="searchForm.userName" placeholder="请输入用户名"></el-input>-->
            <!--            </el-form-item>-->
            <el-form-item label="姓名：" prop="realName">
              <el-input class="myInput" v-model="searchForm.realName" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input class="myInput" v-model="searchForm.mobile" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
              <el-select class="select" v-model="searchForm.roleId" clearable placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!--            <el-form-item label="状态" prop="disabled">-->
            <!--              <el-select class="select" v-model="searchForm.disabled" clearable placeholder="请选择">-->
            <!--                <el-option-->
            <!--                  v-for="item in isNormal"-->
            <!--                  :key="item.value"-->
            <!--                  :label="item.label"-->
            <!--                  :value="item.value"-->
            <!--                ></el-option>-->
            <!--              </el-select>-->
            <!--            </el-form-item>-->
            <el-form-item>
              <el-button size="small" type="primary" @click="getUserList(1)">查询</el-button>
              <el-button size="small" type="warning" @click="$refs.searchForm.resetFields()">清空</el-button>
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
        >新增
        </el-button>
<!--        v-if="$store.state.user.pageBtns.includes('add')"-->
        <!--        <el-button type="danger" v-if="$store.state.user.pageBtns.includes('del')"><i class="el-icon-delete"></i></el-button>-->
      </div>
      <div class="table">
        <el-table :data="userList" border style="width: 100%" v-loading="listLoading" height="470">
          <!--          <el-table-column-->
          <!--            type="selection"-->
          <!--            width="55">-->
          <!--          </el-table-column>-->
          <!--          <el-table-column align="center" label="ID" width="120">-->
          <!--            <template slot-scope="scope">{{ scope.row.id || '-'}}</template>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column align="center" label="用户名" width="120">-->
          <!--            <template slot-scope="scope">{{ scope.row.username || '-'}}</template>-->
          <!--          </el-table-column>-->
          <el-table-column align="center" label="姓名">
            <template slot-scope="scope">{{ scope.row.realName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="手机号" width="120">
            <template slot-scope="scope">{{ scope.row.mobile || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">{{ scope.row.disabledName }}</template>
          </el-table-column>
          <el-table-column align="center" label="角色" width="120">
            <template slot-scope="scope">{{ scope.row.roleName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="更新时间">
            <template slot-scope="scope">{{ scope.row.createTime || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="备注">
            <template slot-scope="scope">{{ scope.row.remark || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="260">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="handleView(scope)">查看</el-button>
              <el-button
                size="small"
                type="warning"
                @click="handleEditInfo(scope)"
                v-if="$store.state.user.pageBtns.includes('edit')"
              >修改
              </el-button>
<!--              <el-button-->
<!--                size="small"-->
<!--                type="warning"-->
<!--                @click="statusDialog(scope)"-->
<!--                v-if="$store.state.user.pageBtns.includes('edit')"-->
<!--              >停用/启用-->
<!--              </el-button>-->
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope)"
                v-if="$store.state.user.pageBtns.includes('del')"
              >删除
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
        @pagination="getUserList"
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
        <!-- employeeId -->
        <!--        <el-form-item label="用户名" prop="username">-->
        <!--          <el-input v-model="userForm.username" placeholder="" :disabled="dialogType == '查看'"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="用户姓名" prop="realName">
          <el-input v-model="userForm.realName" placeholder="用户姓名" :disabled="dialogType == '查看'"/>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="手机号" :disabled="dialogType == '查看'"/>
        </el-form-item>
        <!--        <el-form-item label="用户类型" prop="type">-->
        <!--          &lt;!&ndash; <el-input v-model="userForm.type" v-if="isReadOnly" placeholder="请输入类型"/> &ndash;&gt;-->
        <!--          <el-select class="select" v-model="userForm.type" placeholder="请选择" :disabled="dialogType != '新增用户'">-->
        <!--            <el-option-->
        <!--              v-for="item in userType"-->
        <!--              :key="item.value"-->
        <!--              :label="item.type"-->
        <!--              :value="item.value"-->
        <!--            ></el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="角色" prop="roleId">
          <el-select class="select" v-model="userForm.roleId" clearable placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="userForm.remark" placeholder=""/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;" v-show='dialogType =="查看用户" ? false : true '>
        <el-button type="primary" @click="confirmUser">确认</el-button>
        <el-button type="danger" @click="dialogVisible = false;userForm = {};">取消</el-button>
      </div>
    </el-dialog>
    <!-- 修改状态的弹框 -->
    <el-dialog :visible.sync="dialogVisibleStatus" :title="dialogStatusTitle">
      <el-form v-if="dialogVisibleStatus" :model="userStatus" label-width="80px" ref="userStatus" :rules="statusRule">
        <el-form-item label="现在状态">
          <el-input v-model="userStatus.oldStatus" :disabled="true"/>
        </el-form-item>
        <el-form-item label="选择状态" prop="disabled">
          <el-select class="select" v-model="userStatus.disabled" placeholder="请选择">
            <el-option
              v-for="item in isNormal"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;" v-show="dialogType != '查看用户'">
        <!-- <el-button type="danger" @click="dialogVisibleStatus = false; userStatus = {};"> -->
        <el-button type="primary" @click="alterStatus">确认</el-button>
        <el-button type="danger" @click="noSelectStatus">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getUser,
    getUserList,
    addUser,
    editUserInfo,
    delUser,
    alterUserStatus,
    getStatus,
    getAllRoles,
    getType
  } from '@/api/system-user'
  import Pagination from '@/components/Pagination'
  import {verifyMobile} from '@/utils'

  export default {
    name: 'UserManager',
    components: {Pagination},
    data() {
      return {
        selectName: '',
        selectForm: { // 职员
          pageNo: 1,
          pageSize:20,
          dapartmentId: '',
          mobile: '',
          name: '',
          positionId: ''
        },
        isReadOnly: false,
        userName: '',
        name: '',
        mobile: '',
        options: [],
        value: '',
        isNormal: [],
        value1: '',
        selectType: '',
        selectUserType: '',
        selectStatus: '',
        userList: [],
        dialogVisible: false,
        dialogVisiblePassword: false,
        dialogVisibleStatus: false,
        searchForm: {
          pageNo: 1
          , pageSize:20,
          // disabled: '',
          mobile: '',
          realName: '',
          roleId: ''
          ,type:2
          // userName: ''
        },
        listLoading: false,
        total: 0,
        dialogType: '',
        dialogTitle: '',
        dialogStatusTitle: '',
        selectList: [],
        selectTotal: 0,
        // 添加、修改表单数据
        userForm: {
          mobile: '',
          realName: '',
          type: '2',
          // username: '',
          remark: '',
          roleId: '',
        },
        userType: [],
        // 用户状态
        userStatus: {
          id: '',
          disabled: '',
          oldStatus: ''
          // selectStatus: ''
        },
        formRule: {
          type: [{required: true, message: '请输入选择用户类型', trigger: 'change'}],
          // employeeId:[{ required: true, message: '请选择职员', trigger: 'blur' }],
          // employeeName:[{ required: true, message: '请选择职员', trigger: 'blur' }],
          // username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          realName: [{required: true, message: '请输入用户姓名', trigger: 'blur'}],
          mobile: [{required: true, message: '请输入手机号', trigger: 'blur'}]
        },
        passwordRule: {
          oldPassword: [{required: true, message: '请输入旧密码', trigger: 'blur'}],
          newPassword: [{required: true, message: '请输入新密码', trigger: 'blur'}]
        },
        statusRule: {
          disabled: [{required: true, message: '请选择状态', trigger: 'change'}],
        }
      }
    },
    methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 取消状态选择
      noSelectStatus() {
        this.dialogVisibleStatus = false;
        this.userStatus = {
          id: '',
          disabled: '',
          oldStatus: ''
        }
      },
      // 取消修改
      dialogClose() {
        this.userForm = {
          mobile: '',
          realName: '',
          type: 2,
          // username: '',
          remark: '',
          roleId: ''
        };
      },
      // 获取用户状态
      getUserStatus() {
        getStatus().then(res => {
          if (res.status == 1) {
            let array = [];
            let len = res.data.length;
            for (let i = 0; i < len; i++) {
              let aa = {};
              aa['value'] = i + '';
              aa['label'] = res.data[i].entryValue;
              array.push(aa);
            }
            this.isNormal = array;
          }
        })
      },
      //获取 用户角色下拉框内容
      getUserRole() {
        getAllRoles({module: 2}).then(res => {
          if (res.status == 1) {
            let array = [];
            let len = res.data.length;
            for (let i = 0; i < len; i++) {
              let aa = {};
              aa['value'] = res.data[i].id;
              aa['label'] = res.data[i].name;
              array.push(aa);
            }
            this.options = array;
          }
        })
      },
      // // 用户类型的获取
      // getUserType() {
      //     getType().then(res => {
      //         if (res.status == 1) {
      //             let array = [];
      //             let len = res.data.length;
      //             for (let i = 0; i < len; i++) {
      //                 let aa = {};
      //                 aa['id'] = res.data[i].id;
      //                 aa['type'] = res.data[i].entryValue;
      //                 aa['value'] = res.data[i].entryKey;
      //                 array.push(aa);
      //             }
      //             this.userType = array;
      //         }
      //     })
      // },
      // 修改禁用状态的隐藏弹框
      showStatus() {
        this.dialogVisibleStatus = !this.dialogVisibleStatus;
      },
      //修改 禁用状态的弹框及 准备
      statusDialog(score) {
        this.dialogStatusTitle = '停用/启动';
        this.userStatus.id = score.row.id;
        this.userStatus.oldStatus = score.row.disabledName;
        this.showStatus();

      },
      // 确认修改状态
      alterStatus() {
        this.$refs['userStatus'].validate((valid) => {
          if (valid) {
            // this.userStatus.disabled = this.selectStatus;
            alterUserStatus(this.userStatus).then(res => {
              if (res.status == 1) {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                });
                this.userStatus.disabled = '';
                this.getUserList();
                this.showStatus();
              }
            })
          }
        })
      },
      //显示新增 修改 查看 的隐藏弹窗
      showOrHideDialog() {
        this.dialogVisible = !this.dialogVisible;
      },
      // 新增用户
      addDialog() {
        this.dialogType = '新增用户';
        this.isReadOnly = false;
        this.showOrHideDialog();
      },
      //查看用户
      handleView(score) {
        this.isReadOnly = true;
        getUser(score.row.id).then(res => {
          this.dialogType = '查看用户';
          this.setDetailData(res);
          this.showOrHideDialog();
        })
      },
      // 修改用户
      handleEditInfo(score) {
        this.isReadOnly = false;
        getUser(score.row.id).then(res => {
          this.dialogType = '修改用户';
          this.userForm.id = res.data.id;
          this.setDetailData(res);
          this.showOrHideDialog();
        })
      },
      // 获取用户列表信息
      getUserList(num) {
        if (num == 1) {
          this.searchForm.pageNo = 1;
        }
        this.listLoading = true;
        getUserList(this.searchForm).then(res => {
          this.userList = res.data.rows;
          this.total = res.data.total;
          setTimeout(() => {
            this.listLoading = false
          }, 500)
        })
      },
      // 确认新增 查看 修改
      confirmUser(score) {
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            if (this.dialogType == '新增用户') {
              // this.userForm.type = this.selectUserType;
              if (!verifyMobile(this.userForm.mobile)) {
                this.$message({
                  type: 'warning',
                  message: '请输入正确的手机号！'
                });
                return;
              }
              addUser(this.userForm).then(res => {
                if (res.status == 1) {
                  this.$message({
                    type: 'success',
                    message: '新增成功！'
                  });
                  this.getUserList();
                  this.showOrHideDialog();
                }
              });
            }
            if (this.dialogType == '修改用户') {
              editUserInfo(this.userForm).then(res => {
                if (res.status == 1) {
                  this.$message({
                    type: 'success',
                    message: '修改成功！'
                  });
                  this.getUserList();
                  this.showOrHideDialog();
                }
              })
            }
          }
        })
      },
      //删除角色
      handleDelete(score) {
        this.$confirm('确定要删除该用户吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            await delUser(score.row.id).then(res => {
              this.getUserList();
            })
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(err => {
            console.error(err)
          })
      },
      //查看/修改信息时赋值
      setDetailData(res) {
        // console.log(res);
        // this.selectUserType = res.data.type.toString();
        // this.userForm.username = res.data.username;
        this.userForm.mobile = res.data.mobile;
        this.userForm.realName = res.data.realName;
        this.userForm.remark = res.data.remark;
        this.userForm.roleId = res.data.roleId ? res.data.roleId : null;
        // this.userForm.type = res.data.type.toString();
      },
      selectSomeOne(data) {
        if (data.row) {
          this.userForm.employeeName = data.row.name;
          this.userForm.employeeId = data.row.id;
          this.userForm.username = data.row.mobile;
          this.userForm.realName = data.row.name;
          this.userForm.mobile = data.row.mobile;
          this.innerVisible = false;
        }
      }
    },
    created() {
      this.getUserList();
      this.getUserStatus();
      this.getUserRole();
      // this.getUserType();
    }
  }
</script>

<style>
  .main-block .myInput .el-input__inner {
    width: 100%;
  }

  .selectName {
    width: 200px;
  }
</style>
