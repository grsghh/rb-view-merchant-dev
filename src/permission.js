import router from './router'
import store from './store'
import {Message} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getToken} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import {buttons} from '@/api/system'

NProgress.configure({showSpinner: false}) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect','/ForgetPsw'
  ,'/h5Material','/h5MaterialDetail','/h5Editor'
  ,'/msgCenter','/msgList'
  ,'/helpDetail','/msgDetail'
  ,'/h5Redirect'
  ,'/CouponList','/CouponRule'
] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({path: '/'})
      NProgress.done()
    } else {
      // 获取缓存路由，如果没有找到，则重新通过接口获取路由
      const hasRoles = sessionStorage.getItem('router')
      if (hasRoles) {
        //根据路由中的menuId查询当前页面所拥有的按钮权限
        if (to.query.menuId && to.query.menuId != 'undefined') {
          buttons({menuId: to.query.menuId}).then(res => {
            store.dispatch('user/setBtn', res.data);
            next()
          })
        } else {
          next()
        }
      } else {
        try {
          const routerData = await store.dispatch('user/getInfo')
          const accessRoutes = await store.dispatch('permission/generateRoutes', routerData)
          let toDo = {
            ...to
          };
          //如果是初次登录/404页面跳转，则打开一级菜单中第一个二级菜单
          if (toDo.path === '/'  || toDo.path === '/404') {
            toDo.path = `${accessRoutes[0].path}/${accessRoutes[0].children[0].path}?menuId=${accessRoutes[0].children[0].id}`
          }
          router.addRoutes(accessRoutes)
          next({...toDo, replace: true})
        } catch (error) {
          console.log(error);
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      if (to.query.menuId) {
        next(`/login?redirect=${to.path}&menuId=${to.query.menuId}`)
      } else {
        next(`/login?redirect=${to.path}`)
      }
      NProgress.done()
    }
  }
})
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
