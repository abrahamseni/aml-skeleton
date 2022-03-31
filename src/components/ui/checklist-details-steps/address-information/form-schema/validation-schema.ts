/* eslint-disable */
import * as Yup from 'yup'
import { InternalOptions } from 'yup/lib/types'
import { errorMessages } from '../../../../../constants/error-messages'
import FileValidation from '../../../../../utils/file-validation'
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
  }),
  secondaryAddress: Yup.object()
    .shape({
      buildingName: Yup.string().trim().max(35, errorMessages.MAXIMUM_CHARACTER_LENGTH(35)).notRequired().nullable(),
      buildingNumber: Yup.string().trim().max(8, errorMessages.MAXIMUM_CHARACTER_LENGTH(8)).notRequired().nullable(),
      line1: Yup.string()
        .trim()
        .max(35, errorMessages.MAXIMUM_CHARACTER_LENGTH(35))
        .when('postcode', {
          is: (postcode) => !!postcode,
          then: (schema) => schema.required(errorMessages.FIELD_REQUIRED),
        }),
      line2: Yup.string().trim().max(30, errorMessages.MAXIMUM_CHARACTER_LENGTH(30)).notRequired().nullable(),
      line3: Yup.string()
        .trim()
        .max(30, errorMessages.MAXIMUM_CHARACTER_LENGTH(30))
        .when('postcode', {
          is: (postcode) => !!postcode,
          then: (schema) => schema.required(errorMessages.FIELD_REQUIRED),
        })
        .nullable(),
      line4: Yup.string().trim().max(30, errorMessages.MAXIMUM_CHARACTER_LENGTH(30)).notRequired().nullable(),
      postcode: Yup.string()
        .trim()
        .max(9, errorMessages.MAXIMUM_CHARACTER_LENGTH(9))
        .matches(/^[A-Z0-9 ]*$/, errorMessages.FIELD_MUST_CAPITALIZE)
        .trim()
        .nullable()
        .when(['buildingName', 'buildingNumber', 'line2', 'line4'], {
          is: (postcode, buildingName, buildingNumber, line2, line4) =>
            !!(postcode || buildingName || buildingNumber || line2 || line4),
          then: (schema) => schema.required(errorMessages.FIELD_REQUIRED),
        }),
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
        documentImage: FileValidation.create()
          .maxSize(3, errorMessages.EXCEEDED_MAX_FILE_SIZE)
          .when('year', {
            is: (year) => !!(year && year !== 0),
            then: (schema) => schema.required(errorMessages.FIELD_REQUIRED),
          })
          .notRequired()
          .nullable(),
        documentType: Yup.string()
          .trim()
          .notRequired()
          .nullable()
          .when('year', {
            is: (year) => !!(year && year !== 0),
            then: (schema) => schema.required(errorMessages.FIELD_REQUIRED),
          }),
        month: Yup.string()
          .notRequired()
          .nullable()
          .when('year', {
            is: (year) => !!(year && year !== 0),
            then: (schema) => schema.required(errorMessages.FIELD_REQUIRED),
          }),
        year: Yup.string().notRequired().nullable(),
      })
      .nullable(),
  }),
})

// test method
const conditionalFields = (val: string | undefined, testContext: InternalOptions) => {
  if (val === undefined) {
    return true
  }
  return isOneOfSecondaryAddressFilled(testContext)
}

const isOneOfSecondaryAddressFilled = (currObj: InternalOptions): boolean => {
  if (currObj.originalValue !== '') true

  const baseSecondaryAddressField = {
    ...currObj?.from?.[1]?.value?.secondaryAddress,
    ...currObj?.from?.[2]?.value?.secondaryAddress,
  }

  const isSecondaryAddressMusFilled =
    baseSecondaryAddressField?.line1 !== '' &&
    baseSecondaryAddressField?.line3 !== '' &&
    baseSecondaryAddressField?.postcode !== ''

  return isSecondaryAddressMusFilled
}
