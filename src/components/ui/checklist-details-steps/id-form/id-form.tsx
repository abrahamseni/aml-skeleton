import React, { FC, useState } from 'react'
import { 
  Button,
  InputGroup, 
  Label,
  Select,
  FileInputProps,
  FlexContainer,
  ButtonGroup,
  InputError
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

type Props = {
  defaultValues?: ValuesType
  onSave: (values: ValuesType) => void
  onPrevious?: () => void
  onNext?: (values: ValuesType) => void
  noticeText?: string
  disabled?: boolean
}

export const IdForm: FC<Props> = ({ defaultValues, onSave, onNext, onPrevious, noticeText, disabled }) => {
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<ValuesType>({
    defaultValues: defaultValues || {
      idType: 'DL',
      idReference: 'Hello',
      expiryDate: '',
      // documentFile: 'https://via.placeholder.com/150',
      documentFile: 'MKT22000005', // BDF15002338
    },
    resolver: yupResolver(validationSchema)
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

    let document = ''
    if (!isDataUrl(getValues('documentFile'))) {
      const data = await downloadDocument({ documentId: 'MKT22000004'})
      document = data || ''
    } else {
      document = getValues('documentFile')
    }

    setDocumentPreviewState({ isOpen: true, loading: false, document: document })
  }

  function save(values: ValuesType) {
    alert(JSON.stringify(values, null, 2))
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
      {noticeText && (
        <p>*{noticeText}</p>
      )}
      <InputGroup className="el-my3">
        <Label>{formFields.idType.label}</Label>
        <Select defaultValue="" {...register(formFields.idType.name)} disabled={disabled}>
          {identityDocumentTypes && identityDocumentTypes.map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.value}</option>
          ))}
          <option value="" disabled hidden>Please select</option>
        </Select>
        {errors.idType?.message && (
          <InputError message={errors.idType.message} />
        )}
      </InputGroup>
      <InputGroup 
        className="el-my3" label={formFields.idReference.label} type="text" placeholder="ID Reference" 
        errorMessage={errors.idReference?.message && errors.idReference.message}
        disabled={disabled}
        {...register(formFields.idReference.name)}
      />
      <InputGroup 
        className="el-my3" label={formFields.expiryDate.label} type="date" defaultValue=""
        errorMessage={errors.expiryDate?.message && errors.expiryDate.message}
        disabled={disabled}
        {...register(formFields.expiryDate.name)}
      >
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
        {errors.documentFile?.message && (
          <InputError message={errors.documentFile.message} />
        )}
        <DocumentPreviewModal 
          src={documentPreviewState.document} isOpen={documentPreviewState.isOpen} 
          loading={documentPreviewState.loading}
          onModalClose={() => setDocumentPreviewState({ isOpen: false, loading: false, document: ''})}
        />
      </div>
      <FlexContainer isFlexJustifyBetween className="el-mt8">
        <ButtonGroup>
          <Button intent="secondary" chevronLeft onClick={goToPrevious}>
            Previous
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button intent="success" disabled={disabled} onClick={handleSubmit(save)}>
            Save
          </Button>
          <Button intent="primary" chevronRight disabled={disabled} onClick={handleSubmit(goToNext)} >
            Finish
          </Button>
        </ButtonGroup>
      </FlexContainer>
    </div>
  )
}

interface MyFIleInputProps extends FileInputProps {
  register?: UseFormRegister<any>
} 

const MyFileInput: FC<MyFIleInputProps> = ({ name, onChange, register, ...props}) => {
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
      onChange: (): any => {}
    }
  }

  return (
    <FileInput
      {...getValidationProps()}
      {...props}
      onChange={changeValue}
    />
  )
}

export default IdForm