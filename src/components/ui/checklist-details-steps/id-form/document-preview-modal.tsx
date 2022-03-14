import React, { FC, useState } from 'react'
import { Button, ModalProps, Loader, FlexContainer, PersistantNotification } from '@reapit/elements'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'
import { SizeMe } from 'react-sizeme'
import Modal from './modal'
import { modalMaxHeight, modalHeaderHeight, modalBodyPadding } from './__styles__/modal.style'
import { styled } from '@linaria/react'
import { css } from '@linaria/core'
import { isObjectUrl } from '../../../../utils/url'

interface Props extends ModalProps {
  src?: string
  loading?: boolean
}

export const DocumentPreviewModal: FC<Props> = ({ src, isOpen, onModalClose, loading }) => {
  const [pdfPreviewIsVisible, setPdfPreviewIsVisible] = useState(false)
  const [pdfNumPages, setPdfNumPages] = useState(0)

  function onPdfPreviewLoadSuccess({ numPages }) {
    setPdfNumPages(numPages)
  }

  function getPdfPages(width: number | null) {
    const padding = '24px'
    const pages: any = []
    for (let i = 0; i < pdfNumPages; i++) {
      pages.push(
        <div key={i} style={{ backgroundColor: '#ddd', padding: padding, paddingTop: i === 0 ? padding : 0 }}>
          <Page width={width && width - (24 * 2)} pageNumber={i + 1} />
        </div>
      )
    }
    return pages
  }

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
      style={{ maxWidth: '80%', width: pdfPreviewIsVisible ? '80%' : 'auto'}}
      bodyClassName={css`
        overflow-y: hidden;
      `}
    >
      <Body>
        {loading && (
          <Loader label="Loading" />
        )}
        {src && !loading && (
          !pdfPreviewIsVisible ? (
            <img 
              src={src} onError={() => setPdfPreviewIsVisible(true)}
             />
          ) : (
            <PdfContainer>
              <SizeMe>
                {({ size }) => (
                  <Document file={src} onLoadSuccess={onPdfPreviewLoadSuccess}>
                    {getPdfPages(size.width)}
                  </Document>
                )}
              </SizeMe>
            </PdfContainer>
          )
        )}
      </Body>
      <Footer className="el-pt6">
        <FlexContainer isFlexJustifyEnd>
          <a className="el-button el-intent-primary el-mr4" href={src}>
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
    </Modal>
  )
}

export const footerHeight = '141.233px'

const Body = styled.div`
  max-height: calc(${modalMaxHeight} - ${modalHeaderHeight} - ${footerHeight} - (2 * ${modalBodyPadding}));
  overflow-y: auto;
  padding: 0 0.75rem;
`
const Footer = styled.div`
  height: ${footerHeight};
`

const PdfContainer = styled.div`
  width: 90%;
  margin: 0 auto;
`

export default DocumentPreviewModal