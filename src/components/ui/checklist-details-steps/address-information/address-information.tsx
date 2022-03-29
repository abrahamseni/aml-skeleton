import React, { FC, ReactElement, useState } from 'react'
import { Button, FormLayout, InputWrapFull, useSnack } from '@reapit/elements'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { validationSchema, ValuesType } from './form-schema'
import { RightSideContainer } from './__styles__'
import { ContactModel } from '@reapit/foundations-ts-definitions'
import { notificationMessage } from 'constants/notification-message'
import { useUpdateContact } from 'platform-api/contact-api/update-contact'

import FormField from './form-field'
import FormFooter from 'components/ui/form-footer/form-footer'
import { useFileDocumentUpload } from 'platform-api/file-upload-api/post-file-upload'
import { isDataUrl } from 'utils/url'
import { getFormSaveErrorMessage } from '../../../../utils/error-message'

const initialValues = ({ primaryAddress, secondaryAddress, metadata }): ValuesType => ({
  primaryAddress: {
    type: 'primary',
    ...primaryAddress,
  },
  secondaryAddress: {
    type: 'secondary',
    ...secondaryAddress,
  },
  metadata: {
    primaryAddress: {
      documentImage: metadata?.primaryAddress?.documentImage ?? '',
      documentType: metadata?.primaryAddress?.documentType ?? '',
      month: metadata?.primaryAddress?.month ?? '',
      year: metadata?.primaryAddress?.year ?? '',
    },
    secondaryAddress: {
      documentImage: metadata?.secondaryAddress?.documentImage ?? '',
      documentType: metadata?.secondaryAddress?.documentType ?? '',
      month: metadata?.secondaryAddress?.month ?? '',
      year: metadata?.secondaryAddress?.year ?? '',
    },
  },
})

interface AddressInformationProps {
  userData: ContactModel | undefined
}

const AddressInformation: FC<AddressInformationProps> = ({ userData }): ReactElement => {
  const [isSecondaryFormActive, setIsSecondaryFormActive] = useState(!!userData?.secondaryAddress)

  const { primaryAddress, secondaryAddress, metadata } = userData ?? {}

  const { success, error } = useSnack()

  const {
    getValues,
    setValue,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ValuesType>({
    defaultValues: initialValues({ primaryAddress, secondaryAddress, metadata }),
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  })

  const { mutateAsync, isLoading: isUpdateContactLoading } = useUpdateContact(userData?.id!, userData?._eTag!)

  const { fileUpload, isLoading: isFileUploadLoading } = useFileDocumentUpload()

  const uploadFileDocumentHandler = async (
    name: string,
    fileType: 'metadata.primaryAddress.documentImage' | 'metadata.secondaryAddress.documentImage',
  ): Promise<void> => {
    await fileUpload(
      { name: name, imageData: getValues(fileType) as string },
      {
        onSuccess: (res) => setValue(fileType, res.data.Url),
      },
    )
  }

  const onSubmitHandler = async () => {
    try {
      if (isDataUrl(getValues('metadata.primaryAddress.documentImage') as string)) {
        await uploadFileDocumentHandler(
          `document-image-primary-address-${userData?.id!}`,
          'metadata.primaryAddress.documentImage',
        )
      }

      if (isDataUrl(getValues('metadata.secondaryAddress.documentImage') as string)) {
        await uploadFileDocumentHandler(
          `document-image-secondary-address-${userData?.id!}`,
          'metadata.secondaryAddress.documentImage',
        )
      }

      await mutateAsync(
        {
          primaryAddress: getValues('primaryAddress'),
          secondaryAddress: getValues('secondaryAddress'),
          metadata: {
            declarationRisk: userData?.metadata?.declarationRisk,
            ...getValues('metadata'),
          },
        },
        {
          onSuccess: () => success(notificationMessage.SUCCESS('Address Information'), 3500),
        },
      )
    } catch (e: any) {
      error(getFormSaveErrorMessage('Address Information', e), 7500)
      console.error(e.message)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <FormLayout hasMargin>
          <FormField
            name="primaryAddress"
            useFormProps={{ register, getValues, errors }}
            data-testid="form.primaryAddress"
          />
          <InputWrapFull>
            <RightSideContainer>
              <Button
                data-testid="toggler.extend.form"
                intent="neutral"
                type="button"
                onClick={() => setIsSecondaryFormActive(!isSecondaryFormActive)}
              >
                Less than 3 Years ?
              </Button>
            </RightSideContainer>
          </InputWrapFull>
          {isSecondaryFormActive && (
            <FormField
              name="secondaryAddress"
              useFormProps={{ register, getValues, errors }}
              data-testid="form.secondaryAddress"
            />
          )}
        </FormLayout>
        <FormFooter
          idUser={userData?.id}
          isFieldError={!!Object.keys(errors).length}
          isFormSubmitting={isUpdateContactLoading || isFileUploadLoading}
        />
      </form>
    </>
  )
}

export default React.memo(AddressInformation)
