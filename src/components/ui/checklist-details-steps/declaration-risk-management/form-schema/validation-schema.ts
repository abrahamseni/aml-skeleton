import * as Yup from 'yup'
import { errorMessages } from '../../../../../constants/error-messages'
import { ValuesType } from './form-field'

/**
 * Make validation is URL OR its base64 with format png/pdf/jpeg/jpg
 */
const validationSchema: Yup.SchemaOf<ValuesType> = Yup.object().shape({
  declarationForm: Yup.string()
    .required(errorMessages.FIELD_REQUIRED)
    .matches(/(png|jpg|jpeg|pdf)/, 'Type file must between (.png, .jpg, .jpeg, .pdf)'),

  riskAssessmentForm: Yup.string()
    .required(errorMessages.FIELD_REQUIRED)
    .matches(/(png|jpg|jpeg|pdf)/, 'Type file must between (.png, .jpg, .jpeg, .pdf)'),

  reason: Yup.string().required(errorMessages.FIELD_REQUIRED),

  type: Yup.string().required(errorMessages.FIELD_REQUIRED),
})

export default validationSchema
