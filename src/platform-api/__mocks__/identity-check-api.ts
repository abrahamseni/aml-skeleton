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
  return { createIdentityCheck }
}

export const updateIdentityCheck = jest.fn()

export const useUpdateIdentityCheck = () => {
  return { updateIdentityCheck }
}
