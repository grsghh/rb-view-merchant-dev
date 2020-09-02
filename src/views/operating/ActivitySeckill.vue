<template>
  <div class="contentBox">
    <el-row class="main-block">
      <el-card class="box-card">
        <el-collapse v-model="activeNames" accordion>
          <el-collapse-item title="查询条件" name="1">
            <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" label-width="100px" :inline="true">
            <el-form-item label="状态" prop="state" label-width="60px">
              <el-select class="select" v-model="searchForm.state" clearable placeholder="全部" filterable clearable>
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.entryValue"
                  :value="item.entryKey"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品名称：" prop="productName">
              <el-input class="myInput" v-model="searchForm.productName" placeholder="商品名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="开始时间：" prop="startTime">
              <el-date-picker
                v-model="searchForm.startTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="开始时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="searchForm.endTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getSeckillList(1)">查询</el-button>
              <el-button size="small" type="warning" @click="$refs.searchForm.resetFields()">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </el-row>
    <div class="queryContent">
      <div class="top">
        <el-button
          type="primary"
          @click="addDialog"
          v-if="$store.state.user.pageBtns.includes('add')"
        >新增</el-button>
      </div>
      <div class="table">
        <el-table :data="infoList" border style="width: 99%" v-loading="listLoading" height="590">
          <el-table-column align="center" label="图片" width="120">
            <template slot-scope="scope">
              <el-image v-if="scope.row.eventsImageUrl != null"
                        style="width: 60px; height: 60px"
                        :src="`${scope.row.eventsImageUrl}`"
                        :alt="`${scope.row.name}`"
              ></el-image>
              <div v-else slot="error" class="image-slot">
                <i style="font-size: 40px;color: #eee;" class="el-icon-picture-outline"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="活动名称" class="myStyle" width="150">
            <template slot-scope="scope">{{ scope.row.eventsName}}</template>
          </el-table-column>
          <el-table-column align="center" label="商品名称" width="150" style="cursor:pointer;">
            <template slot-scope="scope" >
              <el-popover
                placement="top-start"
                width="120"
                trigger="hover"
                :content="scope.row.productName">
                <p style="width: 100px;cursor:pointer;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" slot="reference">{{scope.row.productName}}</p>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" label="顺序" class="myStyle">
            <template slot-scope="scope">{{ scope.row.orderNum}}</template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">{{ scope.row.stateName }}</template>
          </el-table-column>
          <el-table-column align="center" label="开始时间" width="180">
            <template slot-scope="scope">{{ scope.row.seckillStartTime}}</template>
          </el-table-column>
          <el-table-column align="center" label="结束时间" width="180">
            <template slot-scope="scope">{{ scope.row.seckillEndTime}}</template>
          </el-table-column>
          <el-table-column align="center" label="浏览量">
            <template slot-scope="scope">{{ scope.row.browseNum}}</template>
          </el-table-column>
          <el-table-column align="center" label="销量" >
            <template slot-scope="scope">{{ scope.row.salesVolume}}</template>
          </el-table-column>
          <el-table-column align="center" label="库存">
            <template slot-scope="scope">{{ scope.row.seckillInventory}}</template>
          </el-table-column>
          <el-table-column align="center" label="秒杀价">
            <template slot-scope="scope">{{ scope.row.fansSeckillPrice}}</template>
          </el-table-column>
          <el-table-column align="center" label="秒杀代理价" width="120">
            <template slot-scope="scope">{{ scope.row.agentSeckillPrice}}</template>
          </el-table-column>
          <el-table-column align="center" label="备注" width="100">
            <template slot-scope="scope">
<!--              <el-popover-->
<!--                placement="top-start"-->
<!--                width="120"-->
<!--                trigger="hover"-->
<!--                :content="scope.row.remark">-->
<!--                <p style="width: 100px;cursor:pointer;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" slot="reference">{{scope.row.remark || '-'}}</p>-->
<!--              </el-popover>-->
              {{scope.row.remark || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" :width="$settings.dateWidth" fixed="right">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="handleView(scope)">查看</el-button>
              <el-button
                size="small"
                type="success"
                @click="copy(scope)"
                v-if="$store.state.user.pageBtns.includes('copy') && scope.row.state === 3"
              >复制</el-button>
              <el-button
                size="small"
                type="warning"
                @click="handleEditInfo(scope)"
                v-if="$store.state.user.pageBtns.includes('edit') && scope.row.state === 1"
              >修改</el-button>
              <!--              v-if="$store.state.user.pageBtns.includes('edit')"-->
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope)"
                v-if="$store.state.user.pageBtns.includes('del') && scope.row.state !== 2"
              >删除</el-button>
              <el-button
                v-if="$store.state.user.pageBtns.includes('stop') && scope.row.state === 2"
                size="small"
                type="danger"
                @click="handleStop(scope)"
              >停止</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="searchForm.pageNo"
        :limit.sync="searchForm.pageSize"
        @pagination="getSeckillList"
      />
    </div>
    <!-- 新增 修改 查看的弹框 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType" @close="dialogClose">
      <el-form
        v-if="dialogVisible"
        :disabled="isReadOnly"
        :model="infoForm"
        label-width="90px"
        ref="infoForm"
        :rules="formRule"
      >
        <!-- 选择商品的弹框 -->
        <el-dialog
          width="70%"
          title="商品选择"
          :visible.sync="innerVisible"
          append-to-body>
          <product @handleCurrentChange="handleCurrentChange" :data="data"></product>
        </el-dialog>
<!--        class="widthStyle"-->
        <div class="myStyle">
          <div class="myStyleItem">
            <el-form-item label="活动名称" prop="eventsName">
              <el-input v-model="infoForm.eventsName" placeholder="秒杀活动名称"  class="input-textarea"
                        type="textarea"
                        rows="3"
                        maxlength="50"
                        show-word-limit
              />
            </el-form-item>
          </div>
        </div>
        <el-form-item label="顺序" prop="orderNum">
          <el-input v-model="infoForm.orderNum" placeholder="必须是数字" class="widthStyle"/>
        </el-form-item>
        <el-form-item label="秒杀图片" prop="eventsImageId">
          <el-upload
            :action="$url.fileUploadUrl"
            list-type="picture-card"
            :headers="upLoadHeader"
            :on-success="upIdSeckillImg"
            :on-remove="remove"
            accept="image/*"
            :limit="1"
            :file-list="seckillList"
            :on-exceed="handleExceed"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品选择">
          <el-button @click="innerVisible = true">请选择商品</el-button>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="infoForm.productName" placeholder="请选择商品" disabled class="widthStyle"/>
        </el-form-item>
        <el-form-item label="商品图片" prop="image">
          <el-upload
            disabled
            :action="$url.fileUploadUrl"
            list-type="picture-card"
            :headers="upLoadHeader"
            accept="image/*"
            :limit="1"
            :file-list="imgList"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <div class="myStyle">
          <div class="myStyleItem">
            <el-form-item label="开始时间" prop="seckillStartTime">
              <el-date-picker
                v-model="infoForm.seckillStartTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="开始时间">
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="myStyleItem">
            <el-form-item label="结束时间" prop="seckillEndTime">
              <el-date-picker
                v-model="infoForm.seckillEndTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
          </div>
        </div>
        <div class="myStyle">
           <div class="myStyleItem">
             <el-form-item label="秒杀价" prop="fansSeckillPrice">
               <el-input v-model="infoForm.fansSeckillPrice" placeholder="秒杀价" disabled class="widthStyle"/>
             </el-form-item>
           </div>
          <div class="myStyleItem">
            <el-form-item label="秒杀代理价" prop="agentSeckillPrice">
              <el-input v-model="infoForm.agentSeckillPrice" placeholder="秒杀代理价" disabled class="widthStyle"/>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="秒杀库存" prop="remark">
          <el-input v-model="infoForm.seckillInventory" placeholder="库存" disabled class="widthStyle"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="infoForm.remark"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    type="textarea"
                    placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;" v-show='dialogType =="查看秒杀" ? false : true '>
        <el-button type="primary" @click="confirmUser">确认</el-button>
        <el-button type="danger" @click="dialogClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import { getActivities, getDetailById, addActivity, editActivity, delActivity,copyActivity, getSeckillStatus,stopActivity } from '@/api/activitySeckill'
    import {getToken} from '@/utils/auth'
    import product from '../productManger/warehouse'
    import Pagination from '@/components/Pagination'
    export default {
        name: 'ActivitySeckill',
        components: { Pagination, product },
        data() {
            return {
                activeNames:'',
                data: {
                    show: true,
                    num: 1
                },
                upLoadHeader: {
                    Authorization: getToken()
                },
                options: [],
                imgList: [],
                seckillList: [],
                innerVisible: false,
                isReadOnly: false,
                name: '',
                mobile: '',
                value: '',
                infoList: [],
                dialogVisible: false,
                searchForm: {
                    pageNo: 1
                    , pageSize:20,
                    state: '',
                    productName: '',
                    startTime: '',
                    endTime: ''
                } ,
                listLoading: false,
                total: 0,
                dialogType: '',
                // 添加、修改表单数据
                infoForm: {
                    eventsImageId: '',
                    eventsName: '',
                    orderNum: '',
                    productId: '',
                    seckillEndTime: '',
                    seckillStartTime: '',
                    agentSeckillPrice: '',
                    fansSeckillPrice: '',
                    seckillInventory: '',
                    remark: ''
                },
                multipleSelection: [],
                formRule: {
                    eventsName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
                    orderNum:[{ required: true, message: '请输入排序字段', trigger: 'blur' }],
                    eventsImageId: [{ required: true, message: '请选择秒杀图片', trigger: 'change' }],
                    seckillStartTime: [{ type: 'string', required: true, message: '请选择时间', trigger: 'change' }],
                    seckillEndTime: [{ type: 'string', required: true, message: '请选择时间', trigger: 'change' }]
                }
            }
        },
        methods: {
            // 秒杀图片
            upIdSeckillImg(res){
                this.infoForm.eventsImageId = res.data
            },
            //删除图片
            remove(){
                this.infoForm.eventsImageId = ''
                this.seckillList = []
            },
            //限制上传文件数量
            handleExceed(){
                this.$message.warning('最多只能上传一张图片');
            },
            // 选择商品回显图片获得商品id
            handleCurrentChange(data) {
                this.imgList = [{url: data.mainImageURL}]
                this.infoForm.productName = data.name
                this.infoForm.productId = data.id
                this.infoForm.fansSeckillPrice = data.retailPrice
                this.infoForm.agentSeckillPrice = data.agentPrice
                this.infoForm.seckillInventory = data.totalInventory
                this.innerVisible = false
            },
            // 取消修改
            dialogClose() {
                this.dialogVisible = false;
                this.infoForm = {
                    eventsImageId: '',
                    eventsName: '',
                    orderNum: '',
                    productId: '',
                    seckillEndTime: '',
                    seckillStartTime: '',
                    agentSeckillPrice: '',
                    fansSeckillPrice: '',
                    seckillInventory: '',
                    remark: ''
                };
                this.imgList = [];
                this.seckillList = [];
            },
            //显示新增 修改 查看 的隐藏弹窗
            showOrHideDialog() {
                this.dialogVisible = !this.dialogVisible;
            },
            // 新增秒杀
            addDialog() {
                this.dialogType = '新增秒杀';
                this.isReadOnly = false;
                this.showOrHideDialog();
            },
            //查看标签
            handleView(score) {
                this.isReadOnly = true;
                getDetailById(score.row.id).then(res =>{
                    this.dialogType = '查看秒杀';
                    this.setDetailData(res);
                    this.showOrHideDialog();
                })
                // this.logoListPro = [{url: res.data.mainFileImageURL}]
                // this.logoList = [{url: res.data.mainImageURL}]
            },
            // 修改标签
            handleEditInfo(score) {
                this.isReadOnly = false;
                getDetailById(score.row.id).then(res =>{
                    this.dialogType = '修改秒杀';
                    this.setDetailData(res);
                    this.showOrHideDialog();
                    this.infoForm.id = res.data.id;
                })
                // this.logoListPro = [{url: res.data.mainFileImageURL}]
                // this.logoList = [{url: res.data.mainImageURL}]
            },
            // 获取用户列表信息
            getSeckillList(num) {
                if(num == 1) {
                    this.searchForm.pageNo = 1;
                }
                this.listLoading = true;
                getActivities(this.searchForm).then(res => {
                    this.infoList = res.data.rows;
                    this.total = res.data.total;
                    setTimeout(() => {
                        this.listLoading = false
                    }, 500)
                })
            },
            // 确认新增 修改
            confirmUser(score) {
                if(!this.infoForm.productId) {
                    this.$message({
                        type: 'warning',
                        message: '必须选择一个商品！'
                    });
                    return;
                }
                this.$refs['infoForm'].validate((valid) => {
                    if (valid) {
                        if(this.dialogType == '新增秒杀') {
                            addActivity(this.infoForm).then(res => {
                                if(res.status == 1) {
                                    this.$message({
                                        type: 'success',
                                        message: '新增成功！'
                                    });
                                    this.getSeckillList();
                                    this.showOrHideDialog();
                                }
                            });
                        }
                        if(this.dialogType == '修改秒杀') {

                            editActivity(this.infoForm).then(res => {
                                if(res.status == 1) {
                                    this.$message({
                                        type: 'success',
                                        message: '修改成功！'
                                    });
                                    this.getSeckillList();
                                    this.showOrHideDialog();
                                }
                            })
                        }
                    }
                })
            },
            // 复制秒杀活动
            copy(data) {
                this.$confirm('确定要复制该秒杀活动吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        await copyActivity(data.row.id).then(res => {
                            if(res.status == 1){
                                this.$message({
                                    type: 'success',
                                    message: '复制成功!'
                                })
                                this.getSeckillList();
                            }
                        })
                    })
                    .catch(err => {
                        console.error(err)
                    })
            },
            //删除角色
            handleDelete(score) {
                this.$confirm('确定要删除该秒杀活动吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        await delActivity(score.row.id).then(res => {
                            if(res.status == 1){
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                })
                                this.getSeckillList();
                            }
                        })
                    })
                    .catch(err => {
                        console.error(err)
                    })
            },
            //立即停止秒杀活动
            handleStop(score) {
                this.$confirm('确定要立即停止该秒杀活动吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        await stopActivity(score.row.id).then(res => {
                            if(res.status === 1){
                                this.$message({
                                    type: 'success',
                                    message: '秒杀活动已停止，将在一分钟内生效。'
                                    ,duration: 3 * 1000
                                });
                                this.getSeckillList();
                            }
                        })
                    })
                    .catch(err => {
                        console.error(err)
                    })
            },
            //查看/修改信息时赋值
            setDetailData(res){
                this.infoForm = res.data;
                this.seckillList = [{
                    url:res.data.eventsImageUrl
                }];
                this.imgList = [{
                    url:res.data.productMainImageUrl
                }];
            },
            // 通过字典获取秒杀状态
            getSeckillStatus() {
                getSeckillStatus().then(res => {
                    if(res.status == 1) {
                        this.options = res.data;
                    }
                })
            }
        },
        created() {
            this.getSeckillStatus();
            this.getSeckillList();
        }
    }
</script>

<style>
  .main-block .myInput .el-input__inner {
    width: 100%;
  }
  .myStyle {
    display: flex;
  }
  .myStyleItem {
    flex: 1;
  }
  .widthStyle {
    width: 220px;
  }
</style>
