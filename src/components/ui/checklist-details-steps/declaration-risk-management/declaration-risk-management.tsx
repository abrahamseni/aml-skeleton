import React from 'react'
import {
  Button,
  ButtonGroup,
  elMb2,
  elW8,
  elWFull,
  FlexContainer,
  InputGroup,
  Label,
  Modal,
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
import { SubmitHandler, useForm, UseFormWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ContactModelMock } from '../__mocks__'
import { generateOptionsType } from '../../../../utils/generator'
import { formField, ValuesType, validationSchema, FormFieldType } from './form-schema'
import { order0 } from './__styles__'
import { displayErrorMessage } from './error-message'

interface DeclarationRiskManagementProps {}
// render view
const DeclarationRiskManagement: React.FC<DeclarationRiskManagementProps> = (): React.ReactElement => {
  const [isModalDeclarationFileOpen, setIsModalDeclarationFileOpen] = React.useState<boolean>(false)
  const [isModalRiskAssessmentFileOpen, setIsRiskAssessmentFileOpen] = React.useState<boolean>(false)

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
    mode: 'onChange',
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
        <FormLayout hasMargin>
          <InputWrapFull>
            <InputWrap className={cx(elW8, elMb6)}>
              <InputGroup>
                <Label className={cx(order0, elMb2)}>{declarationFormField.label}</Label>
                <FileInput
                  {...register(declarationFormField.name)}
                  placeholderText={declarationFormField.label}
                  defaultValue={declarationForm}
                  onFileView={() => setIsModalDeclarationFileOpen(true)}
                />
                {displayErrorMessage({
                  fieldName: declarationFormField.name,
                  formState,
                })}
              </InputGroup>
            </InputWrap>
            <InputWrap className={cx(elW8, elMy6)}>
              <InputGroup>
                <Select {...register(typeField.name)} placeholder={typeField.label}>
                  {generateOptionsType('riskAssessmentType')}
                </Select>
                <Label className={cx(order0, elMb2)}>{typeField.label}</Label>
                {displayErrorMessage({
                  fieldName: typeField.name,
                  formState,
                })}
              </InputGroup>
            </InputWrap>
            <InputWrap className={cx(elW8, elMt6)}>
              <InputGroup>
                <Label className={cx(order0, elMb2)}>{riskAssessmentFormField.label}</Label>
                <FileInput
                  {...register(riskAssessmentFormField.name)}
                  placeholderText={riskAssessmentFormField.label}
                  defaultValue={riskAssessmentForm}
                  onFileView={() => setIsRiskAssessmentFileOpen(true)}
                />
                {displayErrorMessage({
                  fieldName: riskAssessmentFormField.name,
                  formState,
                })}
              </InputGroup>
            </InputWrap>
          </InputWrapFull>
          <InputWrapFull className={cx(elWFull)}>
            <InputGroup className={elWFull}>
              <TextArea {...register(reasonField.name)} placeholder={reasonField.label} />
              <Label>Reason For Type</Label>
              {displayErrorMessage({
                fieldName: reasonField.name,
                formState,
              })}
            </InputGroup>
          </InputWrapFull>
        </FormLayout>
        <FlexContainer isFlexJustifyBetween>
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
        status={isModalDeclarationFileOpen}
        handler={setIsModalDeclarationFileOpen}
        watchFormField={watch}
        selectedFormField={declarationFormField.name}
      />
      {/* Modal Risk Assessment Form */}
      <ModalDocument
        status={isModalRiskAssessmentFileOpen}
        handler={setIsRiskAssessmentFileOpen}
        watchFormField={watch}
        selectedFormField={riskAssessmentFormField.name}
      />
    </>
  )
}

export default DeclarationRiskManagement

interface ModalDocumentProps {
  status: boolean
  handler: React.Dispatch<React.SetStateAction<boolean>>
  watchFormField: UseFormWatch<ValuesType>
  selectedFormField: FormFieldType['declarationFormField']['name'] | FormFieldType['riskAssessmentFormField']['name']
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
