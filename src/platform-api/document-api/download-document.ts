import axios from '../../axios/axios'
import { URLS } from '../../constants/api'
import mime from 'mime'

export const downloadDocument = async (id: string) => {
  const fileResponsePromise = axios.get(`${URLS.DOCUMENTS}/${id}/download`, {
    headers: {
      accept: 'application/octet-stream',
    },
    responseType: 'blob',
  })
  const fileInfoResponsePromise = axios.get(`${URLS.DOCUMENTS}/${id}`)

  const [fileResponse, fileInfoResponse] = await Promise.all([fileResponsePromise, fileInfoResponsePromise])
  const type = mime.getType(fileInfoResponse.data.name)
  const blobWithType = fileResponse.data.slice(0, fileResponse.data.size, type)

  return {
    filename: fileInfoResponse.data.name,
    url: URL.createObjectURL(blobWithType),
  }
}

export const useDownloadDocument = () => {
  return downloadDocument
}
