import request from './request.js'

//获取用户通知
export function getUserNotify(params){
  return request({
    url: `wflow/notify`,
    method: 'get',
    params: params
  })
}

//已读通知
export function readNotify(params){
  return request({
    url: `wflow/notify`,
    method: 'put',
    data: params
  })
}

export default {
  getUserNotify, readNotify
}
