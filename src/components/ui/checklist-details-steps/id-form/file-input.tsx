import React, {
  ChangeEvent,
  Dispatch,
  forwardRef,
  LegacyRef,
  SetStateAction,
  useState,
  MouseEvent,
  useEffect,
  useMemo,
} from 'react'
import { elMr4 } from '@reapit/elements'
import { Button } from '@reapit/elements'
import { Icon } from '@reapit/elements'
import { Label } from '@reapit/elements'
import { FlexContainer } from '@reapit/elements'
import { handleSetNativeInput } from '@reapit/elements'
import { SmallText } from '@reapit/elements'
import { ElFileInput, ElFileInputHidden, ElFileInputIconContainer, ElFileInputWrap, ElIconDisabled } from './__styles__/file-input.style'
import { cx } from '@linaria/core'

export interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileUpload?: (uploadImageModel: CreateImageUploadModel) => Promise<any | ImageUploadModel>
  onFileView?: (base64: string) => void
  placeholderText?: string
  defaultValue?: string
  label?: string
  fileName?: string
}

export type FileInputWrapped = React.ForwardRefExoticComponent<
  FileInputProps & React.RefAttributes<React.InputHTMLAttributes<HTMLInputElement>>
>

export interface CreateImageUploadModel {
  name?: string
  imageData?: string
}

export interface ImageUploadModel {
  Url: string
}

export const handleFileChange = (
  setFileName: Dispatch<SetStateAction<string>>,
  fileName: string,
  onFileUpload?: (uploadImageModel: CreateImageUploadModel) => Promise<string | ImageUploadModel>,
) => (event: ChangeEvent<HTMLInputElement>) => {
  if (event.target && event.target.files && event.target.files[0]) {
    const file = event.target.files[0]

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      const base64 = reader.result

      const value =
        onFileUpload && typeof base64 === 'string'
          ? await onFileUpload({
              imageData: base64,
              name: `${fileName ? fileName : file.name}`,
            })
          : base64

      if (typeof value === 'string') {
        setFileName(value)
      }

      if (value && (value as ImageUploadModel).Url) {
        setFileName((value as ImageUploadModel).Url)
      }
    }
    reader.onerror = (error) => {
      console.error(`file upload error: ${error}`)
    }

    return reader
  }
}

export const handleFileClear = (setFileName: Dispatch<SetStateAction<string>>) => (
  event: MouseEvent<HTMLSpanElement>,
) => {
  event.stopPropagation()
  event.preventDefault()

  setFileName('')
}

export const handleFileView = (onFileView: (fileUrl: string) => void, fileUrl: string) => (
  event: MouseEvent<HTMLSpanElement>,
) => {
  event.stopPropagation()
  event.preventDefault()
  onFileView(fileUrl)
}

export const FileInput: FileInputWrapped = forwardRef(
  (
    { onFileView, onFileUpload, defaultValue, label, placeholderText, fileName = '', accept, id, disabled, ...rest },
    ref: React.ForwardedRef<React.InputHTMLAttributes<HTMLInputElement>>,
  ) => {
    const [fileUrl, setFileName] = useState<string>(defaultValue ?? '')

    const inputId = useMemo(() => {
      if (id) return id
      return generateRandomId()
    }, [id])

    useEffect(handleSetNativeInput(inputId, [fileUrl]), [fileUrl])

    return (
      <ElFileInputWrap>
        {label && <Label>{label}</Label>}
        <FlexContainer isFlexAlignCenter>
          <Button className={elMr4} type="button" intent="low" disabled={disabled}>
            {fileUrl ? 'Change' : 'Upload'}
          </Button>
          <ElFileInput
            data-testid="el-file-input"
            accept={accept}
            type="file"
            onChange={handleFileChange(setFileName, fileName, onFileUpload)}
            disabled={disabled}
          />
          <ElFileInputHidden
            id={inputId}
            {...rest}
            defaultValue={defaultValue}
            ref={ref as LegacyRef<HTMLInputElement>}
          />
          {fileUrl ? (
            <ElFileInputIconContainer>
              {onFileView && (
                <Icon
                  onClick={handleFileView(onFileView, fileUrl)}
                  className={elMr4}
                  intent="primary"
                  icon="previewSystem"
                />
              )}
              <Icon
                onClick={!disabled ? handleFileClear(setFileName): undefined}
                className={cx(elMr4, disabled && ElIconDisabled)}
                intent="primary"
                icon="cancelSolidSystem"
              />
            </ElFileInputIconContainer>
          ) : (
            <SmallText hasGreyText hasNoMargin>
              {placeholderText ?? 'Upload File'}
            </SmallText>
          )}
        </FlexContainer>
      </ElFileInputWrap>
    )
  },
)

const generateRandomId = (): string => {
  try {
    const randomId = `random-${Math.random().toString(36).substring(7)}`
    const isTest = window?.process?.env?.NODE_ENV === 'test'
    return isTest ? 'test-static-id' : randomId
  } catch (e) {
    return ''
  }
}