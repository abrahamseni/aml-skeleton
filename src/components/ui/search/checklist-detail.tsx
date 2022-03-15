/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useState } from 'react'
import { reapitConnectBrowserSession } from '../../../core/connect-session'
import { useReapitConnect } from '@reapit/connect-session'
import { Subtitle, Title, Icon, ProgressBarSteps, Modal, BodyText, InputGroup, Loader } from '@reapit/elements'
import { useParams } from 'react-router'

import PersonalDetails from '../checklist-details-steps/personal-details'
import PrimaryId from '../checklist-details-steps/primary-id'
import SecondaryId from '../checklist-details-steps/secondary-id'
import { DeclarationRiskManagement } from '../checklist-details-steps/declaration-risk-management'
import { AddressInformation } from '../checklist-details-steps/address-information'

import { useSingleContact } from '../../../platform-api/hooks/useSIngleContact'
import { TabsSection } from '../tab-section'
import { isCompletedAddress, isCompletedDeclarationRisk } from '../../../utils/completed-sections'
import { TabsSectionProps } from '../tab-section/tab-section'
import { UseQueryResult } from 'react-query'
import { ContactModel } from '@reapit/foundations-ts-definitions'
import { generateProgressBarResult } from '../../../utils/generator'

interface GenerateTabsContentProps {
  querySingleContact: UseQueryResult<ContactModel, Error>
  switchTabSection: (type: 'forward' | 'backward') => void
}

export const generateTabsContent = (props: GenerateTabsContentProps): TabsSectionProps['contents'] => {
  const { querySingleContact, switchTabSection } = props

  const { data: userData, refetch: userDataRefetch } = querySingleContact

  return [
    {
      name: 'Personal',
      content: <PersonalDetails userData={userData!} userDataRefetch={userDataRefetch} />,
    },
    {
      name: 'Primary ID',
      content: <PrimaryId data={userData!} />,
    },
    {
      name: 'Secondary ID',
      content: <SecondaryId data={userData!} />,
    },
    {
      name: 'Address Information',
      content: (
        <AddressInformation
          userData={userData!}
          userDataRefetch={userDataRefetch}
          switchTabContent={switchTabSection}
        />
      ),
      status: isCompletedAddress(userData!),
    },
    {
      name: 'Declaration Risk Management',
      content: (
        <DeclarationRiskManagement
          userData={userData!}
          userDataRefetch={userDataRefetch}
          switchTabContent={switchTabSection}
        />
      ),
      status: isCompletedDeclarationRisk(userData!),
    },
  ]
}

export const ChecklistDetailPage: FC = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)
  const { id } = useParams<{ id: string }>()

  const querySingleContact = useSingleContact(connectSession, id)
  const { data: userData, isFetching: userDataIsFetching } = querySingleContact

  const [isModalStatusOpen, setModalStatusOpen] = useState<boolean>(false)
  const [userStatus, setUserStatus] = useState<string>('passed')

  // local state - tab pagination handler
  const [activeTabs, setActiveTabs] = React.useState<number>(0)

  if ((!userData && userDataIsFetching) || !userData) {
    return <Loader fullPage label="Please wait..." />
  }

  // data is available from here

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
  const tabContents = generateTabsContent({ querySingleContact, switchTabSection })

  // progress bar indicator
  const { complete: completeStep, total: totalStep } = generateProgressBarResult({ tabContents })

  // render tab component (will use tabContents variable for the content)
  const renderTabContent = () => {
    return (
      <>
        <TabsSection
          activeTabs={activeTabs}
          tabName="tab-section"
          contents={tabContents}
          setActiveTabs={setActiveTabs}
          pageHandler={switchTabSection}
        />
      </>
    )
  }

  return (
    <main>
      <Title hasNoMargin>{`${userData?.forename} ${userData?.surname}`}</Title>
      <div className="el-flex el-flex-row">
        <Subtitle hasGreyText hasBoldText>
          Status: {userData?.identityCheck?.toUpperCase()}
        </Subtitle>
        <Icon icon="editSolidSystem" iconSize="smallest" className="el-ml2" onClick={() => setModalStatusOpen(true)} />
      </div>
      <div>
        <ProgressBarSteps currentStep={completeStep} numberSteps={totalStep} className="el-mt6" />
      </div>
      <div className="el-mt3">{renderTabContent()}</div>
      <Modal isOpen={isModalStatusOpen} onModalClose={() => setModalStatusOpen(false)} title="Update Status">
        <BodyText>
          You have completed 3 out of 5 sections for contact Test Holly Joy Phillips. Please now select one of the
          following options in order to continue
        </BodyText>
        <div className="el-flex el-flex-row el-flex-wrap">
          {[
            { label: 'Passed', value: 'passed', className: '' },
            { label: 'Fail', value: 'fail', className: 'el-ml8' },
            { label: 'Pending', value: 'pending', className: 'el-ml8' },
            { label: 'Cancelled', value: 'cancelled', className: 'el-ml8' },
            { label: 'Unchecked', value: 'unchecked', className: 'el-ml8' },
          ].map(({ label, value, className }, index) => (
            <InputGroup
              key={index}
              type="radio"
              label={label}
              className={className}
              onChange={() => setUserStatus(value)}
              checked={userStatus === value}
            />
          ))}
        </div>
      </Modal>
    </main>
  )
}

export default ChecklistDetailPage
