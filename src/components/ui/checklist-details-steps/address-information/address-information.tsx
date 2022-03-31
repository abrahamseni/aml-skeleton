import React, { FC, ReactElement, useState } from 'react'
import { Button, FormLayout, InputWrapFull, useSnack } from '@reapit/elements'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { validationSchema, ValuesType } from './form-schema'
import { RightSideContainer } from './__styles__'
import { ContactModel } from '@reapit/foundations-ts-definitions'
import { notificationMessage } from '../../../../constants/notification-message'
import { useUpdateContact } from '../../../../platform-api/contact-api/update-contact'

import FormField from './form-field'
import FormFooter from '../../form-footer/form-footer'
import { useFileDocumentUpload } from '../../../../platform-api/file-upload-api/post-file-upload'
import { isDataUrl } from '../../../../utils/url'
import { generateNewObject } from '../../../../utils/generator'

const initialValues = ({ primaryAddress, secondaryAddress, metadata }): ValuesType => ({
  primaryAddress: {
    type: 'primary',
    documentImage: metadata?.primaryAddress?.documentImage ?? '',
    documentType: metadata?.primaryAddress?.documentType ?? '',
    month: metadata?.primaryAddress?.month ?? '',
    year: metadata?.primaryAddress?.year ?? '',
    ...primaryAddress,
  },
  secondaryAddress: {
    type: 'secondary',
    documentImage: metadata?.secondaryAddress?.documentImage ?? '',
    documentType: metadata?.secondaryAddress?.documentType ?? '',
    month: metadata?.secondaryAddress?.month ?? '',
    year: metadata?.secondaryAddress?.year ?? '',
    ...secondaryAddress,
  },
})

interface AddressInformationProps {
  contactData: ContactModel | undefined
}

const AddressInformation: FC<AddressInformationProps> = ({ contactData }): ReactElement => {
  const [isSecondaryFormActive, setIsSecondaryFormActive] = useState(!!contactData?.secondaryAddress)

  const { primaryAddress, secondaryAddress, metadata } = contactData ?? {}

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

  const { mutateAsync, isLoading: isUpdateContactLoading } = useUpdateContact(contactData?.id!, contactData?._eTag!)

  const { fileUpload, isLoading: isFileUploadLoading } = useFileDocumentUpload()

  const uploadFileDocumentHandler = async (
    name: string,
    fileType: 'primaryAddress.documentImage' | 'secondaryAddress.documentImage',
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
      if (isDataUrl(getValues('primaryAddress.documentImage') as string)) {
        await uploadFileDocumentHandler(
          `document-image-primary-address-${contactData?.id!}`,
          'primaryAddress.documentImage',
        )
      }

      if (isDataUrl(getValues('secondaryAddress.documentImage') as string)) {
        await uploadFileDocumentHandler(
          `document-image-secondary-address-${contactData?.id!}`,
          'secondaryAddress.documentImage',
        )
      }

      await mutateAsync(
        {
          primaryAddress: generateNewObject(
            ['documentImage', 'documentType', 'month', 'year', 'countryId'],
            getValues('primaryAddress'),
          ),
          secondaryAddress: generateNewObject(
            ['documentImage', 'documentType', 'month', 'year', 'countryId'],
            getValues('secondaryAddress'),
          ),
          metadata: {
            declarationRisk: contactData?.metadata?.declarationRisk,
            primaryAddress: generateNewObject(
              ['documentImage', 'documentType', 'month', 'year'],
              getValues('primaryAddress'),
              'pick',
            ),
            secondaryAddress: generateNewObject(
              ['documentImage', 'documentType', 'month', 'year'],
              getValues('secondaryAddress'),
              'pick',
            ),
          },
        },
        {
          onSuccess: () => success(notificationMessage.SUCCESS('Address Information'), 3500),
        },
      )
    } catch (e: any) {
      error(e.message, 7500)
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
          idUser={contactData?.id}
          isFieldError={!!Object.keys(errors).length}
          isFormSubmitting={isUpdateContactLoading || isFileUploadLoading}
        />
      </form>
    </>
  )
}

export default AddressInformation
