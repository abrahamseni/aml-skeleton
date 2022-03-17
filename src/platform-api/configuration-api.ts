import { ReapitConnectSession, useReapitConnect } from '@reapit/connect-session'
import { ListItemModel } from '@reapit/foundations-ts-definitions'
import { URLS, BASE_HEADERS } from '../constants/api'
import axios from '../axios/axios'
import { reapitConnectBrowserSession } from '../core/connect-session'
import { useQuery, UseQueryResult } from 'react-query'

export const getIdentityDocumentTypes = async (
  session: ReapitConnectSession | null,
): Promise<Required<ListItemModel>[] | undefined> => {
  try {
    if (!session) return

    const response = await axios.get(`${window.reapit.config.platformApiUrl}${URLS.CONFIGURATION_DOCUMENT_TYPES}`, {
      headers: {
        ...BASE_HEADERS,
        Authorization: `Bearer ${session?.accessToken}`,
      },
    })

    return response.data
  } catch (err) {
    const error = err as Error
    console.error('Error fetching Identity Document Types', error.message)
  }
}

export const useGetIdentityDocumentTypes = (): UseQueryResult<Required<ListItemModel>[] | undefined> => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)

  return useQuery(['getIdentityDocumentTypes'], () => getIdentityDocumentTypes(connectSession!), {
    enabled: !!connectSession,
  })
}
