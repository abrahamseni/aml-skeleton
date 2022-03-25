import axios from '../axios/axios'
import { URLS } from '../constants/api'

export const downloadDocument = async (id: string) => {
  const fileResponsePromise = axios.get(`${URLS.DOCUMENTS}/${id}/download`, {
    headers: {
      accept: 'application/octet-stream',
    },
    responseType: 'blob',
  })
  const fileInfoResponsePromise = axios.get(`${URLS.DOCUMENTS}/${id}`)

  const [fileResponse, fileInfoResponse] = await Promise.all([fileResponsePromise, fileInfoResponsePromise])

  return {
    filename: fileInfoResponse.data.name,
    url: URL.createObjectURL(fileResponse.data),
  }
}

export const useDownloadDocument = () => {
  return downloadDocument
}
