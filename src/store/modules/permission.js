import {constantRoutes} from "@/router"
/* Layout */
import Layout from "@/layout"
import {generateChildrenMenu} from "@/utils/util"

/**
 * Filter asynchronous routing tables by recursion
 * @param menuList menuList
 */
export function filterAsyncRoutes(menuList) {
  const res = []

  menuList.forEach(menu => {
    if (menu.menuUrl !== "/dashboard") {
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
          alwaysShow: true,
          redirect: "noRedirect",
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
          alwaysShow: true,
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

  res.push({path: "*", redirect: "/404", hidden: true})
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
  generateRoutes({commit}, menuList) {
    return new Promise(resolve => {
      const newMenuList = generateChildrenMenu(menuList)
      const accessedRoutes = filterAsyncRoutes(newMenuList)
      commit("SET_ROUTES", accessedRoutes)
      resolve(accessedRoutes)
    })
  },

  repalceRoute({commit}, route) {
    return new Promise(resolve => {
      commit("SET_ROUTES", route)
      resolve(route)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
