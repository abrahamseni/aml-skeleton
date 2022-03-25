import React from 'react'
import { act, render } from '@testing-library/react'
import * as identityCheckAction from '../id-form/identity-check-action'
import { getSaveIdentityDocument } from '../id-form/__mocks__/identity-check-action'
import SecondaryId, { SecondaryIdProps } from '../secondary-id'
import IdForm, { IdFormProps } from '../id-form/id-form'
import { QueryClient, QueryClientProvider } from 'react-query'
import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { identityDocumentTypes } from '../id-form/__mocks__/identity-document-types'
import { URLS } from '../../../../constants/api'
import '@alex_neo/jest-expect-message'
import { success, error } from 'utils/mocks/useSnack'

const saveIdentityDocument = getSaveIdentityDocument(identityCheckAction)

jest.mock('../id-form/id-form', () => {
  const IdForm = jest.requireActual('../id-form/id-form')
  const IdFormMock = jest.fn(() => <></>)
  return {
    __esModule: true,
    ...IdForm,
    IdForm: IdFormMock,
    default: IdFormMock,
  }
})

const axiosMock = new AxiosMockAdapter(axios)

jest.mock('../id-form/identity-check-action')
jest.mock('../../../../core/connect-session')
jest.mock('@reapit/elements', () => jest.requireActual('utils/mocks/reapit-element-mocks'))

describe('secondary id', () => {
  beforeEach(() => {
    axiosMock.reset()
    jest.clearAllMocks()
  })

  test('can set default values', async () => {
    const expectedDefaultValues = {
      idType: 'DL',
      idReference: 'Hello',
      expiryDate: '',
      documentFile: 'MKT22000005',
    }
    setup({
      idCheck: {
        identityDocument1: {
          typeId: 'typeId',
          details: 'details',
          expiry: 'expiry',
          documentId: 'documentId',
        },
        identityDocument2: {
          typeId: expectedDefaultValues['idType'],
          details: expectedDefaultValues['idReference'],
          expiry: expectedDefaultValues['expiryDate'],
          documentId: expectedDefaultValues['documentFile'],
        },
      },
    })

    const { defaultValues } = getIdFormProps()

    expect(defaultValues).toEqual(expectedDefaultValues)
  })

  test('exclude id type option that has been selected by primary id form', async () => {
    setup({
      idCheck: {
        identityDocument1: {
          typeId: 'C',
          details: '',
          expiry: '',
          documentId: '',
        },
        identityDocument2: {
          typeId: '',
          details: '',
          expiry: '',
          documentId: '',
        },
      },
      idDocTypes: [
        {
          id: 'A',
          value: 'A val',
        },
        {
          id: 'B',
          value: 'B val',
        },
        {
          id: 'C',
          value: 'C val',
        },
      ],
    })

    const { idDocTypes } = getIdFormProps()

    expect(idDocTypes).toEqual([
      {
        id: 'A',
        value: 'A val',
      },
      {
        id: 'B',
        value: 'B val',
      },
    ])
  })

  test('can show RPS Ref', async () => {
    const expectedRpsRef = 'c123'
    setup({
      contact: {
        id: expectedRpsRef,
      },
    })

    const { rpsRef } = getIdFormProps()

    expect(rpsRef).toEqual(expectedRpsRef)
  })

  test('can save', async () => {
    setup()

    const expectedValue = {
      idType: 'DL',
      idReference: 'Hello Refa',
      expiryDate: '2021-10-24',
      documentFile: 'this is document',
    }

    const { onSave } = getIdFormProps()

    await act(async () => {
      onSave(expectedValue)
    })

    expect(saveIdentityDocument).toBeCalledTimes(1)
    expect(saveIdentityDocument.mock.calls[0][0]).toEqual({ id: 'c123' })
    expect(saveIdentityDocument.mock.calls[0][1]).toEqual(undefined)
    expect(saveIdentityDocument.mock.calls[0][2]).toEqual(expectedValue)

    saveIdentityDocument.mock.calls[0][3].onSuccess()
    expect(success).toBeCalledTimes(1)
    expect(success.mock.calls[0][0]).toBe('Successfully update secondary id')
  })

  test('show error notification when failed to save', async () => {
    setup()

    const expectedValue = {
      idType: 'DL',
      idReference: 'Hello Refa',
      expiryDate: '2021-10-24',
      documentFile: 'this is document',
    }

    const { onSave } = getIdFormProps()

    await act(async () => {
      onSave(expectedValue)
    })

    expect(saveIdentityDocument).toBeCalledTimes(1)

    saveIdentityDocument.mock.calls[0][3].onError()
    expect(error).toBeCalledTimes(1)
    expect(error.mock.calls[0][0]).toBe('Cannot update secondary id, try to reload your browser')
  })

  test('form is disabled when primary id form is not completed', async () => {
    setup({ idCheck: undefined })

    const { noticeText, disabled } = getIdFormProps()

    expect(noticeText).toBe('Please ensure the Primary ID has been completed before adding a Secondary ID')
    expect(disabled).toBe(true)
  })
})

function getIdFormProps(): IdFormProps {
  const IdFormMock: jest.Mock = IdForm as any
  return IdFormMock.mock.calls.slice(-1)[0][0]
}

function setup(props: Props = {}) {
  axiosMock
    .onGet(`${window.reapit.config.platformApiUrl}${URLS.CONFIGURATION_DOCUMENT_TYPES}`)
    .reply(200, identityDocumentTypes)
  renderSecondaryId(props)
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

type Props = Partial<SecondaryIdProps>

function renderSecondaryId({ contact, ...rest }: Props = {}) {
  queryClient.clear()

  const aContact = contact || { id: 'c123' }
  return render(
    <QueryClientProvider client={queryClient}>
      <SecondaryId contact={aContact} {...rest} />
    </QueryClientProvider>,
  )
}
