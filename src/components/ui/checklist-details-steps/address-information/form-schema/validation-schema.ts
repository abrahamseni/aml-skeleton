import FileValidation from 'utils/file-validation'
import * as Yup from 'yup'
import { errorMessages } from '../../../../../constants/error-messages'
import { ValuesType } from './form-field'

export const validationSchema: Yup.SchemaOf<ValuesType> = Yup.object().shape({
  primaryAddress: Yup.object().shape({
    buildingName: Yup.string().trim().notRequired(),
    buildingNumber: Yup.string().trim().notRequired(),
    line1: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
    line2: Yup.string().trim().notRequired(),
    line3: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
    line4: Yup.string().trim().notRequired(),
    postcode: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
  }),
  secondaryAddress: Yup.object()
    .shape({
      buildingName: Yup.string().trim().notRequired().nullable(),
      buildingNumber: Yup.string().trim().notRequired().nullable(),
      line1: Yup.string().trim().notRequired().nullable(),
      line2: Yup.string().trim().notRequired().nullable(),
      line3: Yup.string().trim().notRequired().nullable(),
      line4: Yup.string().trim().notRequired().nullable(),
      postcode: Yup.string().trim().notRequired().nullable(),
    })
    .nullable(),
  metadata: Yup.object().shape({
    primaryAddress: Yup.object().shape({
      documentImage: FileValidation.create()
        .required(errorMessages.FIELD_REQUIRED)
        .maxSize(3, errorMessages.EXCEEDED_MAX_FILE_SIZE),
      documentType: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
      month: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
      year: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
    }),
    secondaryAddress: Yup.object()
      .shape({
        documentImage: FileValidation.create().maxSize(3, errorMessages.EXCEEDED_MAX_FILE_SIZE),
        documentType: Yup.string().notRequired().nullable(),
        month: Yup.string().notRequired().nullable(),
        year: Yup.string().notRequired().nullable(),
      })
      .nullable(),
  }),
})
