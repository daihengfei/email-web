import {get, post} from "@/utils/request"

export function queryMenu(params) {
  return get("/menu/findMenu", params)
}

export function addMenu(params) {
  return post("/menu/createMenu", params)
}

export function updateMenu(params) {
  return post("/menu/updateMenu", params)
}

export function deleteMenu(params) {
  return post("/menu/deleteMenu", params)
}

export function queryAllMenu() {
  return get("/menu/findAllMenu", "")
}

export function queryMenuByUser(params) {
  return get("/menu/findMenuByUser", params)
}
