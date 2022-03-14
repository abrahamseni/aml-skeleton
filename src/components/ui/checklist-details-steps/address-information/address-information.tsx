import React from 'react'
import { FlexContainer, Button, elMl4, elMt8, elMy4 } from '@reapit/elements'

import FormField from './form-field'
import validationSchema from './form-schema/validation-schema'
import { ValuesType } from './form-schema/form-field'
import { AddressModel } from '@reapit/foundations-ts-definitions'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ContactModelMock } from '../__mocks__'

const AddressInformation: React.FC = (): React.ReactElement => {
  const [isSecondaryFormActive, setIsSecondaryFormActive] = React.useState<boolean>(false)

  const { primaryAddress, secondaryAddress, metadata } = ContactModelMock ?? {}

  // reformat meta data
  const formattedMetadata = {
    primaryAddress: {
      documentImage: metadata?.primaryAddress?.documentImage ?? '',
      documentType: metadata?.primaryAddress?.documentType ?? '',
    },
    secondaryAddress: {
      documentImage: metadata?.secondaryAddress?.documentImage ?? '',
      documentType: metadata?.secondaryAddress?.documentType ?? '',
    },
  }

  // setup value
  const INITIAL_VALUES: ValuesType = {
    primaryAddress: primaryAddress as AddressModel,
    secondaryAddress: secondaryAddress as AddressModel,
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
        <div>
          <FormField identity="primaryAddress" rhfProps={currentForm} />
        </div>
        <FlexContainer isFlexJustifyEnd className={elMy4}>
          <Button intent="secondary" type="button" onClick={() => setIsSecondaryFormActive(!isSecondaryFormActive)}>
            Less than 3 Years?
          </Button>
        </FlexContainer>
        {isSecondaryFormActive && (
          <div>
            <FormField identity="secondaryAddress" rhfProps={currentForm} />
          </div>
        )}
        <FlexContainer isFlexJustifyBetween className={elMt8}>
          <div>
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
    </>
  )
}

export default AddressInformation
