import * as Yup from 'yup'
import { errorMessages } from '../../../../../constants/error-messages'

const validationSchema = Yup.object().shape({
  title: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
  forename: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
  surname: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
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
