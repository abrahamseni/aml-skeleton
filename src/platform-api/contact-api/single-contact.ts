import { useQuery, QueryKey } from 'react-query'
import { AxiosError } from 'axios'
import { ReapitConnectSession } from '@reapit/connect-session'
import { ContactModel } from '@reapit/foundations-ts-definitions'
import axios from '../../axios/axios'
import { URLS } from '../../constants/api'

export const useSingleContact = (session: ReapitConnectSession | null, id: string) => {
  return useQuery<ContactModel, AxiosError, ContactModel, string[] & QueryKey>(
    ['contact', id],
    () => axios.get(`${URLS.CONTACTS}/${id}`).then((res) => res.data),
    {
      enabled: !!session && !!id,
      retry: false,
    },
  )
}
