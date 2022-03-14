import React, { FC } from 'react'
import { Portal, ModalProps } from '@reapit/elements'
import { Body, Container, MyModal, MyModalBg, MyModalHeader } from './__styles__/modal.style'

interface Props extends ModalProps {
  bodyClassName?: string
} 

export const Modal: FC<Props> = ({ isOpen, onModalClose, title, children, bodyClassName, ...props }) => {
  return (
    <>
      {isOpen && (
        <Portal id="modal-root">
          <Container>
            <MyModalBg onClick={onModalClose} />
            <MyModal {...props}>
              <MyModalHeader>{title}</MyModalHeader>
              <Body className={bodyClassName}>
                {children}
              </Body>
            </MyModal>
          </Container>
        </Portal>
      )}
    </>
  )
}

export default Modal