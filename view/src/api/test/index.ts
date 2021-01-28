import { fetchPost, fetchGet, fetchDelete, fetchPut, fetchUrl } from '@/api/interceptors'
/**获取*/
export function getList() {
  fetchGet(`${fetchUrl.domain}get`, {
    name: 123
  }).then(res => {})
}
export function delList() {
  fetchDelete('http://192.168.1.189:3000/delete', {
    name: 123
  }).then(res => {})
}
export function putList() {
  fetchPut('http://192.168.1.189:3000/put', {
    name: 123
  }).then(res => {})
}
export function postList() {
  fetchPost('http://192.168.1.189:3000/post', {
    name: 123
  }).then(res => {})
}
