import React from 'react'
import {
  Button,
  ButtonGroup,
  elMb2,
  elW8,
  FlexContainer,
  InputGroup,
  Label,
  Select,
  TextArea,
  FileInput,
  FormLayout,
  InputWrapFull,
  InputWrap,
  elMy6,
  elMt6,
  elMb6,
} from '@reapit/elements'
import { cx } from '@linaria/core'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ContactModelMock } from '../__mocks__'
import { generateLabelField, generateOptionsType } from '../../../../utils/generator'
import { formField, ValuesType, validationSchema, AvailableFormFieldType } from './form-schema'
import { order0 } from './__styles__'
import { displayErrorMessage } from '../../../../utils/error-message'
import { ModalDocument } from '../../modal-document'

interface DeclarationRiskManagementProps {}
// render view
const DeclarationRiskManagement: React.FC<DeclarationRiskManagementProps> = (): React.ReactElement => {
  // modal handler
  const declarationFormModal = React.useRef<React.ElementRef<typeof ModalDocument>>(null)
  const riskAssessmentFormModal = React.useRef<React.ElementRef<typeof ModalDocument>>(null)

  const { declarationForm, reason, riskAssessmentForm, type } = ContactModelMock?.metadata?.declarationRisk ?? {}

  // setup initial values from context
  const INITIAL_VALUES: ValuesType = {
    declarationForm,
    reason,
    riskAssessmentForm,
    type,
  }

  // setup and integrate with initial value
  const { register, handleSubmit, watch, formState } = useForm<ValuesType>({
    defaultValues: INITIAL_VALUES,
    resolver: yupResolver(validationSchema),
    mode: 'all',
  })

  // declare form
  const { declarationFormField, riskAssessmentFormField, typeField, reasonField } = formField()

  // submit handler
  const onSubmit: SubmitHandler<ValuesType> = (data) => {
    console.log(data)
  }

  return (
    <>
      <form onSubmit={handleSubmit<ValuesType>(onSubmit)}>
        <FormLayout hasMargin className={elW8}>
          <InputWrapFull>
            <InputWrap className={elMb6}>
              <InputGroup>
                <Label className={cx(order0, elMb2)}>{generateLabelField(declarationFormField.label)}</Label>
                <FileInput
                  {...register(declarationFormField.name)}
                  placeholderText={declarationFormField.label}
                  defaultValue={declarationForm}
                  onFileView={() => declarationFormModal?.current?.openModal()}
                />
                {displayErrorMessage<AvailableFormFieldType, ValuesType>(declarationFormField.name, formState)}
              </InputGroup>
            </InputWrap>
            <InputWrap className={elMy6}>
              <InputGroup>
                <Select {...register(typeField.name)} placeholder={typeField.label}>
                  {generateOptionsType('riskAssessmentType')}
                </Select>
                <Label className={cx(order0, elMb2)}>{generateLabelField(typeField.label)}</Label>
                {displayErrorMessage<AvailableFormFieldType, ValuesType>(typeField.name, formState)}
              </InputGroup>
            </InputWrap>
            <InputWrap className={elMt6}>
              <InputGroup>
                <Label className={cx(order0, elMb2)}>{generateLabelField(riskAssessmentFormField.label)}</Label>
                <FileInput
                  {...register(riskAssessmentFormField.name)}
                  placeholderText={riskAssessmentFormField.label}
                  defaultValue={riskAssessmentForm}
                  onFileView={() => riskAssessmentFormModal?.current?.openModal()}
                />
                {displayErrorMessage<AvailableFormFieldType, ValuesType>(riskAssessmentFormField.name, formState)}
              </InputGroup>
            </InputWrap>
            <InputWrap className={elMt6}>
              <InputGroup>
                <TextArea {...register(reasonField.name)} placeholder={reasonField.label} />
                <Label>{generateLabelField(reasonField.label)}</Label>
                {displayErrorMessage<AvailableFormFieldType, ValuesType>(reasonField.name, formState)}
              </InputGroup>
            </InputWrap>
          </InputWrapFull>
        </FormLayout>
        <FlexContainer isFlexJustifyBetween className={elW8}>
          <ButtonGroup>
            <Button intent="secondary" chevronLeft>
              Previous
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button intent="success" type="submit" disabled={Object.keys(formState.errors).length !== 0 ? true : false}>
              Save
            </Button>
            <Button intent="primary" chevronRight>
              Finish
            </Button>
          </ButtonGroup>
        </FlexContainer>
      </form>
      {/* Modal Declaration Form */}
      <ModalDocument
        watchFormField={watch}
        forwardedRef={declarationFormModal}
        selectedFormField={declarationFormField.name}
      />
      {/* Modal Risk Assessment Form */}
      <ModalDocument
        watchFormField={watch}
        forwardedRef={riskAssessmentFormModal}
        selectedFormField={riskAssessmentFormField.name}
      />
    </>
  )
}

export default DeclarationRiskManagement
