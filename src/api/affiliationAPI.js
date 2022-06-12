import request from '@/utils/request'

export function getAuthorsInAffiliation (params) {
  return request({
    url: 'getAuthorsInAffiliation',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: JSON.stringify(params)
  })
}
