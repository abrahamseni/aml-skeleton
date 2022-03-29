import { useReapitConnect } from '@reapit/connect-session'
import { ContactModel, IdentityCheckModel } from '@reapit/foundations-ts-definitions'
import { now } from '../../../../utils/date'
import { reapitConnectBrowserSession } from '../../../../core/connect-session'
import { useCreateIdentityCheck, useUpdateIdentityCheck } from '../../../../platform-api/identity-check-api'
import { getFileExtensionsFromDataUrl } from '../../../../utils/file'
import { isDataUrl } from '../../../../utils/url'
import { ValuesType } from './form-schema/form-field'
import UserError from '../../../../exceptions/user-error'
import { logError } from 'utils/dev'

type ActionResponseListeners<TData = any, TError = any> = {
  onSuccess?: (data: TData) => void
  onError?: (error: TError) => void
  onSettled?: () => void
}

export const useSaveIdentityDocument = (identityDocumentIndex: 1 | 2) => {
  const { updateIdentityCheck } = useUpdateIdentityCheck()
  const { createIdentityCheck } = useCreateIdentityCheck()
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)

  async function saveIdentityDocument(...args: Parameters<typeof trySaveIdentityDocument>) {
    const options = args[3]
    try {
      await trySaveIdentityDocument(...args)
    } catch (err: any) {
      logError(err)
      options?.onError && options.onError(err)
    } finally {
      options?.onSettled && options.onSettled()
    }
  }

  async function trySaveIdentityDocument(
    contact: ContactModel,
    idCheck: IdentityCheckModel | undefined,
    values: ValuesType,
    options?: ActionResponseListeners,
  ) {
    const newIdentityDocument: any = {
      typeId: values.idType,
      details: values.idReference,
      expiry: values.expiryDate,
    }

    if (isDataUrl(values.documentFile)) {
      const extension = getFileExtensionsFromDataUrl(values.documentFile)
      newIdentityDocument.fileData = values.documentFile
      newIdentityDocument.name = `${contact.id}-${values.idType}-${values.idReference}.${extension}`
    }

    const identityDocumentPropName = 'identityDocument' + identityDocumentIndex

    if (idCheck) {
      await updateIdentityCheck(
        {
          id: idCheck.id!,
          _eTag: idCheck._eTag!,
          [identityDocumentPropName]: newIdentityDocument,
        },
        options,
      )
    } else {
      if (identityDocumentIndex === 2) {
        throw new Error(
          'Cannot update "identityDocument2" on identityCheck resource if "identityDocument1" property doesn\'t exist or identityCheck doesn\'t exist',
        )
      }
      const userCode = connectSession?.loginIdentity.userCode
      if (!userCode) {
        throw new UserError(
          'You are not currently logged in as negotiator. The Reapit Platform API only supports Identity Checks performed by negotiators. As such, you your data will not be saved and you will need to log in as another user to complete this action.',
        )
      }
      await createIdentityCheck(
        {
          contactId: contact.id!,
          identityDocument1: newIdentityDocument,
          status: 'pending',
          checkDate: now().format('YYYY-MM-DD'),
          negotiatorId: userCode,
        } as any,
        options,
      )
    }
  }

  return saveIdentityDocument
}

export const generateDocumentFilename = (contactId: string, idType: string, idReference: string, extension: string) => {
  let filename = ''
  contactId = contactId.trim()
  if (contactId !== '') {
    filename += contactId + '-'
  }
  idType = idType.trim()
  if (idType !== '') {
    filename += idType + '-'
  }
  idReference = idReference.trim()
  if (idReference !== '') {
    filename += idReference + '-'
  }
  if (filename !== '') {
    filename = filename.substring(0, filename.length - 1)
  }
  if (extension !== '') {
    filename += '.' + extension
  }

  if (filename !== '') {
    return filename
  } else {
    return 'document'
  }
}
