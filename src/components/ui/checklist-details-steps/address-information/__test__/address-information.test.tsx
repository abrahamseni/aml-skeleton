import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { CONTACT_MOCK_DATA_1, CONTACT_MOCK_DATA_2 } from '../../../../../platform-api/__mocks__/contact-api.mock'
import AddressInformation from '../address-information'
import { formFields } from '../form-schema'
import AxiosMockAdapter from 'axios-mock-adapter'
import Axios from '../../../../../axios/axios'
import { URLS } from '../../../../../constants/api'
import { wait } from 'utils/test'
import { error, success } from 'utils/mocks/useSnack'

const axiosMock = new AxiosMockAdapter(Axios, {
  onNoMatch: 'throwException',
})

const {
  buildingNameField: primaryBuildingNameField,
  documentTypeField: primaryDocumentTypeField,
  documentImageField: primaryDocumentImageField,
} = formFields('primaryAddress')
const { buildingNameField: secondaryBuildingNameField } = formFields('secondaryAddress')

type AddressInformationProps = React.ComponentPropsWithRef<typeof AddressInformation>

jest.mock('react-pdf/dist/esm/entry.webpack', () => {
  return {
    __esModule: true,
    Document: () => null,
    Page: () => null,
  }
})

jest.mock('@reapit/elements', () => jest.requireActual('utils/mocks/reapit-element-mocks'))

jest.unmock('@reapit/connect-session')
jest.mock('../../../../../core/connect-session')

describe('Address Information Component', () => {
  beforeEach(() => {
    axiosMock.reset()
    jest.clearAllMocks()
  })

  it('should match a snapshot', () => {
    expect(renderComponent(defaultAddressInformationProps)).toMatchSnapshot()
  })

  it('field on the form should able to assert with initial value', () => {
    const { getByTestId: getByTestIdAssertOne, unmount: unmountAssertOne } =
      renderComponent(defaultAddressInformationProps)
    const testBuildingNameField1 = getByTestIdAssertOne(`test.${primaryBuildingNameField.name}`) as HTMLInputElement

    expect(testBuildingNameField1.value).not.toBeNull()
    expect(testBuildingNameField1.value).toMatch(/qwqd/i)

    unmountAssertOne()

    const { getByTestId: getByTestIdAssertTwo, unmount: unmountAssertTwo } = renderComponent(
      defaultAddressInformationProps,
      'v2',
    )

    const testBuildingNameField2 = getByTestIdAssertTwo(`test.${primaryBuildingNameField.name}`) as HTMLInputElement

    expect(testBuildingNameField2.value).not.toMatch(/qwqd/i)
    expect(testBuildingNameField2.value).not.toBeNull()
    expect(testBuildingNameField2.value).toMatch(/Primary Address Building Name Test 2/i)

    unmountAssertTwo()
  })

  it('should render exactly 11 field (when secondary address is null)', () => {
    const { container, getByTestId } = renderComponent(defaultAddressInformationProps)

    const totalTextFields = container.querySelectorAll<HTMLInputElement>('[type="text"]')
    const totalOptionFields = getByTestId('option.field.wrapper').childNodes.length

    expect(totalTextFields.length).toEqual(7)
    expect(totalOptionFields).toEqual(4)
    expect(totalTextFields.length + totalOptionFields).toEqual(11)
  })

  it('should able to click "less than 3 years?" button, then the fields should extend the form', () => {
    const { getByTestId, container, getAllByTestId } = renderComponent(defaultAddressInformationProps)

    const togglerButton = getByTestId('toggler.extend.form')

    expect(togglerButton.textContent).toMatch(/Less than 3 Years ?/)

    const beforeTotalTextFields = container.querySelectorAll('[type="text"]').length // true
    let beforeTotalOptionFields = 0 // total option field

    getAllByTestId('option.field.wrapper').forEach((v) => (beforeTotalOptionFields += v.childNodes.length))

    expect(beforeTotalTextFields + beforeTotalOptionFields).toEqual(11)

    // user click button for the first time
    fireEvent.click(togglerButton)

    const afterTotalTextFields = container.querySelectorAll('[type="text"]').length // true
    let afterTotalOptionFields = 0 // total option field

    getAllByTestId('option.field.wrapper').forEach((v) => (afterTotalOptionFields += v.childNodes.length))

    expect(afterTotalTextFields + afterTotalOptionFields).toEqual(22)

    // user click button again
    fireEvent.click(togglerButton)

    const afterTwiceTotalTextFields = container.querySelectorAll('[type="text"]').length // true
    let afterTwiceTotalOptionFields = 0 // total option field
    getAllByTestId('option.field.wrapper').forEach((v) => (afterTwiceTotalOptionFields += v.childNodes.length))

    expect(afterTwiceTotalTextFields + afterTwiceTotalOptionFields).toEqual(11)
  })

  it('the form should automatically extend "the secondary address section", if the secondaryAddress data is not null', () => {
    const { container, getAllByTestId, getByTestId } = renderComponent(defaultAddressInformationProps, 'v2')

    const totalTextFields = container.querySelectorAll('[type="text"]').length // true
    let totalOptionFields = 0 // total option field

    getAllByTestId('option.field.wrapper').forEach((v) => (totalOptionFields += v.childNodes.length))

    expect(totalTextFields + totalOptionFields).toEqual(22)

    const primaryBuildingNameFields = getByTestId(`test.${primaryBuildingNameField.name}`) as HTMLInputElement
    const secondaryBuildingNameFields = getByTestId(`test.${secondaryBuildingNameField.name}`) as HTMLInputElement

    expect(primaryBuildingNameFields.value).toMatch(/Primary Address Building Name Test 2/i)
    expect(secondaryBuildingNameFields.value).toMatch(/Secondary Address Building Name Test 2/i)
  })

  it('at first, submit button should not able to tap', async () => {
    const { getByTestId } = renderComponent(defaultAddressInformationProps)

    const submitButton = getByTestId('save-form')

    axiosMock.onPatch(`${URLS.CONTACTS}/${CONTACT_MOCK_DATA_1.id}`).reply(204)
    fireEvent.click(submitButton)

    await wait(0)

    expect(axiosMock.history.patch[0].url).toEqual('/contacts/MLK16000071')
    expect(success).toBeCalledTimes(1)
    expect(success.mock.calls[0][0]).toMatch(/Successfully update address data/i)
  })

  it('show error notification if request is cancelled or error', async () => {
    const { getByTestId } = renderComponent(defaultAddressInformationProps)

    const submitButton = getByTestId('save-form')

    axiosMock.onPatch(`${URLS.CONTACTS}/${CONTACT_MOCK_DATA_1.id}`).reply(500)

    fireEvent.click(submitButton)

    await wait(0)

    expect(axiosMock.history.patch[0].url).toEqual('/contacts/MLK16000071')
    expect(error).toBeCalledTimes(1)
    expect(error.mock.calls[0][0]).toMatch(/Something is not working, try to reload your browser/i)
  })

  it('should able to change the field value', () => {
    const { getByTestId } = renderComponent(defaultAddressInformationProps, 'v2')

    // text input
    const buildingNameField = getByTestId(`test.${primaryBuildingNameField.name}`) as HTMLInputElement
    expect(buildingNameField.value).toMatch(/Primary Address Building Name Test 2/i)

    fireEvent.change(buildingNameField, { target: { value: 'Primary Address Building Name Test 3' } })

    expect(buildingNameField.value).toMatch(/Primary Address Building Name Test 3/i)

    // select input
    const documentTypeField = getByTestId(`test.${primaryDocumentTypeField.name}`) as HTMLSelectElement
    expect(documentTypeField.value).toMatch(/Mortgage Statement or Mortgage Redemption Statement/i)

    fireEvent.change(documentTypeField, { target: { value: 'Current Council Tax Bill' } })

    expect(documentTypeField.value).toMatch(/Current Council Tax Bill/i)
  })

  it('should show document model if user tap "eye" button', () => {
    const { getByTestId } = renderComponent(defaultAddressInformationProps)
    const fileInput = getByTestId(`test.${primaryDocumentImageField.name}`) as HTMLInputElement
    expect(fileInput.value).not.toBeUndefined()
  })
})

const defaultAddressInformationProps: AddressInformationProps = {
  userData: CONTACT_MOCK_DATA_1,
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

const renderComponent = (props: AddressInformationProps, typeMock: 'v1' | 'v2' = 'v1') => {
  const SELECTED_MOCK_TYPE = typeMock === 'v1' ? CONTACT_MOCK_DATA_1 : CONTACT_MOCK_DATA_2

  axiosMock
    .onGet(`${window.reapit.config.platformApiUrl}${URLS.CONTACTS}/${SELECTED_MOCK_TYPE.id}`)
    .reply(200, SELECTED_MOCK_TYPE)

  return render(
    <QueryClientProvider client={queryClient}>
      <AddressInformation {...props} userData={SELECTED_MOCK_TYPE} />
    </QueryClientProvider>,
  )
}
