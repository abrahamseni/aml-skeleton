import { useMutation } from 'react-query'
import axios from '../../axios/axios'
import { URLS } from '../../constants/api'
import { CreateIdentityCheckModel } from '@reapit/foundations-ts-definitions'

type CreateIdentityCheckParams = CreateIdentityCheckModel

export const createIdentityCheck = async (params: CreateIdentityCheckParams) => {
  await axios.post(`${URLS.ID_CHECKS}`, params)
}

export const useCreateIdentityCheck = () => {
  const result = useMutation((params: CreateIdentityCheckParams) => {
    return createIdentityCheck(params)
  })
  return {
    ...result,
    createIdentityCheck: result.mutateAsync,
  }
}
