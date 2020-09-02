import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/* Layout */
import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/ForgetPsw',
    component: () => import('@/views/login/ForgetPsw'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/order/orderDetail',
    component: () => import('@/views/order/orderDetail'),
    hidden: true
  },
  {
    path: '/h5Material',
    component: () => import('@/views/h5/h5Material'),
    hidden: true
    ,meta:{title:'素材中心'}
  },
  {
    path: '/h5MaterialDetail',
    component: () => import('@/views/h5/h5MaterialDetail'),
    hidden: true
    ,meta:{title:'素材详情'}
  },
  {
    path: '/h5Editor',
    component: () => import('@/views/h5/h5Editor'),
    hidden: true
    ,meta:{title:'编辑素材'}
  },
  {
    path: '/msgCenter',
    component: () => import('@/views/h5/msgCenter'),
    hidden: true
    ,meta:{title:'消息中心'}
  },
  {
    path: '/msgList',
    component: () => import('@/views/h5/msgList'),
    hidden: true
    ,meta:{title:''}
  },
  {
    path: '/msgDetail',
    component: () => import('@/views/h5/msgDetail'),
    hidden: true
    ,meta:{title:'消息详情'}
  },
  {
    path: '/helpDetail',
    component: () => import('@/views/h5/helpDetail'),
    hidden: true
    ,meta:{title:'帮助详情'}
  },
  {
    path: '/h5Redirect',
    component: () => import('@/views/h5/h5Redirect'),
    hidden: true
    ,meta:{title:''}
  },
  {
    path: '/addnews',
    component: () => import('@/views/content/addnews'),
    hidden: true
    ,meta:{title:'发布文章'}
  },
  {
    path: '/editNews',
    component: () => import('@/views/content/editNews'),
    hidden: true
    ,meta:{title:'编辑文章'}
  },
  {
    path: '/CouponList',
    component: () => import('@/views/h5/CouponList'),
    hidden: true
    ,meta:{title:'优惠券'}
  },
  {
    path: '/CouponRule',
    component: () => import('@/views/h5/CouponRule'),
    hidden: true
    ,meta:{title:'优惠券规则说明'}
  },
  // {
  //   path: '/OperationLogs',
  //   component: () => import('@/views/system/OperationLogs')
  //   // ,hidden: true
  //   ,meta:{title:'用户操作日志'}
  // },
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
});

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
