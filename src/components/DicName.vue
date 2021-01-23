<template>
  <span>{{name}}</span>
</template>

<script>
import NetWork from '@/api/network'

export default {
  name: 'DicName',
  props: {
    type: {
      type: String,
      default: ''
    },
    code: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      name: ''
    }
  },
  created: function () {
    this.getDicName()
  },
  methods: {
    getDicName: function () {
      NetWork.get('dic/getUsedDic', {
        type: this.type,
        code: this.code
      }, (data) => {
        if (data) {
          this.name = data.name
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
