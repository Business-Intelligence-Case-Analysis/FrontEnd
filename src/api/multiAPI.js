import request from '@/utils/request'

export function getMultihopBetweenNodes (params) {
  return request({
    url: 'getMultihopBetweenNodes',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: JSON.stringify(params)
  })
}
