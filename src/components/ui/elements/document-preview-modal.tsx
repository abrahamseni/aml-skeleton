import React, { FC, useState } from 'react'
import { Button, ModalProps, Loader, FlexContainer, PersistantNotification } from '@reapit/elements'
import Modal from './modal'
import { css } from '@linaria/core'
import { isObjectUrl } from '../../../utils/url'
import { faFileLines } from '@fortawesome/free-solid-svg-icons'
import { Body, Footer, IconContainer, Icon } from './__styles__/document-preview.style'

export interface DocumentPreviewModalProps extends ModalProps {
  src?: string
  filename?: string
  loading?: boolean
}

export const DocumentPreviewModal: FC<DocumentPreviewModalProps> = ({
  src,
  filename,
  isOpen,
  onModalClose,
  loading,
}) => {
  const [pdfPreviewIsVisible, setPdfPreviewIsVisible] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  function closeModal() {
    onModalClose()
    setPdfPreviewIsVisible(false)
    if (src && isObjectUrl(src)) {
      URL.revokeObjectURL(src)
    }
  }

  return (
    <Modal
      title="Document Preview"
      isOpen={isOpen}
      onModalClose={closeModal}
      style={{ maxWidth: '80%', width: pdfPreviewIsVisible ? '80%' : 'auto' }}
      bodyClassName={css`
        overflow-y: hidden;
      `}
    >
      {loading && (
        <FlexContainer isFlexJustifyCenter>
          <Loader label="Loading" />
        </FlexContainer>
      )}
      {src && !loading && (
        <>
          <Body>
            {!pdfPreviewIsVisible ? (
              <img
                src={src}
                onError={() => setPdfPreviewIsVisible(true)}
                onLoad={() => setImageLoaded(true)}
                alt={imageLoaded ? 'image preview' : undefined}
              />
            ) : (
              <IconContainer>
                <Icon icon={faFileLines} />
              </IconContainer>
            )}
          </Body>
          <Footer className="el-pt6">
            <FlexContainer isFlexJustifyEnd>
              <a
                className="el-button el-intent-primary el-mr4"
                href={src}
                download={filename ? filename : true}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>
              <Button intent="low" onClick={closeModal}>
                Close
              </Button>
            </FlexContainer>
            <PersistantNotification isExpanded isFullWidth className="el-mt4">
              {`If you're having trouble viewing the above image or if it doesn't display correctly,
                please use the 'Download' option above. Once downloaded, you can select your
                default browser to view the document (Internet Explorer, Chrome etc)`}
            </PersistantNotification>
          </Footer>
        </>
      )}
    </Modal>
  )
}

export default DocumentPreviewModal
