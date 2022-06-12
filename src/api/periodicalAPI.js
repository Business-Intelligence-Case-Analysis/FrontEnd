import request from '@/utils/request'

export function getPapersPublishedByVenueInYear (params) {
  return request({
    url: 'getPapersPublishedByVenueInYear',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: JSON.stringify(params)
  })
}

export function getAuthorsByVenue (params) {
  return request({
    url: 'getAuthorsByVenue',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: JSON.stringify(params)
  })
}

export function getPaperInVenueIsCitedTimes (params) {
  return request({
    url: 'getPaperInVenueIsCitedTimes',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: JSON.stringify(params)
  })
}
