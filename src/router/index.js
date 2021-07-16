import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const Login = () => import('../components/Login')
const Welcome = () => import('../components/Welcome')
const Home = () => import('../views/home/Home')
const User = () => import('../views/user/User')
const Rights = () => import('../views/power/Rights')
const Roles = () => import('../views/power/Roles')
const Cate = () => import('../views/goods/Cate')
const Params = () => import('../views/goods/Params')
const List=()=>import('../views/goods/List')
const Add=()=>import('../views/goods/Add')
const Order=()=>import('../views/order/Order')
const Report=()=>import('../views/report/Report')

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: User
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: List
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      },
    ]
  }
]

const router = new VueRouter({
  routes,
  // mode: 'history'
})
router.beforeEach((to, from, next) => {
//从from跳转到to
  if (to.path === '/login') return  next()
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})
export default router
