import React, { useState } from 'react'
import { Subtitle, useSnack } from '@reapit/elements'
import IdForm, { ValuesType } from './id-form'
import { ContactModel, IdentityCheckModel, ListItemModel } from '@reapit/foundations-ts-definitions'
import { useSaveIdentityDocument } from './id-form/identity-check-action'
import { notificationMessage } from 'constants/notification-message'

const defaultValues = {
  idType: '',
  idReference: '',
  expiryDate: '',
  documentFile: '',
}

export type SecondaryIdProps = {
  contact: ContactModel
  idCheck?: IdentityCheckModel
  idDocTypes?: Required<ListItemModel>[]
  onSaved?: () => void
}

const SecondaryId = ({ contact, idCheck, idDocTypes, onSaved }: SecondaryIdProps) => {
  const saveIdentityDocument = useSaveIdentityDocument(2)
  const [loading, setLoading] = useState(false)
  const { success, error } = useSnack()

  function getDefaultValues(): ValuesType {
    if (!idCheck) {
      return defaultValues
    }
    if (!idCheck.identityDocument2) {
      return defaultValues
    }
    const idDoc = idCheck.identityDocument2
    return {
      idType: idDoc.typeId || '',
      idReference: idDoc.details || '',
      expiryDate: idDoc.expiry || '',
      documentFile: idDoc.documentId || '',
    }
  }

  function getIdDocTypes() {
    if (!idCheck) {
      return idDocTypes
    }
    if (!idCheck.identityDocument1) {
      return idDocTypes
    }
    return idDocTypes?.filter((type) => type.id !== idCheck.identityDocument1?.typeId)
  }

  function getNoticeText() {
    const text = 'Please ensure the Primary ID has been completed before adding a Secondary ID'
    if (!idCheck) {
      return text
    }
  }

  async function save(values: ValuesType) {
    setLoading(true)

    saveIdentityDocument(contact, idCheck, values, {
      onSuccess() {
        success(notificationMessage.PI2_SUCCESS)
        onSaved && onSaved()
      },
      onError() {
        error(notificationMessage.PI2_ERROR)
      },
      onSettled() {
        setLoading(false)
      },
    })
  }

  return (
    <>
      <Subtitle>Secondary ID</Subtitle>
      <IdForm
        defaultValues={getDefaultValues()}
        idDocTypes={getIdDocTypes()}
        rpsRef={contact.id}
        noticeText={getNoticeText()}
        loading={loading}
        disabled={idCheck ? false : true}
        onSave={save}
      />
    </>
  )
}

export default SecondaryId
