import {request} from "../common/request";

export function getRightsList(type) {
  return request({
    url: `rights/${type}`
  })
}

export function getRolesList() {
  return request({
    url: 'roles'
  })
}

export function addRolesInfo(roleName, roleDesc) {
  return request({
    url: 'roles',
    method: 'post',
    data: {
      roleName,
      roleDesc
    }
  })
}

export function editRolesClick(id) {
  return request({
    url: `roles/${id}`,
  })
}

export function editRolesInfo(id, roleName, roleDesc) {
  return request({
    url: `roles/${id}`,
    method: 'put',
    data: {
      roleName,
      roleDesc
    }
  })
}

export function removeRolesClick(id) {
  return request({
    url: `roles/${id}`,
    method: 'delete'
  })
}

export function removeRightById(roleId, rightId) {
  return request({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

export function allotRights(roleId, rids) {
  return request({
    url:`roles/${roleId}/rights`,
    method:'post',
    data:{
      rids
    }
  })
}
