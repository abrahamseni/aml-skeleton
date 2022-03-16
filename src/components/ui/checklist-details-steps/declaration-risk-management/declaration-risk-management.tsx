import React from 'react'
import {
  Button,
  ButtonGroup,
  elMb2,
  FlexContainer,
  InputGroup,
  Label,
  Select,
  TextArea,
  FormLayout,
  InputWrapFull,
  InputWrap,
  elMy6,
  elMt6,
  elMb6,
  InputError,
  useSnack,
  elWFull,
  FileInput,
  elPl3,
  BodyText,
} from '@reapit/elements'
import { cx } from '@linaria/core'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { generateLabelField, generateOptionsType } from '../../../../utils/generator'
import { formField, ValuesType, validationSchema } from './form-schema'
import { order0 } from './__styles__'
import { ContactModel } from '@reapit/foundations-ts-definitions'
import { notificationMessage } from '../../../../constants/notification-message'
import { useUpdateContact } from '../../../../platform-api/contact-api/update-contact'
import DocumentPreviewModal from '../id-form/document-preview-modal'

interface DeclarationRiskManagementProps {
  userData: ContactModel | undefined
  switchTabContent: (type: 'forward' | 'backward') => void | undefined
}

// render view
const DeclarationRiskManagement: React.FC<DeclarationRiskManagementProps> = ({
  userData,
  switchTabContent,
}): React.ReactElement => {
  // snack notification - snack provider
  const { success, error } = useSnack()
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

  // local state - button handler
  const [isGoingToNextSection, setIsGoingToNextSection] = React.useState<boolean>(false)

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
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
  } = useForm<ValuesType>({
    defaultValues: INITIAL_VALUES,
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  })

  // declare form
  const { declarationFormField, riskAssessmentFormField, typeField, reasonField } = formField()

  const updateContactData = useUpdateContact(userData!.id!, userData!._eTag!)

  // button handler - submit
  const onSubmitHandler = (): void => {
    updateContactData.mutate({
      metadata: {
        ...userData?.metadata,
        declarationRisk: getValues(),
      },
    })
    setIsButtonLoading(true)
  }

  // button handler - previous
  const onPreviousHandler = (): void => {
    switchTabContent('backward')
  }

  // turn off disabled attribute, if mutate UpdateContactData state is success
  // later will do more with optimize way :)
  React.useLayoutEffect((): void => {
    if (isButtonLoading) {
      if (updateContactData.isSuccess) {
        setIsButtonLoading(false)
        success(notificationMessage.DRM_SUCCESS, 2000)
        isGoingToNextSection && (setIsGoingToNextSection(false), switchTabContent('forward'))
      }
      if (updateContactData.isError) {
        setIsButtonLoading(false)
        error(notificationMessage.DRM_ERROR, 2000)
        isGoingToNextSection && setIsGoingToNextSection(false)
      }
    }
  }, [updateContactData.status])

  return (
    <>
      <form onSubmit={handleSubmit<ValuesType>(onSubmitHandler)}>
        <FormLayout hasMargin className={elWFull}>
          <InputWrapFull>
            <InputWrap className={elMb6}>
              <FlexContainer isFlexColumn className={elPl3}>
                <Label className={cx(order0, elMb2)}>{generateLabelField(declarationFormField.label, true)}</Label>
                <FileInput
                  {...register(declarationFormField.name)}
                  defaultValue={declarationForm}
                  onFileView={() => handleModal('declaration', 'open')}
                  accept="image/jpeg, image/png, application/pdf"
                />
                {errors.declarationForm?.message && <InputError message={errors.declarationForm?.message} />}
              </FlexContainer>
            </InputWrap>
            <InputWrap className={elMy6}>
              <InputGroup>
                <Select {...register(typeField.name)}>{generateOptionsType('riskAssessmentType')}</Select>
                <Label className={cx(order0, elMb2)}>{generateLabelField(typeField.label, true)}</Label>
                {errors.type?.message && <InputError message={errors.type?.message} />}
              </InputGroup>
            </InputWrap>
            <InputWrap className={elMt6}>
              <FlexContainer isFlexColumn className={elPl3}>
                <Label className={cx(order0, elMb2)}>{generateLabelField(riskAssessmentFormField.label, true)}</Label>
                <FileInput
                  style={{ padding: 0 }}
                  {...register(riskAssessmentFormField.name)}
                  defaultValue={riskAssessmentForm}
                  onFileView={() => handleModal('riskAssessment', 'open')}
                  accept="image/jpeg, image/png, application/pdf"
                />
                {errors.riskAssessmentForm?.message && <InputError message={errors.riskAssessmentForm?.message} />}
              </FlexContainer>
            </InputWrap>
            <InputWrap className={elMt6}>
              <InputGroup>
                <TextArea {...register(reasonField.name)} />
                <Label>{generateLabelField(reasonField.label, true)}</Label>
                {errors.reason?.message && <InputError message={errors.reason?.message} />}
              </InputGroup>
            </InputWrap>
          </InputWrapFull>
        </FormLayout>
        <FlexContainer isFlexJustifyBetween className={elWFull}>
          <ButtonGroup>
            <Button intent="secondary" onClick={onPreviousHandler} type="button" disabled={isButtonLoading} chevronLeft>
              Previous
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button
              intent="success"
              type="submit"
              disabled={Object.keys(errors).length !== 0 ? true : false || isButtonLoading}
              loading={updateContactData.isLoading}
            >
              Save
            </Button>
          </ButtonGroup>
        </FlexContainer>
      </form>
      <div className={elMt6}>
        <BodyText hasNoMargin>
          * Indicates fields that are required in order to &apos;Complete&apos; this section.
        </BodyText>
      </div>
      {/* Modal Declaration Form */}
      <DocumentPreviewModal
        src={watch(declarationFormField.name)}
        isOpen={declarationFormModalOpen}
        onModalClose={() => handleModal('declaration', 'close')}
      />
      {/* Modal Risk Assessment Form */}
      <DocumentPreviewModal
        src={watch(riskAssessmentFormField.name)}
        isOpen={riskAssessmentFormModalOpen}
        onModalClose={() => handleModal('riskAssessment', 'close')}
      />
    </>
  )
}

export default DeclarationRiskManagement
