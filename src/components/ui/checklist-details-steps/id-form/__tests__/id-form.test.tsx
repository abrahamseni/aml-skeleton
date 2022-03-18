import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import IdForm, { IdFormProps } from '../id-form'
import userEvent from '@testing-library/user-event'
import { formFields } from '../form-schema/form-field'
import { QueryClient, QueryClientProvider } from 'react-query'
import axios from 'axios/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { identityDocumentTypes } from '../__mocks__/identity-document-types'
import { URLS } from 'constants/api'
import { wait } from 'utils/test'

const axiosMock = new AxiosMockAdapter(axios)

jest.unmock('@reapit/connect-session')
jest.mock('core/connect-session')
jest.mock('react-pdf/dist/esm/entry.webpack', () => {
  return {
    __esModule: true,
    Document: () => null,
    Page: () => null,
  }
})

describe('id form', () => {
  beforeEach(() => {
    axiosMock.reset()
    jest.clearAllMocks()
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

  test('error message from validation is correct', async () => {
    setup()

    await wait(0)

    const saveButton = await screen.findByTestId('saveButton')
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

    const saveButton = await screen.findByTestId('saveButton')
    userEvent.click(saveButton)

    await wait(0)

    expect(onSave).toBeCalledTimes(1)
    expect(onSave.mock.calls[0]).toEqual([expectedValue])
  })

  test('can go to next', async () => {
    const onNext = jest.fn()
    setup({
      onNext: onNext,
    })

    await wait(0)

    const expectedValue = await fillFormWithValidValue()

    const nextButton = await screen.findByTestId('nextButton')
    userEvent.click(nextButton)

    await wait(0)

    expect(onNext).toBeCalledTimes(1)
    expect(onNext.mock.calls[0]).toEqual([expectedValue])
  })

  test('can go to previous', async () => {
    const onPrevious = jest.fn()
    setup({
      onPrevious: onPrevious,
    })

    await wait(0)

    const previousButton = await screen.findByTestId('previousButton')
    userEvent.click(previousButton)

    await wait(0)

    expect(onPrevious).toBeCalledTimes(1)
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
    setup({
      rpsRef: rpsRef,
    })

    await wait(0)

    const rpsRetTextEl = await screen.findByTestId('rpsRefText')

    expect(rpsRetTextEl.textContent).toBe(rpsRef)
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