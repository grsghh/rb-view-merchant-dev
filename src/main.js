import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import '@/assets/font/iconfont.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters
import VueClipboard from 'vue-clipboard2'
let url = {},moduleName = {},miniState = {isMini:false};
switch (process.env.VUE_APP_ENV) {
  case "development"://开发
    url = {
      downUrl:'http://192.168.1.128:10030',//下载文件地址
      picUrl:'http://192.168.1.128:10030/rb-oss/',
      fileUploadUrl: 'http://192.168.1.128:10030/rb-oss/files/multi-part'
      ,videoUploadUrl: 'http://192.168.1.128:10030/rb-oss/upload/videos'
      // fileUploadUrl: 'https://www.zzrbsy.com/api/rb-oss/files/multi-part'
      ,uplodFile:'http://192.168.1.128:10030/rb-order/orders/batch-despatch/upload'
    };
    moduleName = {
      rbMerchant:'rb-merchant'//经销商相关接口
      ,rbPermission:'rb-permission'//权限服务相关接口
      ,rbAccount:'rb-account'//用户登录账号相关服务接口
      ,rbPlatform:'rb-platform'//平台相关接口
      ,rbAgent:'rb-agent'//代理相关接口
      ,rbMember:'rb-member-v2'//粉丝（也就是C端用户）相关接口
      ,rbDatadict:'rb-datadict'//数据字典服务，提供基础数据字典和地域地区查询接口
      ,rbOrder:'rb-order'//订单
      ,rbMessage:'rb-message'//消息服务
      ,rbSeckill: 'rb-seckill'//秒杀服务
      ,rbStatistics: 'rb-statistics'//统计服务
    };
    break;
  case "staging"://测试
    url = {
      downUrl:'http://192.168.1.128:10030',
      fileUploadUrl: 'http://192.168.1.128:10030/rb-oss/files/multi-part'
      ,videoUploadUrl: 'http://192.168.1.128:10030/rb-oss/upload/videos'
      ,uplodFile:'http://192.168.1.128:10030/rb-order/orders/batch-despatch/upload'
    };
    moduleName = {
      rbMerchant:'rb-merchant'//经销商相关接口
      ,rbPermission:'rb-permission'//权限服务相关接口
      ,rbAccount:'rb-account'//用户登录账号相关服务接口
      ,rbPlatform:'rb-platform'//平台相关接口
      ,rbAgent:'rb-agent'//代理相关接口
      ,rbMember:'rb-member-v2'//粉丝（也就是C端用户）相关接口
      ,rbDatadict:'rb-datadict'//数据字典服务，提供基础数据字典和地域地区查询接口
      ,rbOrder:'rb-order'//订单
      ,rbMessage:'rb-message'//消息服务
      ,rbSeckill: 'rb-seckill'//秒杀服务
      ,rbStatistics: 'rb-statistics'//统计服务
    };
    break;
  case "production"://生产
    url = {
      downUrl:'https://www.zzrbsy.com/api',
      fileUploadUrl: 'https://www.zzrbsy.com/api/rb-oss/files/multi-part'
      ,videoUploadUrl: 'https://www.zzrbsy.com/api/rb-oss/upload/videos'
      ,uplodFile:'https://www.zzrbsy.com/api/rb-order/orders/batch-despatch/upload'
    };
    moduleName = {
      rbMerchant:'rb-merchant'//经销商相关接口
      ,rbPermission:'rb-permission'//权限服务相关接口
      ,rbAccount:'rb-account'//用户登录账号相关服务接口
      ,rbPlatform:'rb-platform'//平台相关接口
      ,rbAgent:'rb-agent'//代理相关接口
      ,rbMember:'rb-member-v2'//粉丝（也就是C端用户）相关接口
      ,rbDatadict:'rb-datadict'//数据字典服务，提供基础数据字典和地域地区查询接口
      ,rbOrder:'rb-order'//订单
      ,rbMessage:'rb-message'//消息服务
      ,rbSeckill: 'rb-seckill'//秒杀服务
      ,rbStatistics: 'rb-statistics'//统计服务
    };
    break;
}
//表格全局配置
let settings = {
  dateWidth: '220'
  ,numberWidth:'100'
};
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
});
Vue.use(VueClipboard)
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
window.addEventListener('beforeunload', e => {
  // 页面刷新时清空缓存路由
  sessionStorage.setItem('router', '')
});
Vue.config.productionTip = false
Vue.prototype.$url = url;
Vue.prototype.$settings = settings;
Vue.prototype.$miniState = miniState;
sessionStorage.$moduleName = JSON.stringify(moduleName);
Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时
    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
export default new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
});
