jest.mock('@linaria/core', () => {
  return {
    css: jest.fn(() => 'mock-css-class'),
    cx: jest.fn(() => 'mock-combined-css-class'),
  }
})

jest.mock('@linaria/react', () => {
  const styled = (tag) => {
    if (typeof tag !== 'string') {
      return jest.fn(() => {
        return tag
      })
    }

    return jest.fn(() => tag)
  }
  return {
    styled: new Proxy(styled, {
      get(o, prop) {
        return o(prop)
      },
    }),
  }
})

jest.mock('@reapit/connect-session', () => ({
  ReapitConnectBrowserSession: jest.fn(),
  useReapitConnect: () => ({
    connectSession: {
      loginIdentity: {},
    },
    connectInternalRedirect: '',
  }),
}))

Object.defineProperty(window, 'reapit', {
  value: {
    config: {
      connectClientId: 'SOME_CLIENT_ID',
      connectOAuthUrl: 'SOME_OAUTH_URL',
      platformApiUrl: 'https://example.com',
    },
  },
})
