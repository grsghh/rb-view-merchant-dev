<template>
  <div class="contentBox">
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" label-width="80px" :inline="true">
            <el-form-item label="名称：" prop="name">
              <el-input class="myInput" v-model="searchForm.name" placeholder="供货商名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input class="myInput" v-model="searchForm.mobile" placeholder="请输入手机号" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getSupplierList(1)">查询</el-button>
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
        <el-button
        type="primary"
        @click="educe()"
        v-if="$store.state.user.pageBtns.includes('export')"
      >导出</el-button>
<!--        v-if="$store.state.user.pageBtns.includes('add')"-->
      </div>
      <div class="table">
        <el-table :data="userList" border style="width: 100%" v-loading="listLoading" height="470" @selection-change="handleSelectionChange">
<!--          <el-table-column-->
<!--            type="selection"-->
<!--            width="55">-->
<!--          </el-table-column>-->
          <el-table-column align="center" label="名称">
            <template slot-scope="scope">{{ scope.row.name || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="品牌">
            <template slot-scope="scope">{{ scope.row.brandName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="手机号" width="110">
            <template slot-scope="scope">{{ scope.row.mobile || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="联系人">
            <template slot-scope="scope">{{ scope.row.linkMan || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="所在区域" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.provinceName }}{{ scope.row.cityName }}{{ scope.row.countyName }}</template>
          </el-table-column>
          <el-table-column align="center" label="发货方式" width="100">
            <template slot-scope="scope">{{ scope.row.deliveryTypeName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="发货地址" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.address || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="备注" >
            <template slot-scope="scope">{{ scope.row.remark || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" :width="$settings.dateWidth" fixed="right">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="handleView(scope)">查看</el-button>
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
        @pagination="getSupplierList"
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
        <el-form-item label="供货商" prop="name">
          <el-input v-model="userForm.name" placeholder="供货商名称"/>
        </el-form-item>
        <el-form-item label="品牌" prop="brandId">
            <el-select class="select" v-model="userForm.brandId" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in brandList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="输入手机号"/>
        </el-form-item>
        <el-form-item label="联系人" prop="linkMan">
          <el-input v-model="userForm.linkMan" placeholder="输入联系人"/>
        </el-form-item>
        <el-form-item label="所属区域" prop="countyCode">
          <el-select @change="change" @clear="clear(1)" class="select" v-model="userForm.provinceCode" clearable filterable placeholder="省">
            <el-option
              v-for="item in province"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
          <el-select @change="changecity" @clear="clear(2)" class="select" v-model="userForm.cityCode" clearable filterable placeholder="市">
            <el-option
              v-for="item in city"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
          <el-select class="select" v-model="userForm.countyCode" clearable filterable placeholder="县">
            <el-option
              v-for="item in county"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发货方式" prop="deliveryType">
          <el-select class="select" v-model="userForm.deliveryType" clearable filterable placeholder="选择发货方式">
            <el-option
              v-for="item in deliveryTypeList"
              :key="item.id"
              :label="item.entryValue"
              :value="item.entryKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发货地址" prop="address">
          <el-input v-model="userForm.address" placeholder="详细地址"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="userForm.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;" v-show='dialogType =="查看供应商" ? false : true '>
        <el-button type="primary" @click="confirmUser">确认</el-button>
        <el-button type="danger" @click="dialogVisible = false;userForm = {};">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSupplier, allBrand, dicts, getDetailById, addSupplier, editSupplier, delSupplier, area } from '@/api/supplier'
import Pagination from '@/components/Pagination'
import { verifyMobile } from '@/utils'
import {exportExcel} from '@/utils/exportExcel'
import {supplierExport} from '@/api/report'
export default {
  name: 'supplier',
  components: { Pagination },
  data() {
    return {
        province:[],
        city:[],
        county:[],
        deliveryTypeList: [],
        brandList: [],
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
            name: ''
      } ,
      listLoading: false,
      total: 0,
      dialogType: '',
      // 添加、修改表单数据
      userForm: {
          name: '',
          brandId: '',
          mobile: '',
          linkMan: '',
          provinceCode: '',
          cityCode: '',
          countyCode: '',
          address: '',
          remark: '',
          deliveryType: ''
      },
        multipleSelection: [],
      formRule: {
        name: [{ required: true, message: '请输入供货商名称', trigger: 'blur' }],
          countyCode:[{ required: true, message: '请选择区域', trigger: 'change' }],
        brandId:[{ required: true, message: '请选择品牌', trigger: 'change' }],
          deliveryType:[{ required: true, message: '请选择发货方式', trigger: 'change' }],
          linkMan:[{ required: true, message: '请输入联系人', trigger: 'blur' }],
        mobile:[{ required: true, message: '联系人手机号', trigger: 'blur' }]
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
          brandId: '',
          mobile: '',
          linkMan: '',
          provinceCode: '',
          cityCode: '',
          countyCode: '',
          address: '',
          remark: '',
          deliveryType: ''
      };
    },
    // 获取所有品牌
      allBrand() {
          allBrand().then(res => {
              this.brandList = res.data
      })
    },
    //显示新增 修改 查看 的隐藏弹窗
    showOrHideDialog() {
        this.dialogVisible = !this.dialogVisible;
    },
    // 新增供货商
    addDialog() {
      this.dialogType = '新增供货商';
      this.isReadOnly = false;
      this.showOrHideDialog();
    },
    //查看供应商
    handleView(score) {
        this.isReadOnly = true;
        getDetailById(score.row.id).then(res =>{
          this.dialogType = '查看供应商';
          this.setDetailData(res);
          this.showOrHideDialog();
        })
    },
    // 修改用户
    handleEditInfo(score) {
      this.isReadOnly = false;
        getDetailById(score.row.id).then(res =>{
          this.dialogType = '修改用户';
          this.setDetailData(res);
          this.showOrHideDialog();
          this.userForm.id = res.data.id;
        })
    },
    // 获取用户列表信息
    getSupplierList(num) {
      if(num == 1) {
        this.searchForm.pageNo = 1;
      }
      this.listLoading = true;
        getSupplier(this.searchForm).then(res => {
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
      if(this.dialogType == '新增供货商') {
        // this.userForm.type = this.selectUserType;
        if(!verifyMobile(this.userForm.mobile)) {
          this.$message({
            type: 'warning',
            message: '请输入正确的手机号！'
          });
          return;
        }
          addSupplier(this.userForm).then(res => {
          if(res.status == 1) {
            this.$message({
              type: 'success',
              message: '新增成功！'
            });
            this.getSupplierList();
            this.showOrHideDialog();
          }
        });
      }
      if(this.dialogType == '修改用户') {
          console.log(this.userForm)
          editSupplier(this.userForm).then(res => {
          if(res.status == 1) {
              this.$message({
                  type: 'success',
                  message: '修改成功！'
              });
            this.getSupplierList();
            this.showOrHideDialog();
          }
        })
      }
    }
      })
    },
    //删除角色
    handleDelete(score) {
        this.$confirm('确定要删除该供应商吗？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(async () => {
                console.log(score)
                await delSupplier(score.row.id).then(res => {
                  if(res.status == 1){
                    this.getSupplierList();
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
          let that = this;
          let provinceCode = res.data.provinceCode;
          let cityCode = res.data.cityCode;
          this.userForm = {
              name: res.data.name,
              brandId: res.data.brandId,
              mobile: res.data.mobile,
              linkMan: res.data.linkMan,
              provinceCode: res.data.provinceCode,
              cityCode: res.data.cityCode,
              countyCode: res.data.countyCode,
              address: res.data.address,
              deliveryType: res.data.deliveryType.toString(),
              remark: res.data.remark
          }
          area({type:1,parentCode:''}).then(res => {
              if (res.status == 1) {
                  that.province = res.data
                  area({type:2,parentCode: provinceCode}).then(res1 => {
                      if (res1.status == 1) {
                          that.city = res1.data
                          area({type:3,parentCode:cityCode}).then(res => {
                              if (res.status == 1) {
                                  that.county = res.data
                              }
                          })
                      }
                  })
              }
          })
      },
      // 清空省市县触发事件
      clear(data) {
          if(data == 1) {
              this.city = [];
              this.county = [];
              this.userForm.cityCode = '';
              this.userForm.countyCode = '';
          } else {
              this.county = [];
              this.userForm.countyCode = '';
          }
      },
      //获取省市区
      getProvince() {
          area({type:1,parentCode:''}).then(res => {
              if (res.status == 1) {
                  this.province = res.data
              }
          })
      },
      //获取市区
      getcity(code){
          area({type:2,parentCode:code}).then(res => {
              if(res.status == 1){
                  this.city = res.data
              }
          })
      },
      //获取县
      getcountry(code){
          area({type:3,parentCode:code}).then(res=>{
              if(res.status == 1){
                  this.county = res.data
              }
          })
      },
      change(){
          this.getcity(this.userForm.provinceCode)
          this.userForm.cityCode = ''
          this.userForm.countyCode = ''
      },
      changecity(){
          this.getcountry(this.userForm.cityCode)
          this.userForm.countyCode = ''
      },
      // 获取发货方式
      getTypeList() {
        dicts(100004).then(res => {
            this.deliveryTypeList = res.data;
        })
      },
      //导出
      educe(){
        let exl = {
          //表头，必填
          tHeader: ['名称', '品牌', '手机号',  '联系人', '所在区域', '发货方式', '发货地址', '备注']
          ,
          //表头对应的数据，顺序要与表头一致 ，必填
          filterVal: ['name', 'brandName', 'mobile', 'linkMan', "area", 'deliveryTypeName', 'address', 'remark']
          ,
          filename: '供应商列表'
        };
        supplierExport(this.searchForm).then(res => {
          //需要导出的数据 ，必填
          for(let i in res.data){
            res.data[i].area = res.data[i].provinceName + res.data[i].cityName + res.data[i].countyName
          }
          exl.list = res.data;
          exportExcel(exl);
        })
      }
  },
  created() {
    this.getSupplierList();
    this.allBrand();
    this.getTypeList();
    this.getProvince();
  }
}
</script>

<style>
.main-block .myInput .el-input__inner {
  width: 100%;
}
</style>
