import { ReapitConnectSession } from '@reapit/connect-session'

// we move mockBrowserSession from file "connect-session.tsx" to "connect-session.data.tsx" to make sure
// we import same mockBrowserSession when we call jest.mock('core/connect-session').
// module from 'core/connect-session' is different from module 'core/__mocks__/connect-session', even though
// we mock 'core/connect-session' with module 'core/__mocks__/connect-session'

const mockLoginIdentity = {
  email: 'name@example.com',
  name: 'name',
  developerId: 'SOME_DEVELOPER_ID',
  clientId: 'SOME_CLIENT_ID',
  adminId: 'SOME_ADMIN_ID',
  userCode: 'SOME_USER_ID',
  orgName: 'SOME_ORG_NAME',
  orgId: 'SOME_ORG_ID',
  groups: ['AgencyCloudDeveloperEdition', 'OrganisationAdmin', 'ReapitUser', 'ReapitDeveloper', 'ReapitDeveloperAdmin'],
  offGroupIds: 'MKV',
  offGrouping: true,
  offGroupName: 'Cool Office Group',
  officeId: 'MVK',
  orgProduct: 'agencyCloud',
  agencyCloudId: 'SOME_AC_ID',
}

const mockBrowserSessionData = {
  accessToken: JSON.stringify({
    exp: Math.round(new Date().getTime() / 1000) + 360, // time now + 6mins - we refresh session if expiry within 5mins
  }),
  refreshToken: 'SOME_REFRESH_TOKEN',
  idToken: JSON.stringify({
    name: mockLoginIdentity.name,
    email: mockLoginIdentity.email,
    'custom:reapit:developerId': mockLoginIdentity.developerId,
    'custom:reapit:clientCode': mockLoginIdentity.clientId,
    'custom:reapit:marketAdmin': mockLoginIdentity.adminId,
    'custom:reapit:userCode': mockLoginIdentity.userCode,
    'cognito:groups': mockLoginIdentity.groups,
  }),
  loginIdentity: mockLoginIdentity,
}

export const mockBrowserSession: jest.Mock<ReapitConnectSession> = jest.fn(() => mockBrowserSessionData)
