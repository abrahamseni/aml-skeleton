import { notificationMessage } from '../constants/notification-message'
import { UserErrorName } from '../exceptions/user-error'

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

export const getFormSaveErrorMessage = (formName: string, error: any) => {
  if (error.name === UserErrorName) {
    return error.message
  }

  if (!error.response) {
    return notificationMessage.FORM_SAVE_ERROR(formName)
  }

  const data = error.response.data || {}

  if (typeof data.description !== 'string') {
    return notificationMessage.FORM_SAVE_ERROR(formName)
  }

  if (data.description.startsWith('Precondition failed: The ETag provided does not match the current version')) {
    return notificationMessage.NOT_MATCH_E_TAG
  }

  return notificationMessage.FORM_SAVE_ERROR(formName)
}
