import * as Yup from 'yup'
import { errorMessages } from '../../../../../constants/error-messages'
import FileValidation from '../../../../../utils/file-validation'
import { generateNewObject } from '../../../../../utils/generator'
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
      .required(errorMessages.FIELD_REQUIRED)
      .max(9, errorMessages.MAXIMUM_CHARACTER_LENGTH(9))
      .matches(/^[A-Z0-9 ]*$/, errorMessages.FIELD_MUST_CAPITALIZE)
      .trim(),
    documentImage: FileValidation.create()
      .required(errorMessages.FIELD_REQUIRED)
      .maxSize(3, errorMessages.EXCEEDED_MAX_FILE_SIZE),
    documentType: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
    month: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
    year: Yup.string().trim().required(errorMessages.FIELD_REQUIRED),
  }),
  secondaryAddress: Yup.object()
    .shape({
      buildingName: Yup.string().trim().max(35, errorMessages.MAXIMUM_CHARACTER_LENGTH(35)).notRequired().nullable(),
      buildingNumber: Yup.string().trim().max(8, errorMessages.MAXIMUM_CHARACTER_LENGTH(8)).notRequired().nullable(),
      line1: Yup.string()
        .trim()
        .max(35, errorMessages.MAXIMUM_CHARACTER_LENGTH(35))
        .nullable()
        .test({
          name: 'conditional-required',
          message: errorMessages.FIELD_REQUIRED,
          test: (_val, testContext) => conditionalFieldsCheck(testContext),
        }),
      line2: Yup.string().trim().max(30, errorMessages.MAXIMUM_CHARACTER_LENGTH(30)).notRequired().nullable(),
      line3: Yup.string()
        .trim()
        .max(30, errorMessages.MAXIMUM_CHARACTER_LENGTH(30))
        .nullable()
        .test({
          name: 'conditional-required',
          message: errorMessages.FIELD_REQUIRED,
          test: (_val, testContext) => conditionalFieldsCheck(testContext),
        }),
      line4: Yup.string().trim().max(30, errorMessages.MAXIMUM_CHARACTER_LENGTH(30)).notRequired().nullable(),
      postcode: Yup.string()
        .trim()
        .max(9, errorMessages.MAXIMUM_CHARACTER_LENGTH(9))
        .matches(/^[A-Z0-9 ]*$/, errorMessages.FIELD_MUST_CAPITALIZE)
        .trim()
        .nullable()
        .test({
          name: 'conditional-required',
          message: errorMessages.FIELD_REQUIRED,
          test: (_val, testContext) => conditionalFieldsCheck(testContext),
        }),
      documentImage: FileValidation.create()
        .maxSize(3, errorMessages.EXCEEDED_MAX_FILE_SIZE)
        .notRequired()
        .nullable()
        .test({
          name: 'conditional-required',
          message: errorMessages.FIELD_REQUIRED,
          test: (_val, testContext) => conditionalFieldsCheck(testContext),
        }),
      documentType: Yup.string()
        .trim()
        .notRequired()
        .nullable()
        .test({
          name: 'conditional-required',
          message: errorMessages.FIELD_REQUIRED,
          test: (_val, testContext) => conditionalFieldsCheck(testContext),
        }),
      month: Yup.string()
        .notRequired()
        .nullable()
        .test({
          name: 'conditional-required',
          message: errorMessages.FIELD_REQUIRED,
          test: (_val, testContext) => conditionalFieldsCheck(testContext),
        }),
      year: Yup.string()
        .notRequired()
        .test({
          name: 'conditional-required',
          message: errorMessages.FIELD_REQUIRED,
          test: (_val, testContext) => conditionalFieldsCheck(testContext),
        })
        .nullable(),
    })
    .nullable(),
})

const conditionalFieldsCheck = (testContext: any): boolean => {
  const currentPath = testContext.path?.replace('secondaryAddress.', '')

  if (testContext.originalValue) {
    return true
  }

  const currentObject = generateNewObject(
    [currentPath, 'countryId', 'buildingName', 'buildingNumber', 'line2', 'line4', 'type', 'month', 'year'],
    testContext.parent,
  )

  for (const curr in currentObject) {
    if (currentObject[curr] !== '') {
      return false
    }
  }
  return true
}
