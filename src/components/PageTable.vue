<template>
  <div>
    <el-row>
      <slot name="search" :loadData="loadData"></slot>
    </el-row>
    <el-row>
      <el-table :data="tableData" border :max-height="tableMaxHeight" v-loading="tableLoading" stripe>
        <slot name="table"></slot>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
          style="text-align: right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="myPageSize"
          layout="total, sizes, prev, pager, next"
          :total="total">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import NetWork from '../api/network'

export default {
  name: 'PageTable',
  props: {
    url: {
      type: String,
      default: ''
    },
    param: {
      type: Object,
      default: null
    },
    paramFun: {
      type: Function,
      default() {
        return {}
      }
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 50, 100]
      }
    },
    pageSize: {
      type: Number,
      default: 10
    },
    tableMaxHeight: {
      type: String,
      default: ' '
    }
  },
  data() {
    return {
      myPageSize: 10,
      currentPage: 1,
      total: 0,
      tableData: [],
      tableLoading: false
    }
  },
  created() {
    this.myPageSize = this.pageSize
    this.loadData()
  },
  methods: {
    loadData(currentPage) {
      if (currentPage) {
        this.currentPage = currentPage
      }

      let param = this.param
      if (!param) {
        param = this.paramFun()
      }
      param.skip = this.myPageSize * (this.currentPage - 1)
      param.limit = this.myPageSize

      this.tableLoading = true
      this.total = 0
      this.tableData = []
      NetWork.get(this.url, param, (data) => {
        if (data) {
          this.total = data.total
          this.tableData = data.list
        }
        this.tableLoading = false
      }, () => {
        this.tableLoading = false
      })
    },
    handleSizeChange(pageSize) {
      this.myPageSize = pageSize
      this.loadData()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.loadData()
    }
  }
}
</script>

<style scoped>
</style>
