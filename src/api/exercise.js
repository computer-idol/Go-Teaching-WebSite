import request from "./request"
import base from "./api"

const getExerciseTypeList = function(params) {
  return request(base.baseUrl + base.api.Exercise.ExerciseTypeList,params)
}

const getExerciseSubTypeList = function(params) {
  return request(base.baseUrl + base.api.Exercise.ExerciseSubTypeLevelList,params)
}

const AddWrong = function (params) {
  return request(base.baseUrl + base.api.Exercise.AddWrong,params);
}

const RemoveWrong = function (params) {
  return request(base.baseUrl + base.api.Exercise.RemoveWrong,params);
}

export default{
  getExerciseTypeList,getExerciseSubTypeList,AddWrong,RemoveWrong
}
