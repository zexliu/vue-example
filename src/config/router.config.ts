import {
  UserLayout,
  BasicLayout,
  RouteView,
  BlankLayout,
  PageView
} from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workspace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workspace',
        component: RouteView,
        meta: {
          title: '仪表盘',
          keepAlive: true,
          icon: bxAnaalyse
        },
        children: [
          {
            path: '/dashboard/workspace',
            name: 'WorkSpace',
            component: () => import('@/views/dashboard/WorkSpace.vue'),
            meta: {
              title: '工作台',
              keepAlive: true
            }
          }
        ]
      },
      {
        path: '/system',
        name: 'System',
        component: PageView,
        redirect: '/system/user',
        meta: { title: '权限系统', icon: 'system' },
        children: [
          {
            path: '/system/user',
            name: 'UserManage',
            component: () =>
              import(
                /* webpackChunkName: "list" */ '@/views/system/user/Table.vue'
              ),
            meta: {
              title: '用户管理',
              keepAlive: true,
              roles: ['ADMIN']
            }
          }
        ]
      },
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: '异常页', icon: 'warning' },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () =>
              import(
                /* webpackChunkName: "fail" */ '@/views/exception/403.vue'
              ),
            meta: { title: '403' }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () =>
              import(
                /* webpackChunkName: "fail" */ '@/views/exception/404.vue'
              ),
            meta: { title: '404' }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () =>
              import(
                /* webpackChunkName: "fail" */ '@/views/exception/500.vue'
              ),
            meta: { title: '500' }
          }
        ]
      }
    ]
  },
  // Exception
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/auth',
    component: UserLayout,
    redirect: '/auth/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () =>
          import(/* webpackChunkName: "user" */ '@/views/auth/Login.vue')
      }
      // {
      //   path: 'register',
      //   name: 'register',
      //   component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      // },
      // {
      //   path: 'register-result',
      //   name: 'registerResult',
      //   component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      // },
      // {
      //   path: 'recover',
      //   name: 'recover',
      //   component: undefined
      // }
    ]
  },

  // {
  //   path: '/test',
  //   component: BlankLayout,
  //   redirect: '/test/home',
  //   children: [
  //     {
  //       path: 'home',
  //       name: 'TestHome',
  //       component: () => import('@/views/Home')
  //     }
  //   ]
  // },

  {
    path: '/404',
    component: () =>
      import(/* webpackChunkName: "fail" */ '@/views/exception/404.vue')
  }
]
