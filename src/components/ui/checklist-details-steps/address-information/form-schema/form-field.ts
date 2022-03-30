import { AddressModel } from '@reapit/foundations-ts-definitions'

type UpdatedAddressModel = {
  type?: string
} & Omit<AddressModel, 'countryId'>
export interface ValuesType {
  primaryAddress?: UpdatedAddressModel
  secondaryAddress?: UpdatedAddressModel
  metadata: {
    primaryAddress: {
      documentImage?: string
      documentType?: string
      month?: string
      year?: string
    }
    secondaryAddress: {
      documentImage?: string
      documentType?: string
      month?: string
      year?: string
    } | null
  }
}

export const formFields = (formType: 'primaryAddress' | 'secondaryAddress') =>
  ({
    typeField: {
      name: `${formType}.type`,
      label: 'Type',
    },
    buildingNameField: {
      name: `${formType}.buildingName`,
      label: 'Building Name',
    },
    buildingNumberField: {
      name: `${formType}.buildingNumber`,
      label: 'Building Number',
    },
    line1Field: {
      name: `${formType}.line1`,
      label: 'Line 1',
    },
    line2Field: {
      name: `${formType}.line2`,
      label: 'Line 2',
    },
    line3Field: {
      name: `${formType}.line3`,
      label: 'Line 3',
    },
    line4Field: {
      name: `${formType}.line4`,
      label: 'Line 4',
    },
    postcodeField: {
      name: `${formType}.postcode`,
      label: 'Post Code',
    },
    yearField: {
      name: `metadata.${formType}.year`,
      label: 'Number of Years at Address',
    },
    monthField: {
      name: `metadata.${formType}.month`,
      label: 'Number of Months at Address',
    },
    documentTypeField: {
      name: `metadata.${formType}.documentType`,
      label: `Document ${formType === 'primaryAddress' ? 'Primary Address' : 'Secondary Address'} Type`,
    },
    documentImageField: {
      name: `metadata.${formType}.documentImage`,
      label: `Upload  ${formType === 'primaryAddress' ? 'Primary Address' : 'Secondary Address'} File`,
    },
  } as const)
