import React, { FC, ReactElement, useState } from 'react'
import { InputGroup, Label, Select, InputWrap, InputWrapFull, FlexContainer } from '@reapit/elements'
import { formFields, ValuesType } from './form-schema'
import { UseFormReturn } from 'react-hook-form'
import { generateLabelField, generateOptionsType, generateOptionsYearsOrMonths } from 'utils/generator'
import { cx } from '@linaria/core'
import { order0 } from './__styles__'

import { FileInput } from 'components/ui/ui/file-input'
import DocumentPreviewModal from 'components/ui/ui/document-preview-modal'
import ErrorMessage from 'components/ui/ui/error-message'

interface FormFieldProps {
  name: 'primaryAddress' | 'secondaryAddress'
  useFormProps: {
    errors: UseFormReturn<ValuesType>['formState']['errors']
    register: UseFormReturn<ValuesType>['register']
    getValues: UseFormReturn<ValuesType>['getValues']
  }
}

const FormField: FC<FormFieldProps> = ({ name, useFormProps }): ReactElement => {
  const isPrimaryAddress = name === 'primaryAddress'

  const [imagePrimaryAddress, setImagePrimaryAddress] = useState(false)
  const [imageSecondaryAddress, setImageSecondaryAddress] = useState(false)

  // local function - modal handler
  const modalHandler = (option: 'open' | 'close'): void => {
    if (name === 'primaryAddress') {
      setImagePrimaryAddress(option === 'open')
    } else {
      setImageSecondaryAddress(option === 'open')
    }
  }

  const { register, getValues, errors } = useFormProps

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
  } = formFields(name)

  return (
    <>
      <InputWrapFull>
        <InputWrap>
          <InputGroup type="hidden" {...register(typeField.name)} />
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            autoComplete="off"
            label={generateLabelField(buildingNameField.label)}
            data-testid={buildingNameField.name}
            {...register(buildingNameField.name)}
          />
          <ErrorMessage name={buildingNameField.name} errors={errors} />
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            autoComplete="off"
            label={generateLabelField(buildingNumberField.label)}
            data-testid={buildingNumberField.name}
            {...register(buildingNumberField.name)}
          />
          <ErrorMessage name={buildingNumberField.name} errors={errors} />
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            autoComplete="off"
            label={generateLabelField(postcodeField.label, isPrimaryAddress)}
            data-testid={postcodeField.name}
            {...register(postcodeField.name)}
          />
          <ErrorMessage name={postcodeField.name} errors={errors} />
        </InputWrap>
      </InputWrapFull>
      <InputWrapFull>
        <InputWrap>
          <InputGroup
            type="text"
            autoComplete="off"
            label={generateLabelField(line1Field.label, isPrimaryAddress)}
            data-testid={line1Field.name}
            {...register(line1Field.name)}
          />
          <ErrorMessage name={line1Field.name} errors={errors} />
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            autoComplete="off"
            label={generateLabelField(line2Field.label)}
            data-testid={line2Field.name}
            {...register(line2Field.name)}
          />
          <ErrorMessage name={line2Field.name} errors={errors} />
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            autoComplete="off"
            label={generateLabelField(line3Field.label, isPrimaryAddress)}
            data-testid={line3Field.name}
            {...register(line3Field.name)}
          />
          <ErrorMessage name={line3Field.name} errors={errors} />
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            autoComplete="off"
            label={generateLabelField(line4Field.label)}
            data-testid={line4Field.name}
            {...register(line4Field.name)}
          />
          <ErrorMessage name={line4Field.name} errors={errors} />
        </InputWrap>
      </InputWrapFull>
      <InputWrapFull data-testid="option.field.wrapper">
        <InputWrap>
          <InputGroup>
            <Label>{generateLabelField(yearField.label, isPrimaryAddress)}</Label>
            <Select {...register(yearField.name)} data-testid={yearField.name}>
              {generateOptionsYearsOrMonths('years').map((v) => {
                return (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                )
              })}
            </Select>
            <ErrorMessage name={yearField.name} errors={errors} />
          </InputGroup>
        </InputWrap>
        <InputWrap>
          <InputGroup>
            <Label>{generateLabelField(monthField.label, isPrimaryAddress)}</Label>
            <Select {...register(monthField.name)} data-testid={monthField.name}>
              {generateOptionsYearsOrMonths('months').map((v) => {
                return (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                )
              })}
            </Select>
            <ErrorMessage name={monthField.name} errors={errors} />
          </InputGroup>
        </InputWrap>
        <InputWrap>
          <InputGroup>
            <Label>{generateLabelField(documentTypeField.label, isPrimaryAddress)}</Label>
            <Select {...register(documentTypeField.name)} data-testid={documentTypeField.name}>
              {generateOptionsType('documentType').map((v) => {
                return (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                )
              })}
            </Select>
            <ErrorMessage name={documentTypeField.name} errors={errors} />
          </InputGroup>
        </InputWrap>
        <InputWrap className="el-mt4">
          <FlexContainer isFlexColumn className="el-pl3">
            <Label className={cx('el-mb2', order0)}>
              {generateLabelField(documentImageField.label, isPrimaryAddress)}
            </Label>
            <FileInput
              data-testid={documentImageField.name}
              {...register(documentImageField.name)}
              onFileView={() => modalHandler('open')}
              defaultValue={getValues(documentImageField.name)}
            />
            <ErrorMessage name={documentImageField.name} errors={errors} />
          </FlexContainer>
        </InputWrap>
      </InputWrapFull>
      <DocumentPreviewModal
        src={getValues(documentImageField.name)}
        isOpen={name === 'primaryAddress' ? imagePrimaryAddress : imageSecondaryAddress}
        onModalClose={() => modalHandler('close')}
      />
    </>
  )
}

export default FormField
