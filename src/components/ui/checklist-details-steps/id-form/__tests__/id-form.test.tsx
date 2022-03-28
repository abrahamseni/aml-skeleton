import React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'
import IdForm, { IdFormProps } from '../id-form'
import userEvent from '@testing-library/user-event'
import { formFields } from '../form-schema/form-field'
import { QueryClient, QueryClientProvider } from 'react-query'
import axios from 'axios/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { identityDocumentTypes } from '../__mocks__/identity-document-types'
import { URLS } from 'constants/api'
import { wait } from 'utils/test'
import DocumentPreviewModal, { DocumentPreviewModalProps } from 'components/ui/ui/document-preview-modal'
import { downloadDocument as downloadDocumentMock } from 'platform-api/document-api'
import propsRepo from 'utils/mocks/props-repo'

const axiosMock = new AxiosMockAdapter(axios)

jest.unmock('@reapit/connect-session')
jest.mock('core/connect-session')
jest.mock('components/ui/ui/document-preview-modal', () => {
  const DocumentPreviewModal = jest.requireActual('components/ui/ui/document-preview-modal')
  const DocumentPreviewModalMock = jest.fn(() => <></>)
  return {
    __esModule: true,
    ...DocumentPreviewModal,
    DocumentPreviewModal: DocumentPreviewModalMock,
    default: DocumentPreviewModalMock,
  }
})
jest.mock('platform-api/document-api')
jest.mock('@reapit/elements', () => jest.requireActual('utils/mocks/reapit-element-mocks'))

const downloadDocument: jest.Mock = downloadDocumentMock as any

describe('id form', () => {
  beforeEach(() => {
    axiosMock.reset()
    jest.clearAllMocks()
    propsRepo.clear()
  })

  test('can set default values', async () => {
    const defaultValues = {
      idType: 'DL',
      idReference: 'idReference',
      expiryDate: '2021-10-24',
      documentFile: 'data:documentFile',
    }
    setup({
      defaultValues,
    })

    await wait(0)

    await assertFormValues(defaultValues)
  })

  test('do not save if form is invalid', async () => {
    const defaultValues = {
      idType: '',
      idReference: '',
      expiryDate: '',
      documentFile: '',
    }
    const onSave = jest.fn()
    setup({
      defaultValues,
      onSave,
    })

    await wait(0)

    const saveButton = await screen.findByTestId('save-form')
    userEvent.click(saveButton)

    await wait(0)

    expect(onSave).toBeCalledTimes(0)
  })

  test('error message from validation is correct', async () => {
    setup()

    await wait(0)

    const saveButton = await screen.findByTestId('save-form')
    userEvent.click(saveButton)

    await wait(0)

    await assertErrorMessages({
      idType: 'Required',
      idReference: 'Required',
      expiryDate: 'Required',
      documentFile: 'Required',
    })
  })

  test('can save', async () => {
    const onSave = jest.fn()
    setup({
      onSave: onSave,
    })

    await wait(0)

    const expectedValue = await fillFormWithValidValue()

    const saveButton = await screen.findByTestId('save-form')
    userEvent.click(saveButton)

    await wait(0)

    expect(onSave).toBeCalledTimes(1)
    expect(onSave.mock.calls[0]).toEqual([expectedValue])
  })

  test('can show document preview from data url', async () => {
    const defaultValues = {
      idType: '',
      idReference: '',
      expiryDate: '',
      documentFile: 'data:application/pdf,documentFile',
    }
    setup({
      defaultValues,
    })

    const props = propsRepo.props['input.documentFile']

    await act(async () => {
      await props.onFileView(defaultValues.documentFile)
    })

    const { src, isOpen } = getDocumentPreviewModalProps()

    expect(src).toBe('data:application/pdf,documentFile')
    expect(isOpen).toBe(true)
  })

  test('can show document preview from document id', async () => {
    const documentId = 'RPT20000039'

    const expectedFilename = 'documentFile.pdf'
    const blobUrl = 'blob:http://example.com/123'
    downloadDocument.mockReturnValueOnce(
      Promise.resolve({
        filename: expectedFilename,
        url: blobUrl,
      }),
    )

    const defaultValues = {
      idType: '',
      idReference: '',
      expiryDate: '',
      documentFile: documentId,
    }
    setup({
      defaultValues,
    })

    const props = propsRepo.props['input.documentFile']

    await act(async () => {
      await props.onFileView(defaultValues.documentFile)
    })

    const { src, filename, isOpen } = getDocumentPreviewModalProps()

    expect(src).toBe(blobUrl)
    expect(filename).toBe(expectedFilename)
    expect(isOpen).toBe(true)
  })

  test('can show notice text', async () => {
    const noticeText = 'this is notice text'
    setup({
      noticeText: noticeText,
    })

    await wait(0)

    const noticeTextEl = await screen.findByTestId('noticeText')

    const expectedText = '*' + noticeText
    expect(noticeTextEl.textContent).toBe(expectedText)
  })

  test('can show RPS Ref', async () => {
    const rpsRef = '123456'
    const expectedText = `RPS Ref: ${rpsRef}`
    setup({
      rpsRef: rpsRef,
    })

    await wait(0)

    const rpsRetTextEl = await screen.findByText(expectedText)

    expect(rpsRetTextEl.textContent).toBe(expectedText)
  })
})

async function fillFormWithValidValue() {
  const documentDataUrl = await createDataUrl('this is document')
  const validValues = {
    idType: 'DL',
    idReference: 'Hello Refa',
    expiryDate: '2021-10-24',
    documentFile: documentDataUrl,
  }

  await fillForm({
    [formFields.idType.name]: selectValue(validValues.idType),
    [formFields.idReference.name]: validValues.idReference,
    [formFields.expiryDate.name]: validValues.expiryDate,
    [formFields.documentFile.name]: fileValue(validValues.documentFile),
  })

  return validValues
}

function setup(props: Props = {}) {
  axiosMock
    .onGet(`${window.reapit.config.platformApiUrl}${URLS.CONFIGURATION_DOCUMENT_TYPES}`)
    .reply(200, identityDocumentTypes)
  renderIdForm(props)
}

function getDocumentPreviewModalProps(): DocumentPreviewModalProps {
  const DocumentPreviewModalMock: jest.Mock = DocumentPreviewModal as any
  return DocumentPreviewModalMock.mock.calls.slice(-1)[0][0]
}

async function createDataUrl(content: string): Promise<string> {
  return await convertToDataUrl(new File([content], 'file', { type: 'image/png' }))
}

async function convertToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

type Props = Partial<IdFormProps>

function renderIdForm({ onSave, ...rest }: Props = {}) {
  queryClient.clear()

  const theOnSave = onSave || (() => {})
  return render(
    <QueryClientProvider client={queryClient}>
      <IdForm idDocTypes={identityDocumentTypes} onSave={theOnSave} {...rest} />
    </QueryClientProvider>,
  )
}

async function assertFormValues(values: { [name: string]: string }, getName?: (name: string) => string) {
  const defaultGetName = (name: string) => `input.${name}`
  getName = getName || defaultGetName

  for (const [name, value] of Object.entries<any>(values)) {
    const messageEl: HTMLInputElement = await screen.findByTestId(getName(name))
    expect(messageEl.value, `incorrect value for input "${name}"`).toBe(value)
  }
}

async function assertErrorMessages(values: { [name: string]: string }, getName?: (name: string) => string) {
  const defaultGetName = (name: string) => `error.${name}`
  getName = getName || defaultGetName

  for (const [name, value] of Object.entries<any>(values)) {
    const messageEl = await screen.findByTestId(getName(name))
    expect(messageEl.textContent, `incorrect validation message for input "${name}"`).toBe(value)
  }
}

async function fillForm(values: any, getName?: (name: string) => string) {
  const defaultGetName = (name: string) => `input.${name}`
  getName = getName || defaultGetName

  for (const [name, value] of Object.entries<any>(values)) {
    let val = value
    let type = undefined
    if (typeof value !== 'string') {
      val = value.value
      type = value.type
    }

    const inputEl = await screen.findByTestId(getName(name))
    if (type === 'select') {
      userEvent.selectOptions(inputEl, val)
    } else if (type === 'file') {
      fireEvent.change(inputEl, { target: { value: val } })
    } else {
      userEvent.type(inputEl, val)
    }
  }
}

function selectValue(value: string) {
  return {
    type: 'select',
    value: value,
  }
}

function fileValue(value: string) {
  return {
    type: 'file',
    value: value,
  }
}
