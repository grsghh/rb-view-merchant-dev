<template>
  <div class="contentBox" style="background-color: #fff">
    <template>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="运费模板设置" name="first">
<!--          <development></development>-->
              <div class="queryContent">
                <div class="top">
                  <el-button
                    type="primary"
                    @click="addTemplate"
                  >新增运费模板</el-button>
                  <el-card style="margin-top: 10px" v-for="item in templateList" :key="item.id">
                  <div  class="titleBox">
                    <div class="flexItem left">
                      <span class="templateTitle">{{ item.templateTitle }}</span>
                    </div>
                    <div class="flexItem right">
                      <span class="templateTime">最后编辑时间: {{ item.updateTime }}</span>
                      <el-button
                        type="primary"
                        @click="copyTemplate(item.id)"
                      >复制模板</el-button>
                      <el-button
                        type="warning"
                        @click="editTemplate(item.id)"
                      >修改</el-button>
                      <el-button
                        type="danger"
                        @click="delTemplate(item.id)"
                      >删除</el-button>
                    </div>
                  </div>
                  <div class="table">
                    <el-table :data="item.designatedAreaCarriageConfigs" border style="width: 100%" v-loading="listLoading">
                        <el-table-column align="center" label="运送方式">
                          <template slot-scope="scope">{{ scope.row.transportTypeName || '-'}}</template>
                        </el-table-column>
                        <el-table-column align="center" label="运送到">
                          <template slot-scope="scope">{{ scope.row.designatedAreaCodeNames || '-'}}</template>
                        </el-table-column>
                        <el-table-column align="center" label="首件(个)">
                          <template slot-scope="scope">{{ scope.row.defaultAmount || '-'}}</template>
                        </el-table-column>
                        <el-table-column align="center" label="运费(元)">
                          <template slot-scope="scope">{{ scope.row.defaultMoney || '-'}}</template>
                        </el-table-column>
                        <el-table-column align="center" label="续件(个)">
                          <template slot-scope="scope">{{ scope.row.incrementAmount || '-'}}</template>
                        </el-table-column>
                        <el-table-column align="center" label="运费(元)">
                          <template slot-scope="scope">{{ scope.row.incrementMoney || '-'}}</template>
                        </el-table-column>
<!--                      </el-table-column>-->
                    </el-table>
                  </div>
                </el-card>

                </div>
                <pagination
                  v-show="total>0"
                  :total="total"
                  :page.sync="searchForm.pageNo"
                  :limit.sync="searchForm.pageSize"
                  @pagination="getList"
                />
              </div>
        </el-tab-pane>
        <el-tab-pane label="常用快递" name="second">
          <el-card class="logistics">
            <el-form :model="selectForm" :rules="formRule" ref="selectForm" label-width="100px" label-position="left" class="demo-ruleForm">
              <el-form-item label="快递公司" prop="express">
                <el-checkbox-group v-model="checkList2">
                  <el-checkbox v-for="item in selectForm.express" :key="item.id" :label="item.id" name="express">{{item.companyName}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="物流公司" prop="logistics">
                <el-checkbox-group v-model="checkList1">
                  <el-checkbox v-for="item in selectForm.logistics" :key="item.id" :label="item.id" name="logistics">{{item.companyName}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item style="text-align: right">
                <el-button size="small" type="primary" @click="save">提交保存</el-button>
<!--                <el-button size="small" type="warning" @click="$refs.searchForm.resetFields()">重置</el-button>-->
              </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </template>
    <!-- 新增 修改 查看的弹框 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType" @close="dialogClose">
      <el-form
        v-if="dialogVisible"
        :model="userForm"
        label-width="80px"
        ref="userForm"
        :rules="formRule"
      >
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="userForm.name" placeholder="商品标签名称"/>
        </el-form-item>
        <el-form-item label="发货时间" prop="name">
          <el-select></el-select>
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
    <FreightTemplate v-if="tempData.visible" :params="tempData" :info="theInfo" :id="theId" @componentClose="tempData.visible = false;" @componentComfirm="componentConfirm"></FreightTemplate>
<!--    模板设置组件-->
  </div>
</template>

<script>
    // import { getTags, getDetailById, addTags, editTags, delTags } from '@/api/productTag'
    import { getLogistics, getMyLogistics, setMyLogistics, getTemplateList, delTemplate,copyTemplate, getDetailById } from '@/api/logistics'
    import Pagination from '@/components/Pagination'
    import development from "@/components/development/index"
    import FreightTemplate from "./components/FreightTemplate"
    export default {
        name: 'logistics',
        components: { Pagination , development ,FreightTemplate},
        data() {
            return {
                activeName: 'first',
                checkList1: [],
                checkList2: [],
                checked1: true,
                selectForm: {
                    express: [],
                    logistics: []
                },
                formRule: {
                    // name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
                    // orderNum:[{ required: true, message: '请输入排序字段', trigger: 'blur' }],
                },
                userList: [],
                templateList: [],
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
                }
                ,tempData:{
                    dialogType: '新增模板设置',
                    visible:false
                }
                ,theInfo: {},
                theId: ''
            }
        },
        methods: {
            addTemplate() {
                this.tempData = {
                    visible: true,
                    dialogType: '新增模板设置'
                }
            },
            // 运费模板设置的复制
            copyTemplate(id) {
              copyTemplate({id:id}).then(res=>{
                if(res.status == 1){
                  this.$message({
                    type:'success',
                    message:'复制成功！'
                  })
                  this.getList()
                }
              })
            },
            // 运费模板设置的删除
            delTemplate(id) {
                this.$confirm('确定要删除该模板吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        await delTemplate({id:id}).then(res => {
                            if(res.status == 1){
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
            // 运费模板设置的修改
            editTemplate(id) {
                // let that = this;
                // getDetailById(id).then(res => {
                //     if(res.status == 1) {
                //         that.theInfo = res.data;
                //         that.tempData = {
                //             dialogType: '修改模板设置',
                //             visible: true
                //         }
                //     }
                // })
                this.tempData = {
                    dialogType: '修改模板设置',
                    visible: true,
                    id
                }
            },
            // 获取模板那列表
            getList() {
                getTemplateList(this.searchForm).then(res => {
                    if(res.status == 1) {
                        this.templateList = res.data.rows;
                        this.total = res.data.total;
                    }
                })
            },
            handleClick(tab, event) {
                switch (this.activeName) {
                    case 'first':
                        this.getList();
                        break;
                    case 'second':
                        this.getLogistics();
                        this.getMyLogistics();
                        break;
                }
            },
            // 提交保存物流快递
            save() {
                let that = this;
                setMyLogistics({category:1,list: this.checkList1}).then(res => {
                    if(res.status === 1) {
                        setMyLogistics({category:2,list: this.checkList2}).then(res => {
                            if(res.status == 1) {
                                that.$message({
                                    type: 'success',
                                    message: '保存成功！'
                                });
                                that.getMyLogistics();
                            }
                        })
                    }
                })
            },
            getLogistics() {
                getLogistics({category:1}).then(res => {
                    if(res.status == 1) {
                       this.selectForm.logistics = res.data;
                    }
                });
                getLogistics({category:2}).then(res => {
                    if(res.status == 1) {
                        this.selectForm.express = res.data;
                    }
                });
            },
            getMyLogistics() {
                let that = this;
                getMyLogistics(1).then(res => {
                    if(res.status == 1) {
                        that.checkList1 = res.data;
                    }
                });
                getMyLogistics(2).then(res => {
                    if(res.status == 1) {
                        that.checkList2 = res.data;
                    }
                })
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
                this.tempData = {
                    visible: true
                }
                // this.dialogType = '新增标签';
                // this.showOrHideDialog();
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
                            this.getTagsList();
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
                this.userForm = {
                    name: res.data.name,
                    orderNum: res.data.orderNum,
                    remark: res.data.remark
                }
            }
            //保存运费
            ,componentConfirm(){
                this.tempData.visible = false;
                this.getList();
            }
        },
        created() {
            this.getList();
            // this.getLogistics();
            // this.getMyLogistics();
        }
    }
</script>

<style scoped>
  .main-block .myInput .el-input__inner {
    width: 100%;
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
    margin-right: 100px;
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
