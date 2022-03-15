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
  Modal,
} from '@reapit/elements'
import { cx } from '@linaria/core'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { generateLabelField, generateOptionsType } from '../../../../utils/generator'
import { formField, ValuesType, validationSchema, AvailableFormFieldType } from './form-schema'
import { order0 } from './__styles__'
import { displayErrorMessage } from '../../../../utils/error-message'
import { ContactModel } from '@reapit/foundations-ts-definitions'
import { UpdateContactDataType, useUpdateContactData } from '../../../../platform-api/contact-api'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from 'react-query'

interface DeclarationRiskManagementProps {
  userData: ContactModel | undefined
  userDataRefetch: (
    options?: (RefetchOptions & RefetchQueryFilters) | undefined,
  ) => Promise<QueryObserverResult<ContactModel, Error>>
  switchTabContent: (type: 'forward' | 'backward') => void | undefined
}

// render view
const DeclarationRiskManagement: React.FC<DeclarationRiskManagementProps> = ({
  userData,
  userDataRefetch,
  switchTabContent,
}): React.ReactElement => {
  // local state - modal handler
  const [declarationFormModalOpen, setDeclarationFormModalOpen] = React.useState<boolean>(false)
  const [riskAssessmentFormModalOpen, setRiskAssessmentFormModalOpen] = React.useState<boolean>(false)

  // local function - modal handler
  const handleModal = (type: 'declaration' | 'riskAssessment', option: 'open' | 'close'): void => {
    switch (type) {
      case 'riskAssessment':
        setRiskAssessmentFormModalOpen(option === 'open' ? true : false)
        break
      case 'declaration':
        setDeclarationFormModalOpen(option === 'open' ? true : false)
        break
    }
  }

  // local state - state to manage available  user if user already clicked the button
  const [isButtonLoading, setIsButtonLoading] = React.useState<boolean>(false)

  const { declarationForm, reason, riskAssessmentForm, type } = userData?.metadata?.declarationRisk ?? {}

  // setup initial values from context
  const INITIAL_VALUES: ValuesType = {
    declarationForm,
    reason,
    riskAssessmentForm,
    type,
  }

  // setup and integrate with initial value
  const { register, handleSubmit, watch, formState, getValues } = useForm<ValuesType>({
    defaultValues: INITIAL_VALUES,
    resolver: yupResolver(validationSchema),
    mode: 'all',
  })

  // declare form
  const { declarationFormField, riskAssessmentFormField, typeField, reasonField } = formField()

  // temporary applied method for update data #1
  const updateFormData: UpdateContactDataType = {
    contactId: userData!.id!,
    _eTag: userData!._eTag!,
    bodyData: {
      metadata: {
        ...userData?.metadata,
        declarationRisk: getValues(),
      },
    },
  }

  // temporary applied method for update data #2
  const updateContactData = useUpdateContactData<typeof userDataRefetch>(updateFormData, userDataRefetch)

  // button handler - submit
  const onSubmitHandler = (): void => {
    updateContactData.mutate()
    setIsButtonLoading(true)
  }

  // button handler - next
  const onNextHandler = (): void => {
    onSubmitHandler()
    console.log('next')
    // switchTabContent('forward')
    // will replace with fn handler to the next section
  }

  // button handler - previous
  const onPreviousHandler = (): void => {
    switchTabContent('backward')
    // will replace with fn handler to the previous section
  }

  // turn off disabled attribute, if mutate UpdateContactData state is success
  React.useMemo<void>((): void => {
    isButtonLoading && updateContactData.isSuccess && (setIsButtonLoading(false), console.log('appear notification'))
  }, [updateContactData.isSuccess])

  return (
    <>
      <form onSubmit={handleSubmit<ValuesType>(onSubmitHandler)}>
        <FormLayout hasMargin className={elW8}>
          <InputWrapFull>
            <InputWrap className={elMb6}>
              <InputGroup>
                <Label className={cx(order0, elMb2)}>{generateLabelField(declarationFormField.label)}</Label>
                <FileInput
                  {...register(declarationFormField.name)}
                  placeholderText={declarationFormField.label}
                  defaultValue={declarationForm}
                  onFileView={() => handleModal('declaration', 'open')}
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
                  onFileView={() => handleModal('riskAssessment', 'open')}
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
            <Button intent="secondary" onClick={onPreviousHandler} type="button" disabled={isButtonLoading} chevronLeft>
              Previous
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button
              intent="success"
              type="submit"
              disabled={Object.keys(formState.errors).length !== 0 ? true : false || isButtonLoading}
              loading={updateContactData.isLoading}
            >
              Save
            </Button>
            <Button
              intent="primary"
              onClick={onNextHandler}
              type="button"
              chevronRight
              disabled={Object.keys(formState.errors).length !== 0 ? true : false || isButtonLoading}
            >
              Finish
            </Button>
          </ButtonGroup>
        </FlexContainer>
      </form>
      {/* Modal Declaration Form */}
      <Modal
        isOpen={declarationFormModalOpen}
        title="Image Preview"
        onModalClose={() => handleModal('declaration', 'close')}
      >
        <FlexContainer isFlexAlignCenter isFlexJustifyCenter>
          {/* will be good if we can handle by file type, e.g pdf -> return pdf viewer // img -> return img tag */}
          <img src={watch(declarationFormField.name)} height="auto" width="150px" />
        </FlexContainer>
        <ButtonGroup alignment="right">
          <Button intent="low" onClick={() => handleModal('declaration', 'close')}>
            Close
          </Button>
        </ButtonGroup>
      </Modal>
      {/* Modal Risk Assessment Form */}
      <Modal
        isOpen={riskAssessmentFormModalOpen}
        title="Image Preview"
        onModalClose={() => handleModal('riskAssessment', 'close')}
      >
        <FlexContainer isFlexAlignCenter isFlexJustifyCenter>
          {/* will be good if we can handle by file type, e.g pdf -> return pdf viewer // img -> return img tag */}
          <img src={watch(riskAssessmentFormField.name)} height="auto" width="150px" />
        </FlexContainer>
        <ButtonGroup alignment="right">
          <Button intent="low" onClick={() => handleModal('riskAssessment', 'close')}>
            Close
          </Button>
        </ButtonGroup>
      </Modal>
    </>
  )
}

export default DeclarationRiskManagement
