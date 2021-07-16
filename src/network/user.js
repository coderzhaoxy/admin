import{request} from "../common/request";

export function getUserList(query, pagenum, pagesize) {
  return request({
    url: '/users',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}

export function editState(uId, type) {
  return request({
    url: `users/${uId}/state/${type}`,
    method: 'put',
  })
}

export function addUserInfo(username, password, email, mobile) {
  return request({
    url: 'users',
    method: 'post',
    data: {
      username: username + '',
      password: password + '',
      email: email + '',
      mobile: mobile + ''
    }
  })
}

export function editUserInfo(id) {
  return request({
    url: `users/${id}`,
    params: {
      id
    }
  })
}

export function putUserInfo(id, email, mobile) {
  return request({
    url: `users/${id}`,
    method: 'put',
    data: {
      email,
      mobile
    }
  })
}

export function removeUser(id) {
  return request({
    url: `users/${id}`,
    method: 'delete'
  })
}


export function setRolesClick(id,rids) {
return request({
  url:`roles/${id}/rights`,
  method:'post',
  data:{
    rids
  }
})
}
