import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

const Login = () => import('../components/Login.vue')
const Home = () => import('../components/Home.vue')
const User = () => import('../components/user/User.vue')
const Rights = () => import('../components/Rights.vue')
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    children: [
      /* 子组件 */
      { path: '', component: User } /* 默认子路由 */,
      { path: '/rights', component: Rights },
    ],
  },
]

const router = new VueRouter({
  routes,
})

//挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  // 获取token
  const tokenStr = window.sessionStorage.getItem(
    'token'
  ) /* 拿到浏览器中的token信息 */
  if (!tokenStr) {
    /* token信息不存在 */
    return next('/login')
  }
  // token信息存在
  next()
})

export default router
