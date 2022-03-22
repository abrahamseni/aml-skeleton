import React, { ChangeEvent, forwardRef, LegacyRef, useState, MouseEvent, useEffect } from 'react'
import { elMr4 } from '@reapit/elements'
import { Button } from '@reapit/elements'
import { Icon } from '@reapit/elements'
import { Label } from '@reapit/elements'
import { FlexContainer } from '@reapit/elements'
import { SmallText } from '@reapit/elements'
import { ElFileInput, ElFileInputIconContainer, ElFileInputWrap, ElIconDisabled } from './__styles__/file-input.style'
import { cx } from '@linaria/core'

export type FileValue = {
  url: string
  size: number | undefined
}

type SimpleEvent = { target: { name?: string; value: FileValue }; type: string }

export interface FileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'defaultValue' | 'value' | 'onChange' | 'onBlur'> {
  onFileView?: (base64: string) => void
  placeholderText?: string
  value?: FileValue
  label?: string
  onChange?: (e: SimpleEvent) => void
  onBlur?: (e: SimpleEvent) => void
  invalid?: boolean
  'data-testid'?: string
}

export type FileInputWrapped = React.ForwardRefExoticComponent<
  FileInputProps & React.RefAttributes<React.InputHTMLAttributes<HTMLInputElement>>
>

export const handleFileChange =
  (name: string | undefined, onChange?: FileInputProps['onChange'], onBlur?: FileInputProps['onBlur']) =>
  (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.files && event.target.files[0]) {
      const file = event.target.files[0]

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        const base64 = reader.result

        if (typeof base64 === 'string') {
          const newValue = {
            url: base64,
            size: file.size,
          }

          emitChange(name, newValue, onChange, onBlur)
        }
      }
      reader.onerror = (error) => {
        console.error(`file upload error: ${error}`)
      }

      return reader
    }
  }

export const handleFileClear =
  (name: string | undefined, onChange?: FileInputProps['onChange'], onBlur?: FileInputProps['onBlur']) =>
  (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation()
    event.preventDefault()

    const newValue = {
      url: '',
      size: undefined,
    }
    emitChange(name, newValue, onChange, onBlur)
  }

function emitChange(
  name: string | undefined,
  value: FileValue,
  onChange?: FileInputProps['onChange'],
  onBlur?: FileInputProps['onBlur'],
) {
  const changeEvent = {
    target: {
      name: name,
      value: value,
    },
    type: 'change',
  }
  onChange && onChange(changeEvent)

  const blurEvent = {
    target: {
      name: name,
      value: value,
    },
    type: 'blur',
  }
  onBlur && onBlur(blurEvent)
}

export const handleFileView =
  (onFileView: (fileUrl: string) => void, fileUrl: string) => (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation()
    event.preventDefault()
    onFileView(fileUrl)
  }

export const FileInput: FileInputWrapped = forwardRef(
  (
    {
      onFileView,
      onChange,
      onBlur,
      value,
      name,
      label,
      placeholderText,
      accept,
      disabled,
      invalid,
      'data-testid': testID,
      ...rest
    },
    ref: React.ForwardedRef<React.InputHTMLAttributes<HTMLInputElement>>,
  ) => {
    const [fileValue, setFileValue] = useState<FileValue>(
      value || {
        url: '',
        size: undefined,
      },
    )

    useEffect(() => {
      setFileValue(
        value || {
          url: '',
          size: undefined,
        },
      )
    }, [value])

    function testIDPrefix() {
      if (!testID) {
        return ''
      }
      return `${testID}.`
    }

    return (
      <ElFileInputWrap>
        {label && <Label>{label}</Label>}
        <FlexContainer isFlexAlignCenter>
          <Button className={elMr4} type="button" intent={!invalid ? 'low' : 'danger'} disabled={disabled}>
            {fileValue.url !== '' ? 'Change' : 'Upload'}
          </Button>
          <ElFileInput
            {...rest}
            data-testid={testIDPrefix() + 'file-input'}
            name={name}
            accept={accept}
            type="file"
            onChange={handleFileChange(name, onChange, onBlur)}
            disabled={disabled}
            ref={ref as LegacyRef<HTMLInputElement>}
          />
          {fileValue.url !== '' ? (
            <ElFileInputIconContainer>
              {onFileView && (
                <Icon
                  onClick={handleFileView(onFileView, fileValue.url)}
                  className={elMr4}
                  intent="primary"
                  icon="previewSystem"
                  data-testid={testIDPrefix() + 'preview-button'}
                />
              )}
              <Icon
                onClick={!disabled ? handleFileClear(name, onChange, onBlur) : undefined}
                className={cx(elMr4, disabled && ElIconDisabled)}
                intent="primary"
                icon="cancelSolidSystem"
                data-testid={testIDPrefix() + 'clear-button'}
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
