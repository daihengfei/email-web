import { get } from "@/utils/request"

export function getList(params) {
  return get("/vue-admin-template/table/list", params)
}
