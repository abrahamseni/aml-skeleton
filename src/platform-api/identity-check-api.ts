import { ReapitConnectSession, useReapitConnect } from '@reapit/connect-session'
import axios from '../axios/axios'
import { BASE_HEADERS, URLS } from '../constants/api'
import {
  CreateIdentityCheckModel,
  IdentityCheckModel,
  UpdateIdentityCheckModel,
} from '@reapit/foundations-ts-definitions'
import { useQuery } from 'react-query'
import { reapitConnectBrowserSession } from '../core/connect-session'

type FetchSingleIdentityCheckByContactIdParams = {
  contactId: string
}

export const fetchSingleIdentityCheckByContactId = async (
  session: ReapitConnectSession | null,
  params: FetchSingleIdentityCheckByContactIdParams,
): Promise<IdentityCheckModel | undefined> => {
  if (!session) return

  const response = await axios.get(`${window.reapit.config.platformApiUrl}${URLS.ID_CHECKS}`, {
    headers: {
      ...BASE_HEADERS,
      Authorization: `Bearer ${session?.accessToken}`,
    },
    params: params,
  })

  return response.data._embedded[0]
}

export const useFetchSingleIdentityCheckByContactId = (params: FetchSingleIdentityCheckByContactIdParams) => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)
  const { contactId } = params

  return useQuery(
    ['fetchSingleIdentityCheckByContactId', { contactId }],
    () => fetchSingleIdentityCheckByContactId(connectSession, { contactId }),
    {
      enabled: !!connectSession,
    },
  )
}

type CreateIdentityCheckParams = CreateIdentityCheckModel

export const createIdentityCheck = async (session: ReapitConnectSession | null, params: CreateIdentityCheckParams) => {
  if (!session) return

  await axios.post(`${window.reapit.config.platformApiUrl}${URLS.ID_CHECKS}`, params, {
    headers: {
      ...BASE_HEADERS,
      Authorization: `Bearer ${session?.accessToken}`,
    },
  })
}

export const useCreateIdentityCheck = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)

  return (params: CreateIdentityCheckParams) => {
    return createIdentityCheck(connectSession, params)
  }
}

interface UpdateIdentityCheckParams extends UpdateIdentityCheckModel {
  id: string
  _eTag: string
}

export const updateIdentityCheck = async (session: ReapitConnectSession | null, params: UpdateIdentityCheckParams) => {
  if (!session) return

  const { id, _eTag, ...restParams } = params

  await axios.patch(`${window.reapit.config.platformApiUrl}${URLS.ID_CHECKS}/${id}`, restParams, {
    headers: {
      ...BASE_HEADERS,
      'If-Match': _eTag,
      Authorization: `Bearer ${session?.accessToken}`,
    },
  })
}

export const useUpdateIdentityCheck = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)

  return (params: UpdateIdentityCheckParams) => {
    return updateIdentityCheck(connectSession, params)
  }
}
