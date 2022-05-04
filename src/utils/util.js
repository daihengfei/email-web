export function generateChildrenMenu(menuList) {
  const newMenuList = []
  menuList.forEach(menu => {
    if (menu.menuParentId === '0') {
      menu.children = setChildMenu(menu.id, menuList)
      newMenuList.push(menu)
    }
  })

  return newMenuList;
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
