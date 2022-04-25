import { asyncRoutes, constantRoutes } from '@/router'
/* Layout */
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

function setChildMenu(id, menu) {
  const childMenu = []
  menu.forEach(item => {
    if (item.menuParentId === id) {
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
export function filterAsyncRoutes(menuList) {
  const res = []

  menuList.forEach(menu => {
    if (menu.menuUrl !== '/dashboard') {
      if (menu.children) {
        const children = []
        menu.children.forEach(route => { // 二级菜单需匹配页面
          children.push({
            path: route.menuUrl,
            name: route.menuName,
            // 此处使用require，由于import会有奇怪的错误
            component: (resolve) => require([`@/views${route.menuUrl}/index`], resolve),
            meta: {
              title: route.menuName,
              icon: route.menuIcon
            }
          })
        })

        res.push({
          path: menu.menuUrl,
          component: Layout,
          redirect: 'noRedirect',
          meta: {
            title: menu.menuName,
            icon: menu.menuIcon
          },
          children: children
        })
      } else {
        res.push({
          path: menu.menuUrl,
          name: menu.menuName,
          // 此处使用require，由于import会有奇怪的错误
          component: (resolve) => require([`@/views${menu.menuUrl}/index`], resolve),
          meta: {
            title: menu.menuName,
            icon: menu.menuIcon
          }
        })
      }
    }
  })

  res.push({ path: '*', redirect: '/404', hidden: true })
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
  generateRoutes({ commit }, menuList) {
    return new Promise(resolve => {
      const newMenuList = []
      menuList.forEach(menu => {
        if (menu.menuParentId === 0) {
          menu.children = setChildMenu(menu.id, menuList)
          newMenuList.push(menu)
        }
      })
      // const accessedRoutes = filterAsyncRoutes(asyncRoutes, newMenuList)
      const accessedRoutes = filterAsyncRoutes(newMenuList)
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
