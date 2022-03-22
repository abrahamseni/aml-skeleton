import { useReapitConnect } from '@reapit/connect-session'
import { ContactModel, IdentityCheckModel } from '@reapit/foundations-ts-definitions'
import { now } from 'utils/date'
import { reapitConnectBrowserSession } from '../../../../core/connect-session'
import { useCreateIdentityCheck, useUpdateIdentityCheck } from '../../../../platform-api/identity-check-api'
import { getFileExtensionsFromDataUrl } from '../../../../utils/file'
import { isDataUrl } from '../../../../utils/url'
import { ValuesType } from './form-schema/form-field'

type ActionResponseListeners<TData = any, TError = any> = {
  onSuccess?: (data: TData) => void
  onError?: (error: TError) => void
  onSettled?: () => void
}

export const useSaveIdentityDocument = (identityDocumentIndex: 1 | 2) => {
  const { updateIdentityCheck } = useUpdateIdentityCheck()
  const { createIdentityCheck } = useCreateIdentityCheck()
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)

  function saveIdentityDocument(
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
      updateIdentityCheck(
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
        options?.onError &&
          options.onError(
            new Error(
              'You are not currently logged in as negotiator. The Reapit Platform API only supports Identity Checks performed by negotiators. As such, you your data will not be saved and you will need to log in as another user to complete this action.',
            ),
          )
        return
      }
      createIdentityCheck(
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
