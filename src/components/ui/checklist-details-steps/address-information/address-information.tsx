import React from 'react'
import { Button, elWFull, FormLayout, InputWrapFull, useSnack } from '@reapit/elements'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { validationSchema, ValuesType } from './form-schema'
import { RightSideContainer } from './__styles__'
import { ContactModel } from '@reapit/foundations-ts-definitions'
import { notificationMessage } from 'constants/notification-message'
import { useUpdateContact } from 'platform-api/contact-api/update-contact'

import FormField from './form-field'
import FormFooter from 'components/ui/form-footer/form-footer'
import { useFileDocumentUpload } from 'platform-api/file-upload-api'
import { isDataUrl } from 'utils/url'

interface AddressInformationProps {
  userData: ContactModel | undefined
}

const AddressInformation: React.FC<AddressInformationProps> = ({ userData }): React.ReactElement => {
  // snack notification - snack provider
  const { success, error } = useSnack()

  const [isSecondaryFormActive, setIsSecondaryFormActive] = React.useState<boolean>(!!userData?.secondaryAddress)

  // get user data from parent
  const { primaryAddress, secondaryAddress, metadata } = userData ?? {}

  // reformat metadata
  const formattedMetadata: ValuesType['metadata'] = {
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
  }

  // setup initial values
  const INITIAL_VALUES: ValuesType = {
    primaryAddress: {
      type: 'primary',
      ...primaryAddress,
    },
    secondaryAddress: {
      type: 'secondary',
      ...secondaryAddress,
    },
    metadata: formattedMetadata,
  }

  // setup and integrate initial value with useForm Hook
  const currentForm = useForm<ValuesType>({
    defaultValues: INITIAL_VALUES,
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  })

  const updateContactData = useUpdateContact(userData!.id!, userData!._eTag!)
  const uploadFileData = useFileDocumentUpload()

  const updateDataHandler = async (name: string, fileType: any): Promise<void> => {
    await uploadFileData.fileUpload(
      { name: name, imageData: currentForm.getValues(fileType)! },
      {
        onSuccess: (res) => {
          currentForm.setValue(fileType, res.data.Url)
        },
      },
    )
  }

  // button handler - submit
  const onSubmitHandler = async () => {
    try {
      if (isDataUrl(currentForm.getValues('metadata.primaryAddress.documentImage')!)) {
        await updateDataHandler(
          `document-image-primary-address-${userData?.id!}`,
          'metadata.primaryAddress.documentImage',
        )
      }

      if (isDataUrl(currentForm.getValues('metadata.secondaryAddress.documentImage')!)) {
        await updateDataHandler(
          `document-image-secondary-address-${userData?.id!}`,
          'metadata.secondaryAddress.documentImage',
        )
      }

      if (!uploadFileData.isError) {
        updateContactData.mutate(
          {
            primaryAddress: currentForm.getValues('primaryAddress'),
            secondaryAddress: currentForm.getValues('secondaryAddress'),
            metadata: {
              declarationRisk: userData?.metadata?.declarationRisk,
              ...currentForm.getValues('metadata'),
            },
          },
          {
            onSuccess: () => {
              success(notificationMessage.SUCCESS('Address Information'), 3500)
            },
            onError: (err) => {
              error(err.response?.data.description, 7500)
            },
          },
        )
      }
    } catch (e) {
      // when file upload error, throw here
      console.error(uploadFileData.error)
      error('Failed to upload Document, try again later', 7500)
    }
  }

  return (
    <>
      <form onSubmit={currentForm.handleSubmit(onSubmitHandler)}>
        <FormLayout hasMargin className={elWFull}>
          <FormField identity="primaryAddress" rhfProps={currentForm} data-testid="form.primaryAddress" />
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
            <FormField identity="secondaryAddress" rhfProps={currentForm} data-testid="form.secondaryAddress" />
          )}
        </FormLayout>
        <FormFooter
          idUser={userData?.id}
          isFieldError={!!Object.keys(currentForm.formState.errors).length}
          isFormSubmitting={updateContactData?.isLoading || uploadFileData.isLoading}
        />
      </form>
    </>
  )
}

export default React.memo(AddressInformation)
