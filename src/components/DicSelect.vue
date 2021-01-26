<template>
  <el-select v-bind:value="value" :placeholder="placeholder" size="small" clearable @change="selectChange">
    <el-option v-for="item in items" :label="item.label" :value="item.value" :key="item.value"></el-option>
  </el-select>
</template>

<script>
import {getUsedDics} from '../api/sys'

export default {
  name: 'DicSelect',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    dicType: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {
      items: []
    }
  },
  created() {
    getUsedDics(this.dicType, data => {
      this.items = data
    })
  },
  methods: {
    selectChange(value) {
      if (!value) {
        value = ''
      }
      this.$emit('change', value)
    }
  }
}
</script>

<style scoped>

</style>
