export const displayErrorMessage = (fieldName: string, errors: any): string | undefined => {
  const splittedFieldsName = fieldName.split('.')

  let errorObj: any = errors
  for (let i = 0; i < splittedFieldsName.length; i++) {
    const err = errorObj[splittedFieldsName[i]]
    if (err === undefined) {
      return undefined
    }

    errorObj = err
  }

  if (typeof errorObj.message !== 'string') {
    return undefined
  }

  return errorObj.message
}
