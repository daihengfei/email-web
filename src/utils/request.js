import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken } from '@/utils/auth'

const service = axios.create({
  baseURL: '/api',
  timeout: 250000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = getToken()
    }
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    config.headers['Access-Control-Allow-Origin'] = '*'
    return config
  },
  error => {
    Message.error(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      const token = response.headers['authorization'];
      if (token !== undefined && token !== null && token !== '') {
        setToken(token);
      }
      return res
    }
  },
  error => {
    const status = error.response.status;
    if (status === 401 || status === 403) {
      Message.error(error.response.data.message);
    } else if (status === 404) {
      Message.error('请求资源不存在');
    } else if (status === 500) {
      Message.error('服务器内部错误');
    } else {
      Message.error('未知错误');
    }
    // return Promise.reject(error)
  }
)

const get = (url, data) => {
  return new Promise((resolve, reject) => {
    service
      .get(url, { params: data })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
const deleter = (url, data) => {
  return new Promise((resolve, reject) => {
    service
      .delete(url, { params: data })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
const post = (url, data) => {
  return new Promise((resolve, reject) => {
    service
      .post(url, JSON.stringify(data))
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
const put = (url, data) => {
  return new Promise((resolve, reject) => {
    service
      .put(url, JSON.stringify(data))
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
export { get, post, deleter, put }
// export default service
