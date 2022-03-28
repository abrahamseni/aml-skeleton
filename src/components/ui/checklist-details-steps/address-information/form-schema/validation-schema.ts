import FileValidation from 'utils/file-validation'
import * as Yup from 'yup'
import { errorMessages } from 'constants/error-messages'
import { ValuesType } from './form-field'
import { getFileExtensionsFromDataUrl } from 'utils/file'
import { isDataUrl } from 'utils/url'

export const validationSchema: Yup.SchemaOf<ValuesType> = Yup.object().shape({
  primaryAddress: Yup.object().shape({
    buildingName: Yup.string().trim().max(35, errorMessages.MAXIMUM_CHARACTER_LENGTH(35)).notRequired(),
    buildingNumber: Yup.string().trim().max(8, errorMessages.MAXIMUM_CHARACTER_LENGTH(8)).notRequired(),
    line1: Yup.string()
      .trim()
      .max(35, errorMessages.MAXIMUM_CHARACTER_LENGTH(35))
      .required(errorMessages.FIELD_REQUIRED),
    line2: Yup.string().trim().max(30, errorMessages.MAXIMUM_CHARACTER_LENGTH(30)).notRequired(),
    line3: Yup.string()
      .trim()
      .max(30, errorMessages.MAXIMUM_CHARACTER_LENGTH(30))
      .required(errorMessages.FIELD_REQUIRED),
    line4: Yup.string().trim().max(30, errorMessages.MAXIMUM_CHARACTER_LENGTH(30)).notRequired(),
    postcode: Yup.string()
      .trim()
      .max(9, errorMessages.MAXIMUM_CHARACTER_LENGTH(9))
      .required(errorMessages.FIELD_REQUIRED),
  }),
  secondaryAddress: Yup.object()
    .shape({
      buildingName: Yup.string().trim().max(35, errorMessages.MAXIMUM_CHARACTER_LENGTH(35)).notRequired().nullable(),
      buildingNumber: Yup.string().trim().max(8, errorMessages.MAXIMUM_CHARACTER_LENGTH(8)).notRequired().nullable(),
      line1: Yup.string().trim().max(35, errorMessages.MAXIMUM_CHARACTER_LENGTH(35)).notRequired().nullable(),
      line2: Yup.string().trim().max(30, errorMessages.MAXIMUM_CHARACTER_LENGTH(30)).notRequired().nullable(),
      line3: Yup.string().trim().max(30, errorMessages.MAXIMUM_CHARACTER_LENGTH(30)).notRequired().nullable(),
      line4: Yup.string().trim().max(30, errorMessages.MAXIMUM_CHARACTER_LENGTH(30)).notRequired().nullable(),
      postcode: Yup.string().trim().max(9, errorMessages.MAXIMUM_CHARACTER_LENGTH(9)).notRequired().nullable(),
    })
    .nullable(),
  metadata: Yup.object().shape({
    primaryAddress: Yup.object().shape({
      documentImage: FileValidation.create()
        .required(errorMessages.FIELD_REQUIRED)
        .maxSize(3, errorMessages.EXCEEDED_MAX_FILE_SIZE)
        .test({
          message: errorMessages.WRONG_FILE_TYPE,
          name: 'fileFormat',
          test: (value) => {
            const availableFormat = ['jpeg', 'png', 'jpg', 'svg']
            const currentFileFormat = getFileExtensionsFromDataUrl(value)

            if (!isDataUrl(value)) {
              return true
            }

            if (availableFormat.includes(currentFileFormat)) {
              return true
            }
            return false
          },
        }),
      documentType: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
      month: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
      year: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
    }),
    secondaryAddress: Yup.object()
      .shape({
        documentImage: FileValidation.create()
          .maxSize(3, errorMessages.EXCEEDED_MAX_FILE_SIZE)
          .test({
            message: errorMessages.WRONG_FILE_TYPE,
            name: 'fileFormat',
            test: (value) => {
              if (!isDataUrl(value)) {
                return true
              }
              const availableFormat = ['jpeg', 'png', 'jpg', 'svg']
              const currentFileFormat = getFileExtensionsFromDataUrl(value)

              if (availableFormat.includes(currentFileFormat)) {
                return true
              }
              return false
            },
          })
          .when('secondaryAddress is Filled', {
            is: false,
            then: Yup.string().required(errorMessages.FIELD_REQUIRED),
          }),
        documentType: Yup.string().notRequired().nullable(),
        month: Yup.string().notRequired().nullable(),
        year: Yup.string().notRequired().nullable(),
      })
      .nullable(),
  }),
})
