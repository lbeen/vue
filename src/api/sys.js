import Network from '../api/network'

export const getOneDb = (id, callBack) => Network.get('/database/getOneDb', {id: id}, callBack)

export const saveDatabase = (db, success) => Network.post('/database/saveDatabase', db, success)

export const deleteDatabase = (id, success) => Network.post('/database/deleteDatabase', {id: id}, success)

export const getDics = (parentId, callBack) => {
  Network.get('/dic/getDics', {parentId: parentId}, data => {
    const dics = []
    if (data) {
      for (let i = 0; i < data.length; i++) {
        const dic = data[i]
        dics.push({
          id: dic.id,
          parentId: dic.parentId,
          name: dic.name,
          code: dic.code,
          sort: dic.sort,
          used: dic.used,
          hasChildren: !parentId
        })
      }
    }
    callBack(dics)
  })
}

export const getDicById = (id, callBack) => Network.get('/dic/getDicById', {id: id}, callBack)

export const getUsedDics = (type, callBack) => Network.get('dic/getUsedDics', {type: type}, (data) => {
  const items = []
  if (data) {
    for (let i = 0; i < data.length; i++) {
      items.push({
        label: data[i].name,
        value: data[i].code
      })
    }
  }
  callBack(items)
})

export const saveDic = (dic, success) => Network.post('/dic/saveDic', dic, success)

export const refreshDicCache = () => Network.get('dic/refreshDicCache')

export const getTableById = (id, callBack) => Network.get('/table/getTableById', {id: id}, callBack)

export const saveTable = (table, success) => Network.post('/table/saveTable', table, success)

export const refreshTableCache = () => Network.get('table/refreshTableCache')

export const deleteTable = (id, success) => Network.post('/table/deleteTable', {id: id}, success)

export const getColumnsByTableId = (id, success) => Network.get('/table/getColumnsByTableId', {id: id}, success)

export const insertColumns = (tableId, tableColumns, success) => Network.post('/table/insertColumns', {
  tableId: this.currentTableId,
  tableColumns: tableColumns
}, success)
