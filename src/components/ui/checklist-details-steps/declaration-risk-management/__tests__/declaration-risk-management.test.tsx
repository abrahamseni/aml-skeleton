import { render, fireEvent, act } from '@testing-library/react'
import React from 'react'
import Axios from '../../../../../axios/axios'
import { CONTACT_MOCK_DATA_1, CONTACT_MOCK_DATA_2 } from '../../../../../core/__mocks__/contact.mock'
import DeclarationRiskManagement from '../declaration-risk-management'
import AxiosMockAdapter from 'axios-mock-adapter'
import { URLS } from '../../../../../constants/api'
import { QueryClient, QueryClientProvider } from 'react-query'
import { formField } from '../form-schema'
import { useSnack } from '@reapit/elements'

const axiosMock = new AxiosMockAdapter(Axios)

jest.mock('@reapit/elements', () => {
  return {
    ...jest.requireActual('@reapit/elements'),
    useSnack: jest.fn(() => ({
      success: jest.fn().mockImplementation(() => 'Success Notification') as jest.Mock<any>,
      error: jest.fn().mockImplementation(() => 'Error Notification') as jest.Mock<any>,
    })),
  }
})
jest.mock('@linaria/react', () => {
  const styled = (tag: any) => {
    if (typeof tag !== 'string') {
      return jest.fn(() => {
        return tag
      })
    }

    return jest.fn(() => tag)
  }
  return {
    styled: new Proxy(styled, {
      get(o, prop) {
        return o(prop)
      },
    }),
  }
})
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

  it('should able to click "previous button"', () => {
    const { getByTestId } = renderComponent(defaultDRMProps)

    const previousButton = getByTestId('button.previous')

    const { switchTabContent } = defaultDRMProps

    expect(switchTabContent).not.toBeCalled()

    fireEvent.click(previousButton)

    expect(switchTabContent).toBeCalled()
    expect(switchTabContent).toHaveBeenCalledWith('backward')

    fireEvent.click(previousButton)
    fireEvent.click(previousButton)
    fireEvent.click(previousButton)

    expect(switchTabContent).toBeCalledTimes(4)
  })

  it('should able to click "save button"', async () => {
    const { getByTestId } = renderComponent(defaultDRMProps)

    const submitButton = getByTestId('button.submit')

    const { switchTabContent } = defaultDRMProps
    expect(switchTabContent).not.toBeCalled()

    axiosMock.onPatch(`${URLS.CONTACTS}/${CONTACT_MOCK_DATA_1.id}`).reply(204)
    fireEvent.click(submitButton)
    await wait(0)

    expect(useSnack).toBeCalled()
  })

  it.only('should display error message if required field is empty', async () => {
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
  switchTabContent: jest.fn(),
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

async function wait(ms: number) {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms))
  })
}
