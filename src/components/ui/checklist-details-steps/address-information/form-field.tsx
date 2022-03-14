import React from 'react'
import { elMb2, InputGroup, Label, Select, FileInput, InputWrap, InputWrapFull, elMt4 } from '@reapit/elements'
import { AvailableFormFieldType, formFields, ValuesType } from './form-schema'
import { UseFormReturn } from 'react-hook-form'
import { displayErrorMessage } from '../../../../utils/error-message'
import { generateLabelField, generateOptionsType, generateOptionsYearsOrMonths } from '../../../../utils/generator'
import ModalDocument from '../../modal-document/modal-document'
import { cx } from '@linaria/core'
import { order0 } from './__styles__'

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
  // modal handler
  const documentImagePrimaryModalHandler = React.useRef<React.ElementRef<typeof ModalDocument>>(null)
  const documentImageSecondaryModalHandler = React.useRef<React.ElementRef<typeof ModalDocument>>(null)

  const documentImageModalHandler =
    identity === 'primaryAddress' ? documentImagePrimaryModalHandler : documentImageSecondaryModalHandler
  // local state - modal A (soon will refactor)

  // passed useForm hook from parent
  const { register, watch, getValues, formState } = rhfProps

  // adjusting field name and field label with initialized value
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
      <InputWrapFull>
        <InputWrap>
          <InputGroup
            type="text"
            placeholder={buildingNameField.label}
            label={generateLabelField(buildingNameField.label)}
            autoComplete="off"
            {...register(buildingNameField.name)}
          />
          {displayErrorMessage<AvailableFormFieldType, ValuesType>(buildingNameField.name, formState)}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            placeholder={buildingNumberField.label}
            label={generateLabelField(buildingNumberField.label)}
            autoComplete="off"
            {...register(buildingNumberField.name)}
          />
          {displayErrorMessage<AvailableFormFieldType, ValuesType>(buildingNumberField.name, formState)}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            placeholder={postcodeField.label}
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
            placeholder={line1Field.label}
            label={generateLabelField(line1Field.label, true)}
            autoComplete="off"
            {...register(line1Field.name)}
          />
          {displayErrorMessage<AvailableFormFieldType, ValuesType>(line1Field.name, formState)}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            placeholder={line2Field.label}
            label={generateLabelField(line2Field.label)}
            autoComplete="off"
            {...register(line2Field.name)}
          />
          {displayErrorMessage<AvailableFormFieldType, ValuesType>(line2Field.name, formState)}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            placeholder={line3Field.label}
            label={generateLabelField(line3Field.label, true)}
            autoComplete="off"
            {...register(line3Field.name)}
          />
          {displayErrorMessage<AvailableFormFieldType, ValuesType>(line3Field.name, formState)}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            placeholder={line4Field.label}
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
            <Select {...register(yearField.name)} placeholder={yearField.label}>
              {generateOptionsYearsOrMonths('years')}
            </Select>
            {displayErrorMessage<AvailableFormFieldType, ValuesType>(yearField.name, formState)}
          </InputGroup>
        </InputWrap>
        <InputWrap>
          <InputGroup>
            <Label>{generateLabelField(monthField.label, true)}</Label>
            <Select {...register(monthField.name)} placeholder={monthField.label}>
              {generateOptionsYearsOrMonths('months')}
            </Select>
            {displayErrorMessage<AvailableFormFieldType, ValuesType>(monthField.name, formState)}
          </InputGroup>
        </InputWrap>
        <InputWrap>
          <InputGroup>
            <Label>{generateLabelField(documentTypeField.label, true)}</Label>
            <Select {...register(documentTypeField.name)} placeholder={documentTypeField.label}>
              {generateOptionsType('documentType')}
            </Select>
            {displayErrorMessage<AvailableFormFieldType, ValuesType>(documentTypeField.name, formState)}
          </InputGroup>
        </InputWrap>
        <InputWrap className={elMt4}>
          <InputGroup>
            <Label className={cx(elMb2, order0)}>{generateLabelField(documentImageField.label, true)}</Label>
            <FileInput
              {...register(documentImageField.name)}
              placeholderText={documentImageField.label}
              defaultValue={getValues(documentImageField.name)}
              onFileView={() => documentImageModalHandler.current?.openModal()}
            />
            {displayErrorMessage<AvailableFormFieldType, ValuesType>(documentImageField.name, formState)}
          </InputGroup>
        </InputWrap>
      </InputWrapFull>
      {/* Document Image Primary Address */}
      <ModalDocument
        ref={documentImagePrimaryModalHandler}
        watchFormField={watch}
        forwardedRef={documentImagePrimaryModalHandler}
        selectedFormField={documentImageField.name}
      />
      {/* Document Image Secondary Address */}
      <ModalDocument
        ref={documentImageSecondaryModalHandler}
        watchFormField={watch}
        forwardedRef={documentImageSecondaryModalHandler}
        selectedFormField={documentImageField.name}
      />
    </>
  )
}
