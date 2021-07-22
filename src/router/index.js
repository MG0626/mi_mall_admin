import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home/Home')
  },
  {
    path: '/users',
    component: () => import('../views/users/Users'),
    redirect: '/login',
    children: [
      {
        path: '/login',
        component: () => import('../views/users/childrens/Login')
      },
      {
        path: '/register',
        component: () => import('../views/users/childrens/Register')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // 获取用户信息
  const info = JSON.parse(window.localStorage.getItem('info') || '{"token": null}');
  
  // // 判断去向
  // // 如果去login，则需要判断是否存在token，存在就不给去，不存在就放行
  // if (to.path === '/login') {
  //   // 有token，现在路由去的就是login，则跳转到首页
  //   if(info.token) return next('/');
  //   // 否则，放行
  //   return next();
  // } else{
  //   // 没有token，跳转到login
  //   if(!info.token) return next('/login');
  //   // 有token,判断其有效性, 默认为一天
  //   // 获取现在时间
  //   const currentTime = Date.now();
  //   // 判断是否超过时效
  //   if(currentTime - info.time > (60 * 60  * 24 * 1000)){
  //     // 删除缓存
  //     window.localStorage.removeItem('info');
  //     // 跳转到login
  //     return next('/login');
  //   }
  // }
  // next()

  // 判断是否有token，没有就跳转到login, 如果现在访问的就是login或register则放行
  if (!info.token) {
    if (to.path === '/login' || to.path === '/register') {
      return next();
    }
    next('/login');
  }
  // 有token，不再允许访问login和register
  if(to.path === '/login' || to.path === '/register') return next('/');
  // 判断其有效性, 默认为一天
  // 获取现在时间
  const currentTime = Date.now();
  // 判断是否超过时效
  if(currentTime - info.time > (60 * 60  * 24 * 1000)){
    // 删除缓存
    window.localStorage.removeItem('info');
    // 跳转到login
    return next('/login');
  }
  // 没问题就放行
  next();
})

export default router
