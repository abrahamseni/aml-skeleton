import React from 'react'
import { cx } from '@linaria/core'
import {
  Button,
  ButtonGroup,
  elMb2,
  elMt8,
  elWFull,
  FlexContainer,
  InputGroup,
  Label,
  Modal,
  Select,
  FileInput,
  InputWrap,
  InputWrapFull,
  elW8,
} from '@reapit/elements'
import { formFields, ValuesType } from './form-schema'
import { UseFormReturn } from 'react-hook-form'
import { displayErrorMessage } from './error-message'
import { generateOptionsType, generateOptionsYearsOrMonths } from '../../../../utils/generator'

interface FormFieldProps {
  identity: 'primaryAddress' | 'secondaryAddress'
  /**
   * Pass Reach Hook Form hook
   */
  rhfProps: UseFormReturn<ValuesType, any>
}

export const FormField: React.FC<FormFieldProps> = ({ identity, rhfProps }): React.ReactElement => {
  const [isModalDocumentAOpen, setIsModalDocumentAOpen] = React.useState<boolean>(false)
  const [isModalDocumentBOpen, setIsModalDocumentBOpen] = React.useState<boolean>(false)

  const { register, watch, getValues, formState } = rhfProps

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
            className={elW8}
            placeholder={buildingNameField.label}
            label={buildingNameField.label}
            autoComplete="off"
            {...register(buildingNameField.name)}
          />
          {displayErrorMessage({ fieldName: buildingNameField.name, formState })}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            className={elW8}
            placeholder={buildingNumberField.label}
            label={buildingNumberField.label}
            autoComplete="off"
            {...register(buildingNumberField.name)}
          />
          {displayErrorMessage({ fieldName: buildingNumberField.name, formState })}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            className={elW8}
            placeholder={postcodeField.label}
            label={`${postcodeField.label} *`}
            autoComplete="off"
            {...register(postcodeField.name)}
          />
          {displayErrorMessage({ fieldName: postcodeField.name, formState })}
        </InputWrap>
      </InputWrapFull>
      <InputWrapFull>
        <InputWrap>
          <InputGroup
            type="text"
            className={elW8}
            placeholder={line1Field.label}
            label={`${line1Field.label} *`}
            autoComplete="off"
            {...register(line1Field.name)}
          />
          {displayErrorMessage({ fieldName: line1Field.name, formState })}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            className={elW8}
            placeholder={line2Field.label}
            label={line2Field.label}
            autoComplete="off"
            {...register(line2Field.name)}
          />
          {displayErrorMessage({ fieldName: line2Field.name, formState })}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            className={elW8}
            placeholder={line3Field.label}
            label={`${line3Field.label} *`}
            autoComplete="off"
            {...register(line3Field.name)}
          />
          {displayErrorMessage({ fieldName: line3Field.name, formState })}
        </InputWrap>
        <InputWrap>
          <InputGroup
            type="text"
            className={elW8}
            placeholder={line4Field.label}
            label={line4Field.label}
            autoComplete="off"
            {...register(line4Field.name)}
          />
          {displayErrorMessage({ fieldName: line4Field.name, formState })}
        </InputWrap>
      </InputWrapFull>
      <InputWrapFull className={cx(elMt8)}>
        <InputWrap className={elWFull}>
          <Label>{`${yearField.label} *`}</Label>
          <Select className={elW8} {...register(yearField.name)} placeholder={yearField.label}>
            {generateOptionsYearsOrMonths('years')}
          </Select>
          {displayErrorMessage({ fieldName: yearField.name, formState })}
        </InputWrap>
        <InputWrap className={elWFull}>
          <Label>{`${monthField.label} *`}</Label>
          <Select className={elW8} {...register(monthField.name)} placeholder={monthField.label}>
            {generateOptionsYearsOrMonths('months')}
          </Select>
          {displayErrorMessage({ fieldName: monthField.name, formState })}
        </InputWrap>
        <InputWrap className={elWFull}>
          <Label>{`${documentTypeField.label} *`}</Label>
          <Select className={elW8} {...register(documentTypeField.name)} placeholder={documentTypeField.label}>
            {generateOptionsType('documentType')}
          </Select>
          {displayErrorMessage({ fieldName: documentTypeField.name, formState })}
        </InputWrap>
        <InputWrap className={elWFull}>
          <InputGroup className={elWFull}>
            <Label style={{ order: 0 }} className={elMb2}>
              {`${documentImageField.label} *`}
            </Label>
            <FileInput
              {...register(documentImageField.name)}
              placeholderText={documentImageField.label}
              defaultValue={getValues(documentImageField.name)}
              onFileView={() => {
                identity === 'primaryAddress' ? setIsModalDocumentAOpen(true) : setIsModalDocumentBOpen(true)
              }}
            />
            {displayErrorMessage({ fieldName: documentTypeField.name, formState })}
          </InputGroup>
        </InputWrap>
      </InputWrapFull>
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
