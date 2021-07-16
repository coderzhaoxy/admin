import {request} from "../common/request";

export function getOrderList(queryInfo) {
return request({
  url:'orders',
  params:{
    query:queryInfo.query,
    pagenum:queryInfo.pagenum,
    pagesize:queryInfo.pagesize
  }
})
}
