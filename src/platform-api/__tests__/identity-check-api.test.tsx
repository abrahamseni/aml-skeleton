import {
  useFetchSingleIdentityCheckByContactId,
  useCreateIdentityCheck,
  useUpdateIdentityCheck,
} from '../identity-check-api'
import { renderHook } from '@testing-library/react-hooks'
import { QueryClient, QueryClientProvider } from 'react-query'
import axios from '../../axios/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { BASE_HEADERS, URLS } from '../../constants/api'
import React from 'react'
import { mockBrowserSession } from '../../core/__mocks__/connect-session'

const axiosMock = new AxiosMockAdapter(axios)

jest.unmock('@reapit/connect-session')
jest.mock('core/connect-session')

describe('identity check api', () => {
  beforeEach(() => {
    queryClient.clear()
    axiosMock.reset()
  })

  test('useFetchSingleIdentityCheckByContactId send correct request', async () => {
    const contactId = '123'
    mockFetcIdentityCheckApi()

    const { result, waitFor } = renderApiHook(() => useFetchSingleIdentityCheckByContactId(contactId))

    await waitFor(() => result.current.isSuccess)

    expect(axiosMock.history.get.length).toBe(1)
    expect(axiosMock.history.get[0].headers).toEqual(apiHeader())
    expect(axiosMock.history.get[0].params).toEqual({
      contactId: contactId,
    })
  })

  test('useFetchSingleIdentityCheckByContactId return correct response', async () => {
    const expectedData = {
      id: 'idCheck-123',
    }
    const response = {
      _embedded: [expectedData],
    }
    mockFetcIdentityCheckApi(response)

    const { result, waitFor } = renderApiHook(() => useFetchSingleIdentityCheckByContactId('123'))

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data).toEqual(expectedData)
  })

  test('useCreateIdentityCheck send correct request', async () => {
    const params = {
      contactId: '123',
      identityDocument1: {
        typeId: 'DL',
      },
      status: 'pending',
      checkDate: '2021-10-24',
      negotiatorId: 'uc123',
    }

    axiosMock.onPost(`${URLS.ID_CHECKS}`).reply(200)

    const { result, waitFor } = renderApiHook(() => useCreateIdentityCheck())
    result.current.createIdentityCheck(params)
    await waitFor(() => result.current.isSuccess)

    expect(axiosMock.history.post.length).toBe(1)
    expect(axiosMock.history.post[0].headers).toEqual(apiHeader())
    expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(params)
  })

  test('useUpdateIdentityCheck send correct request', async () => {
    const params = {
      id: '123',
      _eTag: 'etag-123',
      identityDocument1: {
        typeId: 'DL',
      },
      status: 'pending',
      checkDate: '2021-10-24',
      negotiatorId: 'uc123',
    }

    const { id, _eTag, ...restParams } = params

    axiosMock.onPatch(`${URLS.ID_CHECKS}/${id}`).reply(200)

    const { result, waitFor } = renderApiHook(() => useUpdateIdentityCheck())
    result.current.updateIdentityCheck(params)
    await waitFor(() => result.current.isSuccess)

    expect(axiosMock.history.patch.length).toBe(1)
    expect(axiosMock.history.patch[0].headers).toEqual({
      ...apiHeader(),
      'If-Match': _eTag,
    })
    expect(JSON.parse(axiosMock.history.patch[0].data)).toEqual(restParams)
  })
})

function mockFetcIdentityCheckApi(data?: any) {
  const aData = data || {
    _embedded: [
      {
        id: 'idCheck-123',
      },
    ],
  }
  axiosMock.onGet(`${URLS.ID_CHECKS}`).reply(200, aData)
}

function renderApiHook<T>(hook: (...args: any) => T) {
  return renderHook<{ children: any }, T>(hook, { wrapper })
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

const wrapper = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

function apiHeader() {
  return {
    ...BASE_HEADERS,
    Accept: 'application/json, text/plain, */*',
    Authorization: `Bearer ${mockBrowserSession().accessToken}`,
  }
}
