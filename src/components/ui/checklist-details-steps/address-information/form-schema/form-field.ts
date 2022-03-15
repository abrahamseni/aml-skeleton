import { AddressModel } from '@reapit/foundations-ts-definitions'

type UpdatedAddressModel = {
  type?: string
} & Omit<AddressModel, 'countryId'>
export interface ValuesType {
  primaryAddress?: UpdatedAddressModel
  secondaryAddress?: UpdatedAddressModel
  metadata: {
    primaryAddress?: {
      documentImage?: string
      documentType?: string
      month?: string
      year?: string
    }
    secondaryAddress?: {
      documentImage?: string
      documentType?: string
      month?: string
      year?: string
    }
  }
}

export type AvailableFormFieldType =
  | 'primaryAddress.type'
  | 'secondaryAddress.type'
  | 'primaryAddress.buildingName'
  | 'secondaryAddress.buildingName'
  | 'primaryAddress.buildingNumber'
  | 'secondaryAddress.buildingNumber'
  | 'primaryAddress.line1'
  | 'secondaryAddress.line1'
  | 'primaryAddress.line2'
  | 'secondaryAddress.line2'
  | 'primaryAddress.line2'
  | 'secondaryAddress.line2'
  | 'primaryAddress.line3'
  | 'secondaryAddress.line3'
  | 'primaryAddress.line4'
  | 'secondaryAddress.line4'
  | 'primaryAddress.postcode'
  | 'secondaryAddress.postcode'
  | 'metadata.primaryAddress.year'
  | 'metadata.secondaryAddress.year'
  | 'metadata.primaryAddress.month'
  | 'metadata.secondaryAddress.month'
  | 'metadata.primaryAddress.documentType'
  | 'metadata.secondaryAddress.documentType'
  | 'metadata.primaryAddress.documentImage'
  | 'metadata.secondaryAddress.documentImage'

export interface FormFieldType {
  typeField: {
    name: Extract<AvailableFormFieldType, 'primaryAddress.type' | 'secondaryAddress.type'>
    label: string
  }
  buildingNameField: {
    name: Extract<AvailableFormFieldType, 'primaryAddress.buildingName' | 'secondaryAddress.buildingName'>
    label: string
  }
  buildingNumberField: {
    name: Extract<AvailableFormFieldType, 'primaryAddress.buildingNumber' | 'secondaryAddress.buildingNumber'>
    label: string
  }
  line1Field: {
    name: Extract<AvailableFormFieldType, 'primaryAddress.line1' | 'secondaryAddress.line1'>
    label: string
  }
  line2Field: {
    name: Extract<AvailableFormFieldType, 'primaryAddress.line2' | 'secondaryAddress.line2'>
    label: string
  }
  line3Field: {
    name: Extract<AvailableFormFieldType, 'primaryAddress.line3' | 'secondaryAddress.line3'>
    label: string
  }
  line4Field: {
    name: Extract<AvailableFormFieldType, 'primaryAddress.line4' | 'secondaryAddress.line4'>
    label: string
  }
  postcodeField: {
    name: Extract<AvailableFormFieldType, 'primaryAddress.postcode' | 'secondaryAddress.postcode'>
    label: string
  }
  yearField: {
    name: Extract<AvailableFormFieldType, 'metadata.primaryAddress.year' | 'metadata.secondaryAddress.year'>
    label: string
  }
  monthField: {
    name: Extract<AvailableFormFieldType, 'metadata.primaryAddress.month' | 'metadata.secondaryAddress.month'>
    label: string
  }
  documentTypeField: {
    name: Extract<
      AvailableFormFieldType,
      'metadata.primaryAddress.documentType' | 'metadata.secondaryAddress.documentType'
    >
    label: string
  }
  documentImageField: {
    name: Extract<
      AvailableFormFieldType,
      'metadata.primaryAddress.documentImage' | 'metadata.secondaryAddress.documentImage'
    >
    label: string
  }
}

export const formFields = (formType: 'primaryAddress' | 'secondaryAddress'): FormFieldType => ({
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
})
