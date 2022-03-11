import React from 'react'
import { DOCUMENT_TYPE, RISK_ASSESSMENT_TYPE } from '../constants/appointment-details'

interface GenerateOptionsType {
  value: string
  label: string
}

// generate years value
export const generateOptionsYearsOrMonths = (type: 'months' | 'years'): React.ReactNode => {
  const MAX_NUMBER_OF_YEARS = 101
  const MAX_NUMBER_OF_MONTHS = 12

  let max: number

  switch (type) {
    case 'years':
      max = MAX_NUMBER_OF_YEARS
      break
    case 'months':
      max = MAX_NUMBER_OF_MONTHS
      break
  }

  const optionArr: GenerateOptionsType[] = Array.from<unknown, GenerateOptionsType>({ length: max }, (_, i) => {
    if (type === 'months') i++
    return {
      value: i.toString(),
      label: i.toString(),
    } as GenerateOptionsType
  })

  return optionArr.map((v) => {
    return (
      <option key={v.value} value={v.value}>
        {v.label}
      </option>
    )
  })
}

// Available document type options
const optionsDocumentType: GenerateOptionsType[] = [
  { label: 'Please Select', value: '' },
  { label: DOCUMENT_TYPE.MORTGATE, value: DOCUMENT_TYPE.MORTGATE },
  { label: DOCUMENT_TYPE.BILL, value: DOCUMENT_TYPE.BILL },
  { label: DOCUMENT_TYPE.TAX_BILL, value: DOCUMENT_TYPE.TAX_BILL },
  { label: DOCUMENT_TYPE.DRIVING_LICENSE, value: DOCUMENT_TYPE.DRIVING_LICENSE },
  { label: DOCUMENT_TYPE.PHOTO_CARD_DRIVING_LICENSE, value: DOCUMENT_TYPE.PHOTO_CARD_DRIVING_LICENSE },
  { label: DOCUMENT_TYPE.INSURANCE_CERTIFICATE, value: DOCUMENT_TYPE.INSURANCE_CERTIFICATE },
  { label: DOCUMENT_TYPE.STATE_PENSION, value: DOCUMENT_TYPE.STATE_PENSION },
  { label: DOCUMENT_TYPE.CURRENT_BENEFIT, value: DOCUMENT_TYPE.CURRENT_BENEFIT },
  { label: DOCUMENT_TYPE.BANK_STATEMENT, value: DOCUMENT_TYPE.BANK_STATEMENT },
  { label: DOCUMENT_TYPE.HOUSE_PURCHASE, value: DOCUMENT_TYPE.HOUSE_PURCHASE },
  { label: DOCUMENT_TYPE.CREDIT_STATEMENT, value: DOCUMENT_TYPE.CREDIT_STATEMENT },
  { label: DOCUMENT_TYPE.TAX_NOTIFICATION, value: DOCUMENT_TYPE.TAX_NOTIFICATION },
  { label: DOCUMENT_TYPE.ACCOUNT_DOCUMENT, value: DOCUMENT_TYPE.ACCOUNT_DOCUMENT },
  { label: DOCUMENT_TYPE.LETTER_FROM_COUNCIL, value: DOCUMENT_TYPE.LETTER_FROM_COUNCIL },
  { label: DOCUMENT_TYPE.SMART_SEARCH_CCD_REPORT, value: DOCUMENT_TYPE.SMART_SEARCH_CCD_REPORT },
]

// Available risk assessment type options
const optionsRiskAssessmentType: GenerateOptionsType[] = [
  { label: 'Please select...', value: '' },
  { label: RISK_ASSESSMENT_TYPE.SIMPLIFIED, value: RISK_ASSESSMENT_TYPE.SIMPLIFIED },
  { label: RISK_ASSESSMENT_TYPE.NORMAL, value: RISK_ASSESSMENT_TYPE.NORMAL },
  { label: RISK_ASSESSMENT_TYPE.ENHANCED, value: RISK_ASSESSMENT_TYPE.ENHANCED },
]

export const generateOptionsType = (type: 'documentType' | 'riskAssessmentType'): React.ReactNode => {
  let currentTypeArray: GenerateOptionsType[] = []
  switch (type) {
    case 'documentType':
      currentTypeArray = optionsDocumentType
      break
    case 'riskAssessmentType':
      currentTypeArray = optionsRiskAssessmentType
      break
  }

  return currentTypeArray.map((v) => {
    return (
      <option key={v.label} value={v.value}>
        {v.label}
      </option>
    )
  })
}
