import React from 'react'
import { BodyText, Button, elMl4, elMt6, elW8, FlexContainer, FormLayout, InputWrapFull } from '@reapit/elements'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormField } from './form-field'
import { validationSchema, ValuesType } from './form-schema'
import { ContactModelMock } from '../__mocks__'
import { RightSideContainer } from './__styles__'

const AddressInformation: React.FC = (): React.ReactElement => {
  const [isSecondaryFormActive, setIsSecondaryFormActive] = React.useState<boolean>(false)

  const { primaryAddress, secondaryAddress, metadata } = ContactModelMock ?? {}

  // reformat meta data
  const formattedMetadata = {
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
    mode: 'onChange',
  })

  // submit handler
  const onSubmit: SubmitHandler<ValuesType> = (e) => {
    console.log(e)
  }

  return (
    <>
      <form onSubmit={currentForm.handleSubmit(onSubmit)}>
        <FormLayout hasMargin>
          <FormField identity="primaryAddress" rhfProps={currentForm} />
          <InputWrapFull>
            <RightSideContainer className={elW8}>
              <Button intent="neutral" type="button" onClick={() => setIsSecondaryFormActive(!isSecondaryFormActive)}>
                Less than 3 Years ?
              </Button>
            </RightSideContainer>
          </InputWrapFull>
          {isSecondaryFormActive && <FormField identity="secondaryAddress" rhfProps={currentForm} />}
        </FormLayout>
        <FlexContainer isFlexJustifyBetween className={elW8}>
          <div className="el-col">
            <Button chevronLeft intent="secondary" type="submit">
              Previous
            </Button>
          </div>
          <div>
            <Button
              intent="success"
              type="submit"
              disabled={Object.keys(currentForm.formState.errors).length !== 0 ? true : false}
            >
              Save
            </Button>
            <Button chevronRight intent="primary" className={elMl4} type="submit">
              Next
            </Button>
          </div>
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
