import React from 'react'
import { BodyText, Button, ButtonGroup, elMt6, elMt8, elMr6, elWFull, FlexContainer } from '@reapit/elements'

type FormFooterProps = {
  switchTabContent: (type: 'forward' | 'backward') => void | undefined
  isPrevHide?: boolean
  isNextHide?: boolean
  isIdInfoHide?: boolean
  isFormSubmitting?: boolean
  idUser?: string
  isFieldError?: boolean
  submitHandler?: () => Promise<void>
}

const FormFooter = ({
  switchTabContent,
  isPrevHide = false,
  isNextHide = false,
  isIdInfoHide = false,
  idUser,
  isFieldError,
  isFormSubmitting,
  submitHandler,
}: FormFooterProps) => {
  const onNextHandler = async () => {
    await submitHandler!()
    switchTabContent('forward')
  }

  const onPreviousHandler = (): void => {
    switchTabContent('backward')
  }

  return (
    <footer className={elMt8}>
      <FlexContainer isFlexJustifyBetween className={elWFull}>
        {!isPrevHide && (
          <Button
            onClick={onPreviousHandler}
            chevronLeft
            intent="secondary"
            type="button"
            disabled={isFormSubmitting || isFieldError}
            data-testid="previous-form"
          >
            Previous
          </Button>
        )}
        <FlexContainer isFlexAlignCenter isFlexJustifyEnd={isPrevHide} className={isPrevHide ? elWFull : undefined}>
          {!isIdInfoHide && (
            <BodyText hasNoMargin className={elMr6}>
              RPS Ref: {idUser}
            </BodyText>
          )}
          <ButtonGroup>
            <Button
              intent="success"
              type="submit"
              disabled={isFormSubmitting || isFieldError}
              loading={isFormSubmitting}
              data-testid="save-form"
            >
              Save
            </Button>
            {!isNextHide && (
              <Button
                onClick={onNextHandler}
                chevronRight
                intent="primary"
                type="button"
                disabled={isFormSubmitting || isFieldError}
                data-testid="next-form"
              >
                Next
              </Button>
            )}
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
