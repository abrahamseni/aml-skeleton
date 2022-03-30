import { cx } from '@linaria/core'
import { BodyText, Button, ButtonGroup, elMt6, FlexContainer, StatusIndicator, Subtitle } from '@reapit/elements'
import React from 'react'
import { useQueryClient } from 'react-query'
import { endBorder, ReportTable, ReportWrap } from './__styles__/styles'
import { ContactModel, IdentityCheckModel } from '@reapit/foundations-ts-definitions'
import {
  isCompletedProfile,
  isCompletedPrimaryID,
  isCompletedSecondaryID,
  isCompletedAddress,
  isCompletedDeclarationRisk,
} from '../../../utils/completed-sections'
import { generateAddress } from '../table/table'
import { useAtom } from 'jotai'
import { identityTypeAtom } from 'atoms/atoms'
import ReactToPrint from 'react-to-print'
import _merge from 'lodash.merge'

type Props = {
  closeModal: () => void
}

interface ReportModel extends ContactModel, IdentityCheckModel {}

const sections = [
  'Personal Details',
  'Primary ID',
  'Secondary ID',
  'Address Information',
  'Declaration Risk Management',
]

const generateReport = (reportData: ReportModel, idTypes: any) => {
  if (!reportData) return
  const result: any = []
  for (let i = 0; i < sections.length; i++) {
    const row: any = []
    // report section title
    row.push({ value: sections[i] })
    // report section description
    if (sections[i] === 'Personal Details') {
      row.push({
        value: (
          <ul>
            <li>Name: {`${reportData.title} ${reportData.forename} ${reportData.surname}`}</li>
            <li>Home: {reportData.homePhone}</li>
            <li>Work: {reportData.workPhone}</li>
            <li>Mobile: {reportData.mobilePhone}</li>
            <li>Email: {reportData.email}</li>
          </ul>
        ),
      })
      // report sections status
      row.push({ value: <ReportStatus isCompleted={isCompletedProfile(reportData)} /> })
    }
    if (sections[i] === 'Primary ID' || sections[i] === 'Secondary ID') {
      row.push({
        value: (
          <ul>
            <li>Type: {idTypes[reportData[`identityDocument${i}`]?.typeId ?? '']}</li>
            <li>Reference: {reportData[`identityDocument${i}`]?.details ?? ''}</li>
            <li>Expiry Date: {reportData[`identityDocument${i}`]?.expiry ?? ''}</li>
          </ul>
        ),
      })
      row.push({
        value: (
          <ReportStatus isCompleted={i === 1 ? isCompletedPrimaryID(reportData) : isCompletedSecondaryID(reportData)} />
        ),
      })
    }
    if (sections[i] === 'Address Information') {
      row.push({
        value: <BodyText>{generateAddress(reportData.primaryAddress)}</BodyText>,
      })
      row.push({
        value: <ReportStatus isCompleted={isCompletedAddress(reportData)} />,
      })
    }
    if (sections[i] === 'Declaration Risk Management') {
      row.push({
        value: (
          <ul>
            <li>Type: {reportData.metadata?.declarationRisk?.type ?? ''}</li>
            <li>Reason: {reportData.metadata?.declarationRisk?.reason ?? ''}</li>
          </ul>
        ),
      })
      row.push({
        value: <ReportStatus isCompleted={isCompletedDeclarationRisk(reportData)} />,
      })
    }
    result.push(row)
  }
  return result
}

export default function Report({ closeModal }: Props) {
  const [idTypes] = useAtom(identityTypeAtom)
  const qc = useQueryClient()
  const contactData = qc.getQueriesData<ContactModel | IdentityCheckModel>(['contact'])
  const idData = qc.getQueriesData<ContactModel | IdentityCheckModel>(['fetchSingleIdentityCheckByContactId'])
  let data: ReportModel = {}
  if (contactData.length > 0) {
    contactData.forEach((d) => {
      data = _merge(data, d[1] as any)
    })
  }
  if (idData.length > 0) {
    idData.forEach((d) => {
      data = _merge(data, d[1] as any)
    })
  }
  console.log('data', data)

  const printRef = React.useRef<HTMLDivElement>(null)

  return (
    <FlexContainer isFlexColumn>
      <ReportWrap ref={printRef}>
        <Subtitle>
          {data.title} {data.forename} {data.surname}
        </Subtitle>
        <ReportTable>
          <thead>
            <tr>
              <th>Section</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              generateReport(data, idTypes).map((row: any, rowIndex) => {
                return (
                  <tr key={rowIndex}>
                    {row.map((cell, col) => {
                      return <td key={col}>{cell.value}</td>
                    })}
                  </tr>
                )
              })}
          </tbody>
        </ReportTable>
        <hr className={endBorder} />
      </ReportWrap>
      <FlexContainer className={cx(elMt6)} isFlexJustifyEnd>
        <ButtonGroup>
          <ReactToPrint trigger={handleTrigger} content={handleContent({ printRef })} />
          <Button intent="primary" onClick={closeModal}>
            Close
          </Button>
        </ButtonGroup>
      </FlexContainer>
    </FlexContainer>
  )
}

function ReportStatus({ isCompleted }: { isCompleted: boolean }) {
  return (
    <>
      <StatusIndicator intent={isCompleted ? 'success' : 'neutral'} /> {isCompleted ? 'Completed' : 'Incomplete'}
    </>
  )
}

const handleTrigger = () => (
  <Button className="mr-2" intent="primary" type="button">
    Print Report
  </Button>
)

const handleContent =
  ({ printRef }) =>
  () => {
    return printRef.current
  }
