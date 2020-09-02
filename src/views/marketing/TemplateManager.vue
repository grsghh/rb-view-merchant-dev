<template>
  <div class="contentBox">
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" label-width="120px" :inline="true">
            <el-form-item label="模板名称：" prop="name">
              <el-input class="myInput" v-model="searchForm.name" placeholder="请输入模板名称"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="templateCategoryId">
              <el-select class="select" v-model="searchForm.templateCategoryId" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="编号" prop="code">
              <el-input class="myInput" v-model="searchForm.code" placeholder="请输入编号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getTmpList(1)">查询</el-button>
              <el-button size="small" type="warning" @click="$refs.searchForm.resetFields()">清空</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
    <div class="queryContent">
      <div class="top">
        <el-button
          v-if="$store.state.user.pageBtns.includes('add')"
          type="primary"
          @click="addDialog"
        >新增
        </el-button>
      </div>
      <div class="table">
        <el-table :data="tmpList" border style="width: 100%" v-loading="listLoading" height="470">
          <el-table-column align="center" label="模板名称">
            <template slot-scope="scope">{{ scope.row.name || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="分类" width="120">
            <template slot-scope="scope">{{ scope.row.templateCategoryName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="模板编号" width="120">
            <template slot-scope="scope">{{ scope.row.code || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="内容" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.aliyunTemplateContent || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="描述">
            <template slot-scope="scope">{{ scope.row.description || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="创建时间" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.createTime || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="创建人">
            <template slot-scope="scope">{{ scope.row.createByName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="260">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="handleView(scope)">查看</el-button>
              <el-button
                :disabled="scope.row.isSystemPreConfig == 1"
                v-if="$store.state.user.pageBtns.includes('edit')"
                size="small"
                type="warning"
                @click="handleEditInfo(scope)"
              >修改
              </el-button>
              <el-button
                :disabled="scope.row.isSystemPreConfig == 1"
                v-if="$store.state.user.pageBtns.includes('del')"
                size="small"
                type="danger"
                @click="handleDelete(scope)"
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
        @pagination="getTmpList"
      />
    </div>
    <!-- 新增 修改 查看的弹框 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" :title="dialogType" @close="dialogClose">
      <el-form
        v-if="dialogVisible"
        :disabled="isReadOnly"
        :model="tmpForm"
        label-width="120px"
        ref="tmpForm"
        :rules="formRule"
      >
        <el-form-item label="模板名称：" prop="name">
          <el-input v-model="tmpForm.name" placeholder=""/>
        </el-form-item>
        <el-form-item label="模板分类：" prop="templateCategoryId" v-if="!isReadOnly">
          <el-select class="select" v-model="tmpForm.templateCategoryId" placeholder="请选择">
            <el-option
              v-for="item in cusMsgTmpList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板分类：" prop="templateCategoryName" v-else>
          {{tmpForm.templateCategoryName}}
        </el-form-item>
        <el-form-item label="编码：" prop="code">
          <el-input v-model="tmpForm.code" placeholder=""/>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <el-input v-model="tmpForm.content" row="3" type="textarea" @input="contentInput"/>
          <template v-if="!isReadOnly">
            <p class="tipMsg">请填写阿里云上配置的模板内容<el-button style="margin-left: 10px;" size="mini" type="primary" @click="getParam">提取参数</el-button></p>
          </template>
        </el-form-item>
        <el-form-item label="描述：" prop="description">
          <el-input v-model="tmpForm.description" placeholder=""/>
        </el-form-item>
        <el-table
          v-if="tmpForm.templateParamList.length"
          :data="tmpForm.templateParamList" border style="width: 100%"
        >
          <el-table-column align="center" label="参数名称">
            <template slot-scope="scope">
              {{ tmpForm.templateParamList[scope.$index].paramName}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="系统预设">
            <template slot-scope="scope">{{ scope.row.isSystemPreConfig === 1 ? '是' :'否'}}</template>
          </el-table-column>
          <el-table-column align="center" label="中文名称">
            <template slot-scope="scope">
              <el-input
                v-model="tmpForm.templateParamList[scope.$index].chaineseName"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="默认值">
            <template slot-scope="scope">
              <el-input
                v-model="tmpForm.templateParamList[scope.$index].defaultValue"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="描述">
            <template slot-scope="scope">
              <el-input
                v-model="tmpForm.templateParamList[scope.$index].description"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="是否必填">
            <template slot-scope="scope">
              <el-switch
                v-model="tmpForm.templateParamList[scope.$index].isRequired"
                active-text="是"
                inactive-text="否"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div style="text-align:right;margin-top: 10px;" v-show='dialogType !== "查看"'>
        <el-button type="primary" @click="confirmUser" v-if="!isReadOnly">提交</el-button>
        <el-button type="danger" @click="dialogVisible = false;tmpForm = {};">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import { getAllTemplate } from '@/api/messageTemplate'
    import {
        apiDelMsgTmp,
        apiMsgList,
        apiMsgTmpDetail,
        apiGetParam
        ,apiCusMsgTmp
        ,apiEditMsgTmp
        ,apiAddMsgTmp
    } from '@/api/TemplateManger'
    import Pagination from '@/components/Pagination'

    export default {
        name: 'TemplateManager',
        components: {Pagination},
        data() {
            return {
                isReadOnly: false,
                options: [],
                tmpList: [],
                dialogVisible: false,
                searchForm: {
                    pageNo: 1
                    , pageSize: 20,
                    code: '',
                    name: '',
                    templateCategoryId: ''
                },
                listLoading: false,
                total: 0,
                dialogType: '',
                dialogTitle: '',
                // 添加、修改表单数据
                tmpForm: {
                    name:""
                    ,content:""
                    ,code:""
                    ,templateCategoryId:""
                    ,templateParamList:[]
                    ,id:''
                    ,description:''
                },
                cusMsgTmpList: [],
                formRule: {
                    code: [{required: true, message: '请输入编码', trigger: 'blur'}],
                    content: [{required: true, message: '请填写阿里云上配置的模板内容', trigger: 'blur'}],
                    templateCategoryId: [{required: true, message: '请选择模板', trigger: 'change'}],
                    name: [{required: true, message: '请输入模板名称', trigger: 'blur'}]
                }
            }
        },
        methods: {
            // 取消修改
            dialogClose() {
                this.tmpForm = {
                    name:""
                    ,content:""
                    ,code:""
                    ,templateCategoryId:""
                    ,templateParamList:[]
                    ,id:''
                    ,description:''
                };
            },
            //获取短信模板类别简单对象列表
            async getMsgTmps() {
                await getAllTemplate().then(res => {
                    if (res.status === 1) {
                        this.options = res.data;
                    }
                })
            },
            //获取模板分类
            async getCusMsgTmp() {
                await apiCusMsgTmp().then(res => {
                    if (res.status === 1) {
                        this.cusMsgTmpList = res.data;
                    }
                })
            },
            //显示新增 修改 查看 的隐藏弹窗
            showOrHideDialog() {
                this.dialogVisible = !this.dialogVisible;
            },
            // 新增
            addDialog() {
                this.dialogType = '新增';
                this.isReadOnly = false;
                this.showOrHideDialog();
            },
            //查看用户
            handleView(score) {
                this.isReadOnly = true;
                apiMsgTmpDetail({id:score.row.id}).then(res => {
                    this.dialogType = '查看用户';
                    this.setDetailData(res);
                    this.showOrHideDialog();
                })
            },
            // 修改
            handleEditInfo(score) {
                this.isReadOnly = false;
                apiMsgTmpDetail({id:score.row.id}).then(res => {
                    this.dialogType = '修改';
                    this.tmpForm.id = res.data.id;
                    this.setDetailData(res);
                    this.showOrHideDialog();
                })
            },
            // 获取列表
            getTmpList(num) {
                if (num === 1) {
                    this.searchForm.pageNo = 1;
                }
                this.listLoading = true;
                apiMsgList(this.searchForm).then(res => {
                    this.tmpList = res.data.rows;
                    this.total = res.data.total;
                    setTimeout(() => {
                        this.listLoading = false
                    }, 500)
                })
            },
            // 确认新增 查看 修改
            confirmUser() {
                this.$refs['tmpForm'].validate((valid) => {
                    if (valid) {
                        if (this.dialogType === '新增') {
                            let param = {...this.tmpForm};
                            delete param.id;
                            apiAddMsgTmp(param).then(res => {
                                if (res.status === 1) {
                                    this.$message({
                                        type: 'success',
                                        message: '新增成功！'
                                    });
                                    this.getTmpList();
                                    this.showOrHideDialog();
                                }
                            });
                        }
                        if (this.dialogType === '修改') {
                            apiEditMsgTmp(this.tmpForm).then(res => {
                                if (res.status === 1) {
                                    this.$message({
                                        type: 'success',
                                        message: '修改成功！'
                                    });
                                    this.getTmpList();
                                    this.showOrHideDialog();
                                }
                            })
                        }
                    }
                })
            },
            //删除
            handleDelete(score) {
                this.$confirm('确定要删除吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        await apiDelMsgTmp({id:score.row.id}).then(res => {
                            if(res.status === 1){
                                this.getTmpList();
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                })
                            }
                        });
                    })
                    .catch(err => {
                        console.error(err)
                    })
            },
            //查看/修改信息时赋值
            setDetailData(res) {
                this.tmpForm = res.data;
                this.tmpForm.content = res.data.aliyunTemplateContent;
            },
            //提取参数
            getParam(){
                apiGetParam({content:this.tmpForm.content}).then(res=>{
                    if(res.status === 1 || res.data){
                        this.tmpForm.templateParamList = res.data.map(item => {
                            return {
                                isSystemPreConfig:item.isSystemPreConfig
                                ,paramName:item.name
                                ,description:''
                                ,isRequired:0
                                ,chaineseName:''
                                ,defaultValue:''
                            }
                        })
                    }
                })
            }
            //内容修改事件
            ,contentInput(){
                this.tmpForm.templateParamList = [];
            }
        },
        created() {
            this.getMsgTmps();
            this.getCusMsgTmp();
            this.getTmpList();
        }
    }
</script>

<style>
</style>
