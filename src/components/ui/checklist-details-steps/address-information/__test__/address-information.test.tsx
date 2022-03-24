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
import DocumentPreviewModal, { DocumentPreviewModalProps } from 'components/ui/ui/document-preview-modal'

const axiosMock = new AxiosMockAdapter(Axios, {
  onNoMatch: 'throwException',
})

type AddressInformationProps = React.ComponentPropsWithRef<typeof AddressInformation>

jest.unmock('@reapit/connect-session')
jest.mock('react-pdf/dist/esm/entry.webpack', () => {
  return {
    __esModule: true,
    Document: () => null,
    Page: () => null,
  }
})
jest.mock('@reapit/elements', () => jest.requireActual('utils/mocks/reapit-element-mocks'))
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

const { buildingNameField: primaryBuildingNameField, documentTypeField: primaryDocumentTypeField } =
  formFields('primaryAddress')
const { buildingNameField: secondaryBuildingNameField } = formFields('secondaryAddress')

describe('Address Information Component', () => {
  beforeEach(() => {
    axiosMock.reset()
    jest.clearAllMocks()
  })

  describe('Snapshot', () => {
    it('should match a snapshot', () => {
      expect(renderComponent(defaultAddressInformationProps)).toMatchSnapshot()
    })
  })

  describe('DOM', () => {
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

      const beforeTotalTextFields = container.querySelectorAll<HTMLInputElement>('[type="text"]').length // true
      const beforeTotalOptionFields = getAllByTestId('option.field.wrapper').reduce(
        (c, v) => c + v.childNodes.length,
        0,
      ) as number

      expect(beforeTotalTextFields + beforeTotalOptionFields).toEqual(11)

      // user click button for the first time
      fireEvent.click(togglerButton)

      const afterTotalTextFields = container.querySelectorAll('[type="text"]').length // true
      const afterTotalOptionFields = getAllByTestId('option.field.wrapper').reduce(
        (c, v) => c + v.childNodes.length,
        0,
      ) as number

      expect(afterTotalTextFields + afterTotalOptionFields).toEqual(22)

      // user click button again
      fireEvent.click(togglerButton)

      const afterTwiceTotalTextFields = container.querySelectorAll('[type="text"]').length // true
      const afterTwiceTotalOptionFields = getAllByTestId('option.field.wrapper').reduce(
        (c, v) => c + v.childNodes.length,
        0,
      ) as number

      expect(afterTwiceTotalTextFields + afterTwiceTotalOptionFields).toEqual(11)
    })

    it('the form should automatically extend "the secondary address section", if the secondaryAddress data is not null', () => {
      const { container, getAllByTestId, getByTestId } = renderComponent(defaultAddressInformationProps, 'v2')

      const totalTextFields = container.querySelectorAll('[type="text"]').length // true
      const totalOptionFields = getAllByTestId('option.field.wrapper').reduce(
        (c, v) => c + v.childNodes.length,
        0,
      ) as number

      expect(totalTextFields + totalOptionFields).toEqual(22)

      const primaryBuildingNameFields = getByTestId(`test.${primaryBuildingNameField.name}`) as HTMLInputElement
      const secondaryBuildingNameFields = getByTestId(`test.${secondaryBuildingNameField.name}`) as HTMLInputElement

      expect(primaryBuildingNameFields.value).toMatch(/Primary Address Building Name Test 2/i)
      expect(secondaryBuildingNameFields.value).toMatch(/Secondary Address Building Name Test 2/i)
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

    it('should show "error message" when required field is empty', async () => {
      const { getByTestId } = renderComponent(defaultAddressInformationProps)

      // post code
      const postCodePrimaryField = getByTestId('test.primaryAddress.postcode') as HTMLInputElement
      expect(postCodePrimaryField.value).not.toEqual('')

      fireEvent.change(postCodePrimaryField, { target: { value: '' } })
      await wait(0)
      fireEvent.blur(postCodePrimaryField)
      await wait(0)

      const postCodePrimaryFieldErrorMessage = getByTestId('test.error.primaryAddress.postcode')
      expect(postCodePrimaryFieldErrorMessage).not.toBeUndefined()
      expect(postCodePrimaryFieldErrorMessage.textContent).toMatch(/required/i)

      // line 1
      const line1PrimaryField = getByTestId('test.primaryAddress.line1') as HTMLInputElement
      expect(line1PrimaryField.value).toMatch(/Chichester Way/i)

      fireEvent.change(line1PrimaryField, { target: { value: '' } })
      await wait(0)
      fireEvent.blur(line1PrimaryField)
      await wait(0)

      const line1PrimaryFieldErrorMessage = getByTestId('test.error.primaryAddress.line1') as HTMLParagraphElement
      expect(line1PrimaryFieldErrorMessage).not.toBeUndefined()
      expect(line1PrimaryFieldErrorMessage.textContent).toMatch(/required/i)

      // line 3
      const line3PrimaryField = getByTestId('test.primaryAddress.line3') as HTMLInputElement
      expect(line3PrimaryField.value).toMatch(/Hertfordshire/i)

      fireEvent.change(line3PrimaryField, { target: { value: '' } })
      await wait(0)
      fireEvent.blur(line3PrimaryField)
      await wait(0)

      const line3PrimaryFieldErrorMessage = getByTestId('test.error.primaryAddress.line3') as HTMLParagraphElement
      expect(line3PrimaryFieldErrorMessage).not.toBeUndefined()
      expect(line3PrimaryFieldErrorMessage.textContent).toMatch(/required/i)

      // document primary address
      const documentFilePrimaryField = getByTestId('test.metadata.primaryAddress.documentType') as HTMLInputElement
      expect(documentFilePrimaryField.value).toMatch(/Mortgage Statement or Mortgage Redemption Statement/i)

      fireEvent.change(documentFilePrimaryField, { target: { value: '' } })
      await wait(0)
      fireEvent.blur(documentFilePrimaryField)
      await wait(0)

      const documentFilePrimaryFieldErrorMessage = getByTestId(
        'test.error.metadata.primaryAddress.documentType',
      ) as HTMLParagraphElement
      expect(documentFilePrimaryFieldErrorMessage).not.toBeUndefined()
      expect(documentFilePrimaryFieldErrorMessage.textContent).toMatch(/required/i)
    })

    it.todo('should not show "error message" when not required field is empty')

    it.todo('should show "message" when some of field have more than set max value')

    it('should not able to tap "save" button, when required file is empty', async () => {
      const { getByTestId } = renderComponent(defaultAddressInformationProps)

      // post code
      const postCodePrimaryField = getByTestId('test.primaryAddress.postcode') as HTMLInputElement
      expect(postCodePrimaryField.value).toMatch(/WD25 9TY/i)

      fireEvent.change(postCodePrimaryField, { target: { value: '' } })
      await wait(0)
      fireEvent.blur(postCodePrimaryField)
      await wait(0)

      const postCodePrimaryFieldErrorMessage = getByTestId('test.error.primaryAddress.postcode') as HTMLParagraphElement
      expect(postCodePrimaryFieldErrorMessage).not.toBeUndefined()
      expect(postCodePrimaryFieldErrorMessage.textContent).toMatch(/required/i)

      const saveButton = getByTestId('save-form')
      expect(saveButton.getAttribute('disabled')).not.toBeUndefined()
    })

    it('should show document model if user tap "eye" button', async () => {
      const { getByTestId } = renderComponent(defaultAddressInformationProps, 'v2')

      // primary address file input
      const eyeDocumentFilePrimary = getByTestId('test.metadata.primaryAddress.documentImage').nextElementSibling
        ?.childNodes[0] as HTMLSpanElement

      fireEvent.click(eyeDocumentFilePrimary)
      await wait(0)

      const { isOpen: DocumentFilePrimaryIsOpen } = getDocumentPreviewModalProps('primaryAddress')
      expect(DocumentFilePrimaryIsOpen).toBeTruthy()

      // secondary address file input
      const eyeDocumentFileSecondary = getByTestId('test.metadata.secondaryAddress.documentImage').nextElementSibling
        ?.childNodes[0] as HTMLSpanElement as HTMLSpanElement

      fireEvent.click(eyeDocumentFileSecondary)
      await wait(0)

      const { isOpen: DocumentFileSecondaryIsOpen } = getDocumentPreviewModalProps('secondaryAddress')
      expect(DocumentFileSecondaryIsOpen).toBeTruthy()
    })
  })

  describe('Integration', () => {
    it('at first, submit button should not able to tap', async () => {
      const { getByTestId } = renderComponent(defaultAddressInformationProps)

      const submitButton = getByTestId('save-form')

      axiosMock.onPatch(`${URLS.CONTACTS}/${CONTACT_MOCK_DATA_1.id}`).reply(204)
      fireEvent.click(submitButton)

      await wait(0)

      expect(axiosMock.history.patch[0].url).toEqual('/contacts/MLK16000071')
      expect(success).toBeCalledTimes(1)
      expect(success.mock.calls[0][0]).toMatch(/Successfully update Address Information data/i)
    })

    it('will show error notification, when user network is error', async () => {
      const { getByTestId } = renderComponent(defaultAddressInformationProps)

      const submitButton = getByTestId('save-form')

      axiosMock.onPatch(`${URLS.CONTACTS}/${CONTACT_MOCK_DATA_1.id}`).networkError()
      fireEvent.click(submitButton)

      await wait(0)

      expect(axiosMock.history.patch[0].url).toEqual('/contacts/MLK16000071')
      expect(error).toBeCalledTimes(1)
      expect(error.mock.calls[0][0]).toMatch(/Failed to submit Declaration Risk Management form/i)
    })

    it.todo('will show error notification, when failed to upload file Image')
    it.todo('will show error notification, when failed to update contact data')
  })
})

const getDocumentPreviewModalProps = (type: 'primaryAddress' | 'secondaryAddress'): DocumentPreviewModalProps => {
  const DocumentPreviewModalMock: jest.Mock = DocumentPreviewModal as any

  switch (type) {
    case 'primaryAddress':
      return DocumentPreviewModalMock.mock.calls[2][0]
    case 'secondaryAddress':
      return DocumentPreviewModalMock.mock.calls[3][0]
  }
}

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
