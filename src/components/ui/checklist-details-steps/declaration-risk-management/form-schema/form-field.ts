export interface ValuesType {
  declarationForm?: string
  reason?: string
  riskAssessmentForm?: string
  type?: string
}

export type AvailableFormFieldType = 'declarationForm' | 'type' | 'reason' | 'riskAssessmentForm'

export interface FormFieldType {
  declarationFormField: {
    name: Extract<AvailableFormFieldType, 'declarationForm'>
    label: string
  }
  typeField: {
    name: Extract<AvailableFormFieldType, 'type'>
    label: string
  }
  reasonField: {
    name: Extract<AvailableFormFieldType, 'reason'>
    label: string
  }
  riskAssessmentFormField: {
    name: Extract<AvailableFormFieldType, 'riskAssessmentForm'>
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
    label: 'Upload Risk Assessment File',
  },
})
