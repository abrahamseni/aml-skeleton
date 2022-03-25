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
  homePhone: Yup.string()
    .matches(PHONE_NO_REGEX, {
      message: 'Please enter a valid phone number format',
      excludeEmptyString: true,
    })
    .nullable(),
  // .when(['mobilePhone', 'workPhone'], {
  //   is: (mobilePhone, workPhone) => {
  //     // console.log(!mobilePhone, !workPhone, {})
  //     return !mobilePhone && !workPhone
  //   },
  //   then: (schema) => {
  //     //true condition
  //     // console.log('then', { schema })
  //     return schema.required(errorMessages.FIELD_REQUIRED)
  //   },
  //   otherwise: (schema) => {
  //     //false condition
  //     // console.log('otherwise', { schema })
  //     return schema
  //   },
  // }),
})

export default validationSchema
