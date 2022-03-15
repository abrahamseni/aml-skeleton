import { useReapitConnect } from '@reapit/connect-session'
import { ContactModel, IdentityCheckModel } from '@reapit/foundations-ts-definitions'
import dayjs from 'dayjs'
import { reapitConnectBrowserSession } from '../../../../core/connect-session'
import { useCreateIdentityCheck, useUpdateIdentityCheck } from '../../../../platform-api/identity-check-api'
import { getFileExtensionsFromDataUrl } from '../../../../utils/file'
import { isDataUrl } from '../../../../utils/url'
import { ValuesType } from './form-schema/form-field'

export const useSaveIdentityDocument = (identityDocumentIndex: 1 | 2) => {
  const updateIdentityCheck = useUpdateIdentityCheck()
  const createIdentityCheck = useCreateIdentityCheck()
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)

  async function saveIdentityDocument(
    contact: ContactModel,
    idCheck: IdentityCheckModel | undefined,
    values: ValuesType,
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
      await updateIdentityCheck({
        id: idCheck.id!,
        _eTag: idCheck._eTag!,
        [identityDocumentPropName]: newIdentityDocument,
      })
    } else {
      if (identityDocumentIndex === 2) {
        throw new Error('Cannot create new identityCheck resource if "identityDocument1" property is not provided')
      }
      const userCode = connectSession?.loginIdentity.userCode
      if (!userCode) {
        console.log(
          'You are not currently logged in as negotiator. The Reapit Platform API only supports Identity Checks performed by negotiators. As such, you your data will not be saved and you will need to log in as another user to complete this action.',
        )
        return
      }
      await createIdentityCheck({
        contactId: contact.id!,
        identityDocument1: newIdentityDocument,
        status: 'pending',
        checkDate: dayjs().format('YYYY-MM-DD'),
        negotiatorId: userCode,
      } as any)
    }
  }

  return saveIdentityDocument
}