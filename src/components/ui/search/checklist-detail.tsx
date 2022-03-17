/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useState } from 'react'
import { reapitConnectBrowserSession } from '../../../core/connect-session'
import { useReapitConnect } from '@reapit/connect-session'
import { Subtitle, Title, Icon, ProgressBarSteps, Loader, PersistantNotification, BodyText } from '@reapit/elements'
import { useParams } from 'react-router'
import { UseQueryResult } from 'react-query'
import { ContactModel, IdentityCheckModel } from '@reapit/foundations-ts-definitions'
import { Link } from 'react-router-dom'
import PersonalDetails from '../checklist-details-steps/personal-details'
import PrimaryId from '../checklist-details-steps/primary-id'
import SecondaryId from '../checklist-details-steps/secondary-id'
import { DeclarationRiskManagement } from '../checklist-details-steps/declaration-risk-management'
import { AddressInformation } from '../checklist-details-steps/address-information'

import { navigate } from '../../../utils/navigation'
import { history } from '../../../core/router'
import { Routes } from '../../../constants/routes'
import { useSingleContact } from '../../../platform-api/contact-api/single-contact'
import { useFetchSingleIdentityCheckByContactId } from '../../../platform-api/identity-check-api'
import { TabsSection } from '../tab-section'
import { ModalStatus } from '../modal-status'
import {
  isCompletedAddress,
  isCompletedDeclarationRisk,
  isCompletedPrimaryID,
  isCompletedProfile,
  isCompletedSecondaryID,
} from '../../../utils/completed-sections'
import { TabsSectionProps } from '../tab-section/tab-section'
import { generateProgressBarResult } from '../../../utils/generator'

interface GenerateTabsContentProps {
  querySingleContact: UseQueryResult<ContactModel, Error>
  queryIdentityCheck: UseQueryResult<IdentityCheckModel | undefined, unknown>
  switchTabSection: (type: 'forward' | 'backward') => void
}

export const generateTabsContent = (props: GenerateTabsContentProps): TabsSectionProps['contents'] => {
  const { querySingleContact, queryIdentityCheck, switchTabSection } = props

  // single contact
  const { data: userData } = querySingleContact

  // identity check
  const { data: idCheck, refetch: refetchIdCheck } = queryIdentityCheck
  return [
    {
      name: 'Personal',
      content: <PersonalDetails userData={userData!} switchTabContent={switchTabSection} />,
      status: isCompletedProfile(userData),
    },
    {
      name: 'Primary ID',
      content: <PrimaryId contact={userData!} idCheck={idCheck} onSaved={refetchIdCheck} />,
      status: isCompletedPrimaryID(idCheck),
    },
    {
      name: 'Secondary ID',
      content: <SecondaryId contact={userData!} idCheck={idCheck} onSaved={refetchIdCheck} />,
      status: isCompletedSecondaryID(idCheck),
    },
    {
      name: 'Address Information',
      content: <AddressInformation userData={userData} switchTabContent={switchTabSection} />,
      status: isCompletedAddress(userData!),
    },
    {
      name: 'Declaration Risk Management',
      content: <DeclarationRiskManagement userData={userData!} switchTabContent={switchTabSection} />,
      status: isCompletedDeclarationRisk(userData!),
    },
  ]
}

export const ChecklistDetailPage: FC = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)
  const { id } = useParams<{ id: string }>()

  const querySingleContact = useSingleContact(connectSession, id)
  const { data: userData, isFetching: userDataIsFetching, isError: userDataIsError } = querySingleContact

  const queryIdentityCheck = useFetchSingleIdentityCheckByContactId(id)
  const { data: identityCheck, isFetching: identityCheckIsFetching, isError: identityCheckIsError } = queryIdentityCheck

  const [isModalStatusOpen, setModalStatusOpen] = useState<boolean>(false)
  // local state - tab pagination handler
  const [activeTabs, setActiveTabs] = React.useState<number>(0)

  // data is available from here //
  // change current active tab content with this fn
  const switchTabSection = (type: 'forward' | 'backward'): void => {
    switch (type) {
      case 'forward':
        if (activeTabs < tabContents.length - 1) setActiveTabs((prev) => prev + 1)
        break
      case 'backward':
        if (activeTabs > 0) setActiveTabs((prev) => prev - 1)
        break
    }
  }
  // render tab contents
  const tabContents = generateTabsContent({ querySingleContact, queryIdentityCheck, switchTabSection })
  // progress bar indicator
  const { complete: completeStep, total: totalStep } = generateProgressBarResult({ tabContents })

  if ((userDataIsFetching && !userData) || (identityCheckIsFetching && !userData)) {
    return <Loader fullPage label="Please wait..." />
  }

  if ((!userData && userDataIsError) || (!identityCheck && identityCheckIsError)) {
    return (
      <>
        <Link to={Routes.SEARCH}>
          <div className="el-flex el-flex-align-center el-mb6">
            <Icon icon="arrowLeftSystem" iconSize="smallest" />
            <BodyText hasNoMargin hasBoldText className="el-ml3">
              Back to search
            </BodyText>
          </div>
        </Link>
        <PersistantNotification isFullWidth isExpanded icon="warningSolidSystem" intent="danger">
          {querySingleContact?.error?.response?.status === 404
            ? `Entity "Contact" (${id}) was not found.`
            : querySingleContact?.error?.response?.data?.description || 'Error'}
        </PersistantNotification>
      </>
    )
  }

  if (userData && identityCheck) {
    return (
      <main>
        <Title hasNoMargin>{`${userData?.forename} ${userData?.surname}`}</Title>
        <div className="el-flex el-flex-row">
          <Subtitle hasGreyText hasBoldText>
            Status: {userData?.identityCheck?.toUpperCase()}
          </Subtitle>
          <Icon
            icon="editSolidSystem"
            iconSize="smallest"
            className="el-ml2"
            onClick={() => setModalStatusOpen(true)}
          />
        </div>
        <div>
          <ProgressBarSteps currentStep={completeStep} numberSteps={totalStep} className="el-mt6" />
        </div>
        <div className="el-mt3">
          <TabsSection
            activeTabs={activeTabs}
            setActiveTabs={setActiveTabs}
            tabName="tab-section"
            contents={tabContents}
          />
        </div>
        <ModalStatus
          userData={userData}
          idCheck={identityCheck!}
          isModalStatusOpen={isModalStatusOpen}
          setModalStatusOpen={setModalStatusOpen}
        />
      </main>
    )
  }

  return <></>
}

export default ChecklistDetailPage
