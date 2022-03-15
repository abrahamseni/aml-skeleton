import React, { useState } from 'react'
import { Subtitle } from '@reapit/elements'
import IdForm, { ValuesType } from './id-form'
import { ContactModel, IdentityCheckModel } from '@reapit/foundations-ts-definitions'
import { useSaveIdentityDocument } from './id-form/identity-check-action'

const defaultValues = {
  idType: 'DL',
  idReference: 'Hello',
  expiryDate: '',
  // documentFile: 'https://via.placeholder.com/150',
  documentFile: 'MKT22000005', // BDF15002338
}

type Props = {
  contact: ContactModel
  idCheck?: IdentityCheckModel
  onSaved?: () => void
}

const PrimaryId = ({ contact, idCheck, onSaved }: Props) => {
  const saveIdentityDocument = useSaveIdentityDocument(1)
  const [loading, setLoading] = useState(false)

  function getDefaultValues(): ValuesType {
    if (!idCheck) {
      return defaultValues
    }
    const idDoc = idCheck.identityDocument1!
    return {
      idType: idDoc.typeId!,
      idReference: idDoc.details!,
      expiryDate: idDoc.expiry!,
      documentFile: idDoc.documentId!,
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
      <Subtitle>Primary ID</Subtitle>
      <IdForm
        defaultValues={getDefaultValues()}
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
