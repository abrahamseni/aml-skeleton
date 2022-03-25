import React from 'react'
import {
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
  useSnack,
  elWFull,
  elPl3,
} from '@reapit/elements'
import { cx } from '@linaria/core'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { generateLabelField, generateOptionsType, generateTestId } from 'utils/generator'
import { formField, ValuesType, validationSchema } from './form-schema'
import { order0 } from './__styles__'
import { ContactModel } from '@reapit/foundations-ts-definitions'
import { notificationMessage } from 'constants/notification-message'
import { useUpdateContact } from 'platform-api/contact-api/update-contact'
import DocumentPreviewModal from 'components/ui/ui/document-preview-modal'
import FormFooter from 'components/ui/form-footer/form-footer'
import { displayErrorMessage } from 'utils/error-message'
import { FileInput } from 'components/ui/ui/file-input'
import { useFileDocumentUpload } from 'platform-api/file-upload-api'
import { isDataUrl } from 'utils/url'

interface DeclarationRiskManagementProps {
  userData: ContactModel | undefined
}

const DeclarationRiskManagement: React.FC<DeclarationRiskManagementProps> = ({ userData }): React.ReactElement => {
  // snack notification - snack provider
  const { success, error } = useSnack()
  // local state - modal handler
  const [declarationFormModalOpen, setDeclarationFormModalOpen] = React.useState<boolean>(false)
  const [riskAssessmentFormModalOpen, setRiskAssessmentFormModalOpen] = React.useState<boolean>(false)

  // local function - modal handler
  const handleModal = (type: 'declaration' | 'riskAssessment', option: 'open' | 'close'): void => {
    switch (type) {
      case 'riskAssessment':
        setRiskAssessmentFormModalOpen(!!(option === 'open'))
        break
      case 'declaration':
        setDeclarationFormModalOpen(!!(option === 'open'))
        break
    }
  }

  const { declarationForm, reason, riskAssessmentForm, type } = userData?.metadata?.declarationRisk ?? {}

  // setup initial values from context
  const INITIAL_VALUES: ValuesType = {
    declarationForm,
    reason,
    riskAssessmentForm,
    type,
  }

  // setup and integrate with initial value
  const { register, handleSubmit, formState, getValues, setValue } = useForm<ValuesType>({
    defaultValues: INITIAL_VALUES,
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  })

  // declare form
  const { declarationFormField, riskAssessmentFormField, typeField, reasonField } = formField()

  const updateContactData = useUpdateContact(userData!.id!, userData!._eTag!)
  const uploadFileData = useFileDocumentUpload()

  const updateDataHandler = async (name: string, fileType: keyof ValuesType): Promise<void> => {
    await uploadFileData.fileUpload(
      { name: name, imageData: getValues(fileType)! },
      {
        onSuccess: (res) => setValue(fileType, res.data.Url),
      },
    )
  }

  // button handler - submit
  const onSubmitHandler = async () => {
    try {
      // if declaration form field have base64 value, then try to upload in fileUpload
      if (isDataUrl(getValues('declarationForm')!)) {
        await updateDataHandler(`declaration-file-form-${userData?.id!}`, 'declarationForm')
      }

      // if risk assessment form field have base64 value, then try to upload in fileUpload
      if (isDataUrl(getValues('riskAssessmentForm')!)) {
        await updateDataHandler(`risk-assessment-file-form-${userData?.id!}`, 'riskAssessmentForm')
      }

      // while uploading declaration/risk assessment not error, then try to update contact data
      await updateContactData.mutateAsync(
        {
          metadata: {
            ...userData?.metadata,
            declarationRisk: getValues(),
          },
        },
        {
          onSuccess: () => success(notificationMessage.SUCCESS('Declaration Risk Management'), 3500),
          onError: (err) => error(err.response?.data.description ?? notificationMessage.DRM_ERROR, 7500),
        },
      )
    } catch (e) {
      // when file upload error, throw here
      console.error(uploadFileData.error)
      error(notificationMessage.UPLOAD_FILE_ERROR, 7500)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit<ValuesType>(onSubmitHandler)}>
        <FormLayout hasMargin className={elWFull} data-testid="declaration.risk.management.form">
          <InputWrapFull>
            <InputWrap className={elMb6}>
              <FlexContainer isFlexColumn className={elPl3}>
                <Label className={cx(order0, elMb2)}>{generateLabelField(declarationFormField.label, true)}</Label>
                <FileInput
                  {...register(declarationFormField.name)}
                  defaultValue={declarationForm}
                  onFileView={() => handleModal('declaration', 'open')}
                  accept="image/jpeg, image/png, application/pdf"
                  data-testid={generateTestId(declarationFormField.name)}
                />
                {displayErrorMessage(declarationFormField.name, formState) && (
                  <p data-testid={`test.error.${declarationFormField.name}`} className="el-input-error">
                    {displayErrorMessage(declarationFormField.name, formState)}
                  </p>
                )}
              </FlexContainer>
            </InputWrap>
            <InputWrap className={elMy6}>
              <InputGroup>
                <Select {...register(typeField.name)} data-testid={generateTestId(typeField.name)}>
                  {generateOptionsType('riskAssessmentType').map((v) => {
                    return (
                      <option key={v.value} value={v.value}>
                        {v.label}
                      </option>
                    )
                  })}
                </Select>
                <Label className={cx(order0, elMb2)}>{generateLabelField(typeField.label, true)}</Label>
                {displayErrorMessage(typeField.name, formState) && (
                  <p data-testid={`test.error.${typeField.name}`} className="el-input-error">
                    {displayErrorMessage(typeField.name, formState)}
                  </p>
                )}
              </InputGroup>
            </InputWrap>
            <InputWrap className={elMt6}>
              <FlexContainer isFlexColumn className={elPl3}>
                <Label className={cx(order0, elMb2)}>{generateLabelField(riskAssessmentFormField.label, true)}</Label>
                <FileInput
                  {...register(riskAssessmentFormField.name)}
                  defaultValue={riskAssessmentForm}
                  onFileView={() => handleModal('riskAssessment', 'open')}
                  accept="image/jpeg, image/png, application/pdf"
                  data-testid={generateTestId(riskAssessmentFormField.name)}
                />
                {displayErrorMessage(riskAssessmentFormField.name, formState) && (
                  <p data-testid={`test.error.${riskAssessmentFormField.name}`} className="el-input-error">
                    {displayErrorMessage(riskAssessmentFormField.name, formState)}
                  </p>
                )}
              </FlexContainer>
            </InputWrap>
            <InputWrap className={elMt6}>
              <InputGroup>
                <TextArea {...register(reasonField.name)} data-testid={generateTestId(reasonField.name)} />
                <Label>{generateLabelField(reasonField.label, true)}</Label>
                {displayErrorMessage(reasonField.name, formState) && (
                  <p data-testid={`test.error.${reasonField.name}`} className="el-input-error">
                    {displayErrorMessage(reasonField.name, formState)}
                  </p>
                )}
              </InputGroup>
            </InputWrap>
          </InputWrapFull>
        </FormLayout>
        <FormFooter
          idUser={userData?.id}
          isFieldError={!!Object.keys(formState.errors).length}
          isFormSubmitting={updateContactData?.isLoading || uploadFileData.isLoading}
        />
      </form>
      {/* Modal Declaration Form */}
      <DocumentPreviewModal
        src={getValues(declarationFormField.name)}
        isOpen={declarationFormModalOpen}
        onModalClose={() => handleModal('declaration', 'close')}
      />
      {/* Modal Risk Assessment Form */}
      <DocumentPreviewModal
        src={getValues(riskAssessmentFormField.name)}
        isOpen={riskAssessmentFormModalOpen}
        onModalClose={() => handleModal('riskAssessment', 'close')}
      />
    </>
  )
}

export default React.memo(DeclarationRiskManagement)
