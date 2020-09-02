<template>
  <div>
    <el-dialog :visible.sync="params.visible" :title="dialogType" @close="dialogClose">
      <el-form
        v-if="params.visible"
        :disabled="isReadOnly"
        :model="infoForm"
        label-width="120px"
        ref="infoForm"
        :rules="formRule"
      >
        <el-form-item label="销售业绩" prop="accumulateSales" class="myInput">
          <el-input v-model="infoForm.accumulateSales" placeholder="请输入销售业绩" />
        </el-form-item>
        <el-form-item label="群员人数" prop="peopleNum">
          <el-input v-model="infoForm.peopleNum" placeholder="必须是数字"/>
        </el-form-item>
        <el-form-item label="升级条件说明" prop="fileId" required>
          <el-upload
            :action="$url.fileUploadUrl"
            list-type="picture-card"
            :headers="upLoadHeader"
            :on-success="upIdImg"
            :on-remove="remove"
            accept="image/*"
            :limit="1"
            :file-list="imgList"
            :on-exceed="handleExceed"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
<!--          <el-input-->
<!--            v-model="infoForm.explain"-->
<!--            :autosize="{ minRows: 4, maxRows: 10}"-->
<!--            type="textarea"-->
<!--            placeholder="请输入升级条件"-->
<!--          />-->
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirmUser">保存</el-button>
        <el-button type="danger" @click="params.visible = false;infoForm = {};">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {getToken} from '@/utils/auth'
    import { getGeneralUpgrade } from '@/api/level'
    export default {
        name: "SetAgent",
        props:{
            params:{
                type:Object
            }
        },
        data() {
            return {
                // dialogVisible:this.params.visible,
                dialogType: '代理升级条件设置-普通代理',
                isReadOnly: false,
                infoForm: {
                    accumulateSales: '',
                    peopleNum: '',
                    fileId: ''
                },
                formRule: {
                    accumulateSales: [{ required: true, message: '请输入销售业绩', trigger: 'blur' }],
                    peopleNum: [{ required: true, message: '请输入所需群员数量', trigger: 'blur' }]
                },
                imgList: [],
                upLoadHeader:{
                    Authorization:getToken()
                }
            }
        },
        methods: {
            upIdImg(res){
                this.infoForm.fileId = res.data
            },
            //删除图片
            remove(){
                this.infoForm.fileId = ''
                this.imgList = []
            },
            //限制上传文件数量
            handleExceed(){
                this.$message.warning('最多只能上传一张图片');
            },
            dialogClose() {
                this.$emit('componentClose');
            },
            confirmUser() {
                if(!this.infoForm.fileId) {
                    this.$message({
                        type: 'warning',
                        message: '请选择一个图片！'
                    });
                    return;
                }
                this.$refs['infoForm'].validate((valid) => {
                    if (valid) {
                          this.infoForm.id = 1;
                          this.$emit('childrenComfirm',this.infoForm);
                    }
                })
            },
            getGeneralUpgrade() {
                getGeneralUpgrade().then(res => {
                    if(res.data) {
                        this.infoForm = res.data;
                        this.imgList = [{
                            url: res.data.imageUrl
                        }]
                    }
                })
            }
        },
        mounted() {
            this.getGeneralUpgrade();
        }
    }
</script>

<style scoped>

</style>
