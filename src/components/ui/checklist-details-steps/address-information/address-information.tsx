import React from 'react'
import { Button, elWFull, FormLayout, InputWrapFull, useSnack } from '@reapit/elements'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormField } from './form-field'
import { validationSchema, ValuesType } from './form-schema'
import { RightSideContainer } from './__styles__'
import { ContactModel } from '@reapit/foundations-ts-definitions'
import { notificationMessage } from '../../../../constants/notification-message'
import { useUpdateContact } from '../../../../platform-api/contact-api/update-contact'
import FormFooter from 'components/ui/form-footer/form-footer'

interface AddressInformationProps {
  userData: ContactModel | undefined
  switchTabContent: (type: 'forward' | 'backward') => void | undefined
}

const AddressInformation: React.FC<AddressInformationProps> = ({ userData, switchTabContent }): React.ReactElement => {
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

  // button handler - submit
  const onSubmitHandler = async (): Promise<void> => {
    await updateContactData.mutateAsync(
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
          success(notificationMessage.AIF_SUCCESS, 2000)
        },
        onError: () => {
          error(notificationMessage.AIF_ERROR, 2000)
        },
      },
    )
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
          isFormSubmitting={updateContactData?.isLoading}
          currentForm={currentForm}
          switchTabContent={switchTabContent}
          submitHandler={onSubmitHandler}
        />
      </form>
    </>
  )
}

export default AddressInformation
