import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/home/home')
    },
    {
      path: '/test1',
      name: 'Test',
      component: () => import('@/views/test/test')
    },
    {
      path: '/test2',
      name: 'Test2',
      component: () => import('@/views/test/test2')
    },
    {
      path: '/test3',
      name: 'Test3',
      component: () => import('@/views/test/test3')
    },
    {
      path: '/test4',
      name: 'Test4',
      component: () => import('@/views/test/test4')
    },
    {
      path: '/affiliation',
      name: 'Affiliation',
      component: () => import('@/views/searchPage/affiliation')
    },
    {
      path: '/author',
      name: 'Author',
      component: () => import('@/views/searchPage/author')
    },
    {
      path: '/interest',
      name: 'Interest',
      component: () => import('@/views/searchPage/interest')
    },
    {
      path: '/keyAuthor',
      name: 'KeyAuthor',
      component: () => import('@/views/searchPage/keyAuthor')
    },
    {
      path: '/keyPeriodical',
      name: 'KeyPeriodical',
      component: () => import('@/views/searchPage/keyPeriodical')
    },
    {
      path: '/multi',
      name: 'Multi',
      component: () => import('@/views/searchPage/multi')
    },
    {
      path: '/paper',
      name: 'Paper',
      component: () => import('@/views/searchPage/paper')
    },
    {
      path: '/periodical',
      name: 'Periodical',
      component: () => import('@/views/searchPage/periodical')
    }
  ]
})
