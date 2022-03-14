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

export const ChecklistDetailPage: FC = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)
  const { id } = useParams<{ id: string }>()
  const { data: userData } = useSingleContact(connectSession, id)
  const [tab, setTab] = useState<boolean[]>([true, false, false, false, false])
  const [isModalStatusOpen, setModalStatusOpen] = useState<boolean>(false)
  const [userStatus, setUserStatus] = useState<string>('passed')

  const renderTabContent = () => {
    if (userData) {
      return (
        <>
          {tab[0] && <PersonalDetails data={userData} />}
          {tab[1] && <PrimaryId data={userData} />}
          {tab[2] && <SecondaryId data={userData} />}
          {tab[3] && <AddressInformation />}
          {tab[4] && <DeclarationRiskManagement />}
        </>
      )
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

      <div className="el-mt3">
        <Tabs
          name="my-cool-tabs-full-width"
          isFullWidth
          options={[
            {
              id: '0',
              value: '0',
              text: 'Personal Details',
              isChecked: tab[0],
            },
            {
              id: '1',
              value: '1',
              text: 'Primary Id',
              isChecked: tab[1],
            },
            {
              id: '2',
              value: '2',
              text: 'Secondary Id',
              isChecked: tab[2],
            },
            {
              id: '3',
              value: '3',
              text: 'Address Information',
              isChecked: tab[3],
            },
            {
              id: '4',
              value: '4',
              text: 'Declaration Risk Management',
              isChecked: tab[4],
            },
          ]}
          onChange={(event: any) =>
            setTab((prevTab) => {
              const changeTab = prevTab.map(() => false)
              const trueIndex = Number(event.target.value)
              changeTab[trueIndex] = !changeTab[trueIndex]
              return changeTab
            })
          }
        />
        {renderTabContent()}
      </div>
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
