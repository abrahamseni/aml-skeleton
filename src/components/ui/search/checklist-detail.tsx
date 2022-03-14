/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useState } from 'react'
import { reapitConnectBrowserSession } from '../../../core/connect-session'
import { useReapitConnect } from '@reapit/connect-session'
import { Subtitle, Title, Tabs, Icon, ProgressBarSteps, Modal, BodyText, InputGroup } from '@reapit/elements'
import { useParams } from 'react-router'

import PersonalDetails from '../checklist-details-steps/personal-details'
import PrimaryId from '../checklist-details-steps/primary-id'
import SecondaryId from '../checklist-details-steps/secondary-id'
import { DeclarationRiskManagement } from '../checklist-details-steps/declaration-risk-management'
import { AddressInformation } from '../checklist-details-steps/address-information'

import { useSingleContact } from '../../../platform-api/hooks/useSIngleContact'
import { TabsSection } from '../tab-section'

export const ChecklistDetailPage: FC = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)
  const { id } = useParams<{ id: string }>()
  const { data: userData, refetch: userDataRefetch } = useSingleContact(connectSession, id)
  const [isModalStatusOpen, setModalStatusOpen] = useState<boolean>(false)
  const [userStatus, setUserStatus] = useState<string>('passed')

  const tabSectionHandler = React.useRef<React.ElementRef<typeof TabsSection>>(null)

  const renderTabContent = () => {
    if (userData) {
      /**
       * @todo
       * make validator each of contents here
       */
      return (
        <>
          <TabsSection
            ref={tabSectionHandler}
            tabName="tab-section"
            contents={[
              {
                name: 'Personal',
                content: <PersonalDetails data={userData} />,
              },
              {
                name: 'Primary ID',
                content: <PrimaryId data={userData} />,
              },
              {
                name: 'Secondary ID',
                content: <SecondaryId data={userData} />,
              },
              {
                name: 'Address Information',
                content: (
                  <AddressInformation
                    userData={userData}
                    userDataRefetch={userDataRefetch}
                    switchTabContent={switchTabSection}
                  />
                ),
                status: 'danger',
              },
              {
                name: 'Declaration Risk Management',
                content: (
                  <DeclarationRiskManagement
                    userData={userData}
                    userDataRefetch={userDataRefetch}
                    switchTabContent={switchTabSection}
                  />
                ),
              },
            ]}
          />
        </>
      )
    }
  }

  // change current active tab content with this fn
  const switchTabSection = (type: 'forward' | 'backward'): void | undefined => {
    switch (type) {
      case 'forward':
        return tabSectionHandler.current?.nextHandler()
      case 'backward':
        return tabSectionHandler.current?.prevHandler()
    }
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

      <ProgressBarSteps currentStep={3} numberSteps={5} className="el-mt6" />
      <button onClick={() => switchTabSection('backward')}>previous | test</button>
      <button onClick={() => switchTabSection('forward')}>next | test</button>
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
