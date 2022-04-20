import { get, post } from '@/utils/request'
import Encrypt from '@/utils/encrypt'

export async function login(data) {
  const data1 = {
    ...data,
    password: await Encrypt.encodePassword(data.username, data.password)
  }
  return post('/login', data1)
}

export function getInfo(token) {
  const data = {
    token: token
  }
  return get('/getUserInfo', data)
}

export function logout(token) {
  return post('/vue-admin-template/user/logout', token)
}
