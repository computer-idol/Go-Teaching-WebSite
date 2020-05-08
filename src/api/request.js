import axios from "axios"

let request = function (url,params) {
  return axios.post(url, params).then(res=>res).catch(e => e)
}


export default request

