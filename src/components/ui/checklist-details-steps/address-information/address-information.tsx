import React from 'react'
import { BodyText, Button, ButtonGroup, elMt6, elW8, FlexContainer, FormLayout, InputWrapFull } from '@reapit/elements'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormField } from './form-field'
import { validationSchema, ValuesType } from './form-schema'
import { ContactModelMock } from '../__mocks__'
import { RightSideContainer } from './__styles__'

const AddressInformation: React.FC = (): React.ReactElement => {
  const [isSecondaryFormActive, setIsSecondaryFormActive] = React.useState<boolean>(false)

  // temporary data with mock, soon will be replaced by react.useContext
  const { primaryAddress, secondaryAddress, metadata } = ContactModelMock ?? {}

  // reformat meta data
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

  // setup value
  const INITIAL_VALUES: ValuesType = {
    primaryAddress,
    secondaryAddress,
    metadata: formattedMetadata,
  }

  // setup and integrate with initial value
  const currentForm = useForm<ValuesType>({
    defaultValues: INITIAL_VALUES,
    resolver: yupResolver(validationSchema),
    mode: 'all',
  })

  // submit handler
  const onSubmit: SubmitHandler<ValuesType> = (e) => {
    console.log(e)
  }

  return (
    <>
      <form onSubmit={currentForm.handleSubmit(onSubmit)}>
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
            <Button chevronLeft intent="secondary" type="submit">
              Previous
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button
              intent="success"
              type="submit"
              disabled={Object.keys(currentForm.formState.errors).length !== 0 ? true : false}
            >
              Save
            </Button>
            <Button chevronRight intent="primary" type="submit">
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
