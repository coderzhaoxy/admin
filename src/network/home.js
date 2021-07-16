import{request} from "../common/request";

export function getMenuList() {
  return request({
    url:'/menus'
  })
}
