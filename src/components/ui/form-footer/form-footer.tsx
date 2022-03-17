/* eslint-disable no-confusing-arrow */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { BodyText, Button, ButtonGroup, elMt6, elMt8, elMr6, elWFull, FlexContainer } from '@reapit/elements'
import { UseMutationResult } from 'react-query'
import { AxiosError } from 'axios'
import { ContactModel } from '@reapit/foundations-ts-definitions'

type FormFooterProps = {
  setIsGoingToNextSection?: any
  switchTabContent?: any
  isPrevHide?: boolean
  isNextHide?: boolean
  isIdInfoHide?: boolean
  apiData?: any
  formValue?: any
  updateForm?: UseMutationResult<ContactModel, AxiosError<any, any>, any, () => void>
  submitHandler?: any
}

const FormFooter = ({
  setIsGoingToNextSection,
  switchTabContent,
  isPrevHide,
  isNextHide,
  isIdInfoHide,
  apiData,
  formValue,
  updateForm,
  submitHandler,
}: FormFooterProps) => {
  // button handler - next
  const onNextHandler = (): void => {
    // currentForm.trigger()
    // if (Object.keys(currentForm.formState.errors).length === 0) {
    //   onSubmitHandler()
    // }
    // setIsGoingToNextSection(true)
    switchTabContent('forward')
  }

  // button handler - previous
  const onPreviousHandler = (): void => {
    switchTabContent('backward')
  }

  // console.log({ updateForm })
  return (
    <footer className={elMt8}>
      <FlexContainer isFlexJustifyBetween className={elWFull}>
        {!isPrevHide && (
          <Button onClick={onPreviousHandler} chevronLeft intent="secondary" type="button" disabled={false}>
            Previous
          </Button>
        )}
        <FlexContainer isFlexAlignCenter isFlexJustifyEnd={isPrevHide} className={isPrevHide ? elWFull : undefined}>
          {!isIdInfoHide && (
            <BodyText hasNoMargin className={elMr6}>
              RPS Ref:
            </BodyText>
          )}
          <ButtonGroup>
            <Button intent="success" type="submit" disabled={updateForm?.isLoading} loading={updateForm?.isLoading}>
              Save
            </Button>
            <Button
              onClick={onNextHandler}
              chevronRight
              intent="primary"
              type="button"
              disabled={updateForm?.isLoading}
            >
              Next
            </Button>
          </ButtonGroup>
        </FlexContainer>
      </FlexContainer>
      <div className={elMt6}>
        <BodyText hasNoMargin>
          * Indicates fields that are required in order to &apos;Complete&apos; this section.
        </BodyText>
      </div>
    </footer>
  )
}

export default FormFooter
