import { styled } from '@linaria/react'
import { modalMaxHeight, modalHeaderHeight, modalBodyPadding } from './modal.style'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const footerHeight = '8.827rem'

export const Body = styled.div`
  max-height: calc(${modalMaxHeight} - ${modalHeaderHeight} - ${footerHeight} - (2 * ${modalBodyPadding}));
  overflow-y: auto;
  padding: 0 0.75rem;
`
export const Footer = styled.div`
  height: ${footerHeight};
`

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 1.5rem 0;
`

export const Icon = styled(FontAwesomeIcon)`
  color: var(--intent-primary);
  font-size: 3rem;
`
