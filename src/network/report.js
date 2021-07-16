import {request} from "../common/request";
export function getReport() {
return request({
  url:'reports/type/1'
})
}
