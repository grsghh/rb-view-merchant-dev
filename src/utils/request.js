import axios from 'axios'
import {MessageBox, Message} from 'element-ui'
import store from '@/store'
import {getToken, getRefreshToken} from '@/utils/auth'
import router from '@/router'
import vueEl from '@/main'
import wx from 'weixin-js-sdk'
let routeQuery = {};
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // config.headers['Authorization'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJway1tLWlkIjoxLCJway11LWlkIjoxMTczMDcxOTk2MDQyNjQ5NjAsInBrLWRldmljZS10eXBlLW5hbWUiOiJNSU5JIiwiaXNzIjoiYXV0aDAiLCJleHAiOjE1Nzc4NzczMTQsInBrLWEtaWQiOjEsInBrLWItaWQiOjExNzMwNzE5OTUxNjE4NDU3Nn0.HLkq4eCSQM7hq0-RzdIlP4T9EyG7SFeNntfR5_8lJI4'
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.status !== 1) {
      Message({
        message: res.message || '请求错误',
        type: 'error',
        duration: 5 * 1000
      });
      return res
    } else {
      return res
    }
  },
  error => {
    // error.request.status 为响应错误代码
    switch (error.request.status) {
      //token过期
      case 403:
      case 401:
        //小程序环境
        if(vueEl.$miniState.isMini){
          wx.miniProgram.redirectTo({
            url:`/pages/authorization/authorization?backUrl=pages/webview/webview&argu=${JSON.stringify(vueEl._route.query)}`
          });
          return
        }
        Message({
          message: 'token已失效，为保证您的操作安全，请重新登录',
          type: 'error',
          duration: 3 * 1000
        })
        // setTimeout(()=>{
        //   store.dispatch('user/resetToken').then(() => {
        //     location.reload()
        //   });
        // },3000);
        setTimeout(()=>{
          store.dispatch('user/resetToken').then(() => {
            sessionStorage.setItem('router', '')
            router.replace(`/login`)
          });
        },1500);
        break;
    }
    Message({
      message: JSON.parse(error.request.response).message || error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
