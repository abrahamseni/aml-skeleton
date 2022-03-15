import * as Yup from 'yup'
import { errorMessages } from '../../../../../constants/error-messages'
import { ValuesType } from './form-field'

/**
 * Make validation is URL OR its base64 with format png/pdf/jpeg/jpg
 */
export const validationSchema: Yup.SchemaOf<ValuesType> = Yup.object().shape({
  declarationForm: Yup.string()
    .required(errorMessages.FIELD_REQUIRED)
    .matches(/(png|jpg|jpeg|pdf)/, errorMessages.WRONG_FILE_TYPE),

  riskAssessmentForm: Yup.string()
    .required(errorMessages.FIELD_REQUIRED)
    .matches(/(png|jpg|jpeg|pdf)/, errorMessages.WRONG_FILE_TYPE),

  reason: Yup.string().required(errorMessages.FIELD_REQUIRED),

  type: Yup.string().required(errorMessages.FIELD_REQUIRED),
})
