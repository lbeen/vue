import axios from 'axios'
import qs from 'qs'
import ElementUI from 'element-ui'

axios.defaults.baseURL = '/apis'

export default {
  get(path, param, success, error) {
    axios.get(path, {params: param})
      .then(response => {
        if (success) {
          success(response.data)
        }
      })
      .catch(exception => this.errorHandler(exception, error))
  },
  // getAndCheck(path, param, success, error) {
  //   this.get(path, param,
  //     response => this.checkResponse(response, success, error),
  //     exception => this.errorHandler(exception, error))
  // },
  post(path, param, success, error) {
    if (param) {
      param = qs.stringify(param)
    }
    axios.post(path, param)
      .then(response => this.checkResponse(response, success, error))
      .catch(exception => this.errorHandler(exception, error))
  },
  checkResponse(response, success, error) {
    const data = response.data
    if (data.code === 0) {
      if (success) {
        success(response.data.data)
      }
      if (data.msg) {
        ElementUI.Message.success(data.msg)
      }
    } else {
      ElementUI.Message.error(data.msg)
      if (error) {
        error()
      }
    }
  },
  errorHandler(exception, error) {
    console.log(exception)
    ElementUI.Message.error('操作失败')
    if (error) {
      error()
    }
  }
}
