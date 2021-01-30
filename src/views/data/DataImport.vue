<template>
  <div>
    <el-row>
      <el-form :inline="true">
        <el-form-item :label="fileName">
          <el-button type="success" @click="isShowUpload = true" size="small">上传文件</el-button>
        </el-form-item>
        <el-form-item label="数据表">
          <el-select v-model="tableId" placeholder="请选择数据表" style="width: 100%" size="small" clearable filterable>
            <el-option v-for="item in tableOptions" :label="item.label" :value="item.value" :key="item.value"
                       size="small"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分列符">
          <el-select v-model="split" placeholder="请选择分列符" style="width: 100%" size="small" clearable>
            <el-option v-for="item in splitOptions" :label="item.label" :value="item.value" :key="item.value"
                       size="small"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预览数量">
          <el-input-number v-model="previewCount" size="small" :min="1" :max="100" :step="10"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="preview" size="small">预览</el-button>
          <el-button type="success" @click="saveData" size="small">保存</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-table :data="lines" border :cell-style="{'text-align': 'center'}" max-height="600"
              :header-cell-style="{'text-align': 'center','background-color': '#f5f7fa'}">
      <el-table-column v-for="index in maxLineSize" min-width="150" :key="index">
        <template slot="header" slot-scope="scope">
          <el-select v-model="heads[index - 1]" placeholder="请选择表头" style="width: 100%" size="small" clearable>
            <el-option v-for="item in columns" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </template>
        <template slot-scope="scope">{{scope.row[index - 1]}}</template>
      </el-table-column>
    </el-table>

    <el-dialog title="上传文件" :visible.sync="isShowUpload" width="30%">
      <el-form label-width="100px">
        <el-form-item label="文件">
          <el-upload ref="upload" class="upload-demo" :action="'apis/data/upload'"
                     :on-success="handleUploadSuccess"
                     :multiple="false" :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="isShowUpload = false">取 消</el-button>
            <el-button type="primary" size="small" @click="submitUpload">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog title="导入进度" :visible.sync="showProgress" width="570px" :before-close="beforeClose"
               :show-close="false">
      <el-row>
        <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage"></el-progress>
      </el-row>
      <el-row style="margin-top: 5px">
        <el-alert :title="importInfo" type="success" :closable="false"></el-alert>
      </el-row>
      <span slot="footer" class="dialog-footer" v-if="showCloseProgress">
            <el-button type="primary" size="small" @click="showProgress = false">关闭</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import Network from '../../api/network'
import {getImportStatus, preview, saveData} from '../../api/data'

export default {
  name: 'DataImport',
  data() {
    return {
      tableId: '',
      fileName: '',
      tmpFileName: '',
      split: ',',
      previewCount: 50,

      tableOptions: [],
      splitOptions: [{
        label: '英文逗号',
        value: ','
      }, {
        label: '制表符',
        value: '\t'
      }, {
        label: '中文逗号',
        value: '，'
      }],

      maxLineSize: 0,
      heads: [],
      columns: [],
      lines: [],

      isShowUpload: false,

      importInfo: '',
      showProgress: false,
      showCloseProgress: false,
      percentage: 0,
      importStatusInterval: ''
    }
  },
  created() {
    this.getTables()
  },
  methods: {
    beforeClose() {},
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
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleUploadSuccess(res) {
      if (res.code !== 0) {
        this.$message.error(res.msg)
        return
      }
      this.fileName = res.data.fileName
      this.tmpFileName = res.data.tmpFileName
      this.isShowUpload = false
    },
    preview() {
      if (!this.tmpFileName) {
        this.$message.error('请上传文件')
        return
      }
      if (!this.tableId) {
        this.$message.error('请选择数据表')
        return
      }

      preview({
        tmpFileName: this.tmpFileName,
        tableId: this.tableId,
        split: this.split,
        previewCount: this.previewCount
      }, data => {
        this.columns = []
        this.heads = []
        this.maxLineSize = data.maxLineSize
        this.lines = data.lines

        const columns = data.columns
        for (let i = 0; i < columns.length; i++) {
          this.heads.push(columns[i].columnName)
          this.columns.push({
            label: columns[i].columnDesc,
            value: columns[i].columnName
          })
        }
      })
    },
    saveData() {
      if (!this.tmpFileName) {
        this.$message.error('请上传文件')
        return
      }
      if (!this.tableId) {
        this.$message.error('请选择数据表')
        return
      }

      const heads = {}
      for (let i = 0; i < this.heads.length; i++) {
        const exist = heads[this.heads[i]]
        if (exist || exist === 0) {
          this.$message.error('第' + exist + '列和第' + i + '列表头重复')
          return
        }
        heads[this.heads[i]] = i
      }

      saveData({
        tmpFileName: this.tmpFileName,
        tableId: this.tableId,
        split: this.split,
        heads: heads
      }, data => {
        this.showCloseProgress = false
        this.showProgress = true
        this.importStatus(data)
      })
    },
    importStatus(uuid) {
      this.importInfo = ''
      let startTime = new Date().getTime()
      this.importStatusInterval = setInterval(() => {
        getImportStatus(uuid, data => {
          this.setImportInfo(startTime, data)
          if (data.finish) {
            this.showCloseProgress = true
            this.maxLineSize = 0
            this.columns = []
            this.heads = []
            this.lines = []
            clearInterval(this.importStatusInterval)
          }
        })
      }, 500)
    },
    setImportInfo(startTime, data) {
      let cost = new Date().getTime() - startTime
      let total = data.total
      if (!total) {
        this.percentage = 0
        this.importInfo = '总数：计算中，耗时：' + this.getTimeShow(cost)
        return
      }
      let imported = data.imported
      if (!imported) {
        this.percentage = 0
        this.importInfo = '总数：' + total + '，已导入0，耗时：' + this.getTimeShow(cost)
        return
      }

      let percent = imported / total
      this.percentage = Number((percent * 100).toFixed(2))
      let remaining = this.getTimeShow(cost / percent - cost)
      this.importInfo = '总数：' + total + '，已导入: ' + imported + '，耗时：' + this.getTimeShow(cost) + '，预计还需' + remaining
    },
    getTimeShow(millis) {
      let second = Math.round(millis / 1000)
      let minutes = Math.floor(second / 60)
      second = second - minutes * 60

      let info = ''
      if (minutes !== 0) {
        info += minutes + '分'
      }
      info += second + '秒'
      return info
    }
  }
}
</script>

<style scoped>

</style>
