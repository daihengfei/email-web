import { login, register, getVerCode, logout, getInfo } from '@/api/user'
import { getToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'

const getDefaultState = () => {
  return {
    name: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        if (response.code === 200) {
          Message({
            message: '登录成功',
            type: 'success'
          })
        } else {
          Message({
            message: '登录失败',
            type: 'error'
          })
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  register({ commit }, userInfo) {
    const { email, username, password, verCode } = userInfo
    const data = {
      email: email,
      username: username,
      password: password
    }
    return new Promise((resolve, reject) => {
      register({ data: data, vercode: verCode }).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getVerCode({ commit }, email) {
    return new Promise((resolve, reject) => {
      getVerCode({ email: email }).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(getToken()).then(response => {
        let { data } = response

        if (!data) {
          reject('验证失败，请重新登录')
        }

        data = JSON.parse(data)
        const { roles, username, avatar } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('角色不能为空')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then((response) => {
        removeToken()
        resetRouter()
        Message({
          message: response.data,
          type: 'success'
        })
        commit('RESET_STATE')
        // this.$store.dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
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

