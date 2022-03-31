import FileValidation from '../../../../../utils/file-validation'
import * as Yup from 'yup'
import { errorMessages } from '../../../../../constants/error-messages'
import { ValuesType } from './form-field'
import { isDataUrl } from 'utils/url'
import { getFileExtensionsFromDataUrl } from 'utils/file'

const validationSchema: Yup.SchemaOf<ValuesType> = Yup.object({
  idType: Yup.string().required(errorMessages.FIELD_REQUIRED),
  idReference: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
  expiryDate: Yup.string().required(errorMessages.FIELD_REQUIRED),
  documentFile: FileValidation.create()
    .required(errorMessages.FIELD_REQUIRED)
    .maxSize(3, errorMessages.EXCEEDED_MAX_FILE_SIZE)
    .test({
      message: 'Invalid image file (must be png, jpg, jpeg or pdf)',
      name: 'fileFormat',
      test: (value) => {
        if (!isDataUrl(value)) {
          return true
        }

        const availableFormat = ['jpeg', 'png', 'jpg', 'pdf']
        const currentFileFormat = getFileExtensionsFromDataUrl(value)

        if (availableFormat.includes(currentFileFormat)) {
          return true
        }
        return false
      },
    }),
})

export default validationSchema
