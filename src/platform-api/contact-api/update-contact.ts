import { useMutation, useQueryClient } from 'react-query'
// import { ReapitConnectSession } from '@reapit/connect-session'
import { ContactModel } from '@reapit/foundations-ts-definitions'
import axios from '../../axios/axios'
import { URLS } from '../../constants/api'

export const useUpdateContact = (id: string, _eTag: string) => {
  const queryClient = useQueryClient()
  return useMutation(
    (body: any) =>
      axios.patch<ContactModel>(`${URLS.CONTACTS}/${id}`, body, {
        headers: {
          'If-Match': _eTag,
        },
      }),
    {
      // ✅ invalidate contact by id
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries(['contact', id])
        console.log('success', { data })
      },
      onError: (err: any) => {
        console.error('error', err)
      },
    },
  )
}
