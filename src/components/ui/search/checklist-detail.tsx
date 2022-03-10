/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useState } from 'react'
import { Subtitle, Title, Tabs } from '@reapit/elements'
import { useParams } from 'react-router'

import PersonalDetails from '../checklist-details-steps/personal-details'
import PrimaryId from '../checklist-details-steps/primary-id'
import SecondaryId from '../checklist-details-steps/secondary-id'

export const ChecklistDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>()
  const data = {} // we will get data state from API
  const [tab, setTab] = useState<boolean[]>([true, false, false])

  const renderTabContent = () => {
    if (data) {
      return (
        <>
          {tab[0] && <PersonalDetails data={data} />}
          {tab[1] && <PrimaryId data={data} />}
          {tab[2] && <SecondaryId data={data} />}
        </>
      )
    }
  }

  return (
    <main>
      <Title hasNoMargin>Name of User</Title>
      <Subtitle hasGreyText hasBoldText>
        Status: Pass
      </Subtitle>
      <>
        <Tabs
          name="my-cool-tabs-full-width"
          isFullWidth
          options={[
            {
              id: 'tab-1',
              value: '0',
              text: 'Personal Details',
              isChecked: tab[0],
            },
            {
              id: 'tab-2',
              value: '1',
              text: 'Primary Id',
              isChecked: tab[1],
            },
            {
              id: 'tab-3',
              value: '2',
              text: 'Secondary Id',
              isChecked: tab[2],
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
      </>
    </main>
  )
}

export default ChecklistDetailPage
