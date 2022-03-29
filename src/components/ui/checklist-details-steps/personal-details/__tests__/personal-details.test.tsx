/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import AxiosMockAdapter from 'axios-mock-adapter'
import { QueryClient, QueryClientProvider } from 'react-query'

import Axios from 'axios/axios'
import { URLS } from 'constants/api'
import { formFields } from '../form-schema/form-field'
import PersonalDetails from '../personal-details'
import { wait } from 'utils/test'
import { error, success } from 'utils/mocks/useSnack'
import { CONTACT_MOCK_DATA_1, CONTACT_MOCK_DATA_2 } from 'platform-api/__mocks__/contact-api.mock'

const axiosMock = new AxiosMockAdapter(Axios, {
  onNoMatch: 'throwException',
})

jest.mock('@reapit/elements', () => jest.requireActual('utils/mocks/reapit-element-mocks'))
jest.unmock('@reapit/connect-session')
jest.mock('../../../../../core/connect-session')

const { title, forename, surname, dateOfBirth, email, workPhone, mobilePhone, homePhone } = formFields

describe('Personal Details Form', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    axiosMock.reset()
  })

  describe('Snapshot', () => {
    it('should match a snapshot', () => {
      expect(renderComponent(defaultPersonalDetailsProps)).toMatchSnapshot()
    })
  })

  describe('DOM', () => {
    it('should render 8 fields', () => {
      const { container } = renderComponent(defaultPersonalDetailsProps)

      const totalTextFields = container.querySelectorAll<HTMLInputElement>('[type="text"]')
      const totalDateFields = container.querySelectorAll<HTMLInputElement>('[type="date"]')
      const totalEmailields = container.querySelectorAll<HTMLInputElement>('[type="email"]')

      expect(totalTextFields.length).toEqual(6)
      expect(totalDateFields.length).toEqual(1)
      expect(totalEmailields.length).toEqual(1)
      expect(totalTextFields.length + totalDateFields.length + totalEmailields.length).toEqual(8)
    })

    it('the fields should able to automatically fill with default value and be able to change', () => {
      const { getByTestId } = renderComponent(defaultPersonalDetailsProps)

      // title
      const testTitleField = getByTestId(`test.${title.name}`) as HTMLInputElement
      expect(testTitleField.value).toMatch(/Mr/i)
      // forename
      const testForenameField = getByTestId(`test.${forename.name}`) as HTMLInputElement
      expect(testForenameField.value).toMatch(/Christopher/i)
      // surname
      const testSurnameField = getByTestId(`test.${surname.name}`) as HTMLInputElement
      expect(testSurnameField.value).toMatch(/Williamson/i)
      // date of birth
      const testDateOfBirthField = getByTestId(`test.${dateOfBirth.name}`) as HTMLInputElement
      expect(testDateOfBirthField.value).toMatch(/1988-05-19/i)
      // email
      const testEmailField = getByTestId(`test.${email.name}`) as HTMLInputElement
      expect(testEmailField.value).toMatch(/cwilliamson47@rpsfiction.net/i)
      // home phone
      const testHomePhoneField = getByTestId(`test.${homePhone.name}`) as HTMLInputElement
      expect(testHomePhoneField.value).toMatch(/02471896/i)
      // mobile phone
      const testMobilePhoneField = getByTestId(`test.${mobilePhone.name}`) as HTMLInputElement
      expect(testMobilePhoneField.value).toMatch(/07110660399/i)
      // work phone
      const testWorkPhoneField = getByTestId(`test.${workPhone.name}`) as HTMLInputElement
      expect(testWorkPhoneField.value).toMatch(/028233444/i)

      // title changed
      fireEvent.change(testTitleField, { target: { value: 'Ms' } })
      expect(testTitleField.value).toMatch(/Ms/i)
      // forename changed
      fireEvent.change(testTitleField, { target: { value: 'Will' } })
      expect(testTitleField.value).toMatch(/Will/i)
      // surname changed
      fireEvent.change(testSurnameField, { target: { value: 'Helliam' } })
      expect(testSurnameField.value).toMatch(/Helliam/i)
      // date of birth changed
      fireEvent.change(testDateOfBirthField, { target: { value: '1989-02-19' } })
      expect(testDateOfBirthField.value).toMatch(/1989-02-19/i)
      // email changed
      fireEvent.change(testTitleField, { target: { value: 'cwilliamson47@reapit.au' } })
      expect(testTitleField.value).toMatch(/cwilliamson47@reapit.au/i)
      // home phone changed
      fireEvent.change(testHomePhoneField, { target: { value: '02471800' } })
      expect(testHomePhoneField.value).toMatch(/02471800/i)
      // mobile phone changed
      fireEvent.change(testMobilePhoneField, { target: { value: '07110880396' } })
      expect(testMobilePhoneField.value).toMatch(/07110880396/i)
      // work phone changed
      fireEvent.change(testWorkPhoneField, { target: { value: '028246444' } })
      expect(testWorkPhoneField.value).toMatch(/028246444/i)
    })

    it('should display error message if required field is empty', async () => {
      const { getByTestId } = renderComponent(defaultPersonalDetailsProps)

      // title
      const testTitleField = getByTestId(`test.${title.name}`) as HTMLTextAreaElement
      expect(testTitleField.value).toMatch(/Mr/i)

      fireEvent.change(testTitleField, { target: { value: '' } })
      await wait(0)
      fireEvent.blur(testTitleField)
      await wait(0)

      const testTitleFieldErrorMessage = getByTestId(`error.${title.name}`)
      expect(testTitleFieldErrorMessage).not.toBeUndefined
      expect(testTitleFieldErrorMessage.textContent).toMatch(/Required/i)
      // forename
      const testForenameField = getByTestId(`test.${forename.name}`) as HTMLTextAreaElement
      expect(testForenameField.value).toMatch(/Christopher/i)

      fireEvent.change(testForenameField, { target: { value: '' } })
      await wait(0)
      fireEvent.blur(testForenameField)
      await wait(0)

      const testForenameFieldErrorMessage = getByTestId(`error.${forename.name}`)
      expect(testForenameFieldErrorMessage).not.toBeUndefined
      expect(testForenameFieldErrorMessage.textContent).toMatch(/Required/i)
      // surname
      const testSurnameField = getByTestId(`test.${surname.name}`) as HTMLTextAreaElement
      expect(testSurnameField.value).toMatch(/Williamson/i)

      fireEvent.change(testSurnameField, { target: { value: '' } })
      await wait(0)
      fireEvent.blur(testSurnameField)
      await wait(0)

      const testSurnameFieldErrorMessage = getByTestId(`error.${surname.name}`)
      expect(testSurnameFieldErrorMessage).not.toBeUndefined
      expect(testSurnameFieldErrorMessage.textContent).toMatch(/Required/i)
      // date of birth
      const testDateOfBirth = getByTestId(`test.${dateOfBirth.name}`) as HTMLTextAreaElement
      expect(testDateOfBirth.value).toMatch(/1988-05-19/i)

      fireEvent.change(testDateOfBirth, { target: { value: '' } })
      await wait(0)
      fireEvent.blur(testDateOfBirth)
      await wait(0)

      const testDateOfBirthErrorMessage = getByTestId(`error.${dateOfBirth.name}`)
      expect(testDateOfBirthErrorMessage).not.toBeUndefined
      expect(testDateOfBirthErrorMessage.textContent).toMatch(/Required/i)
      // email
      const testEmailField = getByTestId(`test.${email.name}`) as HTMLTextAreaElement
      expect(testEmailField.value).toMatch(/cwilliamson47@rpsfiction.net/i)

      fireEvent.change(testEmailField, { target: { value: '' } })
      await wait(0)
      fireEvent.blur(testEmailField)
      await wait(0)

      const testEmailFieldErrorMessage = getByTestId(`error.${email.name}`)
      expect(testEmailFieldErrorMessage).not.toBeUndefined
      expect(testEmailFieldErrorMessage.textContent).toMatch(/Required/i)
    })
  })
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const defaultPersonalDetailsProps = {
  userData: CONTACT_MOCK_DATA_1,
}

const renderComponent = (props, type: 'v1' | 'v2' = 'v1') => {
  const SELECTED_MOCK_CONTACT = type === 'v1' ? CONTACT_MOCK_DATA_1 : CONTACT_MOCK_DATA_2

  axiosMock.onGet(`${URLS.CONTACTS}/${SELECTED_MOCK_CONTACT.id}`).reply(200, SELECTED_MOCK_CONTACT)

  return render(
    <QueryClientProvider client={queryClient}>
      <PersonalDetails {...props} userData={SELECTED_MOCK_CONTACT} />
    </QueryClientProvider>,
  )
}
