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

export function create(data: any) {
  return axios({
    url: 'api/v1/users',
    method: 'post',
    data
  })
}

export function update(id: string, data: any) {
  return axios({
    url: 'api/v1/users/' + id,
    method: 'put',
    data
  })
}

export function details(id: string) {
  return axios({
    url: 'api/v1/users/' + id,
    method: 'get'
  })
}

export function password(id: string, params: any) {
  return axios({
    url: 'api/v1/users/' + id + '/password',
    method: 'post',
    params: params
  })
}

export function remove(id: string) {
  return axios({
    url: 'api/v1/users/' + id,
    method: 'delete'
  })
}
