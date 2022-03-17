import { useMutation, useQueryClient } from 'react-query'
import { AxiosError } from 'axios'
import { ContactModel } from '@reapit/foundations-ts-definitions'
import axios from '../../axios/axios'
import { URLS } from '../../constants/api'

export const useUpdateContact = (id: string, _eTag: string) => {
  const queryClient = useQueryClient()
  return useMutation<ContactModel, AxiosError, any, () => void>(
    (body: any) => {
      return axios.patch(`${URLS.CONTACTS}/${id}`, body, {
        headers: {
          'If-Match': _eTag,
        },
      })
    },
    {
      // ✅ invalidate contact by id
      onSuccess: () => {
        queryClient.invalidateQueries(['contact', id])
      },
    },
  )
}
