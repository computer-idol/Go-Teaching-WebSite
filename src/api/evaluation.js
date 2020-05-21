import request from "./request"
import base from "./api"

const getEvaluationList= function(params) {
  return request(base.baseUrl + base.api.Evaluation.EvaluationList,params)
}

const createEvaluation = function(params) {
  return request(base.baseUrl + base.api.Evaluation.EvaluationCreate,params)
}

const  endEvaluation = function(params){
  return request(base.baseUrl + base.api.Evaluation.EvaluationEnd,params)
}

const  getEvaluationRecordDetail= function(params){
  return request(base.baseUrl + base.api.Evaluation.WatchEvaluation,params)
}


export default{
  getEvaluationList,createEvaluation,endEvaluation,getEvaluationRecordDetail
}
