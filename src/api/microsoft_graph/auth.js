import {get, post} from "@/utils/request"

export function getAccessToken(email) {
  return get("/msal/access_token", {email})
}

export function getLoginUrl(userInfos) {
  return get("/msal/get_msal_login_url", {
    userInfos: JSON.stringify(userInfos)
  })
}

export function getTempClientInfo(userEmail) {
  return get("/msal/get_temp_clientInfo", {
    userEmail: userEmail
  })
}

export function signIn(data) {
  return post("/msal/sign_in", data)
}
