import Vue from 'vue'
import VueRouter from 'vue-router'
// vuex
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home/Home'),
    children: [
      {
        path: '/users',
        component: () => import('../views/users/Users')
      },
      {
        path: '/permission',
        component: () => import('../views/permission/Permission')
      },
      {
        path: '/role',
        component: () => import('../views/role/Role')
      },
      {
        path: '/goods',
        component: () => import('../views/goods/Goods')
      },
      {
        path: '/category',
        component: () => import('../views/category/Category')
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('../views/auth/Auth'),
    redirect: '/login',
    children: [
      {
        path: '/login',
        component: () => import('../views/auth/children/Login')
      },
      {
        path: '/register',
        component: () => import('../views/auth/children/Register')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('../views/notFound/NotFound')
  },
  {
    path: '*',
    redirect: '/404',
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // 获取用户信息
  const info = JSON.parse(window.localStorage.getItem('info') || '{"token": null}');

  // 判断是否有token 
  if (!info.token) {
    // 如果现在访问的就是login或register则放行
    if (to.path === '/login' || to.path === '/register') {
      return next();
    }
    // 其他路径，跳转到login
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
    // 弹出提示
    router.app.$message.error('身份信息已过期，请重新登录');
    // 跳转到login
    return next('/login');
  }
  // 访问404页面， 放行
  if(to.path === '/404') return next();
  // 从vuex中获取该用户所能访问的路由地址
  const pathArr = store.state.pathArr;
  // 判断是否有权限访问该地址
  if (pathArr.indexOf(to.path) === -1) {
    // 进入判断说明没有权限访问，这个时候不放行，访问404页面
    return next('/404');
  }
  
  // 没问题就放行
  next();
})

export default router
