import React, { FC, useState } from 'react'
import { reapitConnectBrowserSession } from '../../../core/connect-session'
import { useReapitConnect } from '@reapit/connect-session'
import { Subtitle, Title, Icon, ProgressBarSteps, Loader, PersistantNotification, BodyText } from '@reapit/elements'
import { useParams } from 'react-router'
import { UseQueryResult } from 'react-query'
import { ContactModel, IdentityCheckModel, ListItemModel } from '@reapit/foundations-ts-definitions'
import { Link } from 'react-router-dom'
import PersonalDetails from '../checklist-details-steps/personal-details'
import PrimaryId from '../checklist-details-steps/primary-id'
import SecondaryId from '../checklist-details-steps/secondary-id'
import { DeclarationRiskManagement } from '../checklist-details-steps/declaration-risk-management'
import { AddressInformation } from '../checklist-details-steps/address-information'

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
import { useGetIdentityDocumentTypes } from 'platform-api/configuration-api'

interface GenerateTabsContentProps {
  querySingleContact: UseQueryResult<ContactModel, Error>
  queryIdentityCheck: UseQueryResult<IdentityCheckModel | undefined, unknown>
  queryIdentityDocumentTypes: UseQueryResult<Required<ListItemModel>[] | undefined>
}

export const generateTabsContent = (props: GenerateTabsContentProps): TabsSectionProps['contents'] => {
  const { querySingleContact, queryIdentityCheck, queryIdentityDocumentTypes } = props

  // single contact
  const { data: userData } = querySingleContact

  // identity check
  const { data: idCheck, refetch: refetchIdCheck } = queryIdentityCheck

  const { data: idDocTypes } = queryIdentityDocumentTypes
  return [
    {
      name: 'Personal',
      content: <PersonalDetails userData={userData!} />,
      status: isCompletedProfile(userData),
    },
    {
      name: 'Primary ID',
      content: <PrimaryId contact={userData!} idCheck={idCheck} idDocTypes={idDocTypes} onSaved={refetchIdCheck} />,
      status: isCompletedPrimaryID(idCheck),
    },
    {
      name: 'Secondary ID',
      content: <SecondaryId contact={userData!} idCheck={idCheck} idDocTypes={idDocTypes} onSaved={refetchIdCheck} />,
      status: isCompletedSecondaryID(idCheck),
    },
    {
      name: 'Address Information',
      content: <AddressInformation userData={userData} />,
      status: isCompletedAddress(userData),
    },
    {
      name: 'Declaration Risk Management',
      content: <DeclarationRiskManagement userData={userData} />,
      status: isCompletedDeclarationRisk(userData),
    },
  ]
}

export const ChecklistDetailPage: FC = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)
  const { id } = useParams<{ id: string }>()

  // query data
  const querySingleContact = useSingleContact(connectSession, id)
  const { data: userData, isFetching: userDataIsFetching, isError: userDataIsError } = querySingleContact

  const queryIdentityCheck = useFetchSingleIdentityCheckByContactId(id)
  const { data: identityCheck, isFetching: identityCheckIsFetching, isError: identityCheckIsError } = queryIdentityCheck

  const queryIdentityDocumentTypes = useGetIdentityDocumentTypes()
  const {
    data: identityDocumentTypes,
    isFetching: identityDocumentTypesIsFetching,
    isError: identityDocumentTypesIsError,
  } = queryIdentityDocumentTypes

  const [isModalStatusOpen, setModalStatusOpen] = useState<boolean>(false)
  // local state - tab pagination handler
  const [activeTabs, setActiveTabs] = React.useState<number>(0)

  const changeActiveTabs = React.useCallback((index: number) => setActiveTabs(index), [activeTabs])

  // render tab contents
  const tabContents = generateTabsContent({
    querySingleContact,
    queryIdentityCheck,
    queryIdentityDocumentTypes,
  })

  // progress bar indicator
  const currentProgressBarStatus = generateProgressBarResult({ tabContents })

  if (
    (userDataIsFetching && !userData) ||
    (identityCheckIsFetching && !userData) ||
    (identityDocumentTypesIsFetching && !userData)
  ) {
    return <Loader fullPage label="Please wait..." />
  }

  if (
    (!userData && userDataIsError) ||
    (!identityCheck && identityCheckIsError) ||
    (!identityDocumentTypes && identityDocumentTypesIsError)
  ) {
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

  if (userData) {
    return (
      <main>
        <Title hasNoMargin>{`${userData?.forename} ${userData?.surname}`}</Title>
        <div className="el-flex el-flex-row">
          <Subtitle hasGreyText hasBoldText>
            Status: {userData.identityCheck?.toUpperCase()}
          </Subtitle>
          <Icon
            icon="editSolidSystem"
            iconSize="smallest"
            className="el-ml2"
            onClick={() => setModalStatusOpen(true)}
          />
        </div>
        <div>
          <ProgressBarSteps
            currentStep={currentProgressBarStatus.complete}
            numberSteps={currentProgressBarStatus.total}
            className="el-mt6"
          />
        </div>
        <div className="el-mt3">
          <TabsSection
            activeTabs={activeTabs}
            setActiveTabs={changeActiveTabs}
            tabName="tab-section"
            contents={tabContents}
          />
        </div>
        <ModalStatus
          userData={userData}
          idCheck={identityCheck!}
          isModalStatusOpen={isModalStatusOpen}
          setModalStatusOpen={setModalStatusOpen}
          progressBarStatus={currentProgressBarStatus}
        />
      </main>
    )
  }

  return <Loader fullPage label="Please wait..." />
}

export default ChecklistDetailPage
