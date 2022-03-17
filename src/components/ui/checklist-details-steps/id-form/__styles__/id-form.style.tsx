import { ButtonGroup } from '@reapit/elements'
import { styled } from '@linaria/react'

const SaveButtonGroupWidth = '228px'

export const SaveButtonGroup = styled(ButtonGroup)`
  width: ${SaveButtonGroupWidth};
`

export const LoaderContainer = styled.div`
  width: ${SaveButtonGroupWidth};
  display: flex;
  justify-content: center;
`
