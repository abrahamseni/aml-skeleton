import React from 'react'
import { Subtitle } from '@reapit/elements'
import IdForm, { ValuesType } from './id-form'
import { isDataUrl } from '../../../utils/url'

const defaultValues = {
  idType: 'DL',
  idReference: 'Hello',
  expiryDate: '',
  // documentFile: 'https://via.placeholder.com/150',
  documentFile: 'MKT22000005', // BDF15002338
}

type Props = {
  data: {}
}

const PrimaryId = ({ data }: Props) => {
  data

  function save(values: ValuesType) {
    console.log('save')
    console.log(values)

    createUpdateIdentityCheckParams(values)
  }

  function goToPrevious() {
    console.log('previous')
  }

  function goToNext(values: ValuesType) {
    console.log('next')
    console.log(values)

    createUpdateIdentityCheckParams(values)
  }

  function createUpdateIdentityCheckParams(formValues: any) {
    const params = {}
    if (isDataUrl(formValues.documentFile)) {
      params['fileData'] = formValues.documentFile
    }

    return params
  }

  return (
    <>
      <Subtitle>Primary ID</Subtitle>
      <IdForm defaultValues={defaultValues} onSave={save} onPrevious={goToPrevious} onNext={goToNext} />
    </>
  )
}

export default PrimaryId
