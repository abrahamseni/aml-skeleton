/* eslint-disable no-confusing-arrow */
import * as Yup from 'yup'
import { errorMessages } from '../../../../../constants/error-messages'
// import { ValuesType } from './form-field'

const PHONE_NO_REGEX = /^[0-9\- ]{8,14}$/

// const validationSchema: Yup.SchemaOf<ValuesType>
const validationSchema = Yup.object().shape({
  title: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
  forename: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
  surname: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
  dateOfBirth: Yup.string().nullable().required(errorMessages.FIELD_REQUIRED),
  email: Yup.string().trim().email('Please enter a valid email format!').required(errorMessages.FIELD_REQUIRED),
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
