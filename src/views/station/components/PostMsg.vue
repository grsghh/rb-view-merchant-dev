<template>
  <div class="">
    <el-form :model="msgForm" ref="newsForm" :rules="FormRules" label-width="120px" label-position="right">
      <div v-if="propsData.receiveShow">
        <el-form-item class="proTag accept" label="接收人">
          <el-radio-group v-model="msgForm.type"  size=""  @change="changeSelect">
            <el-radio label="1" >全部代理</el-radio>
            <el-radio label="2" >全部粉丝</el-radio>
          </el-radio-group>
          <span class="defined" @click="defined()">自定义</span>
        </el-form-item>
      </div>
      <div v-if="!propsData.detailId">
        <el-form-item class="select" label="筛选出">
          <span class="person"><b>{{peopleNum}}</b>人</span>
          <span class="details" @click="details()">明细</span>
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item class="select" label="接收人">
          <span class="person">{{defindeName}}</span>
        </el-form-item>
      </div>
      <div>
        <el-form-item class="proTag accept" label="消息类型" required>
          <el-radio-group v-model="msgForm.messageType" size="" :disabled="disabled">
            <el-radio v-for="(item,index) in msgTypeList" :key="item.entryKey" :label="item.entryKey">{{item.entryValue}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-form-item label="消息标题" prop="title">
        <el-input v-model="msgForm.title" :disabled="disabled" placeholder="30个字以内" />
      </el-form-item>
      <el-form-item label="副标题" prop="subtitle">
        <el-input v-model="msgForm.subtitle" :disabled="disabled" placeholder="50个字以内" />
      </el-form-item>
      <el-form-item label="消息简介" prop="summary">
        <el-input v-model="msgForm.summary" :disabled="disabled" placeholder="100个字以内" />
      </el-form-item>
      <el-form-item label="消息图标" prop="imageId" required>
        <el-upload
          :disabled="disabled"
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
      </el-form-item>
      <el-form-item label="消息内容" prop="content" required>
        <Tinymce ref="editor" v-model="msgForm.content" :height="400" />
      </el-form-item>
    </el-form>
    <div style="text-align:right;margin-right: 40px;" v-if="!propsData.detailId">
      <el-button type="primary" @click="uploadMsg">
        发布
      </el-button>
    </div>
    <!-- 自定义接收人 -->
    <define-person v-if="defineData.defineDialog" :define-data="defineData" @defineComfirm = 'defineComfirm'></define-person>

    <!-- 明细查询 -->
    <detail-list v-if="params.detailDialog" :params="params"></detail-list>

  </div>
</template>

<script>
  import {agentAndFansNum, publishMsg, msgDetail} from '@/api/station'
  import Tinymce from '@/components/Tinymce'
  import DefinePerson from './DefinePerson'
  import DetailList from './TheDetail'
  import {dicts} from '@/api/system'
  import {getToken} from '@/utils/auth'
  import {getRouteId} from '@/utils'
  export default {
    name:'PostMsg',
    props:{
      propsData:{
        type:Object
      }
    },
    components:{Tinymce,DetailList,DefinePerson},
    data(){
      return{
        msgForm:{
          content: "",
          imageId: "",
          memberIds: [],
          messageType: '',
          subtitle: "",
          summary: "",
          title: "",
          type: '1'
        },
        peopleNum:0,
        imgList:[],
        FormRules:{
          title: [{ required: true, trigger: 'blur', message: '标题不能为空' }],
          messageType: [{ required: true, trigger: 'blur', message: '消息类型必选' }],
          subtitle: [{ required: true, trigger: 'blur', message: '副标题不能为空' }]
        },
        upLoadHeader:{
          Authorization:getToken()
        },
        //自定义接收人
        defineData:{
          defineDialog:false,
        },
        defindeName:[],//详情的接收人
        //明细
        // detailDialog:false,
        params:{
          detailDialog:false,
          memberIds:this.propsData.receiveIds || [],//接收人Id
          type:""
        },
        msgTypeList:[],//消息类型
        disabled:false
      }
    },
    methods:{
      //确定回调
      defineComfirm(data){
        this.defindeIds = data
        this.params.memberIds = data
        this.peopleNum = data.length
        this.msgForm.type = ''
        this.msgForm.memberIds = data
      },
      //发布消息
      uploadMsg(){
        publishMsg(this.msgForm).then(res=>{
          if(res.status == 1 ){
            this.$message({
              type:'success',
              message:'发布消息成功！'
            })
            this.$router.push(`/station/msgList?menuId=${getRouteId('/station/msgList')}`)
          }
        })
      },
      //自定义接收人
      defined(){
        this.defineData.defineDialog = true
      },
      //明细弹窗
      details(){
        this.params.detailDialog = true
        this.params.type = this.msgForm.type
        if(this.propsData.receiveIds.length) this.params.type = ''
      },
      //上传图片成功
      upIdImg(res){
        this.msgForm.imageId = res.data
      },
      //删除图片
      remove(){
        this.msgForm.imageId = ''
        this.imgList = []
      },
      //限制上传文件数量
      handleExceed(){
        this.$message.warning('最多只能上传一张图片');
      },
      //获取消息类型
      async getMsgType(){
        let arr = []
        await dicts('100016').then(res=>{
          if(res.status === 1){
            for(let i in res.data){
              if(i==0){
                continue
              }
              arr.push(res.data[i])
            }
            this.msgTypeList = arr;
          }
        })
      },
      //获取全部代理和全部粉丝
      getAllPerson(){
        agentAndFansNum().then(res=>{
          if(res.status == 1){
            if(this.msgForm.type == 1){
              this.peopleNum = res.data.agentCount
            }else{
              this.peopleNum = res.data.fansCount
            }
          }
        })
      },
      //切换选择接收人
      changeSelect(){
        this.getAllPerson()
      },
      //详情展示
      detaileShow(){
        msgDetail(this.propsData.detailId).then(res=>{
          if(res.status ==1){
            this.defindeName = res.data.receiveMemberName
            this.msgForm = {
              content: res.data.content,
              messageType: res.data.messageType.toString(),
              subtitle: res.data.subtitle,
              summary: res.data.summary,
              title: res.data.title
            }
            if(res.data.imageUrl){
              this.imgList = [{
                url:res.data.imageUrl
              }]
            }else{
              this.imgList = []
            }
          }
        })
      }
    },
    mounted() {
      this.getMsgType()
      if(this.propsData.detailId) {
        this.disabled = true
        this.detaileShow()
      }else if(this.propsData.receiveIds.length) {
        this.params.memberIds = this.propsData.receiveIds
        this.msgForm.memberIds = this.propsData.receiveIds
        this.peopleNum = this.propsData.receiveIds.length
        this.params.type = this.msgForm.type = ''
      }else{
        this.getAllPerson()
      }
    }
  }
</script>

<style lang="scss" scoped>
.accept{padding: 0;}
.details{margin-left: 20px;color: #1890ff; cursor: pointer;}
.defined{margin-left: 30px;}
.select {
  .person {
    b{color: #FF0000;margin-right: 5px;font-size: 16px;}
  }
}
</style>
