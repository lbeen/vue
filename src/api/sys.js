import Network from '@/api/network'

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

export const saveDic = (dic, success) => Network.post('/dic/saveDic', dic, success)

export const refreshDicCache = () => Network.get('dic/refreshDicCache')
