import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import Axios from '../../../../../axios/axios'
import { CONTACT_MOCK_DATA_1, CONTACT_MOCK_DATA_2 } from '../../../../../platform-api/__mocks__/contact-api.mock'
import DeclarationRiskManagement from '../declaration-risk-management'
import AxiosMockAdapter from 'axios-mock-adapter'
import { URLS } from '../../../../../constants/api'
import { QueryClient, QueryClientProvider } from 'react-query'
import { formField } from '../form-schema'
import { wait } from 'utils/test'
import { success } from 'utils/mocks/useSnack'

const axiosMock = new AxiosMockAdapter(Axios)

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

const { declarationFormField, riskAssessmentFormField, typeField, reasonField } = formField()

describe('Declaration Risk Management Form', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    axiosMock.reset()
  })
  it('should match a snapshot', () => {
    expect(renderComponent(defaultDRMProps)).toMatchSnapshot()
  })

  it('should render 4 fields', () => {
    const { getByTestId } = renderComponent(defaultDRMProps)

    const formChildElement = getByTestId('declaration.risk.management.form').childNodes[0].childNodes.length

    expect(formChildElement).toEqual(4)
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

  it('should able to click "save button", and return notification if success', async () => {
    const { getByTestId } = renderComponent(defaultDRMProps)

    const submitButton = getByTestId('save-form')

    axiosMock.onPatch(`${URLS.CONTACTS}/${CONTACT_MOCK_DATA_1.id}`).reply(204)
    fireEvent.click(submitButton)
    await wait(0)

    expect(success).toBeCalledTimes(1)
    expect(success.mock.calls[0][0]).toMatch(/Successfully update declaration risk management/i)
  })

  it('should display error message if required field is empty', async () => {
    const { getByTestId, findByTestId } = renderComponent(defaultDRMProps)

    // risk assessment type
    const testTypeField = getByTestId(`test.${typeField.name}`) as HTMLSelectElement
    expect(testTypeField.value).toMatch(/Simplified/i)

    fireEvent.change(testTypeField, { target: { value: '' } })
    await wait(0)
    fireEvent.blur(testTypeField)
    await wait(0)

    const errorMessage = await findByTestId(`test.error.${typeField.name}`)
    expect(errorMessage).not.toBeUndefined
    expect(errorMessage.textContent).toMatch(/Required/i)
  })

  it.todo('should able to click "save button", and return notification if error ')
})

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
