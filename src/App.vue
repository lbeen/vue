<template>
  <div id="app">
    <el-container>
      <el-aside style="width: 200px;">
        <el-menu :default-active="activeIndex" class="el-menu-demo" router>
          <template v-for="item in navMenuData">
            <el-menu-item :index="item.index" :key="item.name" v-if="!item.child">{{item.name}}</el-menu-item>
            <el-submenu :index="item.index" :key="item.name" v-if="item.child">
              <template slot="title">{{item.name}}</template>
              <template v-for="item2 in item.child">
                <el-menu-item :index="item2.index" :key="item2.name">{{item2.name}}</el-menu-item>
              </template>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      activeIndex: '',
      navMenuData: [
        {
          index: '1',
          name: '系统配置',
          child: [{
            index: '/sys/dic',
            name: '字典管理'
          }, {
            index: '/sys/database',
            name: '数据库管理'
          }, {
            index: '/sys/table',
            name: '数据表管理'
          }]
        },
        {
          index: '2',
          name: '数据',
          child: [{
            index: '/data/import',
            name: '数据导入'
          }, {
            index: '/data/show',
            name: '数据查询'
          }]
        }
      ]
    }
  },
  created() {
    const href = window.location.href
    let path = href.substring(href.indexOf('#') + 1)
    if (path === '/') {
      path = this.navMenuData[0].child[0].index
      window.location.href = href.substring(0, href.indexOf('#') + 1) + path
    }
    this.activeIndex = path
  }
}
</script>

<style scoped>
#app, .el-container, .el-aside, .el-menu {
  height: 100%;
  margin: 0;
}

.el-container div {
  padding: 10px;
  width: 100%;
}
</style>
