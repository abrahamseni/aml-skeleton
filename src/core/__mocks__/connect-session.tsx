import { ReapitConnectBrowserSession } from '@reapit/connect-session'
import { mockBrowserSession } from './connect-session.data'

export { mockBrowserSession }

export const reapitConnectBrowserSession: ReapitConnectBrowserSession = {
  connectInternalRedirect: 'http://example.com/redirect',
  connectIsDesktop: false,
  connectHasSession: true,
  connectAuthorizeRedirect: () => {},
  connectLoginRedirect: () => {},
  connectLogoutRedirect: () => {},
  connectClearSession: () => {},
  connectSession: async () => mockBrowserSession(),
} as any
