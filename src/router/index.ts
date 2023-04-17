import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'


 const routes=[

  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },{
    path: '/dictType',
    name: 'dictType',
    component: () => import('../views/data/DictType.vue')
  },{
    path: '/dictData',
    name: 'dictData',
    component: () => import('../views/data/DictData.vue')
  },{
    path: '/checkFaceInfo',
    name: 'checkFaceInfo',
    component: () => import('../views/face/CheckFaceInfo.vue')
  },{
    path: '/addFaceInfo',
    name: 'addFaceInfo',
    component: () => import('../views/face/AddFaceInfo.vue')
  }
]

// 路由 => 路径和组件之间的对应关系
const router = createRouter({
  history: createWebHistory(), // 路径格式
  routes: routes // 路由数组
});
export default router
