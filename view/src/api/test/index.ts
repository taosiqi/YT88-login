import { fetchPost, fetchGet, fetchDelete, fetchPut, fetchUrl } from '@/api/axios'
/**登录*/

export function login(data: UserInfo): Promise<LoginData> {
  return fetchGet(`${fetchUrl.domain}user/login`, data)
}
/**效验key*/
export function loginVerify(data: LoginVerify): Promise<VerifyData> {
  return fetchGet(`${fetchUrl.domain}user/login/verify`, data)
}
