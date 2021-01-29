import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { projectState } from '@/config'
import qs from 'qs'
//响应时间
axios.defaults.timeout = 5000

//请求拦截器
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = sessionStorage.getItem('token')
    token && (config.headers.authorization = token)
    if (config.method === 'post') {
      config.data = qs.stringify(config.data)
    }
    return config
  },
  error => {
    ElMessage.error('请求超时')
    return Promise.reject(error)
  }
)
//响应拦截器
axios.interceptors.response.use(
  (res: AxiosResponse) => {
    if (res.status !== 200) {
      ElMessage.error('请求错误')
    } else {
      switch (res.data.code) {
        case 401:
          ElMessage.error(res.data.msg)
          return Promise.reject(res.data.msg)
        case 400:
          ElMessage.error(res.data.msg)
          return Promise.reject(res.data.msg)
        case 402:
          return Promise.reject(res.data.msg)
      }
    }
    return Promise.resolve(res.data)
  },
  error => {
    return Promise.reject(error)
  }
)

//post
export function fetchPost(url: string, params: {}): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(
        response => {
          resolve(response)
        },
        err => {
          reject(err)
        }
      )
      .catch(error => {
        reject(error)
      })
  })
}
//put
export function fetchPut(url: string, params: {}): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .put(url, params)
      .then(
        response => {
          resolve(response)
        },
        err => {
          reject(err)
        }
      )
      .catch(error => {
        reject(error)
      })
  })
}
//get
export function fetchGet(url: string, params: {}): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(
        response => {
          resolve(response)
        },
        err => {
          reject(err)
        }
      )
      .catch(error => {
        reject(error)
      })
  })
}
//delete
export function fetchDelete(url: string, params: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        params: params
      })
      .then(
        response => {
          resolve(response)
        },
        err => {
          reject(err)
        }
      )
      .catch(error => {
        reject(error)
      })
  })
}

export const fetchUrl = projectState
