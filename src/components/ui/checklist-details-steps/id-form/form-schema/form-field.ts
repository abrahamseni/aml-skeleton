type FormFieldInfo = {
  name: string,
  label: string,
}

export interface ValuesType {
  idType: string,
  idReference: string,
  expiryDate: string,
  documentFile: string
}

interface IdFormFieldInfo extends FormFieldInfo {
  name: keyof ValuesType
}

export interface FormFieldType {
  idType: IdFormFieldInfo
  idReference: IdFormFieldInfo
  expiryDate: IdFormFieldInfo
  documentFile: IdFormFieldInfo
}

export const formFields: FormFieldType = {
  idType: {
    name: 'idType',
    label: 'ID Type'
  },
  idReference: {
    name: 'idReference',
    label: 'ID Reference'
  },
  expiryDate: {
    name: 'expiryDate',
    label: 'Expiry Date'
  },
  documentFile: {
    name: 'documentFile',
    label: 'Upload Document'
  },
}
