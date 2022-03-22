import { useReapitConnect } from '@reapit/connect-session'
import { ListItemModel } from '@reapit/foundations-ts-definitions'
import { URLS } from '../constants/api'
import axios from '../axios/axios'
import { reapitConnectBrowserSession } from '../core/connect-session'
import { useQuery, UseQueryResult } from 'react-query'

export const getIdentityDocumentTypes = async (): Promise<Required<ListItemModel>[] | undefined> => {
  const response = await axios.get(`${URLS.CONFIGURATION_DOCUMENT_TYPES}`)
  const idDocTypes: Required<ListItemModel>[] = response.data
  return idDocTypes.filter((type) => type.id !== '')
}

export const useGetIdentityDocumentTypes = (): UseQueryResult<Required<ListItemModel>[] | undefined> => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)

  return useQuery(['getIdentityDocumentTypes'], () => getIdentityDocumentTypes(), {
    enabled: !!connectSession,
  })
}
