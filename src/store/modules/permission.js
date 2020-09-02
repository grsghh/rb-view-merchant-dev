import { constantRoutes } from '@/router'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, routerData) {
    return new Promise(resolve => {
      const accessedRoutes = routerData
      sessionStorage.setItem('router', JSON.stringify(accessedRoutes))
      for (const i in accessedRoutes) {
        if (accessedRoutes[i].component != 'Layout') {
          console.log(accessedRoutes[i].component)
          accessedRoutes[i].component = require('../../views' + accessedRoutes[i].component).default
        } else {
          accessedRoutes[i].component = Layout
        }
        if (accessedRoutes[i].children) {
          for (const j in accessedRoutes[i].children) {
            if (accessedRoutes[i].children[j].component != 'Layout') {
              accessedRoutes[i].children[j].component = require('../../views' + accessedRoutes[i].children[j].component).default
            } else {
              accessedRoutes[i].children[j].component = Layout
            }
            if (!accessedRoutes[i].children[j].children) delete accessedRoutes[i].children[j].children
          }
        }
      }
      accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
