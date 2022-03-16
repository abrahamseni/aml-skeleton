import React from 'react'
import {
  elMb2,
  InputGroup,
  Label,
  Select,
  InputWrap,
  InputWrapFull,
  elMt4,
  FlexContainer,
  FileInput,
  elPl3,
} from '@reapit/elements'
import { AvailableFormFieldType, formFields, ValuesType } from './form-schema'
import { UseFormReturn } from 'react-hook-form'
import { displayErrorMessage } from '../../../../utils/error-message'
import { generateLabelField, generateOptionsType, generateOptionsYearsOrMonths } from '../../../../utils/generator'
import { cx } from '@linaria/core'
import { order0 } from './__styles__'

import DocumentPreviewModal from '../id-form/document-preview-modal'

interface FormFieldProps {
  /**
   * Available render option between primaryAddress and secondaryAddress
   */
  identity: 'primaryAddress' | 'secondaryAddress'
  /**
   * Pass Reach Hook Form hook
   */
  rhfProps: UseFormReturn<ValuesType, any>
}

export const FormField: React.FC<FormFieldProps> = ({ identity, rhfProps }): React.ReactElement => {
  // local state - modal handler
  const [imagePrimaryAddress, setImagePrimaryAddress] = React.useState<boolean>(false)
  const [imageSecondaryAddress, setImageSecondaryAddress] = React.useState<boolean>(false)

  // local function - modal handler
  const modalHandler = (option: 'open' | 'close'): void => {
    if (identity === 'primaryAddress') {
      setImagePrimaryAddress(option === 'open' ? true : false)
    } else {
      setImageSecondaryAddress(option === 'open' ? true : false)
    }
  }
  // passed useForm hook from parent
  const { register, getValues, formState } = rhfProps

  // adjusting field name and field label with initialized value
  const {
    typeField,
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
      <InputWrapFull>
        <InputWrap>
          <InputGroup type="hidden" {...register(typeField.name)} />
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            label={generateLabelField(buildingNameField.label)}
            autoComplete="off"
            {...register(buildingNameField.name)}
          />
          {displayErrorMessage<AvailableFormFieldType, ValuesType>(buildingNameField.name, formState)}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            label={generateLabelField(buildingNumberField.label)}
            autoComplete="off"
            {...register(buildingNumberField.name)}
          />
          {displayErrorMessage<AvailableFormFieldType, ValuesType>(buildingNumberField.name, formState)}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            label={generateLabelField(postcodeField.label, true)}
            autoComplete="off"
            {...register(postcodeField.name)}
          />
          {displayErrorMessage<AvailableFormFieldType, ValuesType>(postcodeField.name, formState)}
        </InputWrap>
      </InputWrapFull>
      <InputWrapFull>
        <InputWrap>
          <InputGroup
            type="text"
            label={generateLabelField(line1Field.label, true)}
            autoComplete="off"
            {...register(line1Field.name)}
          />
          {displayErrorMessage<AvailableFormFieldType, ValuesType>(line1Field.name, formState)}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            label={generateLabelField(line2Field.label)}
            autoComplete="off"
            {...register(line2Field.name)}
          />
          {displayErrorMessage<AvailableFormFieldType, ValuesType>(line2Field.name, formState)}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            label={generateLabelField(line3Field.label, true)}
            autoComplete="off"
            {...register(line3Field.name)}
          />
          {displayErrorMessage<AvailableFormFieldType, ValuesType>(line3Field.name, formState)}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            label={generateLabelField(line4Field.label)}
            autoComplete="off"
            {...register(line4Field.name)}
          />
          {displayErrorMessage<AvailableFormFieldType, ValuesType>(line4Field.name, formState)}
        </InputWrap>
      </InputWrapFull>
      <InputWrapFull>
        <InputWrap>
          <InputGroup>
            <Label>{generateLabelField(yearField.label, true)}</Label>
            <Select {...register(yearField.name)}>{generateOptionsYearsOrMonths('years')}</Select>
            {displayErrorMessage<AvailableFormFieldType, ValuesType>(yearField.name, formState)}
          </InputGroup>
        </InputWrap>
        <InputWrap>
          <InputGroup>
            <Label>{generateLabelField(monthField.label, true)}</Label>
            <Select {...register(monthField.name)}>{generateOptionsYearsOrMonths('months')}</Select>
            {displayErrorMessage<AvailableFormFieldType, ValuesType>(monthField.name, formState)}
          </InputGroup>
        </InputWrap>
        <InputWrap>
          <InputGroup>
            <Label>{generateLabelField(documentTypeField.label, true)}</Label>
            <Select {...register(documentTypeField.name)}>{generateOptionsType('documentType')}</Select>
            {displayErrorMessage<AvailableFormFieldType, ValuesType>(documentTypeField.name, formState)}
          </InputGroup>
        </InputWrap>
        <InputWrap className={elMt4}>
          <FlexContainer isFlexColumn className={elPl3}>
            <Label className={cx(elMb2, order0)}>{generateLabelField(documentImageField.label, true)}</Label>
            <FileInput
              {...register(documentImageField.name)}
              defaultValue={getValues(documentImageField.name)}
              onFileView={() => modalHandler('open')}
              accept="image/jpeg, image/png, application/pdf"
            />
            {displayErrorMessage<AvailableFormFieldType, ValuesType>(documentImageField.name, formState)}
          </FlexContainer>
        </InputWrap>
      </InputWrapFull>
      {/* Document Image Address */}
      <DocumentPreviewModal
        src={getValues(documentImageField.name)}
        isOpen={identity === 'primaryAddress' ? imagePrimaryAddress : imageSecondaryAddress}
        onModalClose={() => modalHandler('close')}
      />
    </>
  )
}
