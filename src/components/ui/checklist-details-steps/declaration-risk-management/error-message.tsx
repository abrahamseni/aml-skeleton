import React from 'react'
import { InputError } from '@reapit/elements'
import { FormState } from 'react-hook-form'
import { AvailableFormFieldType, ValuesType } from './form-schema/form-field'

interface DisplayErrorMessageProps {
  fieldName: AvailableFormFieldType
  formState: FormState<ValuesType>
}

export const displayErrorMessage = ({ fieldName, formState }: DisplayErrorMessageProps): React.ReactNode => {
  const { errors } = formState

  let errorMessage: string | undefined
  switch (fieldName) {
    case 'declarationForm':
      errorMessage = errors.declarationForm?.message
      break
    case 'riskAssessmentForm':
      errorMessage = errors.riskAssessmentForm?.message
      break
    case 'reason':
      errorMessage = errors.reason?.message
      break
    case 'type':
      errorMessage = errors.type?.message
      break
  }

  if (errorMessage) {
    return <InputError message={errorMessage} />
  }
}
