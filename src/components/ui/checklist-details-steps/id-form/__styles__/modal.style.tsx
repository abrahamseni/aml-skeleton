import { styled } from '@linaria/react'
import { ModalHeader } from '@reapit/elements'

export const modalMaxHeight = '100vh - 40px'

export const modalHeaderHeight = '44px'

export const modalBodyPadding = '1rem'

export const Container = styled.div`
  position: fixed;
  z-index: 40;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  position: fixed;
`

export const MyModalBg = styled.div`
  display: fixed;
  z-index: 998;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: var(--color-grey-dark);
  opacity: 0.2;
`

export const MyModal = styled.div`
  position: fixed;
  z-index: 999;
  background-color: white;
  box-shadow: 2px 4px 20px rgba(0,0,0,0.12);
  min-width: 300px;
  max-height: calc(100vh - 40px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

export const MyModalHeader = styled(ModalHeader)`
  height: ${modalHeaderHeight};
`

export const Body = styled.div`
  padding: ${modalBodyPadding};
  overflow-y: scroll;
`