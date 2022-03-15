import React, { FC, useState } from 'react'
import {
  Button,
  InputGroup,
  Label,
  Select,
  FileInputProps,
  FlexContainer,
  ButtonGroup,
  InputError,
  Input,
  Loader,
} from '@reapit/elements'
import { FileInput } from './file-input'
import { useForm, UseFormRegister, UseFormRegisterReturn } from 'react-hook-form'
import { useGetIdentityDocumentTypes } from '../../../../platform-api/configuration-api'
import { formFields, ValuesType } from './form-schema/form-field'
import { identityDocumentTypes } from './__mocks__'
import DocumentPreviewModal from './document-preview-modal'
import { useDownloadDocument } from '../../../../platform-api/document-api'
import { yupResolver } from '@hookform/resolvers/yup'
import { isDataUrl } from '../../../../utils/url'
import validationSchema from './form-schema/validation-schema'
import { SaveButtonGroup, LoaderContainer } from './__styles__/id-form.style'

type Props = {
  defaultValues?: ValuesType
  onSave: (values: ValuesType) => void
  onPrevious?: () => void
  onNext?: (values: ValuesType) => void
  noticeText?: string
  rpsRef?: string
  disabled?: boolean
  loading?: boolean
}

export const IdForm: FC<Props> = ({
  defaultValues,
  onSave,
  onNext,
  onPrevious,
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
    defaultValues: defaultValues || {
      idType: 'DL',
      idReference: 'Hello',
      expiryDate: '',
      // documentFile: 'https://via.placeholder.com/150',
      documentFile: 'MKT22000005', // BDF15002338
    },
    resolver: yupResolver(validationSchema),
  })
  const { data: identityDocumentTypesData } = useGetIdentityDocumentTypes()
  identityDocumentTypesData
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
      const data = await downloadDocument({ documentId: documentFile })
      document = data || ''
    } else {
      document = documentFile
    }

    setDocumentPreviewState({ isOpen: true, loading: false, document: document })
  }

  function save(values: ValuesType) {
    // alert(JSON.stringify(values, null, 2))
    onSave(values)
  }

  function goToPrevious() {
    onPrevious && onPrevious()
  }

  function goToNext(values: ValuesType) {
    onNext && onNext(values)
  }

  return (
    <div>
      {noticeText && <p>*{noticeText}</p>}
      <InputGroup className="el-my3">
        <Label>{formFields.idType.label}</Label>
        <Select defaultValue="" {...register(formFields.idType.name)} disabled={disabled}>
          {identityDocumentTypes &&
            identityDocumentTypes.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.value}
              </option>
            ))}
          <option value="" disabled hidden>
            Please select
          </option>
        </Select>
        {errors.idType?.message && <InputError message={errors.idType.message} />}
      </InputGroup>
      <InputGroup className="el-my3">
        <Label>{formFields.idReference.label}</Label>
        <Input type="text" placeholder="ID Reference" disabled={disabled} {...register(formFields.idReference.name)} />
        {errors.idReference?.message && <InputError message={errors.idReference.message} />}
      </InputGroup>
      <InputGroup className="el-my3">
        <Label>{formFields.expiryDate.label}</Label>
        <Input type="date" defaultValue="" disabled={disabled} {...register(formFields.expiryDate.name)} />
        {errors.expiryDate?.message && <InputError message={errors.expiryDate.message} />}
      </InputGroup>
      <div className="el-my3">
        <MyFileInput
          label={formFields.documentFile.label}
          name={formFields.documentFile.name}
          defaultValue={getValues('documentFile')}
          onFileView={openDocumentPreview}
          register={register}
          accept="image/jpeg, image/png, application/pdf"
          disabled={disabled}
        />
        {errors.documentFile?.message && <InputError message={errors.documentFile.message} />}
        <DocumentPreviewModal
          src={documentPreviewState.document}
          isOpen={documentPreviewState.isOpen}
          loading={documentPreviewState.loading}
          onModalClose={() => setDocumentPreviewState({ isOpen: false, loading: false, document: '' })}
        />
      </div>
      <FlexContainer isFlexJustifyBetween className="el-mt8">
        <ButtonGroup>
          <Button intent="secondary" chevronLeft onClick={goToPrevious}>
            Previous
          </Button>
        </ButtonGroup>
        <FlexContainer isFlexAlignCenter>
          <div className="el-mr4">
            <span>RPS Ref:</span>
            <span className="el-ml1">{rpsRef || ''}</span>
          </div>
        {!loading ? (
          <SaveButtonGroup>
            <Button intent="success" disabled={disabled} onClick={handleSubmit(save)}>
              Save
            </Button>
            <Button intent="primary" chevronRight disabled={disabled} onClick={handleSubmit(goToNext)}>
              Next
            </Button>
          </SaveButtonGroup>
        ) : (
          <LoaderContainer>
            <Loader label="Please wait" />
          </LoaderContainer>
        )}
        </FlexContainer>
      </FlexContainer>
    </div>
  )
}

interface MyFIleInputProps extends FileInputProps {
  register?: UseFormRegister<any>
}

const MyFileInput: FC<MyFIleInputProps> = ({ name, onChange, register, ...props }) => {
  function changeValue(e: React.ChangeEvent<HTMLInputElement>) {
    onChange && onChange(e)
    const validationProps = getValidationProps()
    validationProps.onChange && validationProps.onChange(e)
  }

  function getValidationProps(): Partial<UseFormRegisterReturn> {
    if (register !== undefined && name !== undefined) {
      return register(name)
    }

    return {
      onChange: (): any => {},
    }
  }

  return <FileInput {...getValidationProps()} {...props} onChange={changeValue} />
}

export default IdForm