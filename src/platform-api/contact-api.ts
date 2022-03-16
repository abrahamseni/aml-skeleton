import axios from '../axios/axios'
import { useReapitConnect } from '@reapit/connect-session'
import { useQuery, QueryKey, useMutation } from 'react-query'
import qs from 'qs'
import { URLS } from '../constants/api'
import { reapitConnectBrowserSession } from '../core/connect-session'
import { ContactModel, ContactModelPagedResult } from '@reapit/foundations-ts-definitions'
import isEmpty from 'lodash.isempty'

export type SearchContactParam = {
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

// update contact data
export interface UpdateContactDataType {
  contactId: string
  _eTag: string
  bodyData: any
}

const updateContactData = async (params: UpdateContactDataType): Promise<ContactModel | undefined> => {
  const { _eTag, contactId, bodyData } = params
  const { data } = await axios.patch<ContactModel>(`${URLS.CONTACTS}/${contactId}`, bodyData, {
    headers: {
      'If-Match': _eTag,
    },
  })

  return data
}

export const useUpdateContactData = (params: UpdateContactDataType) => {
  return useMutation(() => updateContactData(params))
}
