import{request} from "../common/request";

export  function login(username,password) {
return request({
  method:'post',
  url:'/login',
  params:{
    username,
    password
  }
})
}
