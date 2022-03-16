type FormFieldInfo = {
  name: keyof ValuesType
  label: string
}

export interface ValuesType {
  idType: string
  idReference: string
  expiryDate: string
  documentFile: string
}

export interface FormFieldType {
  idType: FormFieldInfo
  idReference: FormFieldInfo
  expiryDate: FormFieldInfo
  documentFile: FormFieldInfo
}

export const formFields: FormFieldType = {
  idType: {
    name: 'idType',
    label: 'ID Type',
  },
  idReference: {
    name: 'idReference',
    label: 'ID Reference',
  },
  expiryDate: {
    name: 'expiryDate',
    label: 'Expiry Date',
  },
  documentFile: {
    name: 'documentFile',
    label: 'Upload Document',
  },
}
