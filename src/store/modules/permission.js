import { asyncRoutes, constantRoutes } from '@/router'

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

function setChildMenu(id, menu) {
  const childMenu = []
  menu.forEach(item => {
    if (item.parentId === id) {
      childMenu.push(item)
    }
  })
  return childMenu
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
/* export function filterAsyncRoutes(routes, menu) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(menu, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}*/
export function filterAsyncRoutes(menu) {
  const res = []
  const childMenu = []
  menu.forEach(item => {
    if (item.menuParentId === 0) {
      item.children = setChildMenu(item.id, menu)
    }
    childMenu.path = item.menuUrl
  /*  const tmp = { ...route }
    if (hasPermission(menu, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }*/
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
  generateRoutes({ commit }, menu) {
    return new Promise(resolve => {
      /* const menuList = []
      menu.forEach(item => {
        if (item.menuParentId === 0) {
          item.children = setChildMenu(item.id, menu)
        }
        menuList.push(item)
      })*/
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, menu)
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
