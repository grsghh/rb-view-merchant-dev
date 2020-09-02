import { login, logout, getInfo, getRouter, refreshToken} from '@/api/user'
import { getToken, setToken, removeToken ,setRefreshToken,getRefreshToken,removeRefreshToken} from '@/utils/auth'
import router, { resetRouter } from '@/router'
import request from '@/utils/request'

const state = {
  token: getToken(),
  refreshToken: getRefreshToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
  ,pageBtns:[]
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_REFRESHTOKEN: (state, token) => {
    state.refreshToken = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PAGEBTNS: (state, data) => {
    state.pageBtns = data
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, userType } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, userType }).then(response => {
        const { data } = response
        commit('SET_NAME', data.username)
        commit('SET_TOKEN', data.token)
        commit('SET_REFRESHTOKEN', data.refreshToken)
        localStorage.userName = data.username;
        setToken(data.token)
        setRefreshToken(data.refreshToken)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getRouter().then(response => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_REFRESHTOKEN', '')
        commit('SET_PAGEBTNS', [])
        removeToken()
        removeRefreshToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 设置当前路由所用的按钮权限列表
  setBtn({ commit },data) {
    commit('SET_PAGEBTNS', data);
  },
  // 刷新 token
  refreshToken({ commit }) {
    request.defaults.headers.common['Authorization'] = getRefreshToken();
    return new Promise(resolve => {
      refreshToken().then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_REFRESHTOKEN', data.refreshToken)
        setToken(data.token)
        setRefreshToken(data.refreshToken)
        request.defaults.headers.common['Authorization'] = data.token;
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_REFRESHTOKEN', [])
      removeToken()
      resolve()
    })
  },
  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
