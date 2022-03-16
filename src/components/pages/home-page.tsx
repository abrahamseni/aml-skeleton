import React, { FC } from 'react'
import {
  Title,
  PageContainer,
  SecondaryNavContainer,
  Icon,
  Subtitle,
  SmallText,
  Button,
  elMb5,
  FlexContainer,
  SnackProvider,
} from '@reapit/elements'
import { Route } from 'react-router-dom'
import { Routes } from '../../constants/routes'
import ChecklistDetailPage from '../ui/search/checklist-detail'
import SearchPage from '../ui/search/search'

export const HomePage: FC = () => (
  <>
    <SnackProvider>
      <FlexContainer isFlexAuto>
        <SecondaryNavContainer>
          <Title>AML Checklist App</Title>
          <Icon className={elMb5} icon="webhooksInfographic" iconSize="large" />
          <Subtitle>About AML</Subtitle>
          <SmallText hasGreyText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Vitae purus faucibus ornare suspendisse sed nisi lacus sed viverra. At erat
            pellentesque adipiscing commodo.
          </SmallText>
          <Button className={elMb5} intent="neutral" onClick={() => {}}>
            Docs
          </Button>
        </SecondaryNavContainer>
        <PageContainer>
          <Route path={Routes.SEARCH} component={SearchPage} exact />
          <Route path={Routes.CHECKLIST_DETAIL} component={ChecklistDetailPage} exact />
        </PageContainer>
      </FlexContainer>
    </SnackProvider>
  </>
)

export default HomePage
