import Network from '../api/network'

export const preview = (param, callBack) => Network.getAndCheck('/data/preview', param, callBack)

export const saveData = (param, callBack) => Network.postNotStringify('/data/saveData', param, callBack)

export const getImportStatus = (id, callBack) => Network.getAndCheck('/data/getImportStatus', {uuid: id}, callBack)
