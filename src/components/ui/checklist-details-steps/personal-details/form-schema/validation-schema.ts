/* eslint-disable no-confusing-arrow */
import * as Yup from 'yup'
import { errorMessages } from '../../../../../constants/error-messages'
// import { ValuesType } from './form-field'

const PHONE_NO_REGEX = /^[0-9\- ]{8,14}$/

// const validationSchema: Yup.SchemaOf<ValuesType>
const validationSchema = Yup.object().shape({
  title: Yup.string().trim().typeError(errorMessages.FIELD_GENERAL_ERROR()),
  forename: Yup.string().trim().typeError(errorMessages.FIELD_GENERAL_ERROR()),
  surname: Yup.string().trim().typeError(errorMessages.FIELD_GENERAL_ERROR()),
  dateOfBirth: Yup.string().typeError(errorMessages.FIELD_GENERAL_ERROR()),
  email: Yup.string().trim().email('Please enter a valid email format!'),
  homePhone: Yup.string()
    .matches(PHONE_NO_REGEX, {
      message: 'Please enter a valid phone number format',
      excludeEmptyString: true,
    })
    .nullable(),
  mobilePhone: Yup.string()
    .matches(PHONE_NO_REGEX, {
      message: 'Please enter a valid phone number format',
      excludeEmptyString: true,
    })
    .nullable(),
  workPhone: Yup.string()
    .matches(PHONE_NO_REGEX, {
      message: 'Please enter a valid phone number format',
      excludeEmptyString: true,
    })
    .nullable(),
})

export default validationSchema
