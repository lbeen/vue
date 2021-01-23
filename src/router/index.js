import Vue from 'vue'
import Router from 'vue-router'
import dic from '@/views/sys/dic'
import Database from '@/views/sys/Database'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/sys/dic',
      component: dic
    },
    {
      path: '/sys/database',
      component: Database
    }
  ]
})
