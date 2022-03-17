import { ReapitConnectSession, useReapitConnect } from '@reapit/connect-session'
import axios from '../axios/axios'
import { URLS, BASE_HEADERS } from '../constants/api'
import { reapitConnectBrowserSession } from '../core/connect-session'

type DownloadDocumentParams = {
  documentId: string
}

export const downloadDocument = async (session: ReapitConnectSession | null, params: DownloadDocumentParams) => {
  try {
    if (!session) return

    const { documentId } = params

    const response = await axios.get(`${window.reapit.config.platformApiUrl}${URLS.DOCUMENTS}/${documentId}/download`, {
      headers: {
        ...BASE_HEADERS,
        Authorization: `Bearer ${session?.accessToken}`,
        accept: 'application/octet-stream',
      },
      responseType: 'blob',
    })

    return URL.createObjectURL(response.data)
  } catch (err) {
    const error = err as Error
    console.error('Error downloading document', error.message)
  }
}

export const useDownloadDocument = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)

  return (params: DownloadDocumentParams) => {
    return downloadDocument(connectSession, { documentId: params.documentId })
  }
}
