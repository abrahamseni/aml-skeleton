import React from 'react'
import { displayErrorMessage } from 'utils/error-message'

type Props = {
  name: string
  errors: any
  'data-testid'?: string
}

export const ErrorMessage = ({ name, errors, 'data-testid': testID }: Props) => {
  const errorMessage = displayErrorMessage(name, errors)

  function getTestID() {
    if (testID) {
      return testID
    }

    return `error.${name}`
  }

  if (!errorMessage) {
    return null
  }

  return (
    <p data-testid={getTestID()} className="el-input-error">
      {errorMessage}
    </p>
  )
}

export default ErrorMessage
