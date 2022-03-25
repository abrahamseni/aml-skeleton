import Axios from 'axios/axios'
import { AxiosError } from 'axios'
import { URLS } from 'constants/api'
import { useMutation } from 'react-query'

interface FileDocumentUploadType {
  name: string
  imageData: string
}

export const fileDocumentUpload = async (params: FileDocumentUploadType) => {
  return await Axios.post(`${URLS.FILE_UPLOAD}`, params)
}

export const useFileDocumentUpload = () => {
  const result = useMutation<any, AxiosError, any, () => void>((params: FileDocumentUploadType) => {
    return fileDocumentUpload(params)
  })

  return {
    ...result,
    fileUpload: result.mutateAsync,
  }
}
