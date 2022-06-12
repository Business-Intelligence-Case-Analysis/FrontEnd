import request from '@/utils/request'

export function getAuthorsBySameInterest (params) {
  return request({
    url: 'getAuthorsBySameInterest',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: JSON.stringify(params)
  })
}
