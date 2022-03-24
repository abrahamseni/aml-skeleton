import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import Axios from 'axios/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { URLS } from 'constants/api'
import { QueryClient, QueryClientProvider } from 'react-query'
import { formField } from '../form-schema'
import DeclarationRiskManagement from '../declaration-risk-management'
import { wait } from 'utils/test'
import { error, success } from 'utils/mocks/useSnack'
import { CONTACT_MOCK_DATA_1, CONTACT_MOCK_DATA_2 } from 'platform-api/__mocks__/contact-api.mock'
import DocumentPreviewModal, { DocumentPreviewModalProps } from 'components/ui/ui/document-preview-modal'

const axiosMock = new AxiosMockAdapter(Axios, {
  onNoMatch: 'throwException',
})

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

const { declarationFormField, riskAssessmentFormField, typeField, reasonField } = formField()

describe('Declaration Risk Management Form', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    axiosMock.reset()
  })

  describe('Snapshot', () => {
    it('should match a snapshot', () => {
      expect(renderComponent(defaultDRMProps)).toMatchSnapshot()
    })
  })

  describe('DOM', () => {
    it('should render 4 fields', () => {
      const { getByTestId } = renderComponent(defaultDRMProps)

      const formChildElement = getByTestId('declaration.risk.management.form').childNodes[0].childNodes

      expect(formChildElement.length).toEqual(4)
    })

    it('the fields should able to automatically fill with default value and able to change', () => {
      const { getByTestId } = renderComponent(defaultDRMProps)

      // declaration file
      const testDeclarationFileField = getByTestId(`test.${declarationFormField.name}`) as HTMLInputElement
      expect(testDeclarationFileField.value).toMatch(/urlRiskAssessmentForm.png/i)

      // risk assessment type
      const testTypeField = getByTestId(`test.${typeField.name}`) as HTMLSelectElement
      expect(testTypeField.value).toMatch(/Simplified/i)

      // risk assessment file
      const testAssessmentFormField = getByTestId(`test.${riskAssessmentFormField.name}`) as HTMLInputElement
      expect(testAssessmentFormField.value).toMatch(/urlRiskAssessmentForm.png/i)

      // for reason
      const testReasonField = getByTestId(`test.${reasonField.name}`) as HTMLTextAreaElement
      expect(testReasonField.value).toMatch(/erw23r/i)

      fireEvent.change(testTypeField, { target: { value: 'Enhanced' } })
      expect(testTypeField.value).toMatch(/Enhanced/i)

      fireEvent.change(testReasonField, { target: { value: 'Change Test Reason' } })
      expect(testReasonField.value).toMatch(/Change Test Reason/i)
    })

    it('should display error message if required field is empty', async () => {
      const { getByTestId } = renderComponent(defaultDRMProps)

      // upload declaration file
      const testDeclarationFile = getByTestId('test.declarationForm') as HTMLInputElement
      expect(testDeclarationFile.value).not.toEqual('')

      const testDeclarationFileRemoveButton = testDeclarationFile.nextElementSibling?.childNodes[1] as HTMLSpanElement

      fireEvent.click(testDeclarationFileRemoveButton)
      await wait(0)

      expect(testDeclarationFile.value).toEqual('')

      const declarationFileErrorMessage = getByTestId('test.error.declarationForm') as HTMLParagraphElement
      expect(declarationFileErrorMessage).not.toBeUndefined()
      expect(declarationFileErrorMessage.textContent).toMatch(/required/i)

      // risk assessment type
      const testTypeField = getByTestId('test.type') as HTMLSelectElement
      expect(testTypeField.value).toMatch(/Simplified/i)

      fireEvent.change(testTypeField, { target: { value: '' } })
      await wait(0)
      fireEvent.blur(testTypeField)
      await wait(0)

      const typeFieldErrorMessage = getByTestId('test.error.type')
      expect(typeFieldErrorMessage).not.toBeUndefined
      expect(typeFieldErrorMessage.textContent).toMatch(/Required/i)

      // reason for type
      const testReasonTypeField = getByTestId('test.reason') as HTMLTextAreaElement
      expect(testReasonTypeField.value).toMatch(/erw23r/i)

      fireEvent.change(testReasonTypeField, { target: { value: '' } })
      await wait(0)
      fireEvent.blur(testReasonTypeField)
      await wait(0)

      const testReasonTypeFieldErrorMessage = getByTestId('test.error.reason')
      expect(testReasonTypeFieldErrorMessage).not.toBeUndefined
      expect(testReasonTypeFieldErrorMessage.textContent).toMatch(/Required/i)
    })

    it('should not able to tap "save" button, when required file is empty', async () => {
      const { getByTestId } = renderComponent(defaultDRMProps)

      // save button
      const saveButton = getByTestId('save-form') as HTMLButtonElement
      expect(saveButton.getAttribute('disabled')).not.toBeTruthy()

      // reason for type
      const testReasonTypeField = getByTestId('test.reason') as HTMLTextAreaElement
      expect(testReasonTypeField.value).toMatch(/erw23r/i)

      fireEvent.change(testReasonTypeField, { target: { value: '' } })
      await wait(0)
      fireEvent.blur(testReasonTypeField)
      await wait(0)

      const testReasonTypeFieldErrorMessage = getByTestId('test.error.reason')
      expect(testReasonTypeFieldErrorMessage).not.toBeUndefined
      expect(testReasonTypeFieldErrorMessage.textContent).toMatch(/Required/i)

      expect(saveButton.getAttribute('disabled')).not.toBeUndefined()
    })

    it('should open modal, when user tap "eye" button', async () => {
      const { getByTestId } = renderComponent(defaultDRMProps)

      // declaration file
      const eyeDeclarationFile = getByTestId('test.declarationForm').nextElementSibling
        ?.childNodes[0] as HTMLSpanElement

      fireEvent.click(eyeDeclarationFile)
      await wait(0)

      const { isOpen: DeclarationModalIsOpen } = getDocumentPreviewModalProps('declaration')
      expect(DeclarationModalIsOpen).toBeTruthy()

      // risk assessment file
      const eyeRiskAssessmentFile = getByTestId('test.riskAssessmentForm').nextElementSibling
        ?.childNodes[0] as HTMLSpanElement

      fireEvent.click(eyeRiskAssessmentFile)
      await wait(0)

      const { isOpen: RiskAssessmentModalIsOpen } = getDocumentPreviewModalProps('riskAssessment')
      expect(RiskAssessmentModalIsOpen).toBeTruthy()
    })
  })

  describe('Integration', () => {
    it('should able to click "save button", and return notification if success', async () => {
      const { getByTestId } = renderComponent(defaultDRMProps)

      const submitButton = getByTestId('save-form')

      axiosMock.onPatch(`${URLS.CONTACTS}/${CONTACT_MOCK_DATA_1.id}`).reply(204)
      fireEvent.click(submitButton)
      await wait(0)

      expect(axiosMock.history.patch[0].url).toEqual('/contacts/MLK16000071')
      expect(success).toBeCalledTimes(1)
      expect(success.mock.calls[0][0]).toMatch(/Successfully update declaration risk management/i)
    })

    it('will show error notification, when user network is error', async () => {
      const { getByTestId } = renderComponent(defaultDRMProps)

      const submitButton = getByTestId('save-form')

      axiosMock.onPatch(`${URLS.CONTACTS}/${CONTACT_MOCK_DATA_1.id}`).networkError()
      fireEvent.click(submitButton)
      await wait(0)

      expect(error).toBeCalledTimes(1)
      expect(error.mock.calls[0][0]).toMatch(/Failed to submit Declaration Risk Management form/i)
      expect(axiosMock.history.patch[0].url).toEqual('/contacts/MLK16000071')
    })

    it.todo('will show error notification, when failed to upload file Image')
    it.todo('will show error notification, when failed to update contact data')
  })
})

const getDocumentPreviewModalProps = (type: 'declaration' | 'riskAssessment'): DocumentPreviewModalProps => {
  const DocumentPreviewModalMock: jest.Mock = DocumentPreviewModal as any
  switch (type) {
    case 'declaration':
      return DocumentPreviewModalMock.mock.calls[2][0]
    case 'riskAssessment':
      return DocumentPreviewModalMock.mock.calls[4][0]
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

type DeclarationRiskManagementProps = React.ComponentPropsWithRef<typeof DeclarationRiskManagement>

const defaultDRMProps: DeclarationRiskManagementProps = {
  userData: CONTACT_MOCK_DATA_1,
}

const renderComponent = (props: DeclarationRiskManagementProps, type: 'v1' | 'v2' = 'v1') => {
  const SELECTED_MOCK_CONTACT = type === 'v1' ? CONTACT_MOCK_DATA_1 : CONTACT_MOCK_DATA_2

  axiosMock.onGet(`${URLS.CONTACTS}/${SELECTED_MOCK_CONTACT.id}`).reply(200, SELECTED_MOCK_CONTACT)

  return render(
    <QueryClientProvider client={queryClient}>
      <DeclarationRiskManagement {...props} userData={SELECTED_MOCK_CONTACT} />
    </QueryClientProvider>,
  )
}
