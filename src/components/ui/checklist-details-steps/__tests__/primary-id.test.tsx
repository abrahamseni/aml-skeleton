import React from 'react'
import { act, render } from '@testing-library/react'
import * as identityCheckAction from '../id-form/identity-check-action'
import { getSaveIdentityDocument } from '../id-form/__mocks__/identity-check-action'
import PrimaryId, { PrimaryIdProps } from '../primary-id'
import IdForm, { IdFormProps } from '../id-form/id-form'
import { QueryClient, QueryClientProvider } from 'react-query'
import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { identityDocumentTypes } from '../id-form/__mocks__'
import { URLS } from '../../../../constants/api'
import '@alex_neo/jest-expect-message'

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
jest.mock('react-pdf/dist/esm/entry.webpack', () => {
  return {
    __esModule: true,
    Document: () => null,
    Page: () => null,
  }
})

describe('primary id', () => {
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
    expect(saveIdentityDocument.mock.calls[0]).toEqual([{ id: 'c123' }, undefined, expectedValue])
  })

  test('can go to next', async () => {
    setup()

    const expectedValue = {
      idType: 'DL',
      idReference: 'Hello Refa',
      expiryDate: '2021-10-24',
      documentFile: 'this is document',
    }

    const { onNext } = getIdFormProps()

    await act(async () => {
      onNext!(expectedValue)
    })

    expect(saveIdentityDocument).toBeCalledTimes(1)
    expect(saveIdentityDocument.mock.calls[0]).toEqual([{ id: 'c123' }, undefined, expectedValue])
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
  renderPrimaryId(props)
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

type Props = Partial<PrimaryIdProps>

function renderPrimaryId({ contact, ...rest }: Props = {}) {
  queryClient.clear()

  const aContact = contact || { id: 'c123' }
  return render(
    <QueryClientProvider client={queryClient}>
      <PrimaryId contact={aContact} {...rest} />
    </QueryClientProvider>,
  )
}
