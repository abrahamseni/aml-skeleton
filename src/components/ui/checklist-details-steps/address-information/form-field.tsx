import React from 'react'
import { cx } from '@linaria/core'
import {
  Button,
  ButtonGroup,
  elMb2,
  elMt8,
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
import { formFields, FormFieldType, ValuesType } from './form-schema'
import { UseFormReturn, UseFormWatch } from 'react-hook-form'
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
        <InputWrap>
          <Label>{`${yearField.label} *`}</Label>
          <Select className={elW8} {...register(yearField.name)} placeholder={yearField.label}>
            {generateOptionsYearsOrMonths('years')}
          </Select>
          {displayErrorMessage({ fieldName: yearField.name, formState })}
        </InputWrap>
        <InputWrap>
          <Label>{`${monthField.label} *`}</Label>
          <Select className={elW8} {...register(monthField.name)} placeholder={monthField.label}>
            {generateOptionsYearsOrMonths('months')}
          </Select>
          {displayErrorMessage({ fieldName: monthField.name, formState })}
        </InputWrap>
        <InputWrap>
          <Label>{`${documentTypeField.label} *`}</Label>
          <Select className={elW8} {...register(documentTypeField.name)} placeholder={documentTypeField.label}>
            {generateOptionsType('documentType')}
          </Select>
          {displayErrorMessage({ fieldName: documentTypeField.name, formState })}
        </InputWrap>
        <InputWrap>
          <InputGroup>
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
      <ModalDocument
        status={isModalDocumentAOpen}
        handler={setIsModalDocumentAOpen}
        watchFormField={watch}
        selectedFormField={documentImageField.name}
      />
      {/* Document Image Secondary Address */}
      <ModalDocument
        status={isModalDocumentBOpen}
        handler={setIsModalDocumentBOpen}
        watchFormField={watch}
        selectedFormField={documentImageField.name}
      />
    </>
  )
}

interface ModalDocumentProps {
  status: boolean
  handler: React.Dispatch<React.SetStateAction<boolean>>
  watchFormField: UseFormWatch<ValuesType>
  selectedFormField: FormFieldType['documentImageField']['name']
}

const ModalDocument: React.FC<ModalDocumentProps> = ({
  status,
  handler,
  watchFormField,
  selectedFormField,
}): React.ReactElement => {
  return (
    <>
      <Modal isOpen={status} title="Image Preview" onModalClose={() => handler(false)}>
        <FlexContainer isFlexAlignCenter isFlexJustifyCenter>
          <img src={watchFormField(selectedFormField)} height="auto" width="150px" />
        </FlexContainer>
        <ButtonGroup alignment="right">
          <Button intent="low" onClick={() => handler(false)}>
            Close
          </Button>
        </ButtonGroup>
      </Modal>
    </>
  )
}
