import axios from "axios"

let request = function (url,params) {
  axios.interceptors.request.use(config => {
    config.headers.Authorization = "Bearer -1";
    return config
  })
  return axios.post(url, params).then(res=>res).catch(e => e)
}


export default request

