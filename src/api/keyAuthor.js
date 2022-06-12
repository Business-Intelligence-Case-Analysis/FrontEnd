import request from '@/utils/request'

export function getInfluentialAuthors (params) {
  return request({
    url: '/getInfluentialAuthors',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: JSON.stringify(params)
  })
}
