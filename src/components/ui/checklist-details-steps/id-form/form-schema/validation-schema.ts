import FileValidation from 'utils/file-validation'
import * as Yup from 'yup'
import { errorMessages } from '../../../../../constants/error-messages'
import { ValuesType } from './form-field'

const validationSchema: Yup.SchemaOf<ValuesType> = Yup.object({
  idType: Yup.string().required(errorMessages.FIELD_REQUIRED),
  idReference: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
  expiryDate: Yup.string().required(errorMessages.FIELD_REQUIRED),
  documentFile: FileValidation.create()
    .required(errorMessages.FIELD_REQUIRED)
    .maxSize(3, errorMessages.EXCEEDED_MAX_FILE_SIZE),
})

export default validationSchema
