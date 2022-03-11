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
    case 'primaryAddress.buildingName':
      errorMessage = errors.primaryAddress?.buildingName?.message
      break
    case 'secondaryAddress.buildingName':
      errorMessage = errors.secondaryAddress?.buildingName?.message
      break
    case 'primaryAddress.buildingNumber':
      errorMessage = errors.primaryAddress?.buildingNumber?.message
      break
    case 'secondaryAddress.buildingNumber':
      errorMessage = errors.secondaryAddress?.buildingNumber?.message
      break
    case 'primaryAddress.postcode':
      errorMessage = errors.primaryAddress?.postcode?.message
      break
    case 'secondaryAddress.postcode':
      errorMessage = errors.secondaryAddress?.postcode?.message
      break
    case 'primaryAddress.line1':
      errorMessage = errors.primaryAddress?.line1?.message
      break
    case 'secondaryAddress.line1':
      errorMessage = errors.secondaryAddress?.line1?.message
      break
    case 'primaryAddress.line2':
      errorMessage = errors.primaryAddress?.line2?.message
      break
    case 'secondaryAddress.line2':
      errorMessage = errors.secondaryAddress?.line2?.message
      break
    case 'primaryAddress.line3':
      errorMessage = errors.primaryAddress?.line3?.message
      break
    case 'secondaryAddress.line3':
      errorMessage = errors.secondaryAddress?.line3?.message
      break
    case 'primaryAddress.line4':
      errorMessage = errors.primaryAddress?.line4?.message
      break
    case 'secondaryAddress.line4':
      errorMessage = errors.secondaryAddress?.line4?.message
      break
    case 'metadata.primaryAddress.month':
      errorMessage = errors.metadata?.primaryAddress?.month?.message
      break
    case 'metadata.secondaryAddress.month':
      errorMessage = errors.metadata?.secondaryAddress?.month?.message
      break
    case 'metadata.primaryAddress.year':
      errorMessage = errors.metadata?.primaryAddress?.year?.message
      break
    case 'metadata.secondaryAddress.year':
      errorMessage = errors.metadata?.secondaryAddress?.year?.message
      break
    case 'metadata.primaryAddress.documentImage':
      errorMessage = errors.metadata?.primaryAddress?.documentImage?.message
      break
    case 'metadata.secondaryAddress.documentImage':
      errorMessage = errors.metadata?.secondaryAddress?.documentImage?.message
      break
    case 'metadata.primaryAddress.documentType':
      errorMessage = errors.metadata?.primaryAddress?.documentType?.message
      break
    case 'metadata.secondaryAddress.documentType':
      errorMessage = errors.metadata?.secondaryAddress?.documentType?.message
      break
  }

  if (errorMessage) {
    return <InputError message={errorMessage} />
  }
}
