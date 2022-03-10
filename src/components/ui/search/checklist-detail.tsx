import React, { FC } from 'react'
import { FlexContainer } from '@reapit/elements'
import { useParams } from 'react-router'

export const ChecklistDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>()
  console.log('params', id)
  return <FlexContainer isFlexAuto>checklist detail</FlexContainer>
}

export default ChecklistDetailPage
