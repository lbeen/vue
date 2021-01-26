<template>
  <div>
    <el-row>
      <el-form :inline="true">
        <el-form-item>
          <el-button type="success" @click="addDic" size="small">新增字典类型</el-button>
          <el-button type="primary" @click="refreshDicCache" size="small">刷新字典缓存</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-row>
      <el-table :data="dics" row-key="id" border lazy :load="loadChildren" stripe>
        <el-table-column prop="name" label="名称" width="250" align="left"></el-table-column>
        <el-table-column prop="code" label="代码" width="250"></el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.used === '1'">启用</span>
            <span v-else>禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="editDic(scope.row.id)" size="small">修改</el-button>
            <el-button v-if="!scope.row.parentId" type="success" @click="addChild(scope.row.id)" size="small">新增子字典
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-dialog :title="formTitle" :visible.sync="isShowForm" width="500px" :close-on-click-modal="false">
      <el-form label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="form.name" size="small" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="代码">
          <el-input v-model="form.code" size="small" placeholder="请输入代码"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" size="small" placeholder="请输入排序" :step="10"></el-input-number>
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="form.used" active-color="#13ce66" inactive-color="gray"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowForm = false">取 消</el-button>
        <el-button type="primary" @click="saveDic">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getDics, getDicById, saveDic, refreshDicCache} from '../../api/sys'

export default {
  name: 'Dic',
  data() {
    return {
      dics: [],

      isShowForm: false,
      formTitle: '',
      form: {
        id: '',
        parentId: '',
        name: '',
        code: '',
        sort: '',
        used: false
      }
    }
  },
  created() {
    this.loadTopDic()
  },
  methods: {
    loadTopDic() {
      getDics(null, dics => {
        this.dics = dics
      })
    },
    loadChildren(tree, treeNode, resolve) {
      getDics(tree.id, resolve)
    },
    addDic() {
      this.resetForm()
      this.formTitle = '新增字典'
      this.isShowForm = true
    },
    addChild(parentId) {
      this.resetForm()
      this.form.parentId = parentId
      this.formTitle = '新增字典'
      this.isShowForm = true
    },
    editDic(id) {
      this.resetForm()
      this.formTitle = '修改字典'
      this.isShowForm = true
      getDicById(id, data => {
        if (data) {
          this.form.id = data.id
          this.form.parentId = data.parentId
          this.form.name = data.name
          this.form.code = data.code
          this.form.sort = data.sort
          this.form.used = data.used === '1'
        }
      })
    },
    resetForm() {
      this.form = {
        id: '',
        parentId: '',
        name: '',
        code: '',
        sort: '',
        used: false
      }
    },
    saveDic() {
      saveDic({
        id: this.form.id,
        parentId: this.form.parentId,
        name: this.form.name,
        code: this.form.code,
        sort: this.form.sort,
        used: this.form.used ? '1' : '0'
      }, () => {
        this.loadTopDic()
        this.isShowForm = false
      })
    },
    refreshDicCache() {
      refreshDicCache('dic/refreshDicCache')
    }
  }
}
</script>

<style scoped>

</style>
