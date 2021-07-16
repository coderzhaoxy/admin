/*
 * @Author: your name
 * @Date: 2021-07-02 15:36:24
 * @LastEditTime: 2021-07-10 22:23:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \shoppra\src\common\request.js
 */
import axios from 'axios'

export function request(config) {
   const instance = axios.create({
    baseURL:'http://47.100.40.142:8889/api/private/v1/',
    timeout:5000
})

  instance.interceptors.request.use(config=>{
    //为每一次网络请求携带token令牌
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  },err=>{

  })

  instance.interceptors.response.use(res=>{
    return res.data
  },err=>{

  })
  return instance(config)
}
