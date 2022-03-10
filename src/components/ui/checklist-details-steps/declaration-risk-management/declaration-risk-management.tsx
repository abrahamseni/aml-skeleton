import React from 'react'
import {
  Button,
  ButtonGroup,
  elMb2,
  elMt6,
  elMt8,
  elW11,
  elW6,
  elWFull,
  FlexContainer,
  InputGroup,
  Label,
  Modal,
  Select,
  TextArea,
} from '@reapit/elements'
import { cx } from '@linaria/core'
import { SubmitHandler, useForm } from 'react-hook-form'
import { formField, ValuesType } from './form-schema/form-field'

import validationSchema from './form-schema/validation-schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { RISK_ASSESSMENT_TYPE } from '../../../../constants/appointment-details'
import { InputError } from '../../input-error'
import { FileInput } from '../../file-input'
import { ContactModelMock } from '../__mocks__'

// available options risk assessment type
const optionsRiskAssessmentType = [
  { label: 'Please select...', value: '' },
  { label: RISK_ASSESSMENT_TYPE.SIMPLIFIED, value: RISK_ASSESSMENT_TYPE.SIMPLIFIED },
  { label: RISK_ASSESSMENT_TYPE.NORMAL, value: RISK_ASSESSMENT_TYPE.NORMAL },
  { label: RISK_ASSESSMENT_TYPE.ENHANCED, value: RISK_ASSESSMENT_TYPE.ENHANCED },
]

// generate OptionRiskAssessmentType
const generateOptionRiskAssessmentType = () => {
  return optionsRiskAssessmentType.map((v) => (
    <option key={v.label} value={v.value}>
      {v.label}
    </option>
  ))
}

interface DeclarationRiskManagementProps {}
// render view
const DeclarationRiskManagement: React.FC<DeclarationRiskManagementProps> = (): React.ReactElement => {
  const [isModalDeclarationFileOpen, setIsModalDeclarationFileOpen] = React.useState<boolean>(false)
  const [isModalRiskAssessmentFileOpen, setIsRiskAssessmentFileOpen] = React.useState<boolean>(false)

  const contactMetadata = ContactModelMock.metadata ?? {}
  const { declarationForm, reason, riskAssessmentForm, type } = contactMetadata.declarationRisk

  console.log(contactMetadata)
  // setup initial values from context
  const INITIAL_VALUES: ValuesType = {
    declarationForm,
    reason,
    riskAssessmentForm,
    type,
  }

  // setup and integrate with initial value
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ValuesType>({
    defaultValues: INITIAL_VALUES,
    resolver: yupResolver(validationSchema),
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
        <FlexContainer className={elWFull} isFlexJustifyBetween>
          <FlexContainer className={elW6} isFlexAlignCenter>
            <InputGroup className={elW11}>
              <Label style={{ order: 0 }} className={elMb2}>
                Declaration Form
              </Label>
              <FileInput
                {...register(declarationFormField.name)}
                placeholderText={declarationFormField.label}
                defaultValue={declarationForm}
                onFileView={() => setIsModalDeclarationFileOpen(true)}
              />
              {errors.declarationForm && (
                <>
                  <InputError message={errors.declarationForm.message} />
                </>
              )}
            </InputGroup>
          </FlexContainer>
          <div className={elW6}>
            <InputGroup className={elW11}>
              <Select {...register(typeField.name)} placeholder={typeField.label}>
                {generateOptionRiskAssessmentType()}
              </Select>
              <Label>Risk Assessment Type</Label>
              {errors.type && (
                <>
                  <InputError message={errors.type.message} />
                </>
              )}
            </InputGroup>
          </div>
          <FlexContainer className={elW6} isFlexAlignCenter>
            <InputGroup className={elW11}>
              <Label style={{ order: 0 }} className={elMb2}>
                Risk Assessment Form
              </Label>
              <FileInput
                {...register(riskAssessmentFormField.name)}
                placeholderText={riskAssessmentFormField.label}
                defaultValue={riskAssessmentForm}
                onFileView={() => setIsRiskAssessmentFileOpen(true)}
              />
              {errors.riskAssessmentForm && (
                <>
                  <InputError message={errors.riskAssessmentForm.message} />
                </>
              )}
            </InputGroup>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer className={cx(elWFull, elMt6)} isFlexJustifyBetween>
          <div className={elWFull}>
            <InputGroup className={elWFull}>
              <TextArea {...register(reasonField.name)} placeholder={reasonField.label} />
              <Label>Reason For Type</Label>
              {errors.reason && (
                <>
                  <InputError message={errors.reason.message} />
                </>
              )}
            </InputGroup>
          </div>
        </FlexContainer>
        <FlexContainer isFlexJustifyBetween className={elMt8}>
          <ButtonGroup>
            <Button intent="secondary" chevronLeft>
              Previous
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button intent="success" type="submit" disabled={Object.keys(errors).length !== 0 ? true : false}>
              Save
            </Button>
            <Button intent="primary" chevronRight>
              Finish
            </Button>
          </ButtonGroup>
        </FlexContainer>
      </form>
      {/* Declaration Form */}
      <Modal
        isOpen={isModalDeclarationFileOpen}
        title="Image Preview"
        onModalClose={() => setIsModalDeclarationFileOpen(false)}
      >
        <FlexContainer isFlexAlignCenter isFlexJustifyCenter>
          {watch('declarationForm') && <img src={watch('declarationForm')} height="auto" width="150px" />}
        </FlexContainer>
        <ButtonGroup alignment="right">
          <Button intent="low" onClick={() => setIsModalDeclarationFileOpen(false)}>
            Close
          </Button>
        </ButtonGroup>
      </Modal>
      {/* Risk Assessment Form */}
      <Modal
        isOpen={isModalRiskAssessmentFileOpen}
        title="Image Preview"
        onModalClose={() => setIsRiskAssessmentFileOpen(false)}
      >
        <FlexContainer isFlexAlignCenter isFlexJustifyCenter>
          {watch('riskAssessmentForm') && <img src={watch('riskAssessmentForm')} height="auto" width="150px" />}
        </FlexContainer>
        <ButtonGroup alignment="right">
          <Button intent="low" onClick={() => setIsRiskAssessmentFileOpen(false)}>
            Close
          </Button>
        </ButtonGroup>
      </Modal>
    </>
  )
}

export default DeclarationRiskManagement
