import { fetchPost, fetchGet, fetchDelete, fetchPut, fetchUrl } from '@/api/interceptors'
/**登录*/
export function login(data: any) {
  return new Promise((resolve, reject) => {
    fetchGet(`${fetchUrl.domain}user/login`, data).then(res => {
      resolve(res)
    })
  })
}
/**效验key*/
export function loginVerify(data: any) {
  return new Promise((resolve, reject) => {
    fetchGet(`${fetchUrl.domain}user/login/verify`, data).then(res => {
      resolve(res)
    })
  })
}
