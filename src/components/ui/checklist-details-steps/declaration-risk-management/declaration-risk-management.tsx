import React, { FC, ReactElement, memo, useState } from 'react'
import {
  FlexContainer,
  InputGroup,
  Label,
  Select,
  TextArea,
  FormLayout,
  InputWrapFull,
  InputWrap,
  useSnack,
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
import { displayErrorMessage } from 'utils/error-message'
import { FileInput } from 'components/ui/elements/file-input'
import { useFileDocumentUpload } from 'platform-api/file-upload-api'
import { isDataUrl } from 'utils/url'
import FormFooter from 'components/ui/form-footer/form-footer'
import DocumentPreviewModal from 'components/ui/elements/document-preview-modal'

const initialValues = ({ declarationForm, reason, riskAssessmentForm, type }): ValuesType => ({
  declarationForm,
  reason,
  riskAssessmentForm,
  type,
})

interface DeclarationRiskManagementProps {
  userData: ContactModel | undefined
}

const DeclarationRiskManagement: FC<DeclarationRiskManagementProps> = ({ userData }): ReactElement => {
  const { declarationForm, reason, riskAssessmentForm, type } = userData?.metadata?.declarationRisk ?? {}

  const { success, error } = useSnack()

  const [declarationFormModalOpen, setDeclarationFormModalOpen] = useState<boolean>(false)
  const [riskAssessmentFormModalOpen, setRiskAssessmentFormModalOpen] = useState<boolean>(false)

  const handleModal = (type: 'declarationForm' | 'riskAssessmentForm', option: 'open' | 'close'): void => {
    switch (type) {
      case 'riskAssessmentForm':
        setRiskAssessmentFormModalOpen(option === 'open')
        break
      case 'declarationForm':
        setDeclarationFormModalOpen(option === 'open')
        break
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<ValuesType>({
    defaultValues: initialValues({ declarationForm, reason, riskAssessmentForm, type }),
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  })

  const { mutateAsync, isLoading: isUpdateContactLoading } = useUpdateContact(userData!.id!, userData!._eTag!)

  const { fileUpload, isLoading: isFileUploadLoading } = useFileDocumentUpload()

  const uploadFileDocumentHandler = async (
    name: string,
    fileType: 'declarationForm' | 'riskAssessmentForm',
  ): Promise<void> => {
    await fileUpload(
      { name: name, imageData: getValues(fileType) },
      {
        onSuccess: (res) => setValue(fileType, res.data.Url),
      },
    )
  }

  const onSubmitHandler = async () => {
    try {
      if (isDataUrl(getValues('declarationForm') as string)) {
        await uploadFileDocumentHandler(`declaration-file-form-${userData?.id!}`, 'declarationForm')
      }

      if (isDataUrl(getValues('riskAssessmentForm') as string)) {
        await uploadFileDocumentHandler(`risk-assessment-file-form-${userData?.id!}`, 'riskAssessmentForm')
      }

      await mutateAsync(
        {
          metadata: {
            ...userData?.metadata,
            declarationRisk: getValues(),
          },
        },
        {
          onSuccess: () => success(notificationMessage.SUCCESS('Declaration Risk Management'), 3500),
        },
      )
    } catch (e: any) {
      if (e.response?.status === 412) {
        error(notificationMessage.NOT_MATCH_E_TAG, 7500)
      } else {
        error(e.message ?? notificationMessage.DRM_ERROR, 7500)
      }
      console.error(e.message)
    }
  }

  const { declarationFormField, riskAssessmentFormField, typeField, reasonField } = formField()

  return (
    <>
      <form onSubmit={handleSubmit<ValuesType>(onSubmitHandler)}>
        <FormLayout hasMargin data-testid="declaration.risk.management.form">
          <InputWrapFull>
            <InputWrap className="el-mb6">
              <FlexContainer isFlexColumn className="el-pl3">
                <Label className={cx(order0, 'el-mb2')}>{generateLabelField(declarationFormField.label, true)}</Label>
                <FileInput
                  {...register(declarationFormField.name)}
                  defaultValue={declarationForm}
                  onFileView={() => handleModal(declarationFormField.name, 'open')}
                  data-testid={generateTestId(declarationFormField.name)}
                />
                {displayErrorMessage(declarationFormField.name, errors) && (
                  <p data-testid={`test.error.${declarationFormField.name}`} className="el-input-error">
                    {displayErrorMessage(declarationFormField.name, errors)}
                  </p>
                )}
              </FlexContainer>
            </InputWrap>
            <InputWrap className="el-my3">
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
                <Label className={cx(order0, 'el-mb2')}>{generateLabelField(typeField.label, true)}</Label>
                {displayErrorMessage(typeField.name, errors) && (
                  <p data-testid={`test.error.${typeField.name}`} className="el-input-error">
                    {displayErrorMessage(typeField.name, errors)}
                  </p>
                )}
              </InputGroup>
            </InputWrap>
            <InputWrap className="el-mt6">
              <FlexContainer isFlexColumn className="el-pl3">
                <Label className={cx(order0, 'el-mb2')}>
                  {generateLabelField(riskAssessmentFormField.label, true)}
                </Label>
                <FileInput
                  {...register(riskAssessmentFormField.name)}
                  defaultValue={riskAssessmentForm}
                  onFileView={() => handleModal(riskAssessmentFormField.name, 'open')}
                  accept="image/jpeg, image/png, application/pdf"
                  data-testid={generateTestId(riskAssessmentFormField.name)}
                />
                {displayErrorMessage(riskAssessmentFormField.name, errors) && (
                  <p data-testid={`test.error.${riskAssessmentFormField.name}`} className="el-input-error">
                    {displayErrorMessage(riskAssessmentFormField.name, errors)}
                  </p>
                )}
              </FlexContainer>
            </InputWrap>
            <InputWrap className="el-mt6">
              <InputGroup>
                <TextArea {...register(reasonField.name)} data-testid={generateTestId(reasonField.name)} />
                <Label>{generateLabelField(reasonField.label, true)}</Label>
                {displayErrorMessage(reasonField.name, errors) && (
                  <p data-testid={`test.error.${reasonField.name}`} className="el-input-error">
                    {displayErrorMessage(reasonField.name, errors)}
                  </p>
                )}
              </InputGroup>
            </InputWrap>
          </InputWrapFull>
        </FormLayout>
        <FormFooter
          idUser={userData?.id}
          isFieldError={!!Object.keys(errors).length}
          isFormSubmitting={isUpdateContactLoading || isFileUploadLoading}
        />
      </form>
      <DocumentPreviewModal
        src={getValues(declarationFormField.name)}
        isOpen={declarationFormModalOpen}
        onModalClose={() => handleModal(declarationFormField.name, 'close')}
      />
      <DocumentPreviewModal
        src={getValues(riskAssessmentFormField.name)}
        isOpen={riskAssessmentFormModalOpen}
        onModalClose={() => handleModal(riskAssessmentFormField.name, 'close')}
      />
    </>
  )
}

export default memo(DeclarationRiskManagement)
