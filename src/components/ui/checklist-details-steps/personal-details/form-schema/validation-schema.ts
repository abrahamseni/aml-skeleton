import * as Yup from 'yup'
import { errorMessages } from '../../../../../constants/error-messages'
// import { ValuesType } from './form-field'

// const validationSchema: Yup.SchemaOf<ValuesType>
const validationSchema = Yup.object().shape({
  title: Yup.string().typeError(errorMessages.FIELD_GENERAL_ERROR()),
  forename: Yup.string().typeError(errorMessages.FIELD_GENERAL_ERROR()),
  surname: Yup.string().typeError(errorMessages.FIELD_GENERAL_ERROR()),
  dateOfBirth: Yup.string().typeError(errorMessages.FIELD_GENERAL_ERROR()),
  email: Yup.string().email('Please enter a valid email format!'),
  home: Yup.number().typeError('you must specify a number').nullable(),
  // .transform((value: string, originalValue: string) => (originalValue.trim() === '' ? null : value))
  mobile: Yup.number().typeError('you must specify a number').nullable(),
  work: Yup.number().typeError('you must specify a number').nullable(),
})

export default validationSchema
