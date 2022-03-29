import { useMutation, useQueryClient } from 'react-query'
import axios from '../../axios/axios'
import { URLS } from '../../constants/api'
import { UpdateIdentityCheckModel } from '@reapit/foundations-ts-definitions'

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
    updateIdentityCheck: result.mutateAsync,
  }
}
