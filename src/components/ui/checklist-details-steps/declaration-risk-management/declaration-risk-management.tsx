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
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { generateLabelField, generateOptionsType } from '../../../../utils/generator'
import { formField, ValuesType, validationSchema, AvailableFormFieldType } from './form-schema'
import { order0 } from './__styles__'
import { displayErrorMessage } from '../../../../utils/error-message'
import { ModalDocument } from '../../modal-document'
import { ContactModel } from '@reapit/foundations-ts-definitions'
import { UpdateContactDataType, useUpdateContactData } from '../../../../platform-api/contact-api'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from 'react-query'

interface DeclarationRiskManagementProps {
  userData: ContactModel | undefined
  userDataRefetch: (
    options?: (RefetchOptions & RefetchQueryFilters) | undefined,
  ) => Promise<QueryObserverResult<ContactModel, Error>>
}

// render view
const DeclarationRiskManagement: React.FC<DeclarationRiskManagementProps> = ({
  userData,
  userDataRefetch,
}): React.ReactElement => {
  // local state - state to manage available  user if user already clicked the button
  const [isButtonLoading, setIsButtonLoading] = React.useState<boolean>(false)
  // modal handler
  const declarationFormModal = React.useRef<React.ElementRef<typeof ModalDocument>>(null)
  const riskAssessmentFormModal = React.useRef<React.ElementRef<typeof ModalDocument>>(null)

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
    // will replace with fn handler to the next section
  }

  // button handler - previous
  const onPreviousHandler = (): void => {
    console.log('previous')
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
      <ModalDocument
        ref={declarationFormModal}
        watchFormField={watch}
        forwardedRef={declarationFormModal}
        selectedFormField={declarationFormField.name}
      />
      {/* Modal Risk Assessment Form */}
      <ModalDocument
        ref={riskAssessmentFormModal}
        watchFormField={watch}
        forwardedRef={riskAssessmentFormModal}
        selectedFormField={riskAssessmentFormField.name}
      />
    </>
  )
}

export default DeclarationRiskManagement
