import {deleter, get, post} from "@/utils/request"

export function getAccountList(data) {
  return get("/microsoft_graph/client_list", {
    search: data
  })
}

export function createAccount(data) {
  return post("/microsoft_graph/add_client", data)
}

export function deleteAccount(data) {
  return deleter("/microsoft_graph/delete_client", {
    id: data
  })
}
