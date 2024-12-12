import request from './request.js'

//获取用户待办
export function getUserTodoList(params){
  return request({
    url: `wflow/process/task/todoList`,
    method: 'get',
    params: params
  })
}

//获取用户发起的实例
export function getUserSubmittedList(params){
  return request({
    url: `wflow/process/mySubmitted`,
    method: 'get',
    params: params
  })
}

//获取所有发起的实例
export function getSubmittedList(params){
  return request({
    url: `wflow/process/submittedList`,
    method: 'get',
    params: params
  })
}

//获取我已处理的所有审批实例
export function getIdoList(params){
  return request({
    url: `wflow/process/task/idoList`,
    method: 'get',
    params: params
  })
}

//查询流程进度及表单
export function getFormAndProcessProgress(instanceId, nodeId){
  return request({
    url: `wflow/process/progress/${instanceId}/${nodeId}`,
    method: 'get'
  })
}

//处理任务
export function approvalTask(params){
  return request({
    url: `wflow/process/task/handler`,
    method: 'post',
    data: params
  })
}

//获取流程实例表单数据
export function getInstanceFormData(instanceId){
  return request({
    url: `wflow/process/form/data/by/${instanceId}`,
    method: 'get'
  })
}

//获取可回退的节点
export function getEnableRecallNodes(instanceId, taskId){
  return request({
    url: `wflow/process/task/recall/nodes`,
    method: 'get',
    params:{instanceId: instanceId, taskId: taskId}
  })
}

export default {
  getUserTodoList, getUserSubmittedList, getSubmittedList,
  getFormAndProcessProgress, approvalTask, getInstanceFormData,
  getEnableRecallNodes, getIdoList
}
