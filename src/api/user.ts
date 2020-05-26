import { axios } from '@/utils/request'

export function getInfo() {
  return axios({
    url: '/api/v1/users/self',
    method: 'get'
  })
}

export function fetchList(params: any) {
  return axios({
    url: 'api/v1/users',
    method: 'get',
    params: params
  })
}
