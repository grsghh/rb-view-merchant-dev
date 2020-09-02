<template>
    <div class="msgServeChild">
      <el-card>
        <div class="myServeBox">
          <div class="boxItem" @click="selectItem(1)">
            <div :class="{'myServeItem': true, 'active': num == 1 }" >
              <i class="iconfont iconmoban"></i>
            </div>
            <div :class="{'active': num == 1 }">付款关怀</div>
          </div>
          <div class="boxItem" @click="selectItem(2)">
            <div :class="{'myServeItem': true, 'active': num == 2 }">
              <i class="iconfont icongonggao"></i>
            </div>
            <div :class="{'active': num == 2 }">发货提醒</div>
          </div>
        </div>
        <div class="myContentBox">
          <el-form
            :model="msgServeForm"
            label-width="80px"
            ref="msgServeForm"
            :rules="formRule">
            <el-form-item label="提醒开关" prop="isOpen">
              <el-radio-group v-model="msgServeForm.isOpen"  size="" @change="changeSelect">
                <el-radio :label="1" >开</el-radio>
                <el-radio :label="0" >关</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="短信模板" prop="smsTemplateId" v-if="isShow">
              <el-radio-group v-model="msgServeForm.smsTemplateId"  size="">
                <div class="radioDiv" v-for="item in msgServeForm.shortMessageTemplateSimpleVOS" :key="item.id">
                  <el-radio :label="item.id">{{ item.showTemplateContent }}</el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
            <el-form-item style="text-align: left" label-width="0px">
              <el-button size="small" type="primary" @click="save">提交保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
</template>

<script>
    import { getMseeageNode, setMessageNode } from '@/api/messageServe'
    export default {
        name: "MsgServeComponent",
        props: {
            params: {
                type: Object
            }
        },
        data() {
            return {
                num: 1,
                isShow: false,
                msgServeForm: {
                    isOpen: '',
                    shortMessageTemplateSimpleVOS: [],
                    smsTemplateId: ''
                },
                selsetTemplateForm: {
                    tId: '0'
                },
                formRule: {
                    isOpen: [{ required: true, message: '请输入模板分类名称', trigger: 'change' }],
                }
            }
        },
        methods: {
            // 付款关怀与发货提醒的切换
            selectItem(num) {
                this.num = num;
                if(this.params.id == 1) {
                    if(this.num == 1) {
                        this.getInfo({id: 1});
                    } else {
                        this.getInfo({id: 2});
                    }
                } else if(this.params.id == 2) {
                    if(this.num == 1) {
                        this.getInfo({id: 3});
                    } else {
                        this.getInfo({id: 4});
                    }
                }
            },
            // 控制短信模板的显示隐藏
            showTemplate() {
                if(this.msgServeForm.isOpen == 1) {
                    this.isShow = true
                } else {
                    this.isShow = false
                }
            },
            // 提醒开关的切换
            changeSelect() {
                if(this.params.id == 1) {
                    this.showTemplate();
                } else if(this.params.id == 2) {
                    this.showTemplate();
                }
            },
            // 提交保存
            save() {
                setMessageNode(this.msgServeForm).then(res => {
                    if(res.status == 1) {
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                    }
                })
            },
            // 通过id获得对应的信息
            getInfo(data) {
                getMseeageNode(data).then(res => {
                    if(res.status == 1) {
                        this.msgServeForm = res.data;
                        this.changeSelect();
                    }
                })
            }
        },
        mounted() {
            if(this.params.id == 1) {
                this.getInfo({id: 1});
            } else if(this.params.id == 2){
                this.getInfo({id: 3});
            }
        }
    }
</script>

<style scoped>
.msgServeChild {
  background-color: #fff;
}
.myServeBox {
  display: flex;
}
.myServeItem {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom:20px;
  background-color: #ccc;
}
.boxItem {
  margin-right: 100px;
  text-align: center;
}
.myServeItem:nth-of-type(1):after {
  position: absolute;
  top: 50%;
  left: -75px;
  transform: translateY(-50%);
  content: '';
  width: 50px;
  height: 2px;
  background-color: #ccc;
}
div.active {
  color: #1890FF;
}
.myServeItem.active {
  background-color: #1890FF;
}
.iconfont {
  font-size: 40px;
  color: #EBEBEB;
}
.myServeItem.active .iconfont{
  color: #fff;
}
.myContentBox {
  padding-top: 20px ;
}
.radioDiv {
  margin-top: 12px;
}
</style>
