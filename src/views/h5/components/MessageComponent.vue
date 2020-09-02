<template>
    <div class="msgCenter">
      <div class="topBar" v-if="!params.id">
        <router-link :to="{path:'/msgList',query:{id:1}}" class="topBarItem">
          <div>
            <div class="iconBox logistics">
              <i class="iconfont iconwuliu"></i>
            </div>
            <div class="iconTitle">交易物流</div>
            <div class="unReadNum" v-if="unRead.unReadLogisticsCount">{{ unRead.unReadLogisticsCount }}</div>
          </div>
        </router-link>
        <router-link :to="{path:'/msgList',query:{id:2}}" class="topBarItem">
          <div>
            <div class="iconBox inform">
              <i class="iconfont iconxiaoxi1"></i>
            </div>
            <div class="iconTitle">通知消息</div>
            <div class="unReadNum" v-if="unRead.unReadNoticeCount">{{ unRead.unReadNoticeCount }}</div>
          </div>
        </router-link>
        <router-link :to="{path:'/msgList',query:{id:3}}" class="topBarItem">
          <div>
            <div class="iconBox activity">
              <i class="iconfont iconyouhuiquan-"></i>
            </div>
            <div class="iconTitle">活动优惠</div>
            <div class="unReadNum" v-if="unRead.unReadActivityCount">{{ unRead.unReadActivityCount }}</div>
          </div>
        </router-link>
      </div>
      <div :class="{ 'contentBox': true, 'children': params.id ? true : false}" ref="contentBox">
<!--        <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto" infinite-scroll-immediate="hasMore">-->
        <ul :class="{ 'infinite-list': true, 'children': params.id ? true : false}" v-infinite-scroll="load" style="overflow:auto" infinite-scroll-immediate="hasMore">
          <li class="infinite-list-item wuliuInfo children"
              v-for="(item,index) in list"
              @click="toOrderDetail({targetId: item.targetId, id: item.id, isRead: item.isRead,index})"
              @touchstart="delDialog(item.id)"
              @touchmove="gotouchmove"
              @touchend="gotouchend">
            <div class="infoTab" v-if="item.isRead === 0"></div>
            <div class="infoTop">
              <div class="sendHint hideOver">
                {{ item.title }}
              </div>
              <div class="timeInfo">{{item.createTime}}</div>
            </div>
            <div class="infoContent">
              <div class="imgBox">
                <img :src="item.imageUrl" />
              </div>
              <div class="contentInfo">
                <div class="hideOver productName">{{ item.subtitle }}</div>
                <div class="hideOver">{{ item.summary }}</div>
              </div>
            </div>
          </li>
        </ul>
        <div class="noInfo msgCenterStyle" v-if="!params.id && list.length == 0 && flag">
          <div class="noIconBox">
            <i class="iconfont iconxiaoxi1"></i>
          </div>
          <div class="noInfoTitle">暂无消息</div>
        </div>
      </div>
      <del-dialog :theParams="theParams" @sureDel="sureDel" @dialogClose="handleClose"></del-dialog>
      <div class="noInfo msgCenterStyle" v-if="params.id && list.length == 0 && flag">
        <div class="noIconBox">
          <i class="iconfont iconwuliu" v-if="params.id ==1 && list.length == 0"></i>
          <i class="iconfont iconxiaoxi1" v-else-if="params.id ==2 && list.length == 0"></i>
          <i class="iconfont iconyouhuiquan-" v-else-if="params.id ==3 && list.length == 0"></i>
        </div>
        <div class="noInfoTitle" v-if="params.id ==1 && list.length == 0">暂无物流消息</div>
        <div class="noInfoTitle" v-else-if="params.id ==2 && list.length == 0">暂无通知公告</div>
        <div class="noInfoTitle" v-else-if="params.id ==3 && list.length == 0">暂无优惠活动</div>
      </div>
    </div>
</template>

<script>
    import {formatMsgTime,setH5FontSize,removeH5FontSize} from '@/utils'
    import { getMessageList, delMyMessage,orderIsRead, getUnRead } from '@/api/msgCenter'
    import DelDialog from './DelDialog'
    import wx from 'weixin-js-sdk'

    export default {
        name: "MessageComponent",
        props: {
            params: {
                type: Object
            }
        },
        components: { DelDialog },
        data() {
            return {
                pageNo: 1,
                pageSize: 10,
                hasMore: false,
                list: [], // 数据的列表
                menuList: [], // 消息类型的列表
                flag: false,
                count: false,
                dialogVisible: false,
                timeOutEvent: 0,
                delId: '',
                unRead: {},
                theParams: {
                    visible: false
                }
            }
        },
        methods: {
            handleClose() {
                // this.dialogVisible = false
                this.theParams.visible = false;
            },
            delDialog(id) {
                let that = this;
                that.delId = id;
                clearTimeout(that.timeOutEvent);//清除定时器
                that.timeOutEvent = 0;
                that.timeOutEvent = setTimeout(function(){
                    // that.dialogVisible = true;
                    that.theParams.visible = true;
                },500);
            },
            gotouchmove() {
                clearTimeout(this.timeOutEvent);
            },
            //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
            gotouchend(){
                clearTimeout(this.timeOutEvent);//清除定时器
                this.timeOutEvent = 0;
            },
            sureDel() {
                let that = this;
                delMyMessage(that.delId).then(res => {
                    if(res.status) {
                        this.getList();
                        this.getUnRead();
                        // this.dialogVisible = false;
                        this.theParams.visible = false;
                    }
                })
            },
            load() {
                let that = this;
                if(this.hasMore) {
                    this.pageNo++;
                    getMessageList({pageNo: this.pageNo, pageSize: this.pageSize, messageType: null}).then(res => {
                        if(res.status === 1) {
                            let list = res.data.rows.map(item => {
                                //格式化时间
                                item.createTime = formatMsgTime(item.createTime);
                                return item;
                            });
                            that.list = that.list.concat(list);
                            that.hasMore = res.data.total > that.pageNo * that.pageSize;
                        }
                    })
                }
            },
            toOrderDetail(data) {
                if(data.targetId) {
                  if(data.isRead === 1) {
                      wx.miniProgram.navigateTo({
                          url: '/pages/orderDetails/orderDetails?id=' + data.targetId
                      })
                  } else {
                      this.list[data.index].isRead = 1;
                      orderIsRead(data.id).then(res => {
                          if(res.status === 1) {
                              wx.miniProgram.navigateTo({
                                  url: '/pages/orderDetails/orderDetails?id=' + data.targetId
                              })
                          }
                      })
                  }
                } else {
                    this.$router.push({ path: '/msgDetail', query: { id: data.id }})
                }
            },
            getList() {
                let that = this;
                that.pageNo = 1;
                let messageType = null;
                if(that.params) {
                    messageType = that.params.messageType;
                }
                getMessageList({ pageNo: this.pageNo, pageSize: this.pageSize, messageType }).then(res => {
                    if(res.status === 1) {
                        that.flag = true;
                        that.list = res.data.rows;
                        that.list.map(item => {
                            //格式化时间
                            item.createTime = formatMsgTime(item.createTime);
                        });
                        that.hasMore = res.data.total > that.pageNo * that.pageSize;
                    }
                })
            },
            // 获取未读消息数量
            getUnRead() {
                getUnRead().then(res => {
                    if(res.status == 1) {
                        this.unRead = res.data;
                    }
                })
            }
        },
        beforeCreate(){
            setH5FontSize();
        },
        mounted() {
            document.title = '消息中心';
            this.getUnRead()
            this.getList();
        },
        beforeRouteLeave(to,from,next) {
            removeH5FontSize();
            next();
        }

    }
</script>

<style scoped lang="scss">
  .theMsgCenter {
    position: relative;
    height: 100%;
    background-color: #F0F0F0;
    /*overflow: hidden;*/
  }
  .noSelect {
    -webkit-user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    user-select: none;
  }
</style>
