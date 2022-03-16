import { useQuery } from 'react-query'
import axios from 'axios'
import { ReapitConnectSession } from '@reapit/connect-session'
import { BASE_HEADERS } from '../../constants/api'
import { ContactModel } from '@reapit/foundations-ts-definitions'

export const useSingleContact = (session: ReapitConnectSession | null, id: string) => {
  return useQuery<ContactModel, Error>(
    ['contact', id],
    () =>
      axios
        .get(`${window.reapit.config.platformApiUrl}/contacts/${id}`, {
          headers: {
            ...BASE_HEADERS,
            Authorization: `Bearer ${session?.accessToken}`,
          },
        })
        .then((res) => res.data),
    {
      enabled: !!session && !!id,
      retry: false,
    },
  )
}
