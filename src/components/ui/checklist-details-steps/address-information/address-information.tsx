import React from 'react'
import { BodyText, Button, ButtonGroup, elMt6, elW8, FlexContainer, FormLayout, InputWrapFull } from '@reapit/elements'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormField } from './form-field'
import { validationSchema, ValuesType } from './form-schema'
import { RightSideContainer } from './__styles__'
import { ContactModel } from '@reapit/foundations-ts-definitions'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from 'react-query'
import { UpdateContactDataType, useUpdateContactData } from '../../../../platform-api/contact-api'

interface AddressInformationProps {
  userData: ContactModel | undefined
  userDataRefetch: (
    options?: (RefetchOptions & RefetchQueryFilters) | undefined,
  ) => Promise<QueryObserverResult<ContactModel, Error>>
  switchTabContent: (type: 'forward' | 'backward') => void | undefined
}

const AddressInformation: React.FC<AddressInformationProps> = ({
  userData,
  userDataRefetch,
  switchTabContent,
}): React.ReactElement => {
  const [isSecondaryFormActive, setIsSecondaryFormActive] = React.useState<boolean>(false)

  // local state - state to manage available  user if user already clicked the button
  const [isButtonLoading, setIsButtonLoading] = React.useState<boolean>(false)

  // local state - button handler
  const [isGoingToNextSection, setIsGoingToNextSection] = React.useState<boolean>(false)

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
    mode: 'all',
  })

  // trigger form validation on mount
  React.useLayoutEffect(() => {
    currentForm.trigger()
  }, [])

  // temporary applied method for update data #1
  const updatedFormData: UpdateContactDataType = {
    contactId: userData!.id!,
    _eTag: userData!._eTag!,
    bodyData: {
      primaryAddress: currentForm.getValues('primaryAddress'),
      secondaryAddress: currentForm.getValues('secondaryAddress'),
      metadata: {
        declarationRisk: userData?.metadata?.declarationRisk,
        ...currentForm.getValues('metadata'),
      },
    },
  }

  const updateContactData = useUpdateContactData<typeof userDataRefetch>(updatedFormData, userDataRefetch)

  // button handler - submit
  const onSubmitHandler = (): void => {
    updateContactData.mutate()
    setIsButtonLoading(true)
  }

  // button handler - next
  const onNextHandler = (): void => {
    onSubmitHandler()
    setIsGoingToNextSection(true)
  }

  // button handler - previous
  const onPreviousHandler = (): void => {
    switchTabContent('backward')
  }

  // turn off disabled attribute, if mutate UpdateContactData state is success
  // later will do more with optimize way :)
  React.useLayoutEffect((): void => {
    isButtonLoading &&
      updateContactData.isSuccess &&
      (setIsButtonLoading(false), isGoingToNextSection && (setIsGoingToNextSection(false), switchTabContent('forward')))
  }, [updateContactData.isSuccess])

  return (
    <>
      <form onSubmit={currentForm.handleSubmit(onSubmitHandler)}>
        <FormLayout hasMargin className={elW8}>
          <FormField identity="primaryAddress" rhfProps={currentForm} />
          <InputWrapFull>
            <RightSideContainer>
              <Button intent="neutral" type="button" onClick={() => setIsSecondaryFormActive(!isSecondaryFormActive)}>
                Less than 3 Years ?
              </Button>
            </RightSideContainer>
          </InputWrapFull>
          {isSecondaryFormActive && <FormField identity="secondaryAddress" rhfProps={currentForm} />}
        </FormLayout>
        <FlexContainer isFlexJustifyBetween className={elW8}>
          <ButtonGroup>
            <Button onClick={onPreviousHandler} chevronLeft intent="secondary" type="button" disabled={isButtonLoading}>
              Previous
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button
              intent="success"
              type="submit"
              disabled={Object.keys(currentForm.formState.errors).length !== 0 ? true : false || isButtonLoading}
              loading={updateContactData.isLoading}
            >
              Save
            </Button>
            <Button
              onClick={onNextHandler}
              chevronRight
              intent="primary"
              type="button"
              disabled={Object.keys(currentForm.formState.errors).length !== 0 ? true : false || isButtonLoading}
            >
              Next
            </Button>
          </ButtonGroup>
        </FlexContainer>
      </form>
      <div className={elMt6}>
        <BodyText hasNoMargin>
          * Indicates fields that are required in order to &apos;Complete&apos; this section.
        </BodyText>
      </div>
    </>
  )
}

export default AddressInformation
