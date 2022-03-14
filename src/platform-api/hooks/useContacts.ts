import { useQuery } from 'react-query'
import axios from 'axios'
import { ReapitConnectSession } from '@reapit/connect-session'
import { BASE_HEADERS } from '../../constants/api'

export const useContacts = (session: ReapitConnectSession | null, { ...params }) => {
  console.log({ params })
  return useQuery(
    ['contacts', { ...params }],
    () =>
      axios
        .get(`${window.reapit.config.platformApiUrl}/contacts`, {
          headers: {
            ...BASE_HEADERS,
            Authorization: `Bearer ${session?.accessToken}`,
          },
          params: { ...params },
        })
        .then((res) => res.data),
    {
      enabled: !!session,
      retry: false,
    },
  )
}
