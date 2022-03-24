import FileValidation from 'utils/file-validation'
import * as Yup from 'yup'
import { errorMessages } from '../../../../../constants/error-messages'
import { ValuesType } from './form-field'

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
        .maxSize(6, errorMessages.EXCEEDED_MAX_FILE_SIZE),
      documentType: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
      month: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
      year: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
    }),
    secondaryAddress: Yup.object()
      .shape({
        documentImage: FileValidation.create().maxSize(6, errorMessages.EXCEEDED_MAX_FILE_SIZE).nullable(),
        documentType: Yup.string().notRequired().nullable(),
        month: Yup.string().notRequired().nullable(),
        year: Yup.string().notRequired().nullable(),
      })
      .nullable(),
  }),
})
