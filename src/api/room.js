import request from "./request"
import base from "./api"

const getRoomDetail= function(params) {
  return request(base.baseUrl + base.api.Play.PlayRoomDetail,params)
}

const getPlayRoomList = function(params) {
  return request(base.baseUrl + base.api.Play.PlayRoomList,params)
}

const GetAIMove = function (params) {
  return request(base.AIUrl+base.api.Play.GetAIMove,params)
}

const Compute = function (params) {
  return request(base.compute,params)
}

export default{
  getRoomDetail,getPlayRoomList,GetAIMove,Compute
}

