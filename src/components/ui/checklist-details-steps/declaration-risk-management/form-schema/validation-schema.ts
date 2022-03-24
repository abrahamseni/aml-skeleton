import FileValidation from 'utils/file-validation'
import * as Yup from 'yup'
import { errorMessages } from '../../../../../constants/error-messages'
import { ValuesType } from './form-field'

export const validationSchema: Yup.SchemaOf<ValuesType> = Yup.object().shape({
  declarationForm: FileValidation.create()
    .required(errorMessages.FIELD_REQUIRED)
    .maxSize(6, errorMessages.EXCEEDED_MAX_FILE_SIZE),

  riskAssessmentForm: FileValidation.create()
    .required(errorMessages.FIELD_REQUIRED)
    .maxSize(6, errorMessages.EXCEEDED_MAX_FILE_SIZE),

  reason: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),

  type: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
})
