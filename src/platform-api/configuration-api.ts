import { ReapitConnectSession, useReapitConnect } from '@reapit/connect-session'
import { ListItemModel } from '@reapit/foundations-ts-definitions'
import { URLS } from '../constants/api'
import axios from '../axios/axios'
import { reapitConnectBrowserSession } from '../core/connect-session'
import { useQuery, UseQueryResult } from 'react-query'
import { useAtom } from 'jotai'
import { identityTypeAtom } from 'atoms/atoms'
import * as React from 'react'

export const getIdentityDocumentTypes = async (
  session: ReapitConnectSession | null,
): Promise<Required<ListItemModel>[] | undefined> => {
  try {
    if (!session) return

    const response = await axios.get(`${URLS.CONFIGURATION_DOCUMENT_TYPES}`)

    return response.data
  } catch (err) {
    const error = err as Error
    console.error('Error fetching Identity Document Types', error.message)
  }
}

export const useGetIdentityDocumentTypes = (): UseQueryResult<Required<ListItemModel>[] | undefined> => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)
  const [, setIdentityTypes] = useAtom(identityTypeAtom)

  const idTypes = useQuery(['getIdentityDocumentTypes'], () => getIdentityDocumentTypes(connectSession!), {
    enabled: !!connectSession,
  })

  React.useEffect(() => {
    if (idTypes.data) {
      const idTypesObj = idTypes.data.reduce((obj, types) => {
        obj[types.id] = types.value
        return obj
      }, {})
      setIdentityTypes(idTypesObj)
    }
  }, [idTypes.data])

  return idTypes
}
