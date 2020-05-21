import request from "./request"
import base from "./api"

const login = function(params) {
  return request(base.baseUrl + base.api.User.Login,params)
}

const register = function(params) {
  return request(base.baseUrl + base.api.User.Register,params)
}

const getUserList = function(params){
  return request(base.baseUrl + base.api.User.UserList,params)
}

const  getUserRoomList = function(params){
  return request(base.baseUrl + base.api.User.UserRoomList,params)
}

const  getUserEvaluationList= function(params){
  return request(base.baseUrl + base.api.User.UserEvaluationList,params)
}

const UserWrongList = function (params) {
  return request(base.baseUrl + base.api.User.UserWrongList,params);
}

export default{
  login,register,getUserList,UserWrongList,getUserRoomList,getUserEvaluationList
}
