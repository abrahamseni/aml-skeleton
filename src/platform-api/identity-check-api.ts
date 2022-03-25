import { useReapitConnect } from '@reapit/connect-session'
import axios from '../axios/axios'
import { URLS } from '../constants/api'
import {
  CreateIdentityCheckModel,
  IdentityCheckModel,
  UpdateIdentityCheckModel,
} from '@reapit/foundations-ts-definitions'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { reapitConnectBrowserSession } from '../core/connect-session'

export const fetchSingleIdentityCheckByContactId = async (id: string): Promise<IdentityCheckModel | undefined> => {
  const response = await axios.get(`${URLS.ID_CHECKS}`, {
    params: { contactId: id },
  })

  return response.data._embedded[0]
}

export const useFetchSingleIdentityCheckByContactId = (id: string) => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)

  return useQuery(['fetchSingleIdentityCheckByContactId', { id }], () => fetchSingleIdentityCheckByContactId(id), {
    enabled: !!connectSession,
  })
}

type CreateIdentityCheckParams = CreateIdentityCheckModel

export const createIdentityCheck = async (params: CreateIdentityCheckParams) => {
  await axios.post(`${URLS.ID_CHECKS}`, params)
}

export const useCreateIdentityCheck = () => {
  const result = useMutation((params: CreateIdentityCheckParams) => {
    return createIdentityCheck(params)
  })
  return {
    ...result,
    createIdentityCheck: result.mutate,
  }
}

interface UpdateIdentityCheckParams extends UpdateIdentityCheckModel {
  id: string
  _eTag: string
  contactId?: string
}

export const updateIdentityCheck = async (params: UpdateIdentityCheckParams) => {
  const { id, _eTag, contactId, ...restParams } = params

  await axios.patch(`${URLS.ID_CHECKS}/${id}`, restParams, {
    headers: {
      'If-Match': _eTag,
    },
  })

  return contactId
}

export const useUpdateIdentityCheck = () => {
  const queryClient = useQueryClient()
  const result = useMutation(
    (params: UpdateIdentityCheckParams) => {
      return updateIdentityCheck(params)
    },
    {
      onSuccess(contactDataId) {
        queryClient.invalidateQueries(['fetchSingleIdentityCheckByContactId', { id: contactDataId }])
      },
    },
  )
  return {
    ...result,
    updateIdentityCheck: result.mutate,
  }
}
