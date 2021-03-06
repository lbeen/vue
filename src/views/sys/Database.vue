<template>
  <div>
    <page-table url="database/getDbPage" :param="param" ref="pageTable">
      <slot slot="search" slot-scope="scope">
        <el-form :inline="true">
          <el-form-item label="过滤">
            <el-input v-model="param.dbDesc" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <dic-select v-model="param.dbType" dic-type="dbType" placeholder="请选择数据库类型"></dic-select>
          </el-form-item>
          <el-form-item>
            <el-button id="search" type="primary" @click="scope.loadData(1)" size="small">查询</el-button>
            <el-button type="success" @click="addDatabase" size="small">新增</el-button>
          </el-form-item>
        </el-form>
      </slot>
      <slot slot="table">
        <el-table-column label="IP" prop="ip" width="150"></el-table-column>
        <el-table-column label="端口" prop="port" width="100"></el-table-column>
        <el-table-column label="数据库类型" width="150">
          <template slot-scope="scope">
            <dic-name type="dbType" :code="scope.row.dbType"></dic-name>
          </template>
        </el-table-column>
        <el-table-column label="数据库名称" prop="dbName" width="150"></el-table-column>
        <el-table-column label="数据库描述" prop="dbDesc"></el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">{{scope.row.used === '1' ? '启用' : '未启用'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="success" @click="editDatabase(scope.row.id)" size="small">编辑</el-button>
            <el-button type="danger" @click="deleteDatabase(scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </slot>
    </page-table>

    <el-dialog :title="addFormTitle" :visible.sync="isShowAddForm" width="500px" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="IP">
          <el-input v-model="addForm.ip" size="small" placeholder="请输入IP"></el-input>
        </el-form-item>
        <el-form-item label="端口">
          <el-input v-model="addForm.port" size="small" placeholder="请输入端口"></el-input>
        </el-form-item>
        <el-form-item label="数据库类型">
          <dic-select v-model="addForm.dbType" dic-type="dbType" style="width: 100%"
                      placeholder="请选择数据库类型" :value="addForm.dbType">
          </dic-select>
        </el-form-item>
        <el-form-item label="数据库名称">
          <el-input v-model="addForm.dbName" size="small" placeholder="请输入数据库名称"></el-input>
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="addForm.used" active-color="#13ce66" inactive-color="gray">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAddForm = false">取 消</el-button>
        <el-button type="primary" @click="saveDatabase">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="删除" :visible.sync="isShowDeleteConfirm" width="30%">
      <span>{{deleteMsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDeleteConfirm = false">取 消</el-button>
        <el-button type="primary" @click="confirmDatabase">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import PageTable from '../../components/PageTable'
import DicSelect from '../../components/DicSelect'
import DicName from '../../components/DicName'
import {getOneDb, saveDatabase, deleteDatabase} from '../../api/sys'

export default {
  name: 'database',
  components: {
    PageTable,
    DicSelect,
    DicName
  },
  data() {
    return {
      param: {
        dbDesc: '',
        dbType: ''
      },

      isShowAddForm: false,
      formInputWidth: '120px',
      addFormTitle: '',
      addForm: {
        id: '',
        ip: '',
        port: '',
        dbType: '',
        dbName: '',
        used: false
      },

      isShowDeleteConfirm: false,
      deleteId: '',
      deleteMsg: ''
    }
  },
  methods: {
    addDatabase() {
      this.resetAddForm()
      this.addFormTitle = '新增数据库'
      this.isShowAddForm = true
    },
    editDatabase(id) {
      this.resetAddForm()
      this.isShowAddForm = true
      this.addFormTitle = '编辑数据库'

      getOneDb(id, data => {
        if (data) {
          this.addForm = {
            id: data.id,
            ip: data.ip,
            port: data.port,
            dbType: data.dbType,
            dbName: data.dbName,
            used: data.used === '1'
          }
        }
      })
    },
    saveDatabase() {
      if (!this.addForm.ip) {
        this.$message.error('请输入IP')
        return
      }
      if (!this.addForm.port) {
        this.$message.error('请输入端口')
        return
      }
      if (!this.addForm.dbType) {
        this.$message.error('请选择数据库类型')
        return
      }
      if (!this.addForm.dbName) {
        this.$message.error('数据库名称')
        return
      }
      saveDatabase({
        id: this.addForm.id,
        ip: this.addForm.ip,
        port: this.addForm.port,
        dbType: this.addForm.dbType,
        dbName: this.addForm.dbName,
        used: this.addForm.used ? '1' : '0'
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
    deleteDatabase(row) {
      this.isShowDeleteConfirm = true
      this.deleteId = row.id
      this.deleteMsg = '确认删除数据库【' + row.dbDesc + '】？'
    },
    confirmDatabase() {
      if (!this.deleteId) {
        this.$message.error('请选择要删除的数据库')
        return
      }
      deleteDatabase(this.deleteId, () => {
        this.isShowDeleteConfirm = false
      })
    }
  }
}
</script>

<style scoped>
</style>
