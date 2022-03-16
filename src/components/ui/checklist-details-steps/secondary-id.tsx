import React, { useState } from 'react'
import { Subtitle } from '@reapit/elements'
import IdForm, { ValuesType } from './id-form'
import { ContactModel, IdentityCheckModel } from '@reapit/foundations-ts-definitions'
import { useSaveIdentityDocument } from './id-form/identity-check-action'

const defaultValues = {
  idType: '',
  idReference: '',
  expiryDate: '',
  documentFile: '',
}

type Props = {
  contact: ContactModel
  idCheck?: IdentityCheckModel
  onSaved?: () => void
}

const SecondaryId = ({ contact, idCheck, onSaved }: Props) => {
  const saveIdentityDocument = useSaveIdentityDocument(2)
  const [loading, setLoading] = useState(false)

  function getDefaultValues(): ValuesType {
    if (!idCheck) {
      return defaultValues
    }
    if (!idCheck.identityDocument2) {
      return defaultValues
    }
    const idDoc = idCheck.identityDocument2
    return {
      idType: idDoc.typeId!,
      idReference: idDoc.details!,
      expiryDate: idDoc.expiry!,
      documentFile: idDoc.documentId!,
    }
  }

  function getNoticeText() {
    const text = 'Please ensure the Primary ID has been completed before adding a Secondary ID'
    if (!idCheck) {
      return text
    }
  }

  async function save(values: ValuesType) {
    console.log('save')

    await doSave(values)
  }

  function goToPrevious() {
    console.log('previous')
  }

  async function goToNext(values: ValuesType) {
    console.log('next')

    await doSave(values)
  }

  async function doSave(values: ValuesType) {
    setLoading(true)
    await saveIdentityDocument(contact, idCheck, values)
    setLoading(false)

    onSaved && onSaved()
  }

  return (
    <>
      <Subtitle>Secondary ID</Subtitle>
      <IdForm
        defaultValues={getDefaultValues()}
        rpsRef={contact.id}
        noticeText={getNoticeText()}
        loading={loading}
        disabled={idCheck ? false : true}
        onSave={save}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />
    </>
  )
}

export default SecondaryId
