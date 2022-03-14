export interface ValuesType {
  declarationForm?: string
  reason?: string
  riskAssessmentForm?: string
  type?: string
}

export interface FormFieldType {
  declarationFormField: {
    name: 'declarationForm'
    label: string
  }
  typeField: {
    name: 'type'
    label: string
  }
  reasonField: {
    name: 'reason'
    label: string
  }
  riskAssessmentFormField: {
    name: 'riskAssessmentForm'
    label: string
  }
}

export const formField = (): FormFieldType => ({
  declarationFormField: {
    name: 'declarationForm',
    label: 'Upload Declaration File',
  },
  typeField: {
    name: 'type',
    label: 'Risk Assessment Type',
  },
  reasonField: {
    name: 'reason',
    label: 'Reason for Type',
  },
  riskAssessmentFormField: {
    name: 'riskAssessmentForm',
    label: 'Upload File',
  },
})
