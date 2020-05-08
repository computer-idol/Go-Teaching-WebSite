import request from "./request"
import base from "./api"

const  AddPlayer= function(params) {
  return request(base.baseUrl + base.api.Manual.AddPlayer,params)
}

const getPlayCountryList = function(params) {
  return request(base.baseUrl + base.api.Manual.PlayerCountryList,params)
}

const getManualDetail = function(params){
  return request(base.baseUrl + base.api.Manual.ManualDetail,params)
}

const getManualList = function(params){
  return request(base.baseUrl + base.api.Manual.ManualList,params)
}

export default{
  AddPlayer,getPlayCountryList,getManualDetail,getManualList
}
