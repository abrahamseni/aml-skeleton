import React from 'react'
import { cx } from '@linaria/core'
import {
  Button,
  ButtonGroup,
  elMb2,
  elMt8,
  elW11,
  elW3,
  elW4,
  elW5,
  elW6,
  elWFull,
  FlexContainer,
  Input,
  InputAddOn,
  InputGroup,
  Label,
  Modal,
  Select,
  FileInput,
  InputError,
} from '@reapit/elements'
import { formFields, ValuesType } from './form-schema/form-field'
import { UseFormReturn } from 'react-hook-form'
import { DOCUMENT_TYPE } from '../../../../constants/appointment-details'

const MIN_NUMBER_OF_YEARS = 0
const MAX_NUMBER_OF_YEARS = 100

const MIN_NUMBER_OF_MONTHS = 1
const MAX_NUMBER_OF_MONTHS = 12

// generate years value
const generateOptions = (type: 'months' | 'years'): React.ReactNode[] => {
  let min: number
  let max: number
  switch (type) {
    case 'years':
      min = MIN_NUMBER_OF_YEARS
      max = MAX_NUMBER_OF_YEARS
      break
    case 'months':
      min = MIN_NUMBER_OF_MONTHS
      max = MAX_NUMBER_OF_MONTHS
      break
  }

  const optionArr: React.ReactNode[] = []
  while (min <= max) {
    const option = (
      <>
        <option key={min} value={min}>
          {min}
        </option>
      </>
    )
    optionArr.push(option)
    min++
  }
  return optionArr
}

// Available document type options
const optionsDocumentType = [
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

const generateOptionDocumentType = () => {
  return optionsDocumentType.map((v) => (
    <option key={v.label} value={v.value}>
      {v.label}
    </option>
  ))
}

interface FormFieldProps {
  identity: 'primaryAddress' | 'secondaryAddress'
  /**
   * Pass Reach Hook Form hook
   */
  rhfProps: UseFormReturn<ValuesType, any>
}

const FormField: React.FC<FormFieldProps> = ({ identity, rhfProps }): React.ReactElement => {
  const [isModalDocumentAOpen, setIsModalDocumentAOpen] = React.useState<boolean>(false)
  const [isModalDocumentBOpen, setIsModalDocumentBOpen] = React.useState<boolean>(false)

  const {
    register,
    watch,
    getValues,
    formState: { errors },
  } = rhfProps

  const {
    buildingNameField,
    buildingNumberField,
    line1Field,
    line2Field,
    line3Field,
    line4Field,
    postcodeField,
    documentImageField,
    monthField,
    yearField,
    documentTypeField,
  } = formFields(identity)

  return (
    <>
      <FlexContainer>
        <div className={elW4}>
          <InputGroup className={elW11}>
            <Input type="text" {...register(buildingNameField.name)} placeholder={buildingNameField.label} />
            <Label>Building Name</Label>
          </InputGroup>
          {errors.primaryAddress?.buildingName && <InputError message={errors.primaryAddress?.buildingName.message!} />}
        </div>
        <div className={elW4}>
          <InputGroup className={elW11}>
            <Label>Building Number</Label>
            <Input type="text" {...register(buildingNumberField.name)} placeholder={buildingNumberField.label} />
          </InputGroup>
        </div>
        <div className={elW4}>
          <InputGroup className={elWFull}>
            <Label>Post Code</Label>
            <Input type="text" {...register(postcodeField.name)} placeholder={postcodeField.label} />
            <InputAddOn>Required</InputAddOn>
          </InputGroup>
        </div>
      </FlexContainer>
      <FlexContainer className={cx(elWFull, elMt8)} isFlexJustifyBetween>
        <div className={elW4}>
          <InputGroup className={elW11}>
            <Label>Line 1</Label>
            <Input type="text" {...register(line1Field.name)} placeholder={line1Field.label} />
            <InputAddOn>Required</InputAddOn>
          </InputGroup>
        </div>
        <div className={elW4}>
          <InputGroup className={elW11}>
            <Label>Line 2</Label>
            <Input type="text" placeholder={line2Field.label} {...register(line2Field.name)} />
          </InputGroup>
        </div>
        <div className={elW4}>
          <InputGroup className={elW11}>
            <Label>Line 3</Label>
            <Input type="text" placeholder={line3Field.label} {...register(line3Field.name)} />
            <InputAddOn>Required</InputAddOn>
          </InputGroup>
        </div>
        <div className={elW4}>
          <InputGroup className={elWFull}>
            <Label>Line 4</Label>
            <Input type="text" placeholder={line4Field.label} {...register(line4Field.name)} />
          </InputGroup>
        </div>
      </FlexContainer>
      <FlexContainer className={cx(elWFull, elMt8)} isFlexJustifyBetween>
        <div className={elW3}>
          <Label>Number of Years at Address</Label>
          <Select className={elW11} {...register(yearField.name)} placeholder={yearField.label}>
            {generateOptions('years')}
          </Select>
        </div>
        <div className={elW3}>
          <Label>Number of Months at Address</Label>
          <Select className={elW11} {...register(monthField.name)} placeholder={monthField.label}>
            {generateOptions('months')}
          </Select>
        </div>
        <div className={elW5}>
          <Label>Document Type</Label>
          <Select className={elW11} {...register(documentTypeField.name)} placeholder={documentTypeField.label}>
            {generateOptionDocumentType()}
          </Select>
        </div>
        <div className={elW6}>
          <InputGroup className={elWFull}>
            <Label style={{ order: 0 }} className={elMb2}>
              Document Image Primary Address
            </Label>
            <FileInput
              {...register(documentImageField.name)}
              placeholderText={documentImageField.label}
              defaultValue={getValues(documentImageField.name)}
              onFileView={() => {
                identity === 'primaryAddress' ? setIsModalDocumentAOpen(true) : setIsModalDocumentBOpen(true)
              }}
            />
            {errors.metadata?.primaryAddress && (
              <>
                <InputError message={errors.metadata?.primaryAddress.documentImage?.message!} />
              </>
            )}
          </InputGroup>
        </div>
      </FlexContainer>
      {/* Document Image Primary Address */}
      <Modal isOpen={isModalDocumentAOpen} title="Image Preview" onModalClose={() => setIsModalDocumentAOpen(false)}>
        <FlexContainer isFlexAlignCenter isFlexJustifyCenter>
          {watch(documentImageField.name) && <img src={watch(documentImageField.name)} height="auto" width="150px" />}
        </FlexContainer>
        <ButtonGroup alignment="right">
          <Button intent="low" onClick={() => setIsModalDocumentAOpen(false)}>
            Close
          </Button>
        </ButtonGroup>
      </Modal>
      {/* Document Image Secondary Address */}
      <Modal isOpen={isModalDocumentBOpen} title="Image Preview" onModalClose={() => setIsModalDocumentBOpen(false)}>
        <FlexContainer isFlexAlignCenter isFlexJustifyCenter>
          {watch(documentImageField.name) && <img src={watch(documentImageField.name)} height="auto" width="150px" />}
        </FlexContainer>
        <ButtonGroup alignment="right">
          <Button intent="low" onClick={() => setIsModalDocumentBOpen(false)}>
            Close
          </Button>
        </ButtonGroup>
      </Modal>
    </>
  )
}

export default FormField
