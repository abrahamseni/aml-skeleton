import axios from '../axios/axios'
import { useReapitConnect } from '@reapit/connect-session'
import { useQuery, QueryKey } from 'react-query'
import qs from 'qs'
import { URLS } from '../constants/api'
import { reapitConnectBrowserSession } from '../core/connect-session'
import { ContactModelPagedResult } from '@reapit/foundations-ts-definitions'
import isEmpty from 'lodash.isempty'

export type SearchContactParam = {
  pageNumber?: number
  pageSize?: number
  name?: string
  address?: string 
  identityCheck?: string
}

const fetchContactsBy = async (params: SearchContactParam) => {
  try {
    const result = await axios.get(`${URLS.CONTACTS}/?${qs.stringify(params)}`)
    if (result.status < 400) {
      return result.data
    }
  } catch (error) {
    console.error(error)
  }
}

export const useFetchContactsBy = (params: SearchContactParam) => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)
  const beginFetch = () => !!(connectSession?.accessToken && !isEmpty(params))
  
  const contactListResult = useQuery<
    ContactModelPagedResult,
    Error,
    ContactModelPagedResult,
    SearchContactParam & QueryKey
  >(['searchContactBy', params], () => fetchContactsBy(params), {
    enabled: beginFetch(),
    onError: (error) => {
      throw new Error(error.message)
    },
  })

  return contactListResult
}
