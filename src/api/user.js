import { get, post } from '@/utils/request'
import Encrypt from '@/utils/encrypt'

export async function login(data) {
  data = await passwordChanged(data)
  return post('/login', data)
}

export async function register(info) {
  let user = info.data
  user = {
    ...user,
    password: (await passwordChanged(user)).password
  }
  info = {
    ...info,
    data: user
  }
  return post('/register', info)
}

export function getInfo(token) {
  const data = {
    token: token
  }
  return get('/getUserInfo', data)
}

export function getVerCode(email) {
  return get('/sendVerCode', email)
}

export function logout(token) {
  return post('/logout', token)
}

async function passwordChanged(data) {
  return {
    ...data,
    password: await Encrypt.encodePassword(data.username, data.password)
  }
}
