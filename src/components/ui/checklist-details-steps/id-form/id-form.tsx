import React, { FC, useState } from 'react'
import { InputGroup, Label, Select, Input } from '@reapit/elements'
import { useForm } from 'react-hook-form'
import { formFields, ValuesType } from './form-schema/form-field'
import DocumentPreviewModal from 'components/ui/ui/document-preview-modal'
import { useDownloadDocument } from 'platform-api/document-api'
import { yupResolver } from '@hookform/resolvers/yup'
import { isDataUrl } from 'utils/url'
import validationSchema from './form-schema/validation-schema'
import { generateLabelField } from 'utils/generator'
import { ListItemModel } from '@reapit/foundations-ts-definitions'
import FormFooter from 'components/ui/form-footer/form-footer'
import FileInput from 'components/ui/ui/file-input'

const defaultValuesConst = {
  idType: '',
  idReference: '',
  expiryDate: '',
  documentFile: '',
}

export type IdFormProps = {
  defaultValues?: ValuesType
  idDocTypes?: Required<ListItemModel>[]
  onSave: (values: ValuesType) => void
  noticeText?: string
  rpsRef?: string
  disabled?: boolean
  loading?: boolean
}

export const IdForm: FC<IdFormProps> = ({
  defaultValues,
  idDocTypes,
  onSave,
  noticeText,
  rpsRef,
  disabled,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ValuesType>({
    defaultValues: defaultValues || defaultValuesConst,
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  })
  const [documentPreviewState, setDocumentPreviewState] = useState({
    isOpen: false,
    loading: true,
    document: '',
  })
  const downloadDocument = useDownloadDocument()

  async function openDocumentPreview() {
    setDocumentPreviewState({ isOpen: true, loading: true, document: '' })

    const documentFile = getValues('documentFile')
    let document = ''
    if (!isDataUrl(documentFile)) {
      const data = await downloadDocument(documentFile)
      document = data || ''
    } else {
      document = documentFile
    }
    setDocumentPreviewState({ isOpen: true, loading: false, document: document })
  }

  function save(values: ValuesType) {
    onSave(values)
  }

  return (
    <form onSubmit={handleSubmit(save)}>
      {noticeText && <p data-testid="noticeText">*{noticeText}</p>}
      <InputGroup className="el-my3">
        <Label>{generateLabelField(formFields.idType.label, true)}</Label>
        <Select
          {...register(formFields.idType.name)}
          disabled={disabled}
          data-testid={`input.${formFields.idType.name}`}
        >
          {idDocTypes &&
            idDocTypes.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.value}
              </option>
            ))}
          <option value="" disabled hidden>
            Please select
          </option>
        </Select>
        {errors.idType?.message && (
          <p className="el-input-error" data-testid={`error.${formFields.idType.name}`}>
            {errors.idType.message}
          </p>
        )}
      </InputGroup>
      <InputGroup className="el-my3">
        <Label>{generateLabelField(formFields.idReference.label, true)}</Label>
        <Input
          type="text"
          disabled={disabled}
          {...register(formFields.idReference.name)}
          data-testid={`input.${formFields.idReference.name}`}
        />
        {errors.idReference?.message && (
          <p className="el-input-error" data-testid={`error.${formFields.idReference.name}`}>
            {errors.idReference.message}
          </p>
        )}
      </InputGroup>
      <InputGroup className="el-my3">
        <Label>{generateLabelField(formFields.expiryDate.label, true)}</Label>
        <Input
          type="date"
          disabled={disabled}
          {...register(formFields.expiryDate.name)}
          data-testid={`input.${formFields.expiryDate.name}`}
        />
        {errors.expiryDate?.message && (
          <p className="el-input-error" data-testid={`error.${formFields.expiryDate.name}`}>
            {errors.expiryDate.message}
          </p>
        )}
      </InputGroup>
      <div className="el-my3">
        <FileInput
          label={generateLabelField(formFields.documentFile.label, true)}
          defaultValue={getValues('documentFile')}
          onFileView={openDocumentPreview}
          accept="image/jpeg, image/png, application/pdf"
          disabled={disabled}
          {...register(formFields.documentFile.name)}
          data-testid={`input.${formFields.documentFile.name}`}
        />
        {errors.documentFile?.message && (
          <p className="el-input-error" data-testid={`error.${formFields.documentFile.name}`}>
            {errors.documentFile.message}
          </p>
        )}
        <DocumentPreviewModal
          src={documentPreviewState.document}
          isOpen={documentPreviewState.isOpen}
          loading={documentPreviewState.loading}
          onModalClose={() => setDocumentPreviewState({ isOpen: false, loading: false, document: '' })}
        />
      </div>
      <FormFooter idUser={rpsRef || ''} isFieldError={!!Object.keys(errors).length} isFormSubmitting={!!loading} />
    </form>
  )
}

export default IdForm
