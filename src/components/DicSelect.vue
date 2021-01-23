<template>
  <el-select v-bind:value="value" :placeholder="placeholder" size="small" clearable @change="selectChange">
    <el-option v-for="item in items" :label="item.label" :value="item.value" :key="item.value"></el-option>
  </el-select>
</template>

<script>
import NetWork from '@/api/network'

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
    this.getItems()
  },
  methods: {
    getItems() {
      NetWork.get('dic/getUsedDics', {type: this.dicType}, (data) => {
        if (data) {
          for (let i = 0; i < data.length; i++) {
            this.items.push({
              label: data[i].name,
              value: data[i].code
            })
          }
        }
      })
    },
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
