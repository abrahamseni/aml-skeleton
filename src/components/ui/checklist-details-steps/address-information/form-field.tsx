import React, { FC, ReactElement, useState } from 'react'
import { InputGroup, Label, Select, InputWrap, InputWrapFull, FlexContainer } from '@reapit/elements'
import { formFields, ValuesType } from './form-schema'
import { UseFormReturn } from 'react-hook-form'
import { displayErrorMessage } from '../../../../utils/error-message'
import {
  generateLabelField,
  generateOptionsType,
  generateOptionsYearsOrMonths,
  generateTestId,
} from '../../../../utils/generator'
import { cx } from '@linaria/core'
import { order0 } from './__styles__'

import { FileInput } from 'components/ui/ui/file-input'
import DocumentPreviewModal from 'components/ui/ui/document-preview-modal'

interface FormFieldProps {
  name: 'primaryAddress' | 'secondaryAddress'
  useFormProps: UseFormReturn<ValuesType>
}

const FormField: FC<FormFieldProps> = ({ name, useFormProps }): ReactElement => {
  const isPrimaryAddress = name === 'primaryAddress'

  const [imagePrimaryAddress, setImagePrimaryAddress] = useState<boolean>(false)
  const [imageSecondaryAddress, setImageSecondaryAddress] = useState<boolean>(false)

  // local function - modal handler
  const modalHandler = (option: 'open' | 'close'): void => {
    if (name === 'primaryAddress') {
      setImagePrimaryAddress(option === 'open')
    } else {
      setImageSecondaryAddress(option === 'open')
    }
  }

  const {
    register,
    getValues,
    formState: { errors },
  } = useFormProps

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
            data-testid={generateTestId(buildingNameField.name)}
            {...register(buildingNameField.name)}
          />
          {displayErrorMessage(buildingNameField.name, errors) && (
            <p data-testid={`test.error.${buildingNameField.name}`} className="el-input-error">
              {displayErrorMessage(buildingNameField.name, errors)}
            </p>
          )}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            autoComplete="off"
            label={generateLabelField(buildingNumberField.label)}
            data-testid={generateTestId(buildingNumberField.name)}
            {...register(buildingNumberField.name)}
          />
          {displayErrorMessage(buildingNumberField.name, errors) && (
            <p data-testid={`test.error.${buildingNumberField.name}`} className="el-input-error">
              {displayErrorMessage(buildingNumberField.name, errors)}
            </p>
          )}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            autoComplete="off"
            label={generateLabelField(postcodeField.label, isPrimaryAddress)}
            data-testid={generateTestId(postcodeField.name)}
            {...register(postcodeField.name)}
          />
          {displayErrorMessage(postcodeField.name, errors) && (
            <p data-testid={`test.error.${postcodeField.name}`} className="el-input-error">
              {displayErrorMessage(postcodeField.name, errors)}
            </p>
          )}
        </InputWrap>
      </InputWrapFull>
      <InputWrapFull>
        <InputWrap>
          <InputGroup
            type="text"
            autoComplete="off"
            label={generateLabelField(line1Field.label, isPrimaryAddress)}
            data-testid={generateTestId(line1Field.name)}
            {...register(line1Field.name)}
          />
          {displayErrorMessage(line1Field.name, errors) && (
            <p data-testid={`test.error.${line1Field.name}`} className="el-input-error">
              {displayErrorMessage(line1Field.name, errors)}
            </p>
          )}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            autoComplete="off"
            label={generateLabelField(line2Field.label)}
            data-testid={generateTestId(line2Field.name)}
            {...register(line2Field.name)}
          />
          {displayErrorMessage(line2Field.name, errors) && (
            <p data-testid={`test.error.${line2Field.name}`} className="el-input-error">
              {displayErrorMessage(line2Field.name, errors)}
            </p>
          )}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            autoComplete="off"
            label={generateLabelField(line3Field.label, isPrimaryAddress)}
            data-testid={generateTestId(line3Field.name)}
            {...register(line3Field.name)}
          />
          {displayErrorMessage(line3Field.name, errors) && (
            <p data-testid={`test.error.${line3Field.name}`} className="el-input-error">
              {displayErrorMessage(line3Field.name, errors)}
            </p>
          )}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            autoComplete="off"
            label={generateLabelField(line4Field.label)}
            data-testid={generateTestId(line4Field.name)}
            {...register(line4Field.name)}
          />
          {displayErrorMessage(line4Field.name, errors) && (
            <p data-testid={`test.error.${line4Field.name}`} className="el-input-error">
              {displayErrorMessage(line4Field.name, errors)}
            </p>
          )}
        </InputWrap>
      </InputWrapFull>
      <InputWrapFull data-testid="option.field.wrapper">
        <InputWrap>
          <InputGroup>
            <Label>{generateLabelField(yearField.label, isPrimaryAddress)}</Label>
            <Select {...register(yearField.name)} data-testid={generateTestId(yearField.name)}>
              {generateOptionsYearsOrMonths('years').map((v) => {
                return (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                )
              })}
            </Select>
            {displayErrorMessage(yearField.name, errors) && (
              <p data-testid={`test.error.${yearField.name}`} className="el-input-error">
                {displayErrorMessage(yearField.name, errors)}
              </p>
            )}
          </InputGroup>
        </InputWrap>
        <InputWrap>
          <InputGroup>
            <Label>{generateLabelField(monthField.label, isPrimaryAddress)}</Label>
            <Select {...register(monthField.name)} data-testid={generateTestId(monthField.name)}>
              {generateOptionsYearsOrMonths('months').map((v) => {
                return (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                )
              })}
            </Select>
            {displayErrorMessage(monthField.name, errors) && (
              <p data-testid={`test.error.${monthField.name}`} className="el-input-error">
                {displayErrorMessage(monthField.name, errors)}
              </p>
            )}
          </InputGroup>
        </InputWrap>
        <InputWrap>
          <InputGroup>
            <Label>{generateLabelField(documentTypeField.label, isPrimaryAddress)}</Label>
            <Select {...register(documentTypeField.name)} data-testid={generateTestId(documentTypeField.name)}>
              {generateOptionsType('documentType').map((v) => {
                return (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                )
              })}
            </Select>
            {displayErrorMessage(documentTypeField.name, errors) && (
              <p data-testid={`test.error.${documentTypeField.name}`} className="el-input-error">
                {displayErrorMessage(documentTypeField.name, errors)}
              </p>
            )}
          </InputGroup>
        </InputWrap>
        <InputWrap className="el-mt4">
          <FlexContainer isFlexColumn className="el-pl3">
            <Label className={cx('el-mb2', order0)}>
              {generateLabelField(documentImageField.label, isPrimaryAddress)}
            </Label>
            <FileInput
              data-testid={generateTestId(documentImageField.name)}
              {...register(documentImageField.name)}
              onFileView={() => modalHandler('open')}
              defaultValue={getValues(documentImageField.name)}
              accept="image/jpeg, image/png, application/pdf"
            />
            {displayErrorMessage(documentImageField.name, errors) && (
              <p data-testid={`test.error.${documentImageField.name}`} className="el-input-error">
                {displayErrorMessage(documentImageField.name, errors)}
              </p>
            )}
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
