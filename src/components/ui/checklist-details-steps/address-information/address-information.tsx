import React from 'react'
import {
  BodyText,
  Button,
  ButtonGroup,
  elMt6,
  elWFull,
  FlexContainer,
  FormLayout,
  InputWrapFull,
  useSnack,
} from '@reapit/elements'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormField } from './form-field'
import { validationSchema, ValuesType } from './form-schema'
import { RightSideContainer } from './__styles__'
import { ContactModel } from '@reapit/foundations-ts-definitions'
import { notificationMessage } from '../../../../constants/notification-message'
import { useUpdateContact } from '../../../../platform-api/contact-api/update-contact'

interface AddressInformationProps {
  userData: ContactModel | undefined
  switchTabContent: (type: 'forward' | 'backward') => void | undefined
}

const AddressInformation: React.FC<AddressInformationProps> = ({ userData, switchTabContent }): React.ReactElement => {
  // snack notification - snack provider
  const { success, error } = useSnack()

  const [isSecondaryFormActive, setIsSecondaryFormActive] = React.useState<boolean>(
    userData?.secondaryAddress !== null ? true : false,
  )

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

  const updateContactData = useUpdateContact(userData!.id!, userData!._eTag!)

  // button handler - submit
  const onSubmitHandler = (): void => {
    updateContactData.mutate({
      primaryAddress: currentForm.getValues('primaryAddress'),
      secondaryAddress: currentForm.getValues('secondaryAddress'),
      metadata: {
        declarationRisk: userData?.metadata?.declarationRisk,
        ...currentForm.getValues('metadata'),
      },
    })
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
    if (isButtonLoading) {
      if (updateContactData.isSuccess) {
        setIsButtonLoading(false)
        success(notificationMessage.AIF_SUCCESS, 2000)
        isGoingToNextSection && (setIsGoingToNextSection(false), switchTabContent('forward'))
      }
      if (updateContactData.isError) {
        setIsButtonLoading(false)
        error(notificationMessage.AIF_ERROR, 2000)
        isGoingToNextSection && setIsGoingToNextSection(false)
      }
    }
  }, [updateContactData.status])

  return (
    <>
      <form onSubmit={currentForm.handleSubmit(onSubmitHandler)}>
        <FormLayout hasMargin className={elWFull}>
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
        <FlexContainer isFlexJustifyBetween className={elWFull}>
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
