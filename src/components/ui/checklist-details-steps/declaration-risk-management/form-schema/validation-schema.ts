import FileValidation from 'utils/file-validation'
import * as Yup from 'yup'
import { errorMessages } from 'constants/error-messages'
import { ValuesType } from './form-field'
import { getFileExtensionsFromDataUrl } from 'utils/file'
import { isDataUrl } from 'utils/url'

export const validationSchema: Yup.SchemaOf<ValuesType> = Yup.object().shape({
  declarationForm: FileValidation.create()
    .required(errorMessages.FIELD_REQUIRED)
    .maxSize(3, errorMessages.EXCEEDED_MAX_FILE_SIZE),
  riskAssessmentForm: FileValidation.create()
    .required(errorMessages.FIELD_REQUIRED)
    .maxSize(3, errorMessages.EXCEEDED_MAX_FILE_SIZE)
    .test({
      message: errorMessages.WRONG_FILE_TYPE,
      name: 'fileFormat',
      test: (value) => {
        if (!isDataUrl(value)) {
          return true
        }

        const availableFormat = ['jpeg', 'png', 'jpg', 'svg+xml']
        const currentFileFormat = getFileExtensionsFromDataUrl(value)

        if (availableFormat.includes(currentFileFormat)) {
          return true
        }
        return false
      },
    }),
  reason: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
  type: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
})
