import request from "./request"
import base from "./api"

const getExerciseTypeList = function(params) {
  return request(base.baseUrl + base.api.Exercise.ExerciseTypeList,params)
}

const getExerciseSubTypeList = function(params) {
  return request(base.baseUrl + base.api.Exercise.ExerciseSubTypeLevelList,params)
}

export default{
  getExerciseTypeList,getExerciseSubTypeList
}
