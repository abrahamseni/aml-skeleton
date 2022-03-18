import React from 'react'
import { BodyText, Button, ButtonGroup, elMt6, elMt8, elMr6, elWFull, FlexContainer } from '@reapit/elements'

type FormFooterProps = {
  isIdInfoHide?: boolean
  isFormSubmitting: boolean
  idUser?: string
  isFieldError: boolean
}

const FormFooter = ({ isIdInfoHide = false, idUser, isFieldError, isFormSubmitting }: FormFooterProps) => {
  return (
    <footer className={elMt8}>
      <FlexContainer isFlexJustifyBetween className={elWFull}>
        <FlexContainer isFlexAlignCenter>
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
