import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import { ReapitConnectSession } from '@reapit/connect-session'
import { BASE_HEADERS } from '../../constants/api'
import { ContactModel } from '@reapit/foundations-ts-definitions'

export const useUpdateContact = (session: ReapitConnectSession | null, id: string, _eTag: string) => {
  const queryClient = useQueryClient()
  return useMutation(
    (body: any) =>
      axios.patch<ContactModel>(`${window.reapit.config.platformApiUrl}/contacts/${id}`, body, {
        headers: {
          ...BASE_HEADERS,
          Authorization: `Bearer ${session?.accessToken}`,
          'If-Match': _eTag,
        },
      }),
    {
      // ✅ always invalidate the todo list
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
