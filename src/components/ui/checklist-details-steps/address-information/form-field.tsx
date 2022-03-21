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

import DocumentPreviewModal from 'components/ui/ui/document-preview-modal'

interface FormFieldProps {
  /**
   * Available render option between primaryAddress and secondaryAddress
   */
  identity: 'primaryAddress' | 'secondaryAddress'
  /**
   * Pass Reach Hook Form hook
   */
  rhfProps: UseFormReturn<ValuesType>
}

const FormField: React.FC<FormFieldProps> = ({ identity, rhfProps }): React.ReactElement => {
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
            autoComplete="off"
            label={generateLabelField(buildingNameField.label)}
            data-testid={generateTestId(buildingNameField.name)}
            {...register(buildingNameField.name)}
          />
          {displayErrorMessage(buildingNameField.name, formState) && (
            <p data-testid={`test.error.${buildingNameField.name}`} className="el-input-error">
              {displayErrorMessage(buildingNameField.name, formState)}
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
          {displayErrorMessage(buildingNumberField.name, formState) && (
            <p data-testid={`test.error.${buildingNumberField.name}`} className="el-input-error">
              {displayErrorMessage(buildingNumberField.name, formState)}
            </p>
          )}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            autoComplete="off"
            label={generateLabelField(postcodeField.label, true)}
            data-testid={generateTestId(postcodeField.name)}
            {...register(postcodeField.name)}
          />
          {displayErrorMessage(postcodeField.name, formState) && (
            <p data-testid={`test.error.${postcodeField.name}`} className="el-input-error">
              {displayErrorMessage(postcodeField.name, formState)}
            </p>
          )}
        </InputWrap>
      </InputWrapFull>
      <InputWrapFull>
        <InputWrap>
          <InputGroup
            type="text"
            autoComplete="off"
            label={generateLabelField(line1Field.label, true)}
            data-testid={generateTestId(line1Field.name)}
            {...register(line1Field.name)}
          />
          {displayErrorMessage(line1Field.name, formState) && (
            <p data-testid={`test.error.${line1Field.name}`} className="el-input-error">
              {displayErrorMessage(line1Field.name, formState)}
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
          {displayErrorMessage(line2Field.name, formState) && (
            <p data-testid={`test.error.${line2Field.name}`} className="el-input-error">
              {displayErrorMessage(line2Field.name, formState)}
            </p>
          )}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            autoComplete="off"
            label={generateLabelField(line3Field.label, true)}
            data-testid={generateTestId(line3Field.name)}
            {...register(line3Field.name)}
          />
          {displayErrorMessage(line3Field.name, formState) && (
            <p data-testid={`test.error.${line3Field.name}`} className="el-input-error">
              {displayErrorMessage(line3Field.name, formState)}
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
          {displayErrorMessage(line4Field.name, formState) && (
            <p data-testid={`test.error.${line4Field.name}`} className="el-input-error">
              {displayErrorMessage(line4Field.name, formState)}
            </p>
          )}
        </InputWrap>
      </InputWrapFull>
      <InputWrapFull data-testid="option.field.wrapper">
        <InputWrap>
          <InputGroup>
            <Label>{generateLabelField(yearField.label, true)}</Label>
            <Select {...register(yearField.name)} data-testid={generateTestId(yearField.name)}>
              {generateOptionsYearsOrMonths('years').map((v) => {
                return (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                )
              })}
            </Select>
            {displayErrorMessage(yearField.name, formState) && (
              <p data-testid={`test.error.${yearField.name}`} className="el-input-error">
                {displayErrorMessage(yearField.name, formState)}
              </p>
            )}
          </InputGroup>
        </InputWrap>
        <InputWrap>
          <InputGroup>
            <Label>{generateLabelField(monthField.label, true)}</Label>
            <Select {...register(monthField.name)} data-testid={generateTestId(monthField.name)}>
              {generateOptionsYearsOrMonths('months').map((v) => {
                return (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                )
              })}
            </Select>
            {displayErrorMessage(monthField.name, formState) && (
              <p data-testid={`test.error.${monthField.name}`} className="el-input-error">
                {displayErrorMessage(monthField.name, formState)}
              </p>
            )}
          </InputGroup>
        </InputWrap>
        <InputWrap>
          <InputGroup>
            <Label>{generateLabelField(documentTypeField.label, true)}</Label>
            <Select {...register(documentTypeField.name)} data-testid={generateTestId(documentTypeField.name)}>
              {generateOptionsType('documentType').map((v) => {
                return (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                )
              })}
            </Select>
            {displayErrorMessage(documentTypeField.name, formState) && (
              <p data-testid={`test.error.${documentTypeField.name}`} className="el-input-error">
                {displayErrorMessage(documentTypeField.name, formState)}
              </p>
            )}
          </InputGroup>
        </InputWrap>
        <InputWrap className={elMt4}>
          <FlexContainer isFlexColumn className={elPl3}>
            <Label className={cx(elMb2, order0)}>{generateLabelField(documentImageField.label, true)}</Label>
            <FileInput
              data-testid={generateTestId(documentImageField.name)}
              {...register(documentImageField.name)}
              defaultValue={getValues(documentImageField.name)}
              onFileView={() => modalHandler('open')}
              accept="image/jpeg, image/png, application/pdf"
            />
            {displayErrorMessage(documentImageField.name, formState) && (
              <p data-testid={`test.error.${documentImageField.name}`} className="el-input-error">
                {displayErrorMessage(documentImageField.name, formState)}
              </p>
            )}
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

export default React.memo(FormField)
