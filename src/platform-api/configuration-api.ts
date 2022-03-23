import { useReapitConnect } from '@reapit/connect-session'
import { ListItemModel } from '@reapit/foundations-ts-definitions'
import { URLS } from '../constants/api'
import axios from '../axios/axios'
import { reapitConnectBrowserSession } from '../core/connect-session'
import { useQuery, UseQueryResult } from 'react-query'
import { useAtom } from 'jotai'
import { identityTypeAtom } from 'atoms/atoms'
import * as React from 'react'

export const getIdentityDocumentTypes = async (): Promise<Required<ListItemModel>[] | undefined> => {
  const response = await axios.get(`${URLS.CONFIGURATION_DOCUMENT_TYPES}`)
  const idDocTypes: Required<ListItemModel>[] = response.data
  return idDocTypes.filter((type) => type.id !== '')
}

export const useGetIdentityDocumentTypes = (): UseQueryResult<Required<ListItemModel>[] | undefined> => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)
  const [, setIdentityTypes] = useAtom(identityTypeAtom)

  const idTypes = useQuery(['getIdentityDocumentTypes'], () => getIdentityDocumentTypes(), {
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
