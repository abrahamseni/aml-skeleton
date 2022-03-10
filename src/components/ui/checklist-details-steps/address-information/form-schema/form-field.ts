import { AddressModel } from '@reapit/foundations-ts-definitions'

export interface ValuesType {
  primaryAddress: AddressModel
  secondaryAddress: AddressModel
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
    }
  }
}

export interface FormFieldType {
  typeField: {
    name: 'primaryAddressTypeField' | 'secondaryAddressTypeField'
    label: string
  }
  buildingNameField: {
    name: 'primaryAddress.buildingName' | 'secondaryAddress.buildingName'
    label: string
  }
  buildingNumberField: {
    name: 'primaryAddress.buildingNumber' | 'secondaryAddress.buildingNumber'
    label: string
  }
  line1Field: {
    name: 'primaryAddress.line1' | 'secondaryAddress.line1'
    label: string
  }
  line2Field: {
    name: 'primaryAddress.line2' | 'secondaryAddress.line2'
    label: string
  }
  line3Field: {
    name: 'primaryAddress.line3' | 'secondaryAddress.line3'
    label: string
  }
  line4Field: {
    name: 'primaryAddress.line4' | 'secondaryAddress.line4'
    label: string
  }
  postcodeField: {
    name: 'primaryAddress.postcode' | 'secondaryAddress.postcode'
    label: string
  }
  yearField: {
    name: 'metadata.primaryAddress.year' | 'metadata.secondaryAddress.year'
    label: string
  }
  monthField: {
    name: 'metadata.primaryAddress.month' | 'metadata.secondaryAddress.month'
    label: string
  }
  documentTypeField: {
    name: 'metadata.primaryAddress.documentType' | 'metadata.secondaryAddress.documentType'
    label: string
  }
  documentImageField: {
    name: 'metadata.primaryAddress.documentImage' | 'metadata.secondaryAddress.documentImage'
    label: string
  }
}

export const formFields = (formType: 'primaryAddress' | 'secondaryAddress'): FormFieldType => ({
  typeField: {
    name: `${formType}TypeField`,
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
    label: 'Document Type',
  },
  documentImageField: {
    name: `metadata.${formType}.documentImage`,
    label: 'Upload File',
  },
})
