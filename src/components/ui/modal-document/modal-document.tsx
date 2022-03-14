import React from 'react'
import { Button, ButtonGroup, FlexContainer, Modal } from '@reapit/elements'
import { UseFormWatch } from 'react-hook-form'

import { AvailableFormFieldType as AddressFields } from '../checklist-details-steps/address-information/form-schema'
import { AvailableFormFieldType as DRMFields } from '../checklist-details-steps/declaration-risk-management/form-schema'

type ModalDocumentHandle = {
  openModal: () => void
}

type AvailableFieldNameType = AddressFields | DRMFields

export interface ModalDocumentProps<T> {
  forwardedRef: React.RefObject<ModalDocumentHandle>
  watchFormField: UseFormWatch<T>
  selectedFormField: NonNullable<AvailableFieldNameType>
}

/**
 * Reusable Modal Document
 * @description temporary for integrate with FileInput Component
 */
const ModalDocument = React.forwardRef<ModalDocumentHandle, ModalDocumentProps<any>>(
  ({ watchFormField, selectedFormField }, forwardedRef): React.ReactElement => {
    // local state - identify the modal, is open / closed
    const [selectedFormFieldModal, setSelectedFormFieldModal] = React.useState<boolean>(false)

    // throw available function to parent
    React.useImperativeHandle(forwardedRef, () => ({
      openModal() {
        setSelectedFormFieldModal(true)
      },
    }))

    const closeModal = (): void => setSelectedFormFieldModal(false)

    return (
      <>
        <Modal isOpen={selectedFormFieldModal} title="Image Preview" onModalClose={closeModal}>
          <FlexContainer isFlexAlignCenter isFlexJustifyCenter>
            {/* will be good if we can handle by file type, e.g pdf -> return pdf viewer // img -> return img tag */}
            <img src={watchFormField(selectedFormField)} height="auto" width="150px" />
          </FlexContainer>
          <ButtonGroup alignment="right">
            <Button intent="low" onClick={closeModal}>
              Close
            </Button>
          </ButtonGroup>
        </Modal>
      </>
    )
  },
)

export default ModalDocument
