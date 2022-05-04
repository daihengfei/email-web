const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  menuList: state => state.menu.menuList,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews

}
export default getters
