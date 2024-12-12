//获取流程结果标签样式
export function getProcTag(result){
  switch (result){
    case 'RUNNING':
      return ''
    case 'COMPLETE':
    case 'PASS':
      return 'success'
    case 'CANCEL':
      return 'info'
    case 'REFUSE':
      return 'danger'
  }
}

export function getTaskResult(task){
  if (task.result === 'agree') {
    return {text: '已同意', type: 'success'}
  } else if (task.result === 'refuse') {
    return {text: '已拒绝', type: 'danger'}
  } else if (task.result === 'transfer') {
    return {text: '已转交', type: 'primary'}
  }else if (task.result === 'recall') {
    return {text: '已退回', type: 'warning'}
  } else if (!task.result && task.finishTime) {
    return {text: '已取消', type: 'info'}
  } else {
    return {text: '处理中', type: 'primary'}
  }
}
//判断是否为主要业务节点
export function isPrimaryNode(node){
  return node &&
    (node.type === 'ROOT' || node.type === 'APPROVAL'
      || node.type === 'CC' || node.type === 'DELAY'
      || node.type === 'TRIGGER');
}
export function isBranchNode(node){
  return node && (node.type === 'CONDITIONS' || node.type === 'CONCURRENTS');
}
export function isEmptyNode(node){
  return node && (node.type === 'EMPTY')
}
//是分支节点
export function isConditionNode(node){
  return node.type === 'CONDITIONS';
}
//是分支节点
export function isBranchSubNode(node){
  return node && (node.type === 'CONDITION' || node.type === 'CONCURRENT');
}
export function isConcurrentNode(node){
  return node.type === 'CONCURRENTS'
}

export function forEachNode(node, callback){
  if (isBranchNode(node)){
    if (callback(node)){return}
    node.branchs.map(branchNode => {
      if (callback(branchNode)){return}
      forEachNode(branchNode.children, callback)
    })
    forEachNode(node.children, callback)
  }else if (isPrimaryNode(node) || isEmptyNode(node) || isBranchSubNode(node)){
    if (callback(node)){return}
    forEachNode(node.children, callback)
  }
}

export default {
  forEachNode, isPrimaryNode, isBranchNode, isEmptyNode,
  isConditionNode, isBranchSubNode, isConcurrentNode
}
