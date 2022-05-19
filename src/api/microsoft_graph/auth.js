import {deleter, get, post} from "@/utils/request"

export function getAccessToken(email) {
  return get("/msal/access_token", {email})
}

export function getLoginUrl(accessToken) {
  return get("/msal/get_msal_login_url", {accessToken})
}

export function signIn(email, password) {
  return post("/msal/sign_in", {email, password})
}
