import { useReapitConnect } from '@reapit/connect-session'
import axios from '../../axios/axios'
import { URLS } from '../../constants/api'
import { IdentityCheckModel } from '@reapit/foundations-ts-definitions'
import { useQuery } from 'react-query'
import { reapitConnectBrowserSession } from '../../core/connect-session'

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
