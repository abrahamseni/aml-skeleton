import * as Yup from 'yup'
import { errorMessages } from '../../../../../constants/error-messages'
import { ValuesType } from './form-field'

const validationSchema: Yup.SchemaOf<ValuesType> = Yup.object({
  idType: Yup.string().required(errorMessages.FIELD_REQUIRED),
  idReference: Yup.string().required(errorMessages.FIELD_REQUIRED),
  expiryDate: Yup.string().required(errorMessages.FIELD_REQUIRED),
  documentFile: Yup.string().required(errorMessages.FIELD_REQUIRED),
})

export default validationSchema
