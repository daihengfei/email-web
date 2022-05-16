export function generateChildrenMenu(menuList) {
  const newMenuList = []
  menuList.forEach(menu => {
    if (menu.menuParentId === "0") {
      menu.children = setChildMenu(menu.id, menuList)
      newMenuList.push(menu)
    }
  })

  return newMenuList
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

export function timestampToTime(timestamp) {
  var date = new Date(timestamp)
  var Y = date.getFullYear() + "-"
  var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-"
  var D = (date.getDate() < 10 ? "0" + (date.getDate()) : date.getDate()) + " "
  var h = date.getHours() + ":"
  var m = date.getMinutes() + ":"
  var s = date.getSeconds()
  return Y + M + D + h + m + s
}
