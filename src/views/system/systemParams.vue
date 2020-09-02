<template>
  <div class="contentBox" style="background-color: #fff">
    <template>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基础设置" name="first">
          <div class="addShopper">
            <el-row class="main-block">
              <el-card class="box-card">
                <el-form :model="itemForm" ref="itemForm" :rules="FormRules" label-width="120px">
                  <div class="fl">
                    <el-form-item label="商户名称：" prop="name">
                      <el-input v-model="itemForm.name" placeholder="商户名称"/>
                    </el-form-item>
                    <el-form-item label="所属区域：" prop="countyCode">
                      <el-select @change="change" @clear="clear(1)" class="select" v-model="itemForm.provinceCode" clearable filterable placeholder="省">
                        <el-option
                          v-for="item in province"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        ></el-option>
                      </el-select>
                      <el-select @change="changecity" @clear="clear(2)"  class="select" v-model="itemForm.cityCode" clearable filterable placeholder="市">
                        <el-option
                          v-for="item in city"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        ></el-option>
                      </el-select>
                      <el-select class="select" v-model="itemForm.countyCode" clearable filterable placeholder="县">
                        <el-option
                          v-for="item in county"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="详细地址：" prop="address">
                      <textarea v-model="itemForm.address" placeholder="" name="" id="" cols="30" rows="10" style="width: 100%;"></textarea>
                    </el-form-item>
                    <el-form-item label="LOGO：" prop="logoFileId" required>
                      <el-upload
                        :action="$url.fileUploadUrl"
                        list-type="picture-card"
                        :headers="upLoadHeader"
                        :on-success="upIdPic"
                        accept="image/*"
                        :limit="1"
                        :file-list="logoList"
                      >
                        <i class="el-icon-plus"></i>
                        <!--                <i slot="default" class="el-icon-plus"></i>-->
                        <div slot="file" slot-scope="{file}">
                          <img
                            class="el-upload-list__item-thumbnail"
                            :src="file.url" alt=""
                          >
                          <span class="el-upload-list__item-actions">
                    <span
                      v-if="!disabled"
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                        </div>
                      </el-upload>
                    </el-form-item>
                  </div>
                  <div class="fr">
                    <el-form-item label="固定电话：" prop="telephone">
                      <el-input v-model="itemForm.telephone" placeholder="固定电话"/>
                    </el-form-item>
                    <el-form-item label="联系人：" prop="linkMan">
                      <el-input v-model="itemForm.linkMan" placeholder="联系人"/>
                    </el-form-item>
                    <el-form-item label="手机号码：" prop="mobile">
                      <el-input v-model="itemForm.mobile" placeholder="手机号码"/>
                    </el-form-item>
                    <el-form-item label="法人姓名：" prop="legalPerson">
                      <el-input v-model="itemForm.legalPerson" placeholder="法人姓名"/>
                    </el-form-item>
                    <!--            <el-form-item label="账号：" prop="loadRate">-->
                    <!--              <el-input v-model="itemForm.loadRate" placeholder=""/>-->
                    <!--            </el-form-item>-->
                    <!--            <el-form-item label="密码：" prop="loadRate">-->
                    <!--              <el-input v-model="itemForm.loadRate" placeholder=""/>-->
                    <!--            </el-form-item>-->
                    <!--            <el-form-item label="确认密码：" prop="loadRate">-->
                    <!--              <el-input v-model="itemForm.loadRate" placeholder=""/>-->
                    <!--            </el-form-item>-->
                  </div>
                </el-form>
                <div style="text-align: right">
                  <el-button type="primary" @click="editSetting">保存</el-button>
<!--                  <el-button @click="editSetting">取消</el-button>-->
                </div>
              </el-card>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="地址管理" name="second">
          <el-card class="logistics">
            <div class="queryContent">
              <div class="top">
                <el-button type="primary" @click="addDialog" v-if="$store.state.user.pageBtns.includes('add')">新增</el-button>
              </div>
              <div class="table">
                <!--        @selection-change="handleSelectionChange"-->
                <el-table :data="userList" border style="width: 100%" v-loading="listLoading" height="470">
                  <!--          <el-table-column-->
                  <!--            type="selection"-->
                  <!--            width="55">-->
                  <!--          </el-table-column>-->
                  <el-table-column align="center" label="收件人">
                    <template slot-scope="scope">{{ scope.row.linkMan || '-'}}</template>
                  </el-table-column>
                  <el-table-column align="center" label="电话">
                    <template slot-scope="scope">{{ scope.row.mobile || '-'}}</template>
                  </el-table-column>
                  <el-table-column align="center" label="区域">
                    <template slot-scope="scope">{{ scope.row.provinceName }}{{ scope.row.cityName }}{{ scope.row.countyName }}</template>
                  </el-table-column>
                  <el-table-column align="center" label="详细地址">
                    <template slot-scope="scope">{{ scope.row.address || '-'}}</template>
                  </el-table-column>
                  <el-table-column align="center" label="用途">
                    <template slot-scope="scope">{{ scope.row.typeName || '-'}}</template>
                  </el-table-column>
                  <el-table-column align="center" label="是否默认">
                    <template slot-scope="scope">{{ scope.row.isDefault == 0 ? "否" : "是"}}</template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" :width="270" fixed="right">
                    <template slot-scope="scope">
                      <el-button
                        size="small"
                        type="primary"
                        @click="handleSet(scope)"
                        v-if="$store.state.user.pageBtns.includes('setDefault')"
                      >设为默认</el-button>
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
            </div>
          </el-card>
        </el-tab-pane>
<!--        <el-tab-pane label="微信支付配置" name="third">-->
<!--          <el-card class="logistics">-->
<!--            <el-form-->
<!--              :model="payForm"-->
<!--              label-width="170px"-->
<!--              ref="payForm"-->
<!--              :rules="settingRule"-->
<!--            >-->
<!--              <el-form-item label="支付名称" prop="paymentName">-->
<!--                <el-input v-model="payForm.paymentName" placeholder="支付名称"/>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="微信支付应用ID" prop="paymentAppId">-->
<!--                <el-input v-model="payForm.paymentAppId" placeholder="微信支付应用ID"/>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="微信支付访问密钥" prop="paymentAccessKey">-->
<!--                <el-input v-model="payForm.paymentAccessKey" placeholder="请输入备注" />-->
<!--              </el-form-item>-->
<!--              <el-form-item label="微信支付商户id" prop="paymentMerchantId">-->
<!--                <el-input v-model="payForm.paymentMerchantId" placeholder="请输入备注" />-->
<!--              </el-form-item>-->
<!--              <el-form-item label="微信支付商户密钥" prop="paymentMerchantKey">-->
<!--                <el-input v-model="payForm.paymentMerchantKey" placeholder="请输入备注" />-->
<!--              </el-form-item>-->
<!--              <el-form-item label="微信支付签名密钥" prop="paymentSignKey">-->
<!--                <el-input v-model="payForm.paymentSignKey" placeholder="请输入备注" />-->
<!--              </el-form-item>-->
<!--              <el-form-item label="是否开通" prop="isOpen">-->
<!--                <el-switch-->
<!--                  v-model="payForm.isOpen">-->
<!--                </el-switch>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="备注" prop="remark">-->
<!--                <el-input v-model="payForm.remark" placeholder="请输入备注" />-->
<!--              </el-form-item>-->
<!--            </el-form>-->
<!--            <div style="text-align:right;">-->
<!--              <el-button type="primary" @click="payConfirm">保存</el-button>-->
<!--&lt;!&ndash;              <el-button type="danger">取消</el-button>&ndash;&gt;-->
<!--            </div>-->
<!--          </el-card>-->
<!--        </el-tab-pane>-->
        <el-tab-pane label="代理分佣设置" name="fourth">
          <el-card class="agent">
            <el-form
              :model="agentForm"
              label-width="170px"
              ref="agentForm"
              :rules="agentFormRule"
            >
              <el-form-item label="是否开通" prop="isOpen">
                <el-switch
                  v-model="agentForm.isOpen" :active-value="1" :inactive-value="0">
                </el-switch>
              </el-form-item>
              <template v-if="agentForm.isOpen">
                <el-form-item label="直属代理接单奖励：" prop="firstAgentConfig">
                  <el-input v-model="agentForm.firstAgentConfig" placeholder=""/>
                </el-form-item>
                <el-form-item label="间推代理接单奖励：" prop="secondAgentConfig">
                  <el-input v-model="agentForm.secondAgentConfig" placeholder=""/>
                </el-form-item>
                <el-form-item label="三级代理接单奖励：" prop="thirdAgentConfig">
                  <el-input v-model="agentForm.thirdAgentConfig" placeholder="" />
                </el-form-item>
              </template>
            </el-form>
            <div style="text-align:right;">
              <el-button type="primary" @click="agentConfirm">保存</el-button>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </template>
    <!-- 新增 修改 查看的弹框 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType" @close="dialogClose">
      <el-form
        v-if="dialogVisible"
        :model="addressForm"
        label-width="80px"
        ref="addressForm"
        :rules="formRule"
      >
        <el-form-item label="收件人" prop="linkMan">
          <el-input v-model="addressForm.linkMan" placeholder="收件人名称"/>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addressForm.mobile" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="所属区域" prop="countyCode">
          <el-select @change="addressChange" @clear="clear1(1)" class="select" v-model="addressForm.provinceCode" clearable filterable placeholder="省">
            <el-option
              v-for="item in addressProvince"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
          <el-select @change="addressChangecity" @clear="clear1(2)"  class="select" v-model="addressForm.cityCode" clearable filterable placeholder="市">
            <el-option
              v-for="item in addressCity"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
          <el-select class="select" v-model="addressForm.countyCode" clearable filterable placeholder="县">
            <el-option
              v-for="item in addressCounty"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="addressForm.address" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="用途" prop="type">
          <el-radio-group v-model="addressForm.type">
            <el-radio :label="3">发货</el-radio>
            <el-radio :label="2">退货</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否默认" prop="remark">
          <el-switch
            v-model="addressForm.isDefault">
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align:right;" v-show='dialogType =="查看标签" ? false : true '>
        <el-button type="primary" @click="confirmUser">确认</el-button>
        <el-button type="danger" @click="noConfirmUser">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import { getToken } from '@/utils/auth'
    import { getSetting, editSetting, area, getList, getDetailById, addAddress, editAddress, delAddress, setAddress, getPayDetail, setPayDetail,apiRebatesConfig,apiSetRebatesConfig } from '@/api/systemParams'
    import { dicts } from '@/api/supplier'
    export default {
        name: 'addShopper',
        data() {
            return {
                activeName: 'first',
                dialogVisible: false,
                dialogType: '',
                listLoading: false,
                userList: [],
                itemForm: {
                    address: "",
                    cityCode: "",
                    countyCode: "",
                    provinceCode: "",
                    description: "",
                    disabled: 0,
                    linkMan: "",
                    logoFileId: "",
                    mobile: "",
                    name: "",
                    telephone: "",
                    legalPerson:''
                },
                FormRules: {
                    name: [{ required: true, trigger: 'blur', message: '请输入商户名称' }],
                    address: [{ required: true, trigger: 'blur', message: '请输入详细地址' }],
                    linkMan: [{ required: true, trigger: 'blur', message: '请输入联系人' }],
                    mobile: [{ required: true, trigger: 'blur', message: '请输入手机号码' }],
                    telephone: [{ required: true, trigger: 'blur', message: '请输入固定电话' }],
                    legalPerson: [{ required: true, trigger: 'blur', message: '请输入法人姓名' }],
                    countyCode: [{ required: true, trigger: 'change', message: '请选择区域' }]
                }
                , upLoadHeader: {
                    Authorization: getToken()
                },
                province:[],
                city:[],
                county:[],
                logoList:[],
                disabled: false,
                userForm: {
                    linkMan: '',
                    mobile: '',
                    provinceCode: '',
                    cityCode: '',
                    countyCode: '',
                    address: ''
                    // type: '2',
                    // isDefault: true
                },
                addressForm: {
                    linkMan: '',
                    mobile: '',
                    provinceCode: '',
                    cityCode: '',
                    countyCode: '',
                    address: '',
                    type: '',
                    isDefault: false
                },
                addressProvince: [],
                addressCity: [],
                addressCounty: [],
                formRule: {
                    linkMan: [{ required: true, trigger: 'blur', message: '请输入收件人' }],
                    mobile: [{ required: true, trigger: 'blur', message: '请输入收件人' }],
                    countyCode: [{ required: true, trigger: 'change', message: '请选择区域' }],
                    address: [{ required: true, trigger: 'blur', message: '请输入详细地址' }],
                    type: [{ required: true, trigger: 'blur', message: '请选择用途' }]

                },
                payForm: {
                    paymentName: '',
                    paymentAppId: '',
                    paymentAccessKey: '',
                    paymentMerchantId: '',
                    paymentMerchantKey: '',
                    paymentSignKey: '',
                    isOpen: true,
                    remark: '',
                },
                settingRule: {
                    paymentName: [{ required: true, trigger: 'blur', message: '请输入支付名称' }],
                    paymentAppId: [{ required: true, trigger: 'blur', message: '请输入微信支付应用ID' }],
                    paymentAccessKey: [{ required: true, trigger: 'blur', message: '请输入微信支付访问密钥' }],
                    paymentMerchantId: [{ required: true, trigger: 'blur', message: '请输入微信支付商户ID' }],
                    paymentMerchantKey: [{ required: true, trigger: 'blur', message: '请输入微信支付商户密钥' }],
                    paymentSignKey: [{ required: true, trigger: 'blur', message: '请输入微信支付签名密钥' }]
                }
                ,agentForm:{
                    firstAgentConfig: 0,
                    secondAgentConfig: 0,
                    thirdAgentConfig: 0,
                    isOpen: 1
                }
                ,agentFormRule: {
                    // firstAgentConfig: [{ required: true, trigger: 'blur', message: '请输入直推代理接单奖励' }],
                    // secondAgentConfig: [{ required: true, trigger: 'blur', message: '请输入间推代理接单奖励' }],
                    // thirdAgentConfig: [{ required: true, trigger: 'blur', message: '请输入三级代理接单奖励' }]
                }
            }
        },
        methods: {
            getSetting() { // 获取当前商户信息
                this.logoList = [];
                getSetting().then(res => {
                    let that = this;
                  if(res.status == 1) {
                      this.itemForm = res.data;
                      let provinceCode = res.data.provinceCode;
                      let cityCode = res.data.cityCode;
                      this.logoList = [{
                          url:res.data.logoImageUrl
                      }];
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
            getList() {
                this.logoList = [];
                getList({type:''}).then(res => {
                    if(res.status == 1) {
                        this.userList = res.data;
                    }
                })
            },
            dicts() {
                dicts(100005).then(res => {
                    // console.log(res)
                })
            },
            //显示新增 修改 查看 的隐藏弹窗
            showOrHideDialog() {
                this.dialogVisible = !this.dialogVisible;
            },
            addDialog() { // 新增地址的弹框
                this.dialogType = '新增地址';
                this.showOrHideDialog();
                this.provinceCode = '';
                this.cityCode = '';
                this.countyCode = '';
                this.addressForm.isDefault = false;
                this.getProvince(1);
            },
            handleEditInfo(scope) {
                getDetailById(scope.row.id).then(res=> {
                    this.dialogType = '修改地址';
                    this.setDetailData(res);
                    this.showOrHideDialog();
                })
            },
            handleSet(scope) {
                this.$confirm('确定要设置为默认地址吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        await setAddress(scope.row.id).then(res => {
                            if(res.status == 1) {
                                this.getList();
                                this.$message({
                                    type: 'success',
                                    message: '设置成功!'
                                })
                            }
                        })
                    })
                    .catch(err => {
                        console.error(err)
                    })
            },
            handleDelete(scope) {
                this.$confirm('确定要删除该地址吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        await delAddress(scope.row.id).then(res => {
                            if(res.status == 1) {
                                this.getList();
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
            dialogClose() {
                this.addressForm ={
                    linkMan: '',
                    mobile: '',
                    provinceCode: '',
                    cityCode: '',
                    countyCode: '',
                    address: '',
                    type: '',
                    isDefault: true
                };
            },
            //查看/修改信息时赋值
            setDetailData(res){
                let that = this;
                let provinceCode = res.data.provinceCode;
                let cityCode = res.data.cityCode;
                this.addressForm = {
                    id: res.data.id,
                    mobile: res.data.mobile,
                    linkMan: res.data.linkMan,
                    provinceCode: res.data.provinceCode,
                    cityCode: res.data.cityCode,
                    countyCode: res.data.countyCode,
                    address: res.data.address,
                    type: res.data.type,
                    isDefault: res.data.isDefault == 1 ? true : false
                }
                area({type:1,parentCode:''}).then(res => {
                    if (res.status == 1) {
                        that.province = res.data
                        area({type:2,parentCode: provinceCode}).then(res1 => {
                            if (res1.status == 1) {
                                that.addressCity = res1.data
                                area({type:3,parentCode:cityCode}).then(res => {
                                    if (res.status == 1) {
                                        that.addressCounty = res.data
                                    }
                                })
                            }
                        })
                    }
                })
            },
            noConfirmUser() {
                this.dialogVisible = false;
                this.dialogClose();
            },
            confirmUser() {// 新增修改的确认按钮
                this.$refs['addressForm'].validate((valid) => {
                    if (valid) {
                        if(this.dialogType == '新增地址') {
                            this.addressForm.isDefault ? this.addressForm.isDefault = 1 : this.addressForm.isDefault = 0;
                            addAddress(this.addressForm).then(res => {
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
                        if(this.dialogType == '修改地址') {
                            this.addressForm.isDefault ? this.addressForm.isDefault = 1 : this.addressForm.isDefault = 0;
                            editAddress(this.addressForm).then(res => {
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
            handleClick(tab, event) {// 切换tab
                switch (this.activeName) {
                    case "first":
                        this.getSetting();
                        break;
                    case "second":
                        this.getList();
                        break;
                    case "third":
                        this.getPayDetail();
                        break;
                    case "fourth":
                        this.getRebates();
                        break;
                }
            },
            handleRemove(file) {
                this.logoList = [];
                this.itemForm.logoFileId ='';
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
            clear1(data) {
                if(data == 1) {
                    this.addressCity = [];
                    this.addressCounty = [];
                    this.addressForm.cityCode = '';
                    this.addressForm.countyCode = '';
                } else {
                    this.addressCounty = [];
                    this.addressForm.countyCode = '';
                }
            },
            //上传图片成功
            upIdPic(res){
                this.itemForm.logoFileId = res.data;
            },
            //获取省市区
            getProvince(data) {
                if(data == 1) {
                    area({type:1,parentCode:''}).then(res => {
                        if (res.status == 1) {
                            this.addressProvince = res.data
                        }
                    })
                    return;
                }
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
            getcityAddress(code) {
                area({type:2,parentCode:code}).then(res => {
                    if(res.status == 1){
                        this.addressCity = res.data
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
            getcountryAddress(code){
                area({type:3,parentCode:code}).then(res=>{
                    if(res.status == 1){
                        this.addressCounty = res.data
                    }
                })
            },
            change(){
                this.getcity(this.itemForm.provinceCode)
                this.itemForm.cityCode = ''
                this.itemForm.countyCode = ''
            },
            changecity(){
                this.getcountry(this.itemForm.cityCode)
                this.itemForm.countyCode = ''
            },
            addressChange() {
                this.getcityAddress(this.addressForm.provinceCode)
                this.addressForm.cityCode = ''
                this.addressForm.countyCode = ''
            },
            addressChangecity(){
                this.getcountryAddress(this.addressForm.cityCode)
                this.addressForm.countyCode = ''
            },
            editSetting() {
                if(!this.itemForm.logoFileId) {
                    this.$message({
                        type: 'warning',
                        message: '请选择一个图片！'
                    });
                    return;
                }
                this.$refs['itemForm'].validate((valid) => {
                    if (valid) {
                        editSetting(this.itemForm).then(res => {
                            if (res.status == 1) {
                                this.logoList = [];
                                this.$message({
                                    type: 'success',
                                    message: '保存成功！'
                                });
                                this.getSetting();
                            }
                        })
                    }
                })
            },
            getPayDetail() {
                this.logoList = [];
                getPayDetail().then(res => {
                    if(res.status == 1) {
                        this.payForm= {
                            paymentName: res.data.paymentName,
                            paymentAppId: res.data.paymentAppId,
                            paymentAccessKey: res.data.paymentAccessKey,
                            paymentMerchantId: res.data.paymentMerchantId,
                            paymentMerchantKey: res.data.paymentMerchantKey,
                            paymentSignKey: res.data.paymentSignKey,
                            isOpen: res.data.isOpen === 1,
                            remark: res.data.remark
                        }
                    }
                })
            },
            //获取代理分佣设置
            getRebates() {
                this.logoList = [];
                apiRebatesConfig().then(res => {
                    if(res.status == 1) {
                        if(res.data){
                            this.agentForm = res.data;
                        }else{
                            this.agentForm.isOpen = 0
                        }
                    }
                })
            },
            payConfirm() {
                this.payForm.isOpen ? this.payForm.isOpen = 1 : this.payForm.isOpen = 0;
                setPayDetail(this.payForm).then(res => {
                    if(res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '保存成功！'
                        });
                        this.getPayDetail();
                    }
                })
            }
            //保存代理分佣
            ,agentConfirm(){
                let toDo = ()=>{
                    apiSetRebatesConfig(this.agentForm).then(res=>{
                        if(res.status == 1){
                            this.$message({
                              type: 'success',
                              message: '保存成功！'
                            });
                        }
                    })
                };
                //如果选中开通，则需要校验表单
                if(this.agentForm.isOpen){
                    this.$refs['agentForm'].validate((valid) => {
                        if (valid) {
                            toDo();
                        }
                    });
                }else{
                    toDo();
                }
            }
        },
        created() {
            this.getProvince();
            this.getSetting();
        }
    }
</script>
<style scoped lang="scss">
  .main-block .myInput .el-input__inner {
    width: 100%;
  }
  .addShopper {
  .main-block {
  .el-form {
    overflow: hidden;
    display: flex;
    justify-content: left;

  .fl, .fr {
    width: 50%;
    text-align: left;
  }
  }
  }
  }
  .el-tab-pane {
    padding-bottom: 20px;
  }
  .contentBox .queryContent {
    padding: 0;
    margin-top: 0;
  }
  .titleBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .flexItem2 {
    flex: 2;
  }
  .flexItem1 {
    flex: 1;
  }
  .flexItem1.right {
    flex: 1;
    text-align: right;
  }
  .flexItem3 {
    flex: 5;
  }
  .templateTitle {
    font-width: 600;
    margin-right: 50px;
  }
  .templateTime {
    color: #ccc;
  }
  .companyBox {
    display: flex;
    justify-content: center;
  }
  .ft22 {
    font-size: 22px;
  }
</style>
