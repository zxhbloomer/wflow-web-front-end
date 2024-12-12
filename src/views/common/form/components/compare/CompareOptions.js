//字符串比较选项
import moment from "moment";

const strCompareOptions = [
  {name: '等于', symbol: 'EQ', compare: (a, b) => a == b[0]},
  {name: '不等于', symbol: 'NEQ', compare: (a, b) => a != b[0]},
  {name: '为其之一', symbol: 'IN', compare: (a, b) => (b || []).includes(a)},
  {name: '不为其之一', symbol: 'NIN', compare: (a, b) => !(b || []).includes(a)},
  {name: '含有', symbol: 'LIKE', compare: (a, b) => (b || '').includes(a)},
]

const strArrCompareOptions = [
  {name: '包含', symbol: 'HS', compare: (a, b) => checkElementsExistInArray(b, a)},
  {name: '不包含', symbol: 'NHS', compare: (a, b) => !checkElementsExistInArray(b, a)},
]

const numCompareOptions = [
  {name: '大于', symbol: 'GT', compare: (a, b) =>  a > b},
  {name: '小于', symbol: 'LT', compare: (a, b) =>  a < b},
  {name: '等于', symbol: 'EQ', compare: (a, b) =>  a == b},
  {name: '不等于', symbol: 'NEQ', compare: (a, b) => a != b},
  {name: '大于等于', symbol: 'GT_EQ', compare: (a, b) =>  a >= b},
  {name: '小于等于', symbol: 'LT_EQ', compare: (a, b) =>  a <= b},
  {name: '在内或相等', symbol: 'IN_EQ', compare: (a, b) =>  a >= b[0] && a <= b[1]},
  {name: '在内或不等', symbol: 'IN_NEQ', compare: (a, b) =>  a == b},
  {name: '为其之一', symbol: 'IN', compare: (a, b) => (b || []).includes(a)},
  {name: '不为其之一', symbol: 'NIN', compare: (a, b) => !(b || []).includes(a)},
]

const orgCompareOptions = [
  {name: '是', symbol: 'EQ', compare: (a, b) => a[0].id == b[0].id},
  {name: '不是', symbol: 'NEQ', compare: (a, b) => a[0].id != b[0].id},
  {name: '为其之一', symbol: 'IN', compare: (a, b) => checkElementsExistInArray(a, b, 'id')},
  {name: '含有', symbol: 'HS', compare: (a, b) => checkElementsExistInArray(b, a, 'id')},
  {name: '不含有', symbol: 'NHS', compare: (a, b) => !checkElementsExistInArray(b, a, 'id')},
]

const timeCompareOptions = [
  {name: '在之前', symbol: 'LT', compare: (a, b) => moment(a).isBefore(moment(b[0]))},
  {name: '在之后', symbol: 'GT', compare: (a, b)  => moment(a).isAfter(moment(b[0]))},
  {name: '在其中', symbol: 'IN', compare: (a, b) => moment(b[0]).isBefore(moment(a)) && moment(b[1]).isAfter(moment(a))},
]

const timeArrCompareOptions = [
  {name: '包含', symbol: 'HS', compare: (a, b) => moment(a[0]).isBefore(moment(b[0])) && moment(a[1]).isAfter(moment(b[0]))},
  {name: '不包含', symbol: 'NHS', compare: (a, b)  => moment(b[0]).isBefore(moment(a[0])) || moment(b[0]).isAfter(moment(a[1]))},
]

//加载比较函数对象
function getCompareFucs(){
  let cpFuncs = {
    strCompare:{},
    strArrCompare:{},
    numCompare:{},
    orgCompare:{},
    timeCompare:{},
    timeArrCompare:{}
  }
  strCompareOptions.forEach(v => cpFuncs.strCompare[v.symbol] = v.compare)
  strArrCompareOptions.forEach(v => cpFuncs.strArrCompare[v.symbol] = v.compare)
  numCompareOptions.forEach(v => cpFuncs.numCompare[v.symbol] = v.compare)
  orgCompareOptions.forEach(v => cpFuncs.orgCompare[v.symbol] = v.compare)
  timeCompareOptions.forEach(v => cpFuncs.timeCompare[v.symbol] = v.compare)
  timeArrCompareOptions.forEach(v => cpFuncs.timeArrCompare[v.symbol] = v.compare)
  return cpFuncs
}

//校验数组A是否包含在B内
export function checkElementsExistInArray(A, B, key) {
  if (A.length === 0 || B.length === 0){
    return false
  }
  for (let i = 0; i < A.length; i++) {
    let found = false;
    for (let j = 0; j < B.length; j++) {
      if (key){
        if (A[i][key] == B[j][key]) {
          found = true;
          break;
        }
      }else {
        if (A[i] == B[j]) {
          found = true;
          break;
        }
      }
    }
    if (!found) {
      return false;
    }
  }
  return true;
}

export const CompareFuncs = getCompareFucs()

export default {
  strCompareOptions, strArrCompareOptions,
  numCompareOptions, orgCompareOptions,
  timeCompareOptions, timeArrCompareOptions
}
