import request from "./request"
import base from "./api"

const getDifficultyList= function(params) {
  return request(base.baseUrl + base.api.Study.DifficultyList,params)
}

const getChapterList = function(params) {
  return request(base.baseUrl + base.api.Study.ChapterList,params)
}

const  getClassList = function(params){
  return request(base.baseUrl + base.api.Study.ClassList,params)
}

const  getTeachStepList = function(params){
  return request(base.baseUrl + base.api.Study.TeachStepList,params)
}


export default{
  getChapterList,getClassList,getDifficultyList,getTeachStepList
}

