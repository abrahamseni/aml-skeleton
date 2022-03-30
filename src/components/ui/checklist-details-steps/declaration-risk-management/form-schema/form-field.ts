export interface ValuesType {
  declarationForm?: string
  reason?: string
  riskAssessmentForm?: string
  type?: string
}

export const formField = () =>
  ({
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
  } as const)
