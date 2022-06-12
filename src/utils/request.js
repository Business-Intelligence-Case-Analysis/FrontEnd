import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.withCredentials = true

// manageClass an axios instance
const service = axios.create({
  baseURL: 'http://124.221.246.162:8081/', // url = base url + request url
  // baeURL: 'http://localhost:8081/', // url = base url + request url

  // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 500000, // request timeout
  crossDomain: true
})

export default service

// get参数编码
function encodeURIParams (config) {
  let url = config.url
  url += '?'
  const keys = Object.keys(config.params)
  for (const key of keys) {
    url += `${key}=${encodeURIComponent(config.params[key])}&`
  }
  url = url.substring(0, url.length - 1)
  config.params = {}
  return url
}

// request拦截器
service.interceptors.request.use(
  config => {
    // ...略略略
    if (config.method === 'get' && config.params) {
      config.url = encodeURIParams(config)
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
