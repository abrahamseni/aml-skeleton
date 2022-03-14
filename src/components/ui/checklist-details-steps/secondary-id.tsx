import React from 'react'
import { Subtitle } from '@reapit/elements'
import IdForm, { ValuesType } from './id-form'

const defaultValues = {
  idType: 'BC',
  idReference: 'ABC123',
  expiryDate: '2023-01-23',
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
  }

  function goToPrevious() {
    console.log('previous')
  }

  function goToNext(values: ValuesType) {
    console.log('next')
    console.log(values)
  }

  return (
    <>
      <Subtitle>Secondary ID</Subtitle>
      <IdForm defaultValues={defaultValues} onSave={save} onPrevious={goToPrevious} onNext={goToNext} />
    </>
  )
}

export default PrimaryId
