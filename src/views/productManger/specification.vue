<template>
  <div class="contentBox">
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" label-width="80px" :inline="true">
            <el-form-item label="名称：" prop="userName">
              <el-input class="myInput" v-model="searchForm.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="disabled">
              <el-select class="select" v-model="searchForm.disabled" clearable placeholder="请选择">
                <el-option
                  v-for="item in isNormal"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="规格" prop="disabled">
              <el-select class="select" v-model="searchForm.disabled" clearable placeholder="请选择">
                <el-option
                  v-for="item in isNormal"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getUserList(1)">查询</el-button>
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
      >新增</el-button>
        <el-button
        type="primary"
      >导出</el-button>
<!--        v-if="$store.state.user.pageBtns.includes('add')"-->
      </div>
      <div class="table">
        <el-table :data="userList" border style="width: 100%" v-loading="listLoading" height="470">
<!--                    <el-table-column-->
<!--                      type="selection"-->
<!--                      width="55">-->
<!--                    </el-table-column>-->
          <el-table-column align="center" label="规格分类">
            <template slot-scope="scope">{{ scope.row.username || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="规格名称">
            <template slot-scope="scope">{{ scope.row.mobile || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="规格属性">
            <template slot-scope="scope">{{ scope.row.realName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="备注">
            <template slot-scope="scope">{{ scope.row.roleName || '-'}}</template>
          </el-table-column>
<!--          <el-table-column align="center" label="地址" :width="$settings.dateWidth" >-->
<!--            <template slot-scope="scope">{{ scope.row.updateTime || '-'}}</template>-->
<!--          </el-table-column>-->
          <el-table-column align="center" label="操作" :width="$settings.dateWidth" fixed="right">
<!--              <el-button size="small" type="primary" @click="handleView(scope)">查看</el-button>-->
            <template slot-scope="scope">
              <el-button
                size="small"
                type="warning"
                @click="handleEditInfo(scope)"
              >修改</el-button>
<!--              v-if="$store.state.user.pageBtns.includes('edit')"-->
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope)"
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
      <!-- 选择职员的弹框 -->
      <el-dialog
        width="70%"
        title="职员选择"
        :visible.sync="innerVisible"
        append-to-body>
        <el-row class="main-block main-ipt">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="selectForm" :model="selectForm" label-width="100px" :inline="true">
            <el-form-item label="职员名称：" prop="name">
              <el-input v-model="selectForm.name" placeholder="请输入职员名称"></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="mobile">
              <el-input v-model="selectForm.mobile" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="部门：" prop="dapartmentId">
              <el-select v-model="selectForm.dapartmentId" filterable clearable placeholder="全部">
                <el-option
                  v-for="item in dapartmentList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="职务：" prop="positionId">
              <el-select v-model="selectForm.positionId" filterable clearable placeholder="全部">
                <el-option
                  v-for="item in positionList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getList(1)">查询</el-button>
              <el-button size="small" type="warning" @click="$refs.selectForm.resetFields()">清空</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
    <el-row class="main-block">
      <el-card>
        <el-table :data="selectList" style="width: 100%;"
                  border
                  v-loading="listLoading"
                  height="320"
        >
          <!-- <el-table-column align="center" label="ID">
            <template slot-scope="scope">
              {{ scope.row.id || '-'}}
            </template>
          </el-table-column> -->
          <el-table-column align="center" label="姓名">
            <template slot-scope="scope">
              {{ scope.row.name || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="手机号">
            <template slot-scope="scope">
              {{ scope.row.mobile || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="部门">
            <template slot-scope="scope">
              {{ scope.row.dapartmentName || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="职务">
            <template slot-scope="scope">
              {{ scope.row.positionName || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="selectSomeOne(scope)">
                确认
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="selectTotal>0" :total="selectTotal" :page.sync="selectForm.pageNo" :limit.sync="selectForm.pageSize"
                    @pagination="getList"/>
      </el-card>
    </el-row>
      </el-dialog>
      <!-- employeeId -->
        <el-form-item label="规格分类" prop="username">
          <el-input v-model="userForm.username" placeholder="请选择职员" disabled/>
        </el-form-item>
        <el-form-item label="规格名称" prop="realName">
          <el-input v-model="userForm.realName" placeholder="请选择职员" disabled/>
        </el-form-item>
        <el-form-item label="规格属性" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请选择职员" disabled/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="userForm.remark" placeholder="请输入备注" />
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
import { getUser, getUserList, addUser, editUserInfo, delUser, alterUserPassword, alterUserStatus, getStatus, getAllRoles, getType } from '@/api/system-user'
import { positions, departments, Employees } from '@/api/manage'
import Pagination from '@/components/Pagination'
import { verifyMobile } from '@/utils'
export default {
  name: 'specification',
  components: { Pagination },
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
      positionList: [],//职务
      dapartmentList: [],//部门
      innerVisible: false, // 职员选择的内层弹框
      isReadOnly: false,
      userName: '',
      name: '',
      mobile: '',
      options: [],
      value: '',
      isNormal: [],
      value1: '',
      selectType: '',
      selectUserType:'',
      selectStatus: '',
      userList: [],
      dialogVisible: false,
      dialogVisiblePassword: false,
      dialogVisibleStatus: false,
      searchForm: {
        pageNo: 1
        , pageSize:20
        ,  disabled: '',
            mobile: '',
            realName: '',
            roleId: '',
            userName: ''
      } ,
      listLoading: false,
      total: 0,
      dialogType: '',
      dialogTitle: '',
      dialogStatusTitle: '',
      selectList: [],
      selectTotal: 0,
      // 添加、修改表单数据
      userForm: {
          employeeId: '',
          mobile: '',
          realName: '',
          type: '',
          username:''
          ,remark:'',
          roleId: '',
          employeeName: ''
      },
      userType: [],
      // 用户密码
      userPassword: {
        id: '',
        oldPassword: '',
        newPassword: ''
      },
      // 用户状态
      userStatus: {
        id: '',
        disabled: '',
        oldStatus: ''
        // selectStatus: ''
      },
      formRule: {
        type: [{ required: true, message: '请输入选择用户类型', trigger: 'change' }],
        // employeeId:[{ required: true, message: '请选择职员', trigger: 'blur' }],
        // employeeName:[{ required: true, message: '请选择职员', trigger: 'blur' }],
        username:[{ required: true, message: '请输入用户名', trigger: 'blur' }],
        realName:[{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        mobile:[{ required: true, message: '请输入手机号', trigger: 'blur' }]
      },
      passwordRule: {
        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPassword:[{ required: true, message: '请输入新密码', trigger: 'blur' }]
      },
      statusRule: {
        disabled: [{ required: true, message: '请选择状态', trigger: 'change' }],
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
    // 取消密码选择
    noSetPassword() {
      this.dialogVisiblePassword = false;
      this.userPassword = {
        id: '',
        oldPassword: '',
        newPassword: ''
      }
    },
    // 取消修改
    dialogClose() {
      this.userForm = {
        employeeId: '',
        employeeName: '',
        mobile: '',
        realName: '',
        type: '',
        username:''
          ,remark:'',
          roleId: ''
      };
    },
    // 获取用户状态
    getUserStatus() {
      getStatus().then(res => {
        if(res.status == 1) {
          let array = [];
          let len = res.data.length;
          for(let i = 0; i < len; i++) {
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
      getAllRoles().then(res => {
        if(res.status == 1) {
          let array = [];
          let len = res.data.length;
          for(let i = 0; i < len; i++) {
            let aa = {};
            aa['value'] = res.data[i].id;
            aa['label'] = res.data[i].name;
            array.push(aa);
          }
          this.options = array;
        }
      })
    },
    // 用户类型的获取
    getUserType() {
      getType().then(res => {
        if(res.status == 1) {
          let array = [];
          let len = res.data.length;
          for(let i = 0; i < len; i++) {
            let aa = {};
            aa['id'] = res.data[i].id;
            aa['type'] = res.data[i].entryValue;
            aa['value'] = res.data[i].entryKey;
            array.push(aa);
          }
          this.userType = array;
        }
      })
    },
    //获取职务
    getposition() {
      positions(9999).then(res => {
        this.positionList = res.data.rows
      })
    },
    //获取部门
    getDepartment() {
      departments(9999).then(res => {
        if (res.status == 1) {
          this.dapartmentList = res.data.rows
        }
      })
    },
    // 修改密码隐藏弹窗
    showPassword() {
      this.dialogVisiblePassword = !this.dialogVisiblePassword;
    },
    // 修改禁用状态的隐藏弹框
    showStatus() {
      this.dialogVisibleStatus = !this.dialogVisibleStatus;
    },
    // 修改密码的弹框 及 准备
    passwordDialog(score) {
      this.dialogTitle = '修改密码';
      this.userPassword.id = score.row.id;
      this.showPassword();
    },
    //修改 禁用状态的弹框及 准备
    statusDialog(score) {
      this.dialogStatusTitle = '修改禁用状态';
      this.userStatus.id = score.row.id;
      this.userStatus.oldStatus = score.row.disabledName;
      this.showStatus();

    },
    //确认修改密码
    alterPassword() {
      this.$refs['userPassword'].validate((valid) => {
          if (valid) {
      alterUserPassword(this.userPassword).then(res => {
        if(res.status == 1){
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
            this.userPassword = {
                id: '',
                oldPassword: '',
                newPassword: ''
            };
            this.showPassword();
        }
      })
          }
      })
    },
    // 确认修改状态
    alterStatus() {
      this.$refs['userStatus'].validate((valid) => {
          if (valid) {
      // this.userStatus.disabled = this.selectStatus;
      alterUserStatus(this.userStatus).then(res => {
        if(res.status == 1) {
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
        getUser(score.row.id).then(res =>{
          this.dialogType = '查看用户';
          this.setDetailData(res);
          this.showOrHideDialog();
        })
    },
    // 修改用户
    handleEditInfo(score) {
      this.isReadOnly = false;
      getUser(score.row.id).then(res =>{
          this.dialogType = '修改用户';
          this.userForm.id = res.data.id;
          this.setDetailData(res);
          this.showOrHideDialog();
        })
    },
    // 获取用户列表信息
    getUserList(num) {
      if(num == 1) {
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
      if(this.dialogType == '新增用户') {
        // this.userForm.type = this.selectUserType;
        console.log(this.userForm.mobile);
        if(!verifyMobile(this.userForm.mobile)) {
          this.$message({
            type: 'warning',
            message: '请输入正确的手机号！'
          });
          return;
        }
addUser(this.userForm).then(res => {
          if(res.status == 1) {
            this.$message({
              type: 'success',
              message: '新增成功！'
            });
            this.getUserList();
            this.showOrHideDialog();
          }
        });
      }
      if(this.dialogType == '修改用户') {
        // console.log(this.userForm);
        editUserInfo(this.userForm).then(res => {
          if(res.status == 1) {
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
      setDetailData(res){
        // console.log(res);
          this.selectUserType = res.data.type.toString();
          this.userForm.employeeId = res.data.employeeId;
          this.userForm.employeeName = res.data.employeeName;
          this.userForm.username = res.data.username;
          this.userForm.mobile = res.data.mobile;
          this.userForm.realName = res.data.realName;
          this.userForm.remark = res.data.remark;
          this.userForm.roleId = res.data.roleId ? res.data.roleId.toString() : null;
          this.userForm.type = res.data.type.toString();
      },
      getList(num) { // 获取职员的列表
        if(num == 1) {
          this.selectForm.pageNo = 1;
        }
        this.listLoading = true
        Employees(this.selectForm).then(res => {
          if (res.status == 1) {
            this.selectList = res.data.rows
            this.selectTotal = res.data.total
            setTimeout(() => {
              this.listLoading = false
            }, 500)
          }
        })
      },
      selectSomeOne(data) {
        console.log(data.row);
        if(data.row) {
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
    this.getList(); // 获得职员信息
    this.getUserList();
    this.getUserStatus();
    this.getUserRole();
    this.getUserType();
    this.getposition(); // 获取职务
    this.getDepartment(); // 获取部门
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
