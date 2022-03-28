export interface ValuesType {
  idType: string
  idReference: string
  expiryDate: string
  documentFile: string
}

export const formFields = {
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
} as const
