<template>
  <div>
    <page-table url="table/getPage" :param="param" ref="pageTable">
      <slot slot="search" slot-scope="scope">
        <el-form :inline="true">
          <el-form-item label="表名">
            <el-input v-model="param.tableName" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item label="表描述">
            <el-input v-model="param.tableDesc" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item label="数据库">
            <el-select v-model="param.dbId" placeholder="请选择数据库" size="small" clearable>
              <el-option v-for="item in dbOptions" :label="item.label" :value="item.value" :key="item.value"
                         size="small">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button id="search" type="primary" @click="scope.loadData(1)" size="small">查询</el-button>
            <el-button type="success" @click="addTable" size="small">新增</el-button>
            <el-button type="success" @click="refreshTableCache" size="small">刷新缓存</el-button>
          </el-form-item>
        </el-form>
      </slot>
      <slot slot="table">
        <el-table-column label="表名" prop="tableName" width="180"></el-table-column>
        <el-table-column label="表描述" prop="tableDesc"></el-table-column>
        <el-table-column label="数据库" prop="dbDesc" width="220"></el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button type="success" @click="editTable(scope.row.id)" size="small">编辑</el-button>
            <el-button type="danger" @click="deleteTable(scope.row)" size="small">删除</el-button>
            <el-button type="primary" @click="editColumns(scope.row.id)" size="small">编辑字段</el-button>
          </template>
        </el-table-column>
      </slot>
    </page-table>

    <el-dialog :title="addFormTitle" :visible.sync="isShowAddForm" width="500px" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="表名">
          <el-input v-model="addForm.tableName" size="small" placeholder="请输入表名"></el-input>
        </el-form-item>
        <el-form-item label="表描述">
          <el-input type="textarea" :rows="5" v-model="addForm.tableDesc" size="small"
                    placeholder="请输入表描述"></el-input>
        </el-form-item>
        <el-form-item label="数据库">
          <el-select v-model="addForm.dbId" placeholder="请选择数据库" style="width: 100%" size="small" clearable>
            <el-option v-for="item in dbOptions" :label="item.label" :value="item.value" :key="item.value"
                       size="small">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAddForm = false">取 消</el-button>
        <el-button type="primary" @click="saveTable">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="删除" :visible.sync="isShowDeleteConfirm" width="30%">
      <span>{{deleteMsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDeleteConfirm = false">取 消</el-button>
        <el-button type="primary" @click="confirmTable">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog title="字段说明" :visible.sync="showColumnsTable" :close-on-click-modal="false">
      <el-row style="margin-bottom: 10px">
        <el-col :span="16">
          <el-input v-model="columnsDesc" size="small" type="textarea" placeholder="请输入字段说明"></el-input>
        </el-col>
        <el-col :span="8">
          <div style="margin-left: 10px; margin-top: 5px">
            <el-button type="primary" @click="analysisColumnsDesc">解析</el-button>
            <el-button type="success" @click="addTableColumn">新增</el-button>
          </div>
        </el-col>
      </el-row>
      <el-table :data="tableColumns" border max-height="500">
        <el-table-column label="序号" width="50" type="index"></el-table-column>
        <el-table-column label="字段" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.columnName" size="small" placeholder="请输入字段名" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column label="描述">
          <template slot-scope="scope">
            <el-input v-model="scope.row.columnDesc" size="small" placeholder="请输入字段描述"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="字段类型">
          <template slot-scope="scope">
            <dic-select v-model="scope.row.columnType" dic-type="columnType" placeholder="请选择字段类型"></dic-select>
          </template>
        </el-table-column>
        <el-table-column label="向上" width="50">
          <template slot-scope="scope">
            <i v-if="scope.$index !== 0" class="el-icon-top" style="color: red;cursor: pointer;"
               @click="upColumn(scope.$index)"></i>
          </template>
        </el-table-column>
        <el-table-column label="删除" width="50">
          <template slot-scope="scope">
            <i class="el-icon-delete" style="color: red;cursor: pointer;"
               @click="deleteColumn(scope.$index)"></i>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showColumnsTable = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveTableColumns" size="small">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PageTable from '../../components/PageTable'
import Network from '../../api/network'
import DicSelect from '../../components/DicSelect'
import {
  getTableById,
  saveTable,
  refreshTableCache,
  deleteTable,
  getColumnsByTableId,
  insertColumns,
  getUsedDics
} from '../../api/sys'

export default {
  name: 'Table',
  components: {
    PageTable,
    DicSelect
  },
  data() {
    return {
      param: {
        dbId: '',
        tableName: '',
        tableDesc: ''
      },
      dbOptions: [],

      isShowAddForm: false,
      formInputWidth: '120px',
      addFormTitle: '',
      addForm: {
        id: '',
        tableName: '',
        tableDesc: '',
        dbId: ''
      },

      isShowDeleteConfirm: false,
      deleteId: '',
      deleteMsg: '',

      showColumnsTable: false,
      currentTableId: '',
      tableColumns: [],

      columnTypeOption: [],
      columnsDesc: ''
    }
  },
  created() {
    this.getDbs()
    this.getColumnTypeOption()
  },
  methods: {
    getDbs() {
      Network.get('database/getDbPage', {
        pageSize: 100,
        currentPage: 1
      }, data => {
        if (data) {
          for (let i = 0; i < data.list.length; i++) {
            this.dbOptions.push({
              label: data.list[i].dbDesc,
              value: data.list[i].id
            })
          }
        }
      })
    },
    getColumnTypeOption() {
      getUsedDics('columnType', data => {
        this.columnTypeOption = data
      })
    },
    addTable() {
      this.resetAddForm()
      this.addFormTitle = '新增表'
      this.isShowAddForm = true
    },
    editTable(id) {
      this.resetAddForm()
      this.isShowAddForm = true
      this.addFormTitle = '编辑表'

      getTableById(id, function (data) {
        if (data) {
          this.addForm = {
            id: data.id,
            tableName: data.tableName,
            tableDesc: data.tableDesc,
            dbId: data.dbId
          }
        }
      })
    },
    saveTable() {
      if (!this.addForm.tableName) {
        this.$message.error('请输入表名')
        return
      }
      if (!this.addForm.tableDesc) {
        this.$message.error('请输入表描述')
        return
      }
      if (!this.addForm.dbId) {
        this.$message.error('请选择数据库')
        return
      }
      saveTable({
        id: this.addForm.id,
        tableName: this.addForm.tableName,
        tableDesc: this.addForm.tableDesc,
        dbId: this.addForm.dbId
      }, () => {
        this.$refs.pageTable.loadData(1)
        this.isShowAddForm = false
      })
    },
    resetAddForm() {
      this.addForm = {
        id: '',
        ip: '',
        port: '',
        dbType: '',
        dbName: '',
        used: false
      }
    },
    deleteTable(row) {
      this.isShowDeleteConfirm = true
      this.deleteId = row.id
      this.deleteMsg = '确认删除表【' + row.tableName + '】？'
    },
    confirmTable() {
      if (!this.deleteId) {
        this.$message.error('请选择要删除的表')
        return
      }
      deleteTable(this.deleteId, () => {
        this.$refs.pageTable.loadData(1)
        this.isShowDeleteConfirm = false
      })
    },
    refreshTableCache() {
      refreshTableCache()
    },
    editColumns(tableId) {
      this.currentTableId = tableId
      this.tableColumns = []
      this.columnsDesc = ''
      this.showColumnsTable = true
      getColumnsByTableId(tableId, data => {
        if (data) {
          this.tableColumns = data
        }
      })
    },
    analysisColumnsDesc() {
      if (!this.columnsDesc) {
        return
      }
      let split
      if (this.columnsDesc.indexOf(',') >= 0) {
        split = ','
      } else if (this.columnsDesc.indexOf('，') >= 0) {
        split = '，'
      } else if (this.columnsDesc.indexOf('\t') >= 0) {
        split = '\t'
      } else {
        return
      }

      let arr = this.columnsDesc.split(split)
      for (let i = 0; i < arr.length; i++) {
        this.tableColumns.push({
          columnDesc: arr[i],
          columnName: arr[i],
          columnType: 'string'
        })
      }
    },
    addTableColumn() {
      this.tableColumns.push({})
    },
    upColumn(columnIndex) {
      let tableColumns = []
      for (let i = 0; i < this.tableColumns.length;) {
        if (i === columnIndex - 1) {
          tableColumns.push(this.tableColumns[i + 1])
          tableColumns.push(this.tableColumns[i])
          i += 2
        } else {
          tableColumns.push(this.tableColumns[i])
          i++
        }
      }
      this.tableColumns = tableColumns
    },
    deleteColumn(columnIndex) {
      const tableColumns = []
      for (let i = 0; i < this.tableColumns.length; i++) {
        if (i !== columnIndex) {
          tableColumns.push(this.tableColumns[i])
        }
      }
      this.tableColumns = tableColumns
    },
    saveTableColumns() {
      const tableColumns = []
      for (let i = 0; i < this.tableColumns.length; i++) {
        const tableColumn = this.tableColumns[i]
        if (!tableColumn.columnName || !tableColumn.columnDesc || !tableColumn.columnType) {
          this.$message.error('请完善字段信息')
          return
        }
        tableColumns.push({
          sort: i,
          columnName: tableColumn.columnName,
          columnDesc: tableColumn.columnDesc,
          columnType: tableColumn.columnType
        })
      }
      if (tableColumns.length === 0) {
        this.$message.error('请添加字段信息')
        return
      }

      insertColumns(this.currentTableId, tableColumns, () => {
        this.$refs.pageTable.loadData(1)
        this.showColumnsTable = false
      })
    }
  }
}
</script>

<style scoped>

</style>
