import {
  queryMenu,
  addMenu,
  updateMenu,
  deleteMenu,
  queryAllMenu,
  queryMenuByUser
} from "@/api/system/menu"
import { Message } from "element-ui"

const state = {
  menuList: [],
  menuTreeByUser: []
}

const mutations = {
  SET_MENU_LIST: (state, menuList) => {
    state.menuList = menuList
  },
  SET_MENU_TREE_BY_USER: (state, menuTree) => {
    state.menuTreeByUser = menuTree
  }
}

const actions = {
  // 获取菜单列表
  getMenu({ commit }, params) {
    return new Promise((resolve, reject) => {
      queryMenu(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 新增菜单
  addMenu({ commit }, params) {
    return new Promise((resolve, reject) => {
      addMenu(params).then(response => {
        if (response.code === 200) {
          Message({
            message: "新增成功",
            type: "success"
          })
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 修改菜单
  updateMenu({ commit }, params) {
    return new Promise((resolve, reject) => {
      updateMenu(params).then(response => {
        if (response.code === 200) {
          Message({
            message: "修改成功",
            type: "success"
          })
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 删除菜单
  deleteMenu({ commit }, params) {
    return new Promise((resolve, reject) => {
      deleteMenu(params).then(response => {
        if (response.code === 200) {
          Message({
            message: "删除成功",
            type: "success"
          })
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取所有菜单
  getAllMenu({ commit }) {
    return new Promise((resolve, reject) => {
      queryAllMenu().then(response => {
        const data = JSON.parse(response.data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取用户菜单根据用户
  getMenuByUser({ commit }, params) {
    return new Promise((resolve, reject) => {
      queryMenuByUser(params).then(response => {
        const data = JSON.parse(response.data)
        const { menuList } = data
        commit("SET_MENU_TREE_BY_USER", menuList)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
