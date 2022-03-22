import axios from '../axios/axios'
import { URLS } from '../constants/api'

export const downloadDocument = async (id: string) => {
  const response = await axios.get(`${URLS.DOCUMENTS}/${id}/download`, {
    headers: {
      accept: 'application/octet-stream',
    },
    responseType: 'blob',
  })

  return URL.createObjectURL(response.data)
}

export const useDownloadDocument = () => {
  return downloadDocument
}
