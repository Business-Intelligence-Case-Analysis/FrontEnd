import request from '@/utils/request'

export function getAuthorsByName (params) {
  return request({
    url: 'getAuthorsByName',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: JSON.stringify(params)
  })
}

export function getCollaborateAuthor (params) {
  return request({
    url: 'getCollaborateAuthors',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: JSON.stringify(params)
  })
}

export function getPapersAndVenues (params) {
  return request({
    url: 'getPapersAndVenues',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: JSON.stringify(params)
  })
}

export function getPapersAndAuthorsCitedByAuthor (params) {
  return request({
    url: 'getPapersAndAuthorsCitedByAuthor',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: JSON.stringify(params)
  })
}

export function getAuthorsInSameAffiliation (params) {
  return request({
    url: 'getAuthorsInSameAffiliation',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: JSON.stringify(params)
  })
}
