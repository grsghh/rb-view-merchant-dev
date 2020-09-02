<template>
  <div class="FreightTemplate">
    <el-dialog
      :visible.sync="dialogVisible"
      title="模板设置"
      :close-on-click-modal="false"
      destroy-on-close
      @close="dialogClose"
    >
      <div class="contentBox">
        <div class="queryContent">
          <el-form :model="form" label-width="120px" ref="form" :rules="formRule">
            <el-form-item label="模板名称：" prop="templateName">
              <el-input v-model="form.templateName" placeholder="请填写模板名称" />
            </el-form-item>
            <el-form-item label="发货时间:" prop="despatchTime">
              <el-select v-model="form.despatchTime"  clearable placeholder="全部">
                <el-option
                  v-for="item in sendTime"
                  :key="item.entryKey"
                  :label="item.entryValue"
                  :value="item.entryKey">
                </el-option>
              </el-select>
              <span>如实设定宝贝的发货时间，不仅可避免发货咨询和纠纷，还能促进成交！</span>
            </el-form-item>
            <el-form-item label="是否包邮：" prop="id">
              <el-radio-group v-model="form.isPinkage">
                <el-radio :label="0">自定义运费</el-radio>
                <el-radio :label="1">卖家承担运费</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="计价方式：" prop="carriagePricingType">
              <el-radio-group v-model="form.carriagePricingType">
                <el-radio :label="1">按件数</el-radio>
                <el-radio :label="2" disabled>按重量</el-radio>
                <el-radio :label="3" disabled>按体积</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="运送方式：" prop="description" v-if="!form.isPinkage">
              <div>除指定地区外，其余地区的运费采用“默认运费”</div>
              <el-checkbox-group v-model="form.transportTypeValues">
                <template v-for="(item,index) in sendType">
                  <el-checkbox  :disabled="item.entryKey != 1" :label="item.entryKey">{{item.entryValue}}</el-checkbox>
                  <br>
                  <template v-if="form.transportTypeValues.indexOf(item.entryKey) != -1">
                    <!--                  <template v-if="form.transportTypeValues.length">-->
                    <el-form-item label="" prop="">
                      <div class="FreightTemplate-container">
                        <div class="title">
                          <span>默认运费</span>
                          <el-input type="tel" v-model="form.designatedAreaCarriageConfigs[0].defaultAmount" placeholder="" />件内
                          <el-input type="tel" v-model="form.designatedAreaCarriageConfigs[0].defaultMoney" placeholder="" />元，
                          <span>每增加</span>
                          <el-input type="tel" v-model="form.designatedAreaCarriageConfigs[0].incrementAmount" placeholder="" />件，
                          <span>增加运费</span>
                          <el-input type="tel" v-model="form.designatedAreaCarriageConfigs[0].incrementMoney" placeholder="" />元
                        </div>
                        <el-table v-if="form.peirsongLiebiao[index].peisongquyuList.length" :data="form.peirsongLiebiao[index].peisongquyuList" border style="width: 100%">
                          <el-table-column label="运送到">
                            <template slot-scope="scope">
                              {{ scope.row.designatedAreaCodeNames || '未添加地区'}}
                              <el-button type="text" @click="showAreaDialog({type:index,index:scope.$index,designatedAreaCodes:scope.row.designatedAreaCodes})">编辑</el-button>
                            </template>
                          </el-table-column>
                          <el-table-column label="首件数(件)">
                            <template slot-scope="scope">
                              <el-input type="tel" v-model="form.peirsongLiebiao[index].peisongquyuList[scope.$index].defaultAmount"  placeholder="" />
                            </template>
                          </el-table-column>
                          <el-table-column label="首费(元)">
                            <template slot-scope="scope">
                              <el-input v-model="form.peirsongLiebiao[index].peisongquyuList[scope.$index].defaultMoney"  placeholder="" />
                            </template>
                          </el-table-column>
                          <el-table-column label="续件数(件)">
                            <template slot-scope="scope">
                              <el-input v-model="form.peirsongLiebiao[index].peisongquyuList[scope.$index].incrementAmount"  placeholder="" />
                            </template>
                          </el-table-column>
                          <el-table-column label="续费(元)">
                            <template slot-scope="scope">
                              <el-input v-model="form.peirsongLiebiao[index].peisongquyuList[scope.$index].incrementMoney"  placeholder="" />
                            </template>
                          </el-table-column>
                          <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                              <el-button type="text" @click="deleteSendListRow({type:index,index:scope.$index})">删除</el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                        <div>
                          <el-button type="text" @click="addSendList({type:index})">为指定地区城市设置运费</el-button>
                        </div>
                      </div>
                    </el-form-item>
                  </template>
                </template>
              </el-checkbox-group>
            </el-form-item>
            <template v-if="!form.isPinkage">
              <el-divider></el-divider>
              <el-checkbox label="指定条件包邮" v-model="conditionCheckd"></el-checkbox>
              <div class="FreightTemplate-container marginBottom">
                <el-table v-if="conditionCheckd" :data="form.peirsongLiebiao[1].zhidingList" border style="width: 100%">
                  <el-table-column label="选择区域">
                    <template slot-scope="scope">
                      {{  scope.row.designatedAreaCodeNames || '未添加地区'}}
                      <el-button type="text"
                                 @click="showAreaDialog(
                               {type:scope.$index,index:scope.$index,isZhi: 1,designatedAreaCodes:scope.row.designatedAreaCodes}
                               )"
                      >编辑</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column label="选择运送方式">
                    <template slot-scope="scope">
                      <el-select v-model="form.peirsongLiebiao[1].zhidingList[scope.$index].transportType" placeholder="所有分类">
                        <el-option
                          v-for="item in thelist"
                          :key="item.id"
                          :label="item.label"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="设置包邮条件">
                    <template slot-scope="scope">
                      <el-select class="smallSelect" v-model="form.peirsongLiebiao[1].zhidingList[scope.$index].pinkageConditionType" placeholder="所有分类">
                        <el-option
                          v-for="item in theMoneylist"
                          :key="item.id"
                          :label="item.label"
                          :value="item.id">
                        </el-option>
                      </el-select>
                      <div class="theDiv" v-if="form.peirsongLiebiao[1].zhidingList[scope.$index].pinkageConditionType == 1">
                        满 <el-input class="small" v-model="form.peirsongLiebiao[1].zhidingList[scope.$index].amount"></el-input> 件包邮
                      </div>
                      <div class="theDiv" v-if="form.peirsongLiebiao[1].zhidingList[scope.$index].pinkageConditionType == 2">
                        满 <el-input class="small" v-model="form.peirsongLiebiao[1].zhidingList[scope.$index].money"></el-input> 元包邮
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <!--                    <el-button type="text" @click="deleteSendListRow({type:index,index:scope.$index})">+</el-button>-->
                      <el-button class="bigFont" type="text" @click="addZhiDingList">+</el-button>
                      <el-button class="bigFont" type="text" v-if="scope.$index != 0" @click="delZhiDingList(scope.$index)">-</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </el-form>
          <div style="text-align:right;">
            <el-button type="primary" @click="componentConfirm">
              保存
            </el-button>
            <el-button type="danger" @click="dialogClose">
              取消
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="areaDialog"
      title="选择区域"
      :close-on-click-modal="false"
      destroy-on-close
      append-to-body
      @close="areaDialogClose"
    >
      <template v-for="(item,index) in areaList">
        <div class="area-list">
          <div class="area-list-label">
            <el-checkbox
              v-model="areaCheck[index].checkedAll"
              :indeterminate="areaCheck[index].isIndeterminate"
              @change="checkAllPro({index})"
            >
              {{item.name}}
            </el-checkbox>
          </div>
          <!--          区域 如 华中-->
          <div class="pro-list">
            <el-checkbox-group v-model="areaCheck[index].checked" @change="handleCheckedCitiesChange({index})">
              <el-checkbox v-for="pro in item.children" :label="pro.code" :key="pro.code">{{pro.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <!--          省份 如 河南-->
        </div>
      </template>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirmSetSendArea">
          保存
        </el-button>
        <el-button type="danger" @click="areaDialog = false;">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {dicts,apiRegionsTree} from '@/api/system'
    import { addTemplateList , gettempDetailById, changeTempDetail } from '@/api/logistics'
    let designatedAreaCarriageConfigsForm = {isDefault: 1,transportType: 1, defaultAmount: 1, defaultMoney: 6,incrementAmount:1, incrementMoney: 6};
    export default {
        name: "FreightTemplate"
        ,props:['params','info']
        ,data(){
            return {
                form:{
                    templateName: '', // 模板名称
                    isPinkage: 0, // 是否包邮
                    isConditionPinkage: '0', // 是否指定条件包邮
                    despatchTime: '',  // 发货时间
                    carriagePricingType: 1, // 运费计价方式
                    transportTypeValues:[], // 运送方式
                    designatedAreaCarriageConfigs: [designatedAreaCarriageConfigsForm],
                    conditionPinkageConfigList: [],
                    peirsongLiebiao:[
                        {
                            peisongquyuList:[]
                        },
                        {
                            zhidingList: [
                                {
                                    amount: '5',
                                    money: '100',
                                    designatedAreaCodeNames: '',
                                    designatedAreaCodes: '',
                                    pinkageConditionType: 1,
                                    transportType: 1
                                }
                            ]
                        }
                    ]
                }
                ,formRule:{
                    templateName: [{ required: true, message: '运费模板名称不可为空', trigger: 'blur' }]
                }
                ,sendType:[]
                ,sendTime:[]//时间列表
                ,areaList:[]// 区域列表
                ,dialogVisible:this.params.visible
                ,areaDialog:false
                ,theAreaDialog: false
                ,whitchForm:''
                ,areaCheck:[]
                ,theAreaCheck: []
                ,nowTableForm:{}
                ,conditionCheckd: false
                ,conditionList: [{
                    amount: '5',
                    money: '100',
                    designatedAreaCodeNames: '',
                    designatedAreaCodes: '',
                    pinkageConditionType: 1,
                    transportType: 1
                }]
                ,thelist: [{id: 1, label: '快递'}]
                ,theMoneylist: [{id: 1, label: '数量'},{id: 2,label: '金额'}]
                ,returnFlag: false
            }
        }
        ,methods: {
            // itemChange() {
            // },
            //运送方式
            async getSendType() {
                await dicts('100009').then(res => {
                    if (res.status == 1) {
                        this.sendType = res.data;
                        this.form.transportTypeValues = [res.data[0].entryKey];
                    }
                })
            }
            //发货时间
            , async getSendTime() {
                await dicts('100013').then(res => {
                    if (res.status == 1) {
                        this.sendTime = res.data;
                    }
                })
            }
            //获取区域和省
            , async getAreaTree() {
                await apiRegionsTree().then(res => {
                    if (res.status == 1) {
                        this.areaList = res.data;
                        //动态添加区域的全选状态
                        for (let i in res.data) {
                            this.areaCheck.push({
                                checkedAll: false
                                , checked: []
                                , isIndeterminate: false
                            })
                        }
                    }
                })
            }
            , dialogClose() {
                this.$emit('componentClose');
            }
            //动态添加运送方式的table表单记录
            , addSendList(data) {
                /*
                * 将来会有EMS/平邮3个动态table，所以需要预留出形参，根据参数来判断往哪个动态table添加表单记录
                * type:要删除的动态table对象名
                * */
                this.form.peirsongLiebiao[data.type].peisongquyuList.push({
                    designatedAreaCodeNames: ''
                    , designatedAreaCodes: ''
                    , defaultAmount: '1'
                    , defaultMoney: '6'
                    , incrementAmount: '1'
                    , incrementMoney: '6'
                })
            }
            // 增加指定表单记录
            , addZhiDingList() {
                this.form.peirsongLiebiao[1].zhidingList.push({
                    amount: '',
                    money: '',
                    designatedAreaCodeNames: '',
                    designatedAreaCodes: '',
                    pinkageConditionType: 1,
                    transportType: 1
                })
            }
            // 删除指定表单记录
            , delZhiDingList(index) {
                this.form.peirsongLiebiao[1].zhidingList.splice(index, 1)
            }
            //删除动态添加运送方式的table表单记录
            , deleteSendListRow(data) {
                /*
                * type:要删除的动态table index
                * index:需要删除的下标
                * */
                this.form.peirsongLiebiao[data.type].peisongquyuList.splice(data.index, 1);
            }
            //打开区域选择弹窗
            , showAreaDialog(data) {
                this.nowTableForm = data;
                this.areaDialog = true;
                let {designatedAreaCodes} = data;
                let {areaList} = this;
                //如果当前已有选中的区域，则需要回显
                if (designatedAreaCodes) {
                    // 先清空表单中已选中的区域信息
                    // if(data.isZhi == 1) {
                    //     if(this.form.peirsongLiebiao[1].zhidingList[data.index].designatedAreaCodeNames) {
                    //         this.form.peirsongLiebiao[1].zhidingList[data.index].designatedAreaCodeNames = '';
                    //         this.form.peirsongLiebiao[1].zhidingList[data.index].designatedAreaCodes = '';
                    //     }
                    // } else {
                    //     if(this.form.peirsongLiebiao[0].peisongquyuList[data.index].designatedAreaCodeNames) {
                    //         this.form.peirsongLiebiao[0].peisongquyuList[data.index].designatedAreaCodeNames = '';
                    //         this.form.peirsongLiebiao[0].peisongquyuList[data.index].designatedAreaCodes = '';
                    //     }
                    // }
                    designatedAreaCodes = designatedAreaCodes.split(',');
                    //遍历区域
                    for (let i in areaList) {
                        //遍历区域下的省份
                        for (let j in areaList[i].children) {
                            //遍历当前记录中已选中的省份ids
                            for (let k in designatedAreaCodes) {
                                if (designatedAreaCodes[k] === areaList[i].children[j].code) {
                                    this.areaCheck[i].checked.push(areaList[i].children[j].code);
                                }
                            }
                        }
                        this.areaCheck[i].checkedAll =
                            this.areaCheck[i].checked.length === areaList[i].children.length;
                    }
                }
            }
            //全选当前区域下的所有省份
            , checkAllPro(data) {
                if (!this.areaCheck[data.index].checkedAll) {
                    this.areaCheck[data.index].checked = []
                } else {
                    let areaListNow = this.areaList[data.index].children;
                    for (let i in areaListNow) {
                        this.areaCheck[data.index].checked.push(areaListNow[i].code);
                    }
                }
                this.areaCheck[data.index].isIndeterminate = false;
            }
            //省份选择
            , handleCheckedCitiesChange(data) {
                this.areaCheck[data.index].checkedAll =
                    this.areaCheck[data.index].checked.length === this.areaList[data.index].children.length;
                this.areaCheck[data.index].isIndeterminate =
                    this.areaCheck[data.index].checked.length > 0
                    && this.areaCheck[data.index].checked.length < this.areaList[data.index].children;
            }
            //关闭区域弹窗
            , areaDialogClose() {
                this.areaCheck = [];
                for (let i in this.areaList) {
                    this.areaCheck.push({
                        checkedAll: false
                        , checked: []
                        , isIndeterminate: false
                    })
                }
            }
            //保存设置好的区域
            , confirmSetSendArea() {
                let {
                    areaCheck
                    , nowTableForm
                    , areaList
                } = this;
                //需要设置配送的表单数据
                let toForm = null;
                if (nowTableForm.isZhi == 1) {
                    toForm = this.form.peirsongLiebiao[1].zhidingList[nowTableForm.index];
                } else {
                    toForm = this.form.peirsongLiebiao[0].peisongquyuList[nowTableForm.index];
                }
                toForm.designatedAreaCodes = '';
                toForm.designatedAreaCodeNames = '';
                let nullCount = areaCheck.length;
                for (let i in areaCheck) {
                    //把选中的地区id赋值
                    if (areaCheck[i].checked.length) {
                        //组合区域id
                        toForm.designatedAreaCodes +=
                            `${areaCheck[i].checked},`;
                        for (let j in areaList) {
                            for (let p in areaList[j].children) {
                                //组合区域名称
                                for (let k in areaCheck[i].checked) {
                                    if (areaCheck[i].checked[k] === areaList[j].children[p].code) {
                                        toForm.designatedAreaCodeNames +=
                                            `${areaList[j].children[p].name}、`;
                                    }
                                }
                            }
                        }
                    } else {
                        nullCount--;
                    }
                }
                //如果没有选择任何地区，则清空
                if (!nullCount) {
                    toForm.designatedAreaCodeNames = ''
                    toForm.designatedAreaCodes = ''
                } else {
                    toForm.designatedAreaCodeNames = toForm.designatedAreaCodeNames.substr(0, toForm.designatedAreaCodeNames.length - 1);
                    toForm.designatedAreaCodes = toForm.designatedAreaCodes.substr(0, toForm.designatedAreaCodes.length - 1);
                }
                //清空选中区域
                for (let i in areaCheck) {
                    areaCheck[i].checked = [];
                    areaCheck[i].checkedAll = false;
                }
                this.areaDialog = false;
            }

            //确认保存并返回
            , componentConfirm() {
                let that = this;
                that.returnFlag = false;
                this.$refs['form'].validate((valid) => {
                        if (valid) {
                if (that.form.peirsongLiebiao[0].peisongquyuList.length >= 1) {
                    that.form.peirsongLiebiao[0].peisongquyuList.forEach(item => {
                        if (item.designatedAreaCodes == '') {
                            errorToDo(1);
                        }
                    })
                }
                if (that.conditionCheckd) {
                    that.form.peirsongLiebiao[1].zhidingList.forEach(item => {
                        if (item.designatedAreaCodes == '') {
                            errorToDo(2);
                        }
                    })
                }
                if (that.returnFlag) {
                    return;
                }
                that.conditionCheckd ? that.form.isConditionPinkage = 1 : that.form.isConditionPinkage = 0;
                this.form.transportTypeValues = this.form.transportTypeValues.join(',');
                that.form.designatedAreaCarriageConfigs = [designatedAreaCarriageConfigsForm];
                that.form.peirsongLiebiao[0].peisongquyuList.forEach(item => {
                    item.isDefault = 0;
                    item.transportType = 1;
                    that.form.designatedAreaCarriageConfigs.push(item);
                });
                if (that.form.isConditionPinkage) {
                    that.form.conditionPinkageConfigList = [];
                    that.form.peirsongLiebiao[1].zhidingList.forEach(item => {
                        that.form.conditionPinkageConfigList.push(item);
                    })
                }
                ;
                if (!this.params.id) {
                    addTemplateList(this.form).then(res => {
                        successToDo({res, msgTxt: '新增'})
                    })
                } else {
                    changeTempDetail(this.form).then(res => {
                        successToDo({res, msgTxt: '修改'})
                    })
                }

                function errorToDo(num) {
                    let theMsg = '';
                    if (num == 1) {
                        theMsg = '指定区域';
                    } else {
                        theMsg = '条件';
                    }
                    that.$message({
                        type: 'warning',
                        message: `${theMsg}包邮明细中的区域不能为空！`
                    });
                    that.returnFlag = true;
                }

                function successToDo(data) {
                    that.form.transportTypeValues = ['1'];
                    if (data.res.status == 1) {
                        that.$message({
                            type: 'success',
                            message: `${data.msgTxt}成功！`
                        });
                        that.$emit('componentComfirm');
                    }
                }
            }
        })
            },
            //获取运费模板详情
            async getTempDetail(){
                await gettempDetailById(this.params.id).then(res => {
                    if(res.status == 1){
                        this.form = {
                            id:res.data.id,
                            templateName: res.data.templateName, // 模板名称
                            isPinkage: res.data.isPinkage, // 是否包邮
                            isConditionPinkage: res.data.isConditionPinkage, // 是否指定条件包邮
                            despatchTime: res.data.despatchTime ? res.data.despatchTime.toString() : '',  // 发货时间
                            carriagePricingType:res.data.carriagePricingType, // 运费计价方式
                            transportTypeValues:res.data.transportTypeValues.split(','), // 运送方式
                            designatedAreaCarriageConfigs:res.data.designatedAreaCarriageConfigs ? [res.data.designatedAreaCarriageConfigs[0]] : [designatedAreaCarriageConfigsForm],
                            conditionPinkageConfigList: [],
                            peirsongLiebiao:[
                                {
                                    peisongquyuList:[]
                                },
                                {
                                    zhidingList: res.data.conditionPinkageConfigList ? res.data.conditionPinkageConfigList : [{
                                        amount: '5',
                                        money: '100',
                                        designatedAreaCodeNames: '',
                                        designatedAreaCodes: '',
                                        pinkageConditionType: 1,
                                        transportType: 1
                                    }]
                                }
                            ]
                        }
                        this.conditionCheckd = !!this.form.isConditionPinkage;
                        if(res.data.designatedAreaCarriageConfigs && res.data.designatedAreaCarriageConfigs.length > 1){
                            for(let i = 1;i < res.data.designatedAreaCarriageConfigs.length; i ++){
                                this.form.peirsongLiebiao[0].peisongquyuList.push(res.data.designatedAreaCarriageConfigs[i])
                            }
                        }
                    }
                })
            }
        }
        ,mounted() {
            this.getSendTime()
            this.getSendType()
            this.getAreaTree()
            if(this.params.id){
                this.getTempDetail()
            }
        }
    }
</script>

<style scoped lang="scss">
  .FreightTemplate-container{
    .title{display: flex;background-color: #e8f2ff;padding: 10px;
      .el-input{width: 70px;margin:0 3px;}
    }
  }
  .area-list{margin-bottom: 25px;position: relative;
    .el-checkbox-group{position: relative;padding-left: 100px;
      .el-checkbox{margin-bottom: 5px;}
    }
    .area-list-label{position: absolute;left: 0;}
  }
  .marginBottom {
    margin-bottom: 30px;
    margin-top: 10px;
  }
  .bigFont {
    font-size: 30px;
  }
  .theDiv {
    padding: 10px 0;
    text-align: center;
  }
  .small {
    width: 100px;
  }
  .smallSelect {
    margin-left: 20px;
    width: 150px;
  }
</style>
