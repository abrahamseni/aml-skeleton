const actualFetchSingleIdentityCheckByContactId = jest.requireActual(
  'platform-api/identity-check-api',
).fetchSingleIdentityCheckByContactId

export const fetchSingleIdentityCheckByContactId = jest.fn(actualFetchSingleIdentityCheckByContactId)

export const useFetchSingleIdentityCheckByContactId = (id: string) => {
  return {
    data: fetchSingleIdentityCheckByContactId(id),
    isFetching: false,
    refetch: () => {},
  }
}

export const createIdentityCheck = jest.fn()

export const useCreateIdentityCheck = () => {
  return (params: any) => createIdentityCheck(null, params)
}

export const updateIdentityCheck = jest.fn()

export const useUpdateIdentityCheck = () => {
  return (params: any) => updateIdentityCheck(null, params)
}
