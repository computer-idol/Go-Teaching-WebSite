import request from "./request"
import base from "./api"

const login = function(params) {
  return request(base.baseUrl + base.api.User.Login,params)
}

const register = function(params) {
  return request(base.baseUrl + base.api.User.Register,params)
}

const getUserList = function(){
  return request(base.baseUrl + base.api.User.UserList,"user")
}

const getAIList = function(){
  return request(base.baseUrl + base.api.User.UserList,"AI")
}

export default{
  login,register,getUserList,getAIList
}
