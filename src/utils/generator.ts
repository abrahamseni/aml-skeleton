import { GenerateTabsContentResult } from 'components/ui/search/checklist-detail'
import { DOCUMENT_TYPE, RISK_ASSESSMENT_TYPE } from '../constants/appointment-details'

interface GenerateOptionsType {
  value: string
  label: string
}

export const generateOptionsYearsOrMonths = (type: 'months' | 'years'): GenerateOptionsType[] => {
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

  return Array.from<unknown, GenerateOptionsType>({ length: max }, (_, i) => {
    if (type === 'months') i++
    return {
      value: i.toString(),
      label: i.toString(),
    } as GenerateOptionsType
  })
}

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

const optionsRiskAssessmentType: GenerateOptionsType[] = [
  { label: 'Please select...', value: '' },
  { label: RISK_ASSESSMENT_TYPE.SIMPLIFIED, value: RISK_ASSESSMENT_TYPE.SIMPLIFIED },
  { label: RISK_ASSESSMENT_TYPE.NORMAL, value: RISK_ASSESSMENT_TYPE.NORMAL },
  { label: RISK_ASSESSMENT_TYPE.ENHANCED, value: RISK_ASSESSMENT_TYPE.ENHANCED },
]

export const generateOptionsType = (type: 'documentType' | 'riskAssessmentType'): GenerateOptionsType[] => {
  let currentTypeArray: GenerateOptionsType[] = []
  switch (type) {
    case 'documentType':
      currentTypeArray = optionsDocumentType
      break
    case 'riskAssessmentType':
      currentTypeArray = optionsRiskAssessmentType
      break
  }

  return currentTypeArray
}

export const generateLabelField = (text: string, isRequired: boolean = false): string => {
  if (isRequired) return `${text} *`
  return text
}

export const generateTestId = (test: string): string => {
  return `test.${test}`
}
interface GenerateProgressBarProps {
  tabContents: GenerateTabsContentResult[]
}

export interface GenerateProgressBarResult {
  notComplete: number
  complete: number
  total: number
}

export const generateProgressBarResult = ({ tabContents }: GenerateProgressBarProps): GenerateProgressBarResult => {
  const result: GenerateProgressBarResult = {
    notComplete: 0,
    complete: 0,
    total: 0,
  }

  tabContents.map((v) => {
    switch (v.status) {
      case true:
        result.complete += 1
        result.total += 1
        break
      default:
        result.notComplete += 1
        result.total += 1
    }
  })
  return result
}

export const generateNewObject = (keys: string[], object?: object, type: 'pick' | 'remove' = 'remove') => {
  if (!object) return

  let clonedObject

  switch (type) {
    case 'pick':
      clonedObject = {}
      keys.forEach((key) => (clonedObject[key] = object[key]))
      break
    case 'remove':
      clonedObject = { ...object }
      keys.forEach((key) => delete clonedObject[key])
      break
  }

  return clonedObject
}
