import React, { FC, useState } from 'react'
import { Button, ModalProps, Loader, FlexContainer, PersistantNotification } from '@reapit/elements'
import Modal from './modal'
import { modalMaxHeight, modalHeaderHeight, modalBodyPadding } from './__styles__/modal.style'
import { styled } from '@linaria/react'
import { css } from '@linaria/core'
import { isObjectUrl, isSameOrigin } from '../../../utils/url'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines } from '@fortawesome/free-solid-svg-icons'

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
      <Body>
        {loading && <Loader label="Loading" />}
        {src &&
          !loading &&
          (!pdfPreviewIsVisible ? (
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
          ))}
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
            {!src || isSameOrigin(src) ? 'Download' : 'View in new tab'}
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
    </Modal>
  )
}

export const footerHeight = '8.827rem'

const Body = styled.div`
  max-height: calc(${modalMaxHeight} - ${modalHeaderHeight} - ${footerHeight} - (2 * ${modalBodyPadding}));
  overflow-y: auto;
  padding: 0 0.75rem;
`
const Footer = styled.div`
  height: ${footerHeight};
`

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 1.5rem 0;
`

const Icon = styled(FontAwesomeIcon)`
  color: var(--intent-primary);
  font-size: 3rem;
`
export default DocumentPreviewModal
