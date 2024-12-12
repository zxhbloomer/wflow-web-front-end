import request from '@/api/request.js'


// 查询表单及分组
export function getGroupModels(param) {
  return request({
    url: 'wflow/model/group/list',
    method: 'get',
    params: param
  })
}

// 查询表单及分组
export function getGroupModelsByUser(param) {
  return request({
    url: 'wflow/model/list/byUser',
    method: 'get',
    params: param
  })
}

// 查询所有模型分组
export function getModelGroups(param) {
  return request({
    url: 'wflow/model/group',
    method: 'get',
    params: param
  })
}

// 表单分组排序
export function modelGroupsSort(param) {
  return request({
    url: 'wflow/model/group/sort',
    method: 'put',
    data: param
  })
}

// 表单排序
export function modelsSort(groupId, param) {
  return request({
    url: `wflow/model/sort/${groupId}`,
    method: 'put',
    data: param
  })
}

// 修改分组
export function updateModelGroupName(groupId, param) {
  return request({
    url: `wflow/model/group/${groupId}`,
    method: 'put',
    params: param
  })
}

// 新增模型分组
export function createModelGroup(param) {
  return request({
    url: `wflow/model/group`,
    method: 'post',
    params: param
  })
}

// 删除分组
export function deleteModelGroup(groupId) {
  return request({
    url: `wflow/model/group/${groupId}`,
    method: 'delete'
  })
}

// 删除模型
export function deleteModel(modelId) {
  return request({
    url: `wflow/model/${modelId}`,
    method: 'delete'
  })
}

// 获取模型
export function getModelById(modelId) {
  return request({
    url: `wflow/model/detail/${modelId}`,
    method: 'get'
  })
}

// 获取模型
export function getModelByDefId(defId) {
  return request({
    url: `wflow/model/detail/def/${defId}`,
    method: 'get'
  })
}

// 修改分组
export function modelMoveToGroup(modelId, groupId) {
  return request({
    url: `wflow/model/${modelId}/move/${groupId}`,
    method: 'put'
  })
}

// 启用或停用流程
export function enOrDisModel(modelId, type) {
  return request({
    url: `wflow/model/${modelId}/active/${type}`,
    method: 'put'
  })
}

// 获取抄送我的流程
export function getCcMeList(params) {
  return request({
    url: `wflow/process/ccMe`,
    method: 'get',
    params: params
  })
}

// 获取控制台统计数据
export function getProcessCountData() {
  return request({
    url: `wflow/process/instance/count`,
    method: 'get'
  })
}


export default {
  createModelGroup, updateModelGroupName, modelGroupsSort,
  modelsSort, getGroupModels, getModelGroups, modelMoveToGroup,
  deleteModelGroup, deleteModel, getModelById, getModelByDefId,
  enOrDisModel, getCcMeList, getProcessCountData, getGroupModelsByUser
}
