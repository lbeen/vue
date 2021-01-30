<template>
  <div>
    <page-table url="data/getData" :param-fun="paramFun" ref="pageTable">
      <slot slot="search" slot-scope="scope">
        <el-form :inline="true">
          <el-form-item label="数据表">
            <el-select v-model="table" placeholder="请选择数据表" style="width: 100%" size="small" clearable
                       filterable @change="tableChange">
              <el-option v-for="item in tableOptions" :label="item.label" :value="item.value" :key="item.value"
                         size="small"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showConditions = true" size="small">查询条件</el-button>
            <el-button id="search" type="primary" @click="search(scope)" size="small">查询</el-button>
          </el-form-item>
        </el-form>
      </slot>
      <slot slot="table">
        <el-table-column v-for="item in heads" :label="item.columnDesc" :prop="item.columnName" min-width="150"
                         :key="item.columnName">
        </el-table-column>
      </slot>
    </page-table>
    <el-dialog title="查询条件" :visible.sync="showConditions">
      <el-table :data="conditions" border max-height="500">
        <el-table-column label="序号" width="50" type="index"></el-table-column>
        <el-table-column label="字段" width="150">
          <template slot-scope="scope">
            <el-select v-model="scope.row.id" placeholder="请选择字段" style="width: 100%" size="small"
                       clearable @change="selectColumn">
              <el-option v-for="item in selectHeads" :label="item.columnDesc" :value="item.id" :key="item.id"
                         size="small">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="值">
          <template slot-scope="scope">
            <el-input v-model="scope.row.columnValue" size="small" placeholder="请输入字段值" style="width: 100%"
                      v-if="scope.row.columnType === 'string'">
            </el-input>
            <el-input-number v-model="scope.row.columnValue" size="small" :step="1" placeholder="请输入字段值"
                             style="width: 100%"
                             v-if="scope.row.columnType === 'int' || scope.row.columnType === 'long' || scope.row.columnType === 'double'">
            </el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="删除" width="50">
          <template slot-scope="scope">
            <i class="el-icon-delete" style="color: red;cursor: pointer;"
               @click="deleteCondition(scope.$index)"></i>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="addCondition" size="small">新 增</el-button>
        <el-button type="primary" @click="conditionSearch" size="small">查询</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Network from '../../api/network'
import {getColumnsByTableId} from '../../api/sys'
import PageTable from '../../components/PageTable'

export default {
  name: 'DataShow',
  components: {
    PageTable
  },
  data() {
    return {
      tableOptions: [],

      table: '',
      selectHeads: [],

      showConditions: false,
      conditions: [],

      heads: []
    }
  },
  created() {
    this.getTables()
  },
  methods: {
    getTables() {
      Network.get('table/getPage', {
        pageSize: 100,
        currentPage: 1
      }, data => {
        if (data) {
          for (let i = 0; i < data.list.length; i++) {
            const table = data.list[i]
            this.tableOptions.push({
              label: table.tableName,
              value: table.id
            })
          }
        }
      })
    },
    tableChange(value) {
      this.conditions = []
      this.selectHeads = []
      getColumnsByTableId(value, data => {
        if (data) {
          this.selectHeads = data
        }
      })
    },
    addCondition() {
      this.conditions.push({})
    },
    deleteCondition(index) {
      let conditions = []
      for (let i = 0; i < this.conditions.length; i++) {
        if (i !== index) {
          conditions.push(this.conditions[i])
        }
      }
      this.conditions = conditions
    },
    selectColumn: function (id) {
      for (let i = 0; i < this.selectHeads.length; i++) {
        let head = this.selectHeads[i]
        if (head.id === id) {
          for (let j = 0; j < this.conditions.length; j++) {
            let condition = this.conditions[j]
            if (condition.id === id) {
              condition.columnType = head.columnType
              condition.columnName = head.columnName
            }
          }
          break
        }
      }
    },
    conditionSearch() {
      this.showConditions = false
      this.$refs.pageTable.loadData(1)
    },
    paramFun() {
      let table
      for (let i = 0; i < this.tableOptions.length; i++) {
        if (this.tableOptions[i].value === this.table) {
          table = this.tableOptions[i].label
          break
        }
      }
      return {
        table: table,
        conditions: JSON.stringify(this.conditions)
      }
    },
    search(scope) {
      this.heads = this.selectHeads
      scope.loadData(1)
    }
  }
}
</script>

<style scoped>

</style>
