import request from '@/utils/request'

export function getPapersByPaperTitle (params) {
  return request({
    url: 'getPapersByPaperTitle',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: JSON.stringify(params)
  })
}

export function getPaperAndReferences (params) {
  return request({
    url: 'getPaperAndReferences',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: JSON.stringify(params)
  })
}

export function getPaperAndVenue (params) {
  return request({
    url: 'getPaperAndVenue',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: JSON.stringify(params)
  })
}

export function getPaperAuthor (params) {
  return request({
    url: 'getPaperAuthor',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: JSON.stringify(params)
  })
}
