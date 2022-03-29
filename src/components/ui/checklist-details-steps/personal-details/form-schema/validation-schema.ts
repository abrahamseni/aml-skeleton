import * as Yup from 'yup'
import { errorMessages } from '../../../../../constants/error-messages'

const validationSchema = Yup.object().shape({
  title: Yup.string().trim().required(errorMessages.FIELD_REQUIRED).max(15, errorMessages.MAXIMUM_CHARACTER_LENGTH(15)),
  forename: Yup.string()
    .trim()
    .required(errorMessages.FIELD_REQUIRED)
    .max(20, errorMessages.MAXIMUM_CHARACTER_LENGTH(20)),
  surname: Yup.string()
    .trim()
    .required(errorMessages.FIELD_REQUIRED)
    .max(20, errorMessages.MAXIMUM_CHARACTER_LENGTH(20)),
  dateOfBirth: Yup.string().nullable().required(errorMessages.FIELD_REQUIRED),
  email: Yup.string().trim().email('Please enter a valid email format!').required(errorMessages.FIELD_REQUIRED),
  mobilePhone: Yup.string().nullable(),
  workPhone: Yup.string().nullable(),
  homePhone: Yup.string()
    .nullable()
    .when(['mobilePhone', 'workPhone'], {
      is: (mobilePhone, workPhone) => {
        return !mobilePhone && !workPhone
      },
      then: (schema) => {
        return schema.required(errorMessages.FIELD_REQUIRED)
      },
    }),
})

export default validationSchema
