import React, { useState } from 'react'
import { Subtitle, useSnack } from '@reapit/elements'
import IdForm, { ValuesType } from './id-form'
import { ContactModel, IdentityCheckModel, ListItemModel } from '@reapit/foundations-ts-definitions'
import { useSaveIdentityDocument } from './id-form/identity-check-action'
import { notificationMessage } from 'constants/notification-message'

// const defaultValues = {
//   idType: 'DL',
//   idReference: 'Hello',
//   expiryDate: '',
//   // documentFile: 'https://via.placeholder.com/150',
//   documentFile: 'MKT22000005', // BDF15002338
// }

const defaultValues = {
  idType: '',
  idReference: '',
  expiryDate: '',
  documentFile: '',
}

export type PrimaryIdProps = {
  contact: ContactModel
  idCheck?: IdentityCheckModel
  idDocTypes?: Required<ListItemModel>[]
  onSaved?: () => void
}

const PrimaryId = ({ contact, idCheck, idDocTypes, onSaved }: PrimaryIdProps) => {
  const saveIdentityDocument = useSaveIdentityDocument(1)
  const [loading, setLoading] = useState(false)
  const { success, error } = useSnack()

  function getDefaultValues(): ValuesType {
    if (!idCheck) {
      return defaultValues
    }
    if (!idCheck.identityDocument1) {
      return defaultValues
    }
    const idDoc = idCheck.identityDocument1
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
    if (!idCheck.identityDocument2) {
      return idDocTypes
    }
    return idDocTypes?.filter((type) => type.id !== idCheck.identityDocument2?.typeId)
  }

  async function save(values: ValuesType) {
    await doSave(values)
  }

  function goToPrevious() {
    console.log('previous')
  }

  async function goToNext(values: ValuesType) {
    await doSave(values)
  }

  async function doSave(values: ValuesType) {
    setLoading(true)

    saveIdentityDocument(contact, idCheck, values, {
      onSuccess() {
        success(notificationMessage.PI1_SUCCESS)
        onSaved && onSaved()
      },
      onError() {
        error(notificationMessage.PI1_ERROR)
      },
      onSettled() {
        setLoading(false)
      },
    })
  }

  return (
    <>
      <Subtitle>Primary ID</Subtitle>
      <IdForm
        defaultValues={getDefaultValues()}
        idDocTypes={getIdDocTypes()}
        rpsRef={contact.id}
        loading={loading}
        onSave={save}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />
    </>
  )
}

export default PrimaryId
