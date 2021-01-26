import Vue from 'vue'
import Router from 'vue-router'
import Dic from '../views/sys/Dic'
import Database from '../views/sys/Database'
import Table from '../views/sys/Table'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/sys/dic',
      component: Dic
    },
    {
      path: '/sys/database',
      component: Database
    },
    {
      path: '/sys/table',
      component: Table
    }
  ]
})
